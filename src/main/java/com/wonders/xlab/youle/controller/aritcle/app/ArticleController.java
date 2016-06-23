package com.wonders.xlab.youle.controller.aritcle.app;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.framework.utils.QiniuUtils;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.dto.article.ArticleDto;
import com.wonders.xlab.youle.dto.event.AppendCommentsDto;
import com.wonders.xlab.youle.dto.event.ArticleRepliesDto;
import com.wonders.xlab.youle.dto.event.ReplyUserDto;
import com.wonders.xlab.youle.dto.mall.NormalActivitiProductVo;
import com.wonders.xlab.youle.dto.mall.TryActivitiProductVo;
import com.wonders.xlab.youle.dto.recommend.ArticleCellDto;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.entity.article.ArticleCell;
import com.wonders.xlab.youle.entity.article.ArticleMallProduct;
import com.wonders.xlab.youle.entity.article.Banner;
import com.wonders.xlab.youle.entity.event.UserCommentPk;
import com.wonders.xlab.youle.entity.event.UserComments;
import com.wonders.xlab.youle.entity.mall.MallActiviti;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;
import com.wonders.xlab.youle.entity.mall.MallActivitiProductPK;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import com.wonders.xlab.youle.entity.moments.Moment;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.entity.user.UserArticle;
import com.wonders.xlab.youle.enums.PointsEvent;
import com.wonders.xlab.youle.enums.Status;
import com.wonders.xlab.youle.repository.article.ArticleMallProductRepository;
import com.wonders.xlab.youle.repository.article.ArticleRepository;
import com.wonders.xlab.youle.repository.article.BannerRepository;
import com.wonders.xlab.youle.repository.event.ArticlePraisedRepository;
import com.wonders.xlab.youle.repository.event.UserCommentsRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiProductRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiRepository;
import com.wonders.xlab.youle.repository.mall.MallProductRepository;
import com.wonders.xlab.youle.repository.moments.MomentRepository;
import com.wonders.xlab.youle.repository.tags.TagRepository;
import com.wonders.xlab.youle.repository.user.UserArticleRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.article.ArticleService;
import com.wonders.xlab.youle.service.article.MyComparator;
import com.wonders.xlab.youle.service.security.SecurityService;
import com.wonders.xlab.youle.service.user.UserService;
import com.wonders.xlab.youle.utils.BeanUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.RandomUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.*;

/**
 * Created by Jeffrey on 15/8/13.
 */

@RestController
@RequestMapping("article")
public class ArticleController extends FileUploadController<Article, Long> {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private UserCommentsRepository userCommentsRepository;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private UserArticleRepository userArticleRepository;

    @Autowired
    private ArticleMallProductRepository articleMallProductRepository;

    @Autowired
    private MallProductRepository mallProductRepository;

    @Autowired
    private MallActivitiProductRepository mallActivitiProductRepository;

    @Autowired
    private ArticlePraisedRepository articlePraisedRepository;

    @Autowired
    private MallActivitiRepository mallActivitiRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private UserService userService;

    @RequestMapping(value = "add", method = RequestMethod.POST)
    public ControllerResult<?> addArticle(@RequestBody ArticleDto articleDto) {

        Long userId = securityService.getUserId();
        User user = userRepository.findOne(userId);
        Article article = articleService.saveArticle(user, articleDto);
        userService.updateUserAndIntegrals(user, 30, PointsEvent.publish);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(article)
                .setMessage("文章添加成功！");
    }

    /**
     * 后台文章添加－－已经迁移到com.wonders.xlab.youle.controller.article.manager
     * @param userId
     * @param articleDto
     * @return
     */
//    @RequestMapping(value = "manage/{userId}", method = RequestMethod.POST)
//    public ControllerResult<?> manageArticle(@PathVariable long userId, @RequestBody ArticleDto articleDto) {
//
//        User user = userRepository.findOne(userId);
//        Article article = articleService.saveArticle(user, articleDto);
//        if (null != articleDto.getProductId() &&
//                null != articleDto.getActivityId() &&
//                articleDto.getProductId() > 0 &&
//                articleDto.getActivityId() > 0) {
//            ArticleMallProduct articleMallProduct = new ArticleMallProduct(
//                    articleDto.getProductId(),
//                    articleDto.getActivityId(),
//                    article
//            );
//            articleMallProductRepository.save(articleMallProduct);
//        }
//
//        return new ControllerResult<>()
//                .setRet_code(0)
//                .setRet_values(article)
//                .setMessage("文章添加成功！");
//    }

