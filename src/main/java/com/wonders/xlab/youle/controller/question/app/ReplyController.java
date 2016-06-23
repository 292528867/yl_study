package com.wonders.xlab.youle.controller.question.app;

import com.wonders.xlab.framework.controller.AbstractBaseController;
import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.dto.question.RepliesDto;
import com.wonders.xlab.youle.dto.question.RepliesListDto;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.questions.Questions;
import com.wonders.xlab.youle.entity.questions.Replies;
import com.wonders.xlab.youle.entity.questions.RepliesPk;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.questions.QuestionRepository;
import com.wonders.xlab.youle.repository.questions.ReplyRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.security.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Jeffrey on 15/9/6.
 */
@RestController
@RequestMapping("reply")
public class ReplyController extends AbstractBaseController<Replies, Long> {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private SecurityService securityService;

    @RequestMapping(value = "question", method = RequestMethod.POST)
    public ControllerResult<?> replyQuestion(@RequestBody RepliesDto reply) {
        User from = userRepository.findOne(securityService.getUserId());
        Questions question = questionRepository.findOne(reply.getQuestionId());
        Replies replies = new Replies();
        if (reply.getTargetUserId() != null) {
            User to = userRepository.findOne(reply.getTargetUserId());
            replies.setTo(to);
        }
        replies.setPk(new RepliesPk(from, question));
        replies.setContent(reply.getContent());
        replyRepository.save(replies);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("回复成功！");
    }

    @RequestMapping(value = "byQuestion/{questionId}", method = RequestMethod.GET)
    public ControllerResult<?> findByQuestion(@PathVariable long questionId, Pageable pageable) {

        Questions question = questionRepository.findOne(questionId);
        List<Replies> replies = replyRepository.findByPkQuestionsId(questionId, pageable);
        List<RepliesListDto> repliesListDtos = new ArrayList<>();
        for (Replies reply : replies) {
            RepliesListDto repliesListDto = new RepliesListDto(reply.getPk().getFrom(), reply.getTo() , reply.getContent(), reply.getCreatedDate());
            repliesListDtos.add(repliesListDto);
        }
        Map<String, Object> result = new HashMap<>();
        result.put("question", question);
        result.put("replies", repliesListDtos);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(result)
                .setMessage("回复信息获取成功！");
    }

    @Override
    protected MyRepository<Replies, Long> getRepository() {
        return replyRepository;
    }
}
