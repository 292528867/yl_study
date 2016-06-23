package com.wonders.xlab.youle.repository.article;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.enums.Status;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * Created by Jeffrey on 15/8/27.
 */
public class ArticleRepositoryTest extends AbstractTestCase{

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testFindOnlyHashPic() throws Exception {
        List<Article> articles = articleRepository.findOnlyHasPic("热门");
        System.out.println("articles.size() = " + articles.size());
    }

    @Test
    public void testFindCategoryGroupByCategory() throws Exception {
        List<String> category = articleRepository.findCategoryGroupByCategory();
        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(category);
        System.out.println("s = " + s);
    }

    @Test
    public void testFindByCategory() throws Exception {
        List<Article> category = articleRepository.findByCategoryAndStatus("热门", Status.effective);
        System.out.println("category.size() = " + category.size());
    }

    @Test
    public void testFindByMoments() throws Exception {
        List<Article> byMoments = articleRepository.findByStatusAndMomentsIdOrderByClickAmountDesc(Status.effective, 5l, new PageRequest(0, 4));
        String s = mapper.writeValueAsString(byMoments);
        System.out.println("s = " + s);
        System.out.println("byMoments.size() = " + byMoments.size());
    }
}