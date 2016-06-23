package com.wonders.xlab.youle.repository.article;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.article.ArticleMallProduct;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/8.
 */
public interface ArticleMallProductRepository extends MyRepository<ArticleMallProduct, Long> {

    ArticleMallProduct findFirst1ByArticleId(long articleId);

    List<ArticleMallProduct> findByArticleId(long articleId);
}
