package com.wonders.xlab.youle.controller.aritcle.manager;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.dto.article.ArticleDto;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.entity.article.ArticleMallProduct;
import com.wonders.xlab.youle.entity.event.UserCommentPk;
import com.wonders.xlab.youle.entity.event.UserComments;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.entity.user.UserArticle;
import com.wonders.xlab.youle.enums.Status;
import com.wonders.xlab.youle.repository.article.ArticleMallProductRepository;
import com.wonders.xlab.youle.repository.article.ArticleRepository;
import com.wonders.xlab.youle.repository.event.UserCommentsRepository;
import com.wonders.xlab.youle.repository.user.UserArticleRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.article.ArticleService;
import com.wonders.xlab.youle.utils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Jeffrey on 15/10/8.
 */

@RestController
@RequestMapping("manager/article")
public class ArticleManagerController extends FileUploadController<Article, Long> {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ArticleMallProductRepository articleMallProductRepository;

    @Autowired
    private UserArticleRepository userArticleRepository;

    @Autowired
    private UserCommentsRepository userCommentsRepository;

    @Override
    protected MyRepository<Article, Long> getRepository() {
        return articleRepository;
    }

    @RequestMapping(value = "manage/{userId}", method = RequestMethod.POST)
    public ControllerResult<?> manageArticle(@PathVariable long userId, @RequestBody ArticleDto articleDto) {
        User user = userRepository.findOne(userId);
        Article article = articleService.saveArticle(user, articleDto);
        if (null != articleDto.getProductId() &&
                null != articleDto.getActivityId() &&
                articleDto.getProductId() > 0 &&
                articleDto.getActivityId() > 0) {
            ArticleMallProduct articleMallProduct = new ArticleMallProduct(
                    articleDto.getProductId(),
                    articleDto.getActivityId(),
                    article
            );
            articleMallProductRepository.save(articleMallProduct);
        }

        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(article)
                .setMessage("文章添加成功！");
    }

    @RequestMapping(
            value = "modify/{productId}/{activityId}/{momentId}",
            method = RequestMethod.PUT
    )
    public Article modify(@RequestBody Article entity, @PathVariable long productId, @PathVariable long activityId, @PathVariable long momentId) {
        return articleService.managerArticle(entity, productId, activityId, momentId);
    }

    @RequestMapping(value = "{articleId}/author", method = RequestMethod.GET)
    public User articleAuthor(@PathVariable long articleId) {
        Map<String, Object> filters = new HashMap<>();
        filters.put("pk.article.id_equal", articleId);
        UserArticle userArticle = userArticleRepository.find(filters);
        if (userArticle.isEmpty()) {
            return null;
        }
        return userArticle.getPk().getUser();
    }

    @RequestMapping(
            method = RequestMethod.PUT
    )
    @Override
    public Article modify(@RequestBody Article entity) {
        Article article = articleRepository.findOne(entity.getId());
        BeanUtils.copyNotNullProperties(entity, article, "clickAmount", "coefficient", "recommend", "recommendValue", "arithmeticValue");
        return super.modify(article);
    }

    @RequestMapping("{id}/remove")
    public boolean remove(@PathVariable Long id) {
        Article article = articleRepository.findOne(id);
        article.setRemoved(true);
        articleRepository.save(article);
        return true;
    }

    @RequestMapping("{id}/status")
    public boolean status(@PathVariable Long id, Status status) {
        Article article = articleRepository.findOne(id);
        article.setStatus(status);
        articleRepository.save(article);
        return true;
    }

    @RequestMapping("{id}/top")
    public boolean setupTop(@PathVariable long id, boolean top) {
        Article article = articleRepository.findOne(id);
        article.setIsTop(top);
        articleRepository.save(article);
        return true;
    }

    @RequestMapping("{id}/hightlight")
    public boolean hightlight(@PathVariable Long id, boolean hightlight) {
        Article article = articleRepository.findOne(id);
        article.setHightlight(hightlight);
        articleRepository.save(article);
        return true;
    }

    @Override
    protected String getPathPrefix() {
        return "article/";
    }

    @RequestMapping("comment")
    private boolean comment(Long articleId, Long fromUserId, String content) {

        Article article = articleRepository.findOne(articleId);
        User user = userRepository.findOne(fromUserId);
        if (null == article)
            return false;
        if (null == user)
            return false;
        UserComments comments = new UserComments();
        UserCommentPk pk = new UserCommentPk();
        pk.setArticle(article);
        pk.setFrom(user);
        comments.setPk(pk);
        comments.setContent(content);
        userCommentsRepository.save(comments);
        return true;
    }
}
