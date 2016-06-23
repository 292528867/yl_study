package com.wonders.xlab.youle.controller.moments.app;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.dto.recommend.ArticleDto;
import com.wonders.xlab.youle.dto.recommend.MomentDto;
import com.wonders.xlab.youle.dto.recommend.QuestionDto;
import com.wonders.xlab.youle.dto.recommend.Statistic;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.dto.user.UserDto;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.entity.article.ArticleCell;
import com.wonders.xlab.youle.entity.article.Banner;
import com.wonders.xlab.youle.entity.moments.Moment;
import com.wonders.xlab.youle.entity.questions.Questions;
import com.wonders.xlab.youle.entity.user.UserArticle;
import com.wonders.xlab.youle.enums.Status;
import com.wonders.xlab.youle.repository.article.ArticleRepository;
import com.wonders.xlab.youle.repository.article.BannerRepository;
import com.wonders.xlab.youle.repository.moments.MomentRepository;
import com.wonders.xlab.youle.repository.questions.QuestionRepository;
import com.wonders.xlab.youle.repository.user.UserArticleRepository;
import com.wonders.xlab.youle.service.article.ArticleService;
import com.wonders.xlab.youle.service.article.MyComparator;
import com.wonders.xlab.youle.service.moments.MomentService;
import com.wonders.xlab.youle.service.redis.moments.MomentRedisService;
import com.wonders.xlab.youle.utils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Created by Jeffrey on 15/8/13.
 */
@RestController
@RequestMapping("moments")
public class MomentController extends FileUploadController<Moment, Long> {

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private MomentRedisService momentRedisService;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserArticleRepository userArticleRepository;

    @Autowired
    private MomentService momentService;

    @Autowired
    private ArticleService articleService;

    @Override
    protected MyRepository<Moment, Long> getRepository() {
        return momentRepository;
    }

    @RequestMapping(value = "all",method = RequestMethod.GET)
    public ControllerResult<?> all() {
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(momentRepository.findAll())
                .setMessage("成功！");
    }

    @Override
    @RequestMapping(value = "queryAll",method = RequestMethod.GET)
    public ControllerResult<?> queryAll() {
        List<Banner> banners = bannerRepository.findTop5ByTypeOrderBySortSequenceDesc(Banner.Type.moment);
        List<Moment> moments = momentRepository.findByTypeNotNullOrderByCompositorDescTypeAscIdAsc();
        List<MomentDto> momentDtos = new ArrayList<>();
        for (Moment moment : moments) {
            MomentDto momentDto = new MomentDto();
            BeanUtils.copyProperties(moment, momentDto);
            momentDto.setId(moment.getId());
            //圈子的类型是文章，将圈子的文章数据添加到圈子返回值中
            if (moment.getType().equals(Moment.Type.article)) {
                List<Article> articles = articleRepository
                        .findByStatusAndMomentsIdOrderByClickAmountDesc(
                                Status.effective, moment.getId(), new PageRequest(0, 10)
                        );
                Set<ArticleDto> articleDtos = new HashSet<>();
                for (Article article : articles) {
                    //文章符合展现条件
                    if (ArticleService.isArticleCanView(article)) {
                        article.setCells(sortCells(article));
                        ArticleDto articleDto = new ArticleDto();
                        BeanUtils.copyProperties(article, articleDto);
                        articleDto.setId(article.getId());
                        articleDtos.add(articleDto);
                    }
                }
                momentDto.setArticles(articleDtos);
                momentDtos.add(momentDto);
            }
            //圈子的类型是问答，将圈子的问题数据添加到圈子返回值中
            else if (moment.getType().equals(Moment.Type.qa)) {
                List<Questions> questions = questionRepository.findTop10ByPicUrlNot("");
                Set<QuestionDto> questionDtos = new HashSet<>();
                for (Questions question : questions) {
                    QuestionDto questionDto = new QuestionDto();
                    BeanUtils.copyProperties(question, questionDto);
                    questionDto.setId(question.getId());
                    questionDtos.add(questionDto);
                }
                momentDto.setQuestions(questionDtos);
                momentDtos.add(momentDto);
            }

        }
        Map<String, Object> result = new HashMap<>();
        result.put("banners", banners);
        result.put("moments", momentDtos);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(result)
                .setMessage("获取成功！");
    }

    /**
     * 对文章单元dto进行排序并取出第一条为图片单元的数据
     * @param article
     * @return
     */
    Set<ArticleCell> sortCells(Article article) {
        Set<ArticleCell> sortCell = new TreeSet<>(new MyComparator());
        sortCell.addAll(article.getCells());
        for (final ArticleCell articleCell : sortCell) {
            if (articleCell.getType().equals("1")) {
                return new HashSet<ArticleCell>(){{
                    add(articleCell);
                }};
            }
        }
        return new HashSet<>();
    }

    /**
     * 圈子的信息
     * @param momentId
     * @param pageable
     * @return
     */
    @RequestMapping(value = "info/{momentId}", method = RequestMethod.GET)
    public ControllerResult<?> momentsInfo(@PathVariable long momentId, Pageable pageable) {

        Moment moment = momentRedisService.findById(momentId);
        List<UserArticle> userArticles = userArticleRepository
                .findTop5ByMomentId(momentId, new PageRequest(0, 5));

        List<UserDto> users = new ArrayList<>();
        for (UserArticle userArticle : userArticles) {
            UserDto user = new UserDto();
            BeanUtils.copyProperties(userArticle.getPk().getUser(), user);
            users.add(user);
        }
//        List<UserArticle> articles = userArticleRepository
//                .findByPkArticleMomentsIdAndPkArticleStatus(momentId, Status.effective, pageable);
        Map<String, Object> param = new HashMap<>();
        param.put("momentId", momentId);
        //统计数据
        Statistic statistic = momentService.momentStatistics(momentId);
        Map<String, Object> result = new HashMap<>();
        result.put("name", moment.getName());
        result.put("users", users);
        result.put("articles", articleService.findArticlesByParam(param, pageable));
        result.put("statistic", statistic);
        result.put("coverIconUrl", moment.getCoverIconUrl());
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(result)
                .setMessage("圈子信息获取成功！");
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public Moment add(@RequestBody Moment entity) {
        Moment moment = super.add(entity);
        momentRedisService.save(moment);
        return moment;
    }

    @Override
    @RequestMapping(method = RequestMethod.PUT)
    public Moment modify(@RequestBody Moment entity) {
        Moment moment = super.modify(entity);
        momentRedisService.save(moment);
        return moment;
    }

    @Override
    protected String getPathPrefix() {
        return "moments/";
    }
}
