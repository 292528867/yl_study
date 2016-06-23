package com.wonders.xlab.youle.controller.question.manager;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.entity.questions.Replies;
import com.wonders.xlab.youle.repository.questions.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Jeffrey on 15/10/8.
 */
@RestController
@RequestMapping("manager/reply")
public class RelyManagerController extends FileUploadController<Replies, Long> {

    @Autowired
    private ReplyRepository replyRepository;

    @Override
    protected String getPathPrefix() {
        return "replies/";
    }

    @Override
    protected MyRepository<Replies, Long> getRepository() {
        return replyRepository;
    }
}
