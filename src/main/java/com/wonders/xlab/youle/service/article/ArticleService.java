package com.wonders.xlab.youle.service.article;

import com.wonders.xlab.youle.dto.article.ArticleCellDto;
import com.wonders.xlab.youle.dto.article.ArticleDto;
import com.wonders.xlab.youle.dto.article.TagDto;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.entity.article.ArticleCell;
import com.wonders.xlab.youle.entity.article.ArticleMallProduct;
import com.wonders.xlab.youle.entity.event.ArticlePraised;
import com.wonders.xlab.youle.entity.moments.Moment;
import com.wonders.xlab.youle.entity.tags.Tag;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.entity.user.UserArticle;
import com.wonders.xlab.youle.entity.user.UserArticlePk;
import com.wonders.xlab.youle.enums.Status;
import com.wonders.xlab.youle.repository.article.ArticleCellRepository;
import com.wonders.xlab.youle.repository.article.ArticleMallProductRepository;
import com.wonders.xlab.youle.repository.article.ArticleRepository;
import com.wonders.xlab.youle.repository.event.ArticlePraisedRepository;
import com.wonders.xlab.youle.repository.event.UserCommentsRepository;
import com.wonders.xlab.youle.repository.moments.MomentRepository;
import com.wonders.xlab.youle.repository.tags.TagRepository;
import com.wonders.xlab.youle.repository.user.UserArticleRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.redis.moments.MomentRedisService;
import com.wonders.xlab.youle.service.security.SecurityService;
import com.wonders.xlab.youle.utils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Created by Jeffrey on 15/8/18.
 */
@Service
public class ArticleService {

    @Autowired
    private MomentRedisService momentRedisService;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserArticleRepository userArticleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticlePraisedRepository articlePraisedRepository;

    @Autowired
    private ArticleCellRepository articleCellRepository;

    @Autowired
    private TagRepository tagRepository;


    @Autowired
    private UserCommentsRepository userCommentsRepository;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private ArticleMallProductRepository articleMallProductRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public Article saveArticle(User user, ArticleDto articleDto) {
        Assert.notNull(user);
        //通过id从redis里面取出实体对象
        Moment moment = momentRedisService.findById(articleDto.getMomentsId());
        Article article = new Article();
        BeanUtils.copyNotNullProperties(articleDto, article);
        Set<ArticleCell> articleCells = new HashSet<>();
        if (articleDto.getCells() != null) {
            for (ArticleCellDto articleCellDto : articleDto.getCells()) {

                //构建文章单元实体
                ArticleCell articleCell = new ArticleCell();
                BeanUtils.copyNotNullProperties(articleCellDto, articleCell,"tags");
                articleCell = articleCellRepository.save(articleCell);
                //构造文章单元对应标签实体
                Set<Tag> tags = new HashSet<>();
                if (articleCellDto.getTags() != null) {
                    for (TagDto tagDto : articleCellDto.getTags()) {
                        Tag tag = new Tag();
                        BeanUtils.copyNotNullProperties(tagDto, tag);
                        tag.setArticleCell(articleCell);
                        tags.add(tag);
                    }
                }
                List<Tag> savedTags = tagRepository.save(tags);
                tags.clear();
                tags.addAll(savedTags);
                articleCell.setTags(tags);
                articleCells.add(articleCell);
            }
        }
        article.setMoments(moment);
        article.setCells(articleCells);
        article.setCategory(moment.getName());
        article = articleRepository.save(article);
        //保存用户和文章关联关系
        saveUserAndArticle(user, article);
        return article;
    }

    public Article saveUserAndArticle(User user, Article article) {
        UserArticle userArticle = new UserArticle();
        userArticle.setPk(new UserArticlePk(user, article));
        userArticleRepository.save(userArticle);
        return article;
    }

    @Transactional
    public boolean praise(User user, Article article) {
        article.setClickAmount(article.getClickAmount() + 1);
        ArticlePraised articlePraised = new ArticlePraised(user, article);
        try {
            articlePraisedRepository.save(articlePraised);
            articleRepository.save(article);
            return true;
        } catch (RuntimeException e) {
            return false;
        }

    }