    /**
     * 文章图片上传
     *
     * @param file 图片
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "uploadPic", method = RequestMethod.POST)
    public Object uploadPic(@RequestParam("file") MultipartFile file)  {
        if (!file.isEmpty()) {
            String key;
            boolean success;
            try {
                key = String.valueOf(System.currentTimeMillis()).concat("/") +
                        getPathPrefix() + URLDecoder.decode(file.getOriginalFilename(), "UTF-8");
                success = QiniuUtils.upload(file.getBytes(), getBucketName(), key);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            if (success) {
                return new ControllerResult<>().setRet_code(0).setRet_values(
                        Collections.singletonMap("url", getBucketUrl().concat(key))
                ).setMessage("图片上传成功!");
            }
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("图片上传失败!");
        }
        return new ControllerResult<>()
                .setRet_code(-1)
                .setRet_values("")
                .setMessage("上传图片不能为空！");
    }

    /**
     * 用户点赞文章
     * app需在请求头里面添加token
     * @param articleId 文章id
     * @return
     */
    @RequestMapping(value = "append/praise/{articleId}", method = RequestMethod.POST)
    public ControllerResult<?> articlePraised(@PathVariable long articleId) {

        //通过安全框架获取用户
        User user = userRepository.findOne(securityService.getUserId());

        if (user.isEmpty()) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("用户不存在！");
        }
        Article article = articleRepository.findOne(articleId);
        if (article.isEmpty()) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("不存在此文章！");
        }
        if (articlePraisedRepository.countByArticleIdAndUserId(user.getId(), articleId) > 1) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("您已经点过赞了哦");
        }
        if (articleService.praise(user, article)) {
            return new ControllerResult<>()
                    .setRet_code(0)
                    .setRet_values(Collections.singletonMap("articleId", articleId))
                    .setMessage("成功点赞！");
        } else {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values(Collections.singletonMap("success", "false"))
                    .setMessage("再试一次！");
        }
    }

    /**
     * 用户对指定文章评论或者在指定文章中回复某人
     *
     * @param appendCommentsDto 被评论文章id，被回复人id，回复或者评论内容
     * @param result            接口传入参数验证结果
     * @return
     */
    @RequestMapping(value = "append/comments", method = RequestMethod.POST)
    public ControllerResult<?> appendComments(
            @RequestBody @Valid AppendCommentsDto appendCommentsDto,
            BindingResult result) {

        /**
         * 错位验证结果返回
         */
        if (result.hasErrors()) {
            StringBuilder builder = new StringBuilder();
            for (ObjectError error : result.getAllErrors())
                builder.append(error.getDefaultMessage());
            return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage(builder.toString());
        }

        User from = userRepository.findOne(securityService.getUserId());
        if (from == null) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("用户不存在！");
        }

        Article article = articleRepository.findOne(appendCommentsDto.getArticleId());
        if (article == null) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("文章不存在！");
        }

        User to = (
                null == appendCommentsDto.getToUserId() ? null
                        : userRepository.findOne(appendCommentsDto.getToUserId())
        );
        userCommentsRepository.save(
                new UserComments(new UserCommentPk(from, article), appendCommentsDto.getContent(), to)
        );
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("评论成功！");
    }

    /**
     * 推荐页接口
     *
     * @return 推荐页的5个banner、文章所有分类、默认热门文章简介列表拼接json
     */
    @RequestMapping(value = "homePage", method = RequestMethod.GET)
    public ControllerResult<?> homePage(Pageable pageable) {
        //查询推荐页的5个展现banner
        List<Banner> banners = bannerRepository.findTop5ByTypeOrderBySortSequenceDesc(Banner.Type.recommend);
        //查询所有文章分类
        List<String> categories = momentRepository.findByMomentsNames(Moment.Hot.yes);
        categories.remove("孕育问答");
        categories.remove("热门");

        //查询所有添加了分类为 热门 的文章和用户
//        List<UserArticle> userArticles = userArticleRepository.findHotArticle(pageable);

        Map<String, Object> result = new HashMap<>();

        List<String> sortCategories = new ArrayList<>();
        sortCategories.add("热门");
        sortCategories.addAll(categories);
        result.put("banners", banners);
        result.put("categories", sortCategories);
        result.put("articles", articleService.findArticlesByParam(new HashMap<String, Object>(), pageable));
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(result)
                .setMessage("成功！");
    }

    /**
     * 用户点击文章分类标签，获取该标签下所有分类的文章列表接口
     *
     * @param category 分类名称
     * @return 分类文章列表json
     */
    @RequestMapping(value = "byCategory", method = RequestMethod.GET)
    public ControllerResult<?> findByCategory(@RequestParam("category") String category, Pageable pageable) {

//        if (category.equals("热门")) {
//            return new ControllerResult<>()
//                    .setRet_code(0)
//                    .setRet_values(articleService.copyVo(userArticleRepository.findHotArticle(pageable)))
//                    .setMessage("成功！");
//        }

        //获取所有分类的文章(只包含文章图片单元)和对应发布文章用户
//        List<UserArticle> userArticles = userArticleRepository.findByCategory(category, pageable);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(articleService.findArticlesByParam(new HashMap<String, Object>(), pageable))
                .setMessage("成功！");
    }

    /**
     * 分页获取对指定文章的所有评论信息和用户信息
     *
     * @param pageable  分页
     * @param articleId 文章的id
     * @return 文章评论列表json
     */
    @RequestMapping(value = "comments/{articleId}", method = RequestMethod.GET)
    public ControllerResult<?> articleReplies(Pageable pageable, @PathVariable long articleId) {
        //获取文章评论列表
        List<UserComments> userComments = userCommentsRepository
                .findByPkArticleIdOrderByCreatedDateDesc(articleId, pageable);
        List<ArticleRepliesDto> articleReplies = new ArrayList<>();
        //遍历构建回复dto
        for (UserComments userComment : userComments) {
            ReplyUserDto to = new ReplyUserDto();
            if (null != userComment.getTo() && null != userComment.getTo().getId()) {
                BeanUtils.copyProperties(userComment.getTo(), to);
                to.setId(userComment.getTo().getId());
            }
            ReplyUserDto from = new ReplyUserDto();
            BeanUtils.copyProperties(userComment.getPk().getFrom(), from);
            from.setId(userComment.getPk().getFrom().getId());
            articleReplies.add(new ArticleRepliesDto(to, from, userComment.getContent(), userComment.getCreatedDate()));
        }
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(articleReplies)
                .setMessage("获取回复成功！");
    }

    /**
     * 根据文章的id获取文章的详细信息接口
     *
     * @param id
     * @return
     */
    @Override
    @RequestMapping(value = "find/{id}", method = RequestMethod.GET)
    public ControllerResult<?> findById(@PathVariable Long id) {
        UserArticle userArticle = userArticleRepository.findByPkArticleIdOrderByPkArticleCellsCellSortAsc(id);
        ArticleMallProduct articleAndProduct = articleMallProductRepository.findFirst1ByArticleId(id);
        //是否允许点赞
        boolean isPraised = false;
        //内部商品视图
        TryActivitiProductVo insideProduct = null;
        //外部商品视图
        NormalActivitiProductVo  outsideProduct = null;
        //如果文章关联商品则展示商品，否则随机展示一个商品
        if (null != articleAndProduct &&
                articleAndProduct.getMallProductId() != null &&
                articleAndProduct.getActivityId() != null) {
            //配置活动产品查询主键
            MallProduct mallProduct = mallProductRepository.findOne(articleAndProduct.getMallProductId());
            MallActiviti mallActiviti = mallActivitiRepository.findOne(articleAndProduct.getActivityId());
            MallActivitiProduct activitiProduct = mallActivitiProductRepository.findOne(
                    new MallActivitiProductPK(mallActiviti, mallProduct)
            );
            //内部商品
            if (activitiProduct.getPk().getMallActiviti().getType().equals(MallActiviti.ActivitiType.TRY)) {
                insideProduct = new TryActivitiProductVo(activitiProduct);
            }
            //外部商品
            else if (activitiProduct.getPk().getMallActiviti().getType().equals(MallActiviti.ActivitiType.NORMAL)) {
                outsideProduct = new NormalActivitiProductVo(activitiProduct.getPk().getMallProduct());
            }
        } else {
            //当文章无关联商品
            //从活动商品中按照时间取出20条活动商品信息
            //再从20条商品信息中随机拿出一条
            //判断商品属于内部商品还是外部商品
            Pageable pageable = new PageRequest(0, 20, new Sort(new Sort.Order(Sort.Direction.DESC, "createdDate")));
            Page<MallActivitiProduct> productPage = mallActivitiProductRepository.findAll(MapUtils.EMPTY_MAP, pageable);
            if (productPage.getContent() != null && productPage.getContent().size() > 0) {
                int randomNumber = RandomUtils.nextInt(0, productPage.getContent().size());
                MallActivitiProduct activitiProduct = productPage.getContent().get(randomNumber);
                //内部商品
                if (activitiProduct.getPk().getMallActiviti().getType().equals(MallActiviti.ActivitiType.TRY)) {
                    insideProduct = new TryActivitiProductVo(activitiProduct);
                }
                //外部商品
                else if (activitiProduct.getPk().getMallActiviti().getType().equals(MallActiviti.ActivitiType.NORMAL)) {
                    outsideProduct = new NormalActivitiProductVo(activitiProduct.getPk().getMallProduct());
                }
            }
        }

        //对文章的单元进行排序
        Article article = userArticle.getPk().getArticle();
        Set<ArticleCell> sortCells = new TreeSet<>(new MyComparator());
        sortCells.addAll(article.getCells());
        article.setCells(sortCells);

        try {
            isPraised = articleService.isPraised(id, securityService.getUserId());
        } catch (Exception ignored) {
        }

        Map<String, Object> result = new HashMap<>();
        result.put("article", article);
        result.put("isPraised", isPraised);
        result.put("user", userArticle.getPk().getUser());
        result.put("users", articlePraisedRepository.findByArticleId(id, new PageRequest(0, 5)));
        result.put("products", insideProduct == null ? outsideProduct : insideProduct);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(result)
                .setMessage("文章获取成功！");
    }

    /**
     * 获取用户发布文章列表
     * @return
     */
    @RequestMapping(value = "byUser", method = RequestMethod.GET)
    public ControllerResult<?> findByUser() {
        List<UserArticle> userArticles = userArticleRepository
                .findByPkUserIdAndPkArticleStatus(securityService.getUserId(), Status.effective);
        List<com.wonders.xlab.youle.dto.recommend.ArticleDto> articleDtos = new ArrayList<>();
        for (UserArticle userArticle : userArticles) {
            //文章符合展现要求
            if (ArticleService.isArticleCanView(userArticle.getPk().getArticle())) {

                com.wonders.xlab.youle.dto.recommend.ArticleDto articleDto = new com.wonders.xlab.youle.dto.recommend.ArticleDto();
                articleDto.setId(userArticle.getPk().getArticle().getId());
                articleDto.setNickName(userArticle.getPk().getUser().getNickName());
                articleDto.setIconUrl(userArticle.getPk().getUser().getIconUrl());
                articleDto.setTitle(userArticle.getPk().getArticle().getTitle());
                articleDto.setCreatedDate(userArticle.getPk().getArticle().getCreatedDate());

                Set<ArticleCellDto> cells = new HashSet<>();

                for (ArticleCell articleCell : userArticle.getPk().getArticle().getCells()) {
                    if (articleCell.getType().equals("1")) {
                        ArticleCellDto articleCellDto = new ArticleCellDto();
                        BeanUtils.copyProperties(articleCell, articleCellDto);
                        cells.add(articleCellDto);
                        articleDto.setCells(cells);
                        articleDtos.add(articleDto);
                        break;
                    }
                }
            }

        }
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(articleDtos)
                .setMessage("文章获取成功！");
    }

    @RequestMapping(value = "badArticle/{articleId}", method = RequestMethod.POST)
    public ControllerResult<?> badArticleReport(@PathVariable long articleId) {
        try {
            Long userId = securityService.getUserId();
        } catch (Exception ignored){

        }
        Article article = articleRepository.findOne(articleId);
        article.setBadReport(null == article.getBadReport() ? 0 : article.getBadReport() + 1);
        articleRepository.save(article);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("举报成功！");
    }

    @Override
    protected MyRepository<Article, Long> getRepository() {
        return articleRepository;
    }

    @Override
    protected String getPathPrefix() {
        return "article/";
    }
}
