package com.wonders.xlab.youle.repository.questions;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.questions.Replies;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
public interface ReplyRepository extends MyRepository<Replies, Long> {

    List<Replies> findByPkQuestionsId(long questionId, Pageable pageable);
}