    public List<com.wonders.xlab.youle.dto.recommend.ArticleDto> copyVo(List<UserArticle> userArticles) {
        //构造app前端需要展示的文章列表数据结构
        List<com.wonders.xlab.youle.dto.recommend.ArticleDto> articleDtos = new ArrayList<>();
        for (UserArticle userArticle : userArticles) {
            Article article = userArticle.getPk().getArticle();
            if (ArticleService.isArticleCanView(article)) {
                com.wonders.xlab.youle.dto.recommend.ArticleDto articleDto = new com.wonders.xlab.youle.dto.recommend.ArticleDto();
                Set<com.wonders.xlab.youle.dto.recommend.ArticleCellDto> cellDtos = new HashSet<>();

                //对文章单元进行排序
                Set<ArticleCell> cells = new TreeSet<>(new MyComparator());
                cells.addAll(article.getCells());
                //向文章只添加一个图片单元
                for (ArticleCell articleCell : cells) {
                    if (articleCell.getType().equals("1")) {
                        com.wonders.xlab.youle.dto.recommend.ArticleCellDto cellDto = new com.wonders.xlab.youle.dto.recommend.ArticleCellDto();
                        BeanUtils.copyProperties(articleCell, cellDto);
                        cellDtos.add(cellDto);
                        break;
                    }
                }
                articleDto.setId(article.getId());
                BeanUtils.copyProperties(article, articleDto);
                articleDto.setNickName(userArticle.getPk().getUser().getNickName());
                articleDto.setIconUrl(userArticle.getPk().getUser().getIconUrl());
                articleDto.setCells(cellDtos);

                //统计文章所有回复
                Long totalComments = userCommentsRepository.countByPkArticleId(article.getId());
                //统计文章所有点赞
                Long totalPraised = articlePraisedRepository.countByArticleId(article.getId());

                try {
                    articleDto.setIsPraised(
                            isPraised(
                                    article.getId(),
                                    securityService.getUserId()
                            )
                    );
                } catch (Exception e) {
                    articleDto.setIsPraised(false);
                }

                articleDto.setTotalComments(totalComments);
                articleDto.setTotalPraised(totalPraised);
                articleDtos.add(articleDto);
            }
        }
        return articleDtos;
    }

    public Set<ArticleCell> sortCells(Article article) {
        Set<ArticleCell> cells = new TreeSet<>(new MyComparator());
        cells.addAll(article.getCells());
        for (final ArticleCell cell : cells) {
            if (cell.getType().equals("1")) {
                return new HashSet<ArticleCell>(){{
                    add(cell);
                }};

            }
        }
        return new HashSet<>();
    }

    @Transactional
    public Article managerArticle(Article entity, long productId, long activityId, long momentId) {
        Article article = articleRepository.findOne(entity.getId());
        if (entity.getCells().size() != article.getCells().size()) {
            throw new RuntimeException("传入文章的单元与已有文章单元的数量不一致！");
        }
        if (!article.getMoments().getId().equals(momentId)) {
            Moment moment = momentRepository.findOne(momentId);
            entity.setMoments(moment);
            entity.setCategory(moment.getName());
        }

        for (ArticleCell articleCell : entity.getCells()) {
            for (Tag tag : articleCell.getTags()) {
                tag.setArticleCell(articleCell);
            }
            if (!CollectionUtils.isEmpty(articleCell.getTags())){
                tagRepository.save(articleCell.getTags());
            }
        }

        BeanUtils.copyNotNullProperties(entity, article, "clickAmount", "coefficient", "recommend", "recommendValue", "arithmeticValue");

        Article modify = articleRepository.save(article);
        if (-1 != productId && -1 != activityId) {
            List<ArticleMallProduct> articleMallProducts = articleMallProductRepository.findByArticleId(modify.getId());
            articleMallProductRepository.delete(articleMallProducts);
            ArticleMallProduct articleMallProduct = new ArticleMallProduct(productId, activityId, modify);
            articleMallProductRepository.save(articleMallProduct);
        }
        return modify;
    }

    public boolean isPraised(long articleId, long userId) {
        return 0 < articlePraisedRepository.countByArticleIdAndUserId(articleId, userId);
    }

