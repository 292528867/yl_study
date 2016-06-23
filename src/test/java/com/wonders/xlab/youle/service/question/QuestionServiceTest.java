package com.wonders.xlab.youle.service.question;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.dto.question.QuestionDto;
import com.wonders.xlab.youle.entity.questions.Questions;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/15.
 */
public class QuestionServiceTest extends AbstractTestCase {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testFindByPage() throws Exception {
        List<QuestionDto> page = questionService.findByPage(Questions.Type.psychology, new PageRequest(0, 3));

        System.out.println("mapper.writeValueAsString(page) = " + mapper.writeValueAsString(page));
    }
}