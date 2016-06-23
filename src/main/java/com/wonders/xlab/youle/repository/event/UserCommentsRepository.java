package com.wonders.xlab.youle.repository.event;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.event.UserComments;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Created by Jeffrey on 15/8/21.
 */
public interface UserCommentsRepository extends MyRepository<UserComments, Long> {

    List<UserComments> findByPkArticleIdOrderByCreatedDateDesc(long articleId, Pageable pageable);

    Long countByPkArticleId(long articleId);
}