    /**
     * 判断文章是否具备展现条件
     *
     * @param article
     * @return
     */
    public static boolean isArticleCanView(Article article) {

        Assert.notNull(article);

        if (null == article.getCells() || article.getCells().size() < 2) {
            return false;
        }

        //文章单元必须包含图片和文字
        boolean hasPic = false, hasContent = false;

        for (ArticleCell articleCell : article.getCells()) {
            if (articleCell.getType().equals("1")) {
                hasPic = true;
            } else {
                hasContent = true;
            }
            if (articleCell.getType().equals("1") &&
                    (articleCell.getPicHeight() == 0 ||
                            articleCell.getPicWidth() == 0 ||
                            StringUtils.isBlank(articleCell.getPicUrl())
                    )
                    ) {
                return false;
            }
        }
        return hasPic && hasContent;
    }

    /**
     * 根据momentId查询圈子文章，并按照时间降序排列
     * 同一天内，按回复数降序，点赞数降序排列
     * momentId可选，不选时默认查询所有圈子的文章
     * @param param
     * @param pageable
     * @return
     */
    public List<com.wonders.xlab.youle.dto.recommend.ArticleDto> findArticlesByParam(Map<String, Object> param, Pageable pageable){
        Long momentId = (Long)param.get("momentId");
        String category = (String) param.get("category");
        String querySql = "SELECT t.id, b.cnt, c.pcnt" +
                " FROM" +
                "    yl_article t," +
                "    (SELECT " +
                "        a.id, COUNT(uc.id) cnt" +
                "    FROM" +
                "        yl_article a left join yl_user_comments uc on a.id = uc.article_id" +
                "    GROUP BY a.id) b" +
                "    (SELECT " +
                "        a.id, COUNT(ap.id) pcnt" +
                "    FROM" +
                "        .yl_article a left join .yl_article_praised ap on a.id = ap.article_id" +
                "    GROUP BY a.id) c"+
                " WHERE" +
                "    t.id = b.id and t.id=c.id " +
                "    and t.status = 1 " +
                "    and t.removed = 0 ";

        querySql += momentId != null ? " and t.moment_id="+ momentId : "";
        querySql += StringUtils.isNotBlank(category) ? " and t.category='"+category+"' ":"";
        querySql += " ORDER BY t.top, datediff(now(), t.created_date) ASC , b.cnt DESC, c.pcnt DESC" ;
        querySql += " limit "+ pageable.getOffset()+ "," + pageable.getPageSize();
        List<Map<String, Object>> resultList = jdbcTemplate.queryForList(querySql);

        List<com.wonders.xlab.youle.dto.recommend.ArticleDto> articleDtos = new ArrayList<>();
        for (Map<String, Object> map : resultList) {
            UserArticle userArticle = userArticleRepository.findByPkArticleId((long) map.get("id"));
            Article article = userArticle.getPk().getArticle();
            if (ArticleService.isArticleCanView(article)) {
                com.wonders.xlab.youle.dto.recommend.ArticleDto articleDto = new com.wonders.xlab.youle.dto.recommend.ArticleDto();
                Set<com.wonders.xlab.youle.dto.recommend.ArticleCellDto> cellDtos = new HashSet<>();

                //对文章单元进行排序
                Set<ArticleCell> cells = new TreeSet<>(new MyComparator());
                cells.addAll(article.getCells());
                //向文章只添加一个图片单元
                for (ArticleCell articleCell : cells) {
                    if (articleCell.getType().equals("1")) {
                        com.wonders.xlab.youle.dto.recommend.ArticleCellDto cellDto = new com.wonders.xlab.youle.dto.recommend.ArticleCellDto();
                        BeanUtils.copyProperties(articleCell, cellDto);
                        cellDtos.add(cellDto);
                        break;
                    }
                }
                articleDto.setId(article.getId());
                BeanUtils.copyProperties(article, articleDto);
                articleDto.setNickName(userArticle.getPk().getUser().getNickName());
                articleDto.setIconUrl(userArticle.getPk().getUser().getIconUrl());
                articleDto.setCells(cellDtos);

                //统计文章所有回复
                Long totalComments = Long.parseLong((String) map.get("cnt"));
                //统计文章所有点赞
                Long totalPraised = Long.parseLong((String) map.get("pcnt"));

                try {
                    articleDto.setIsPraised(
                        isPraised(
                                article.getId(),
                                securityService.getUserId()
                        )
                    );
                } catch (Exception e) {
                    articleDto.setIsPraised(false);
                }

                articleDto.setTotalComments(totalComments);
                articleDto.setTotalPraised(totalPraised);
                articleDtos.add(articleDto);
            }
        }
        return articleDtos;
    }

}
