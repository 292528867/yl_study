package com.wonders.xlab.youle.repository.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.entity.user.UserArticle;
import com.wonders.xlab.youle.enums.Status;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jeffrey on 15/9/1.
 */
public class UserArticleRepositoryTest extends AbstractTestCase {

    @Autowired
    private UserArticleRepository userArticleRepository;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testName() throws Exception {
        List<UserArticle> all = userArticleRepository.findOnlyHasPic("热门", new PageRequest(0,20));
        List<Article> articles = new ArrayList<>();
        for (UserArticle userArticle : all) {
            articles.add(userArticle.getPk().getArticle());
        }

        System.out.println("mapper.writeValueAsString(articles) = " + mapper.writeValueAsString(articles));
    }

    @Test
    public void testFindTop5ByMomentId() throws Exception {
        List<UserArticle> articles = userArticleRepository.findTop5ByMomentId(1l, new PageRequest(0,5));
        System.out.println("users.size() = " + articles.size());
    }

    @Test
    public void testFindByPkArticleMomentsIdAndPkArticleCellsTypeIs1() throws Exception {
        List<UserArticle> userArticles = userArticleRepository.findByPkArticleMomentsIdAndPkArticleStatus(1l, Status.effective, new PageRequest(0, 20));

        System.out.println("userArticles.size() = " + userArticles.size());
    }

    @Test
    public void testFindByPkUserId() throws Exception {
        List<UserArticle> userArticles = userArticleRepository.findByPkUserIdAndPkArticleStatus(1l, Status.effective);
        System.out.println("mapper.writeValueAsString(articles) = " + mapper.writeValueAsString(userArticles));
    }

    @Test
    public void testFindByPkUserId1() throws Exception {

        List<UserArticle> userArticles = userArticleRepository.findByPkUserIdAndPkArticleStatus(9l, Status.effective);

        System.out.println("mapper.writeValueAsString(userArticles) = " + mapper.writeValueAsString(userArticles));

    }

    @Test
    public void testFindByPkArticleIdOrderByPkArticleCellsCellSortAsc() throws Exception {
        UserArticle article = userArticleRepository.findByPkArticleIdOrderByPkArticleCellsCellSortAsc(18l);

        System.out.println("mapper.writeValueAsString(articles) = " + mapper.writeValueAsString(article));
    }
}