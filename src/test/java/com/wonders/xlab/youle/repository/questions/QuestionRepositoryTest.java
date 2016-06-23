package com.wonders.xlab.youle.repository.questions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.entity.questions.Questions;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
public class QuestionRepositoryTest extends AbstractTestCase {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testName() throws Exception {
        Page<Questions> page = questionRepository.findAll(new PageRequest(0, 1));
    }

    @Test
    public void testFindTop30By() throws Exception {
        List<Questions> list = questionRepository.findTop10ByPicUrlNot("");
        String s = mapper.writeValueAsString(list);
        System.out.println("s = " + s);

    }
}