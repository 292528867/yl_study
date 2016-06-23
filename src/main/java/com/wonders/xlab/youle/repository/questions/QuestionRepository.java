package com.wonders.xlab.youle.repository.questions;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.questions.Questions;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
public interface QuestionRepository extends MyRepository<Questions, Long> {

    List<Questions> findTop10ByPicUrlNot(String url);

}
