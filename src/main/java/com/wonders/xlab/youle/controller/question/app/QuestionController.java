package com.wonders.xlab.youle.controller.question.app;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.framework.utils.QiniuUtils;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.dto.question.QuestionDto;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.questions.Questions;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.questions.QuestionRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.question.QuestionService;
import com.wonders.xlab.youle.service.security.SecurityService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
@RestController
@RequestMapping("questions")
public class QuestionController extends FileUploadController<Questions, Long> {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private QuestionService questionService;

    /**
     * 登录用户提交无图片问答问题接口
     * @param question
     * @return
     */
    @RequestMapping(value = "pose", method = RequestMethod.PUT)
    public ControllerResult<?> questions(@RequestBody Questions question) {
        User user = userRepository.findOne(securityService.getUserId());
        question.setUser(user);
        question = questionRepository.save(question);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(question)
                .setMessage("提问成功！");
    }

    /**
     *  登录用户提交问答问题接口
     * @param question
     * @param files
     * @return
     */
    @RequestMapping(value = "pose", method = RequestMethod.POST)
    public ControllerResult<?> questions(Questions question, @RequestParam("file") MultipartFile... files) {
        User user = userRepository.findOne(securityService.getUserId());
        question.setUser(user);

        String url = "";
        for (int i = 0; i < files.length; i++) {
            try {
                BufferedImage bi = ImageIO.read(files[i].getInputStream());
                //在七牛返回图片路径添加以“___”拼接图片长宽
                String key = String.valueOf(System.currentTimeMillis()).concat("/")
                        .concat(getPathPrefix()).concat("/")
                        .concat("___").concat(String.valueOf(bi.getWidth()))
                        .concat("___").concat(String.valueOf(bi.getHeight()))
                        .concat("___");
                key += URLDecoder.decode(files[i].getOriginalFilename(), "UTF-8");
                QiniuUtils.upload(files[i].getBytes(), getBucketName(), key);
                url += getBucketUrl().concat(key);
                //多张图片路径以“;”分割开
                if (i != files.length - 1) {
                    url += ";";
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        question.setPicUrl(url);
        questionRepository.save(question);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("提问成功！");
    }

    @Override
    protected MyRepository<Questions, Long> getRepository() {
        return questionRepository;
    }

    @Override
    protected String getPathPrefix() {
        return "questions/";
    }

    @RequestMapping(value = "queryByPage/{type}", method = RequestMethod.GET)
    public ControllerResult<?> queryAllByType(@PathVariable Questions.Type type, Pageable pageable) {
        List<QuestionDto> dtos = questionService.findByPage(type, pageable);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(CollectionUtils.isEmpty(dtos) ? new ArrayList<>() : dtos)
                .setMessage("获取成功！");
    }
}
