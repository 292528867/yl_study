package com.wonders.xlab.youle.controller.question.manager;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.entity.questions.Questions;
import com.wonders.xlab.youle.repository.questions.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Jeffrey on 15/10/8.
 */
@RestController
@RequestMapping("manager/questions")
public class QuestionManagerController extends FileUploadController<Questions, Long> {

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    protected String getPathPrefix() {
        return "questions/";
    }

    @Override
    protected MyRepository<Questions, Long> getRepository() {
        return questionRepository;
    }
}
