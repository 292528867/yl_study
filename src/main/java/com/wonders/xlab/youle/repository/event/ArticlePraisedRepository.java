package com.wonders.xlab.youle.repository.event;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.event.ArticlePraised;
import com.wonders.xlab.youle.entity.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by Jeffrey on 15/8/21.
 */
public interface ArticlePraisedRepository extends MyRepository<ArticlePraised, Long> {

    @Query("select ap.user from ArticlePraised ap where ap.article.id = :articleId")
    List<User> findByArticleId(@Param("articleId") long articleId, Pageable pageable);

    List<ArticlePraised> findByArticleIdAndUserId(long articleId, long userId);

    Long countByArticleIdAndUserId(long articleId, long userId);

    Long countByArticleId(long articleId);

    Long countByUserId(long userId);

}
