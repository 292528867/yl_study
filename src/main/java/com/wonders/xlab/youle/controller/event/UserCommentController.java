package com.wonders.xlab.youle.controller.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wonders.xlab.framework.controller.AbstractBaseController;
import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.event.UserComments;
import com.wonders.xlab.youle.repository.event.UserCommentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Jeffrey on 15/8/30.
 */
@RestController
@RequestMapping("event")
public class UserCommentController extends AbstractBaseController<UserComments, Long> {

    @Autowired
    private UserCommentsRepository userCommentsRepository;

    @RequestMapping("comments/{articleId}")
    private ControllerResult<?> findUserComments(@PathVariable long articleId, Pageable pageable) throws JsonProcessingException {
        Map<String, Object> filters = new HashMap<>();
        filters.put("pk.article.id_equals", articleId);
        Page<UserComments> commentsPage = findAll(objectMapper.writeValueAsString(filters), pageable);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(commentsPage)
                .setMessage("获取成功！");
    }

    @Override
    protected MyRepository<UserComments, Long> getRepository() {
        return userCommentsRepository;
    }
}
