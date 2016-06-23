package com.wonders.xlab.youle.controller.user.app;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.framework.utils.QiniuUtils;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.dto.IdenCode;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.dto.user.SupplementInfo;
import com.wonders.xlab.youle.dto.user.UserDto;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.enums.PointsEvent;
import com.wonders.xlab.youle.enums.Status;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.redis.valid.ValidCodeService;
import com.wonders.xlab.youle.service.security.SecurityService;
import com.wonders.xlab.youle.service.user.UserService;
import com.wonders.xlab.youle.utils.BeanUtils;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.Collections;
import java.util.Date;

/**
 * Created by Jeffrey on 15/8/13.
 */
@RestController
@RequestMapping("user")
public class UserController extends FileUploadController<User, Long> {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidCodeService validCodeService;

    @Autowired
    private SecurityService securityService;

    @RequestMapping(value = "login/{md5Code}", method = RequestMethod.POST)
    public ControllerResult<?> login(@RequestBody @Valid IdenCode idenCode, @PathVariable String md5Code, BindingResult result) {

        /**
         * 错位验证结果返回
         */
        if (result.hasErrors()) {
            StringBuilder builder = new StringBuilder();
            for (ObjectError error : result.getAllErrors())
                builder.append(error.getDefaultMessage());
            return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage(builder.toString());
        }
        //转化请求参数md5
        try {
            String params = objectMapper.writeValueAsString(idenCode);
            //判断请求参数的MD5码是否与传入码相同
            if (!DigestUtils.md5Hex(params).equals(md5Code)) {
                return new ControllerResult<>()
                        .setRet_code(-1)
                        .setRet_values("")
                        .setMessage("非法请求！");
            }
        } catch (JsonProcessingException e) {
            LOGGER.info(e.getLocalizedMessage());
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("登录失败！");
        }
        Object code = validCodeService.get("youle:validCode:" + idenCode.getTel());
        if (null == code || StringUtils.isBlank(code.toString())) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("验证码失效！");
        } else if (!code.toString().equals(idenCode.getCode())) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("验证码输入错误！");
        } else {
            User user = userRepository.findByTel(idenCode.getTel());
            String password = DigestUtils.md5Hex(idenCode.getPassword());
            if (null == user) {
                user = new User();
                BeanUtils.copyNotNullProperties(idenCode, user);
                user.setPassword(password);
                user = userRepository.save(user);
                return new ControllerResult<>()
                        .setRet_code(0)
                        .setRet_values(user)
                        .setMessage("登录成功！");
            } else {
                if (!password.equals(user.getPassword())) {
                    return new ControllerResult<>()
                            .setRet_code(-1)
                            .setRet_values("")
                            .setMessage("密码输入错误！");
                }
                if (!user.getAppPlatform().equals(idenCode.getAppPlatform())) {
                    user.setAppPlatform(idenCode.getAppPlatform());
                    user = userRepository.save(user);
                }
                return new ControllerResult<>()
                        .setRet_code(0)
                        .setRet_values(user)
                        .setMessage("登录成功！");
            }

        }
    }

    @RequestMapping(value = "find", method = RequestMethod.GET)
    public ControllerResult<?> findById() {
        return new ControllerResult<>().setRet_code(0)
                .setRet_values(getRepository().findOne(securityService.getUserId()))
                .setMessage("获取成功！");
    }

    @RequestMapping(value = "modify/nickNameOrPortrait", method = RequestMethod.POST)
    public ControllerResult<?> modifyNickNameAndPortrait(String nickName, MultipartFile file) {

        if ((null == file || file.isEmpty()) && StringUtils.isBlank(nickName)) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("昵称和头像不能为空！");
        }
        User user = userRepository.findOne(securityService.getUserId());
        if (StringUtils.isNotBlank(nickName)) {
            User _u = this.userRepository.findByNickName(nickName);
            if (_u != null && !_u.getId().equals(user.getId()))
                return new ControllerResult<>()
                        .setRet_code(-1)
                        .setRet_values("")
                        .setMessage("用户名重名");

            user.setNickName(nickName);
        }
        if (null != file && !file.isEmpty()) {
            try {
                String key = String.valueOf(System.currentTimeMillis()).concat("/").concat(getPathPrefix()).concat("/");
                key += URLDecoder.decode(file.getOriginalFilename(), "UTF-8");
                boolean success = QiniuUtils.upload(file.getBytes(), getBucketName(), key);
                user.setIconUrl(getBucketUrl().concat(key));
                if (!success) {
                    return new ControllerResult<>()
                            .setRet_code(-1)
                            .setRet_values("")
                            .setMessage("修改失败！");
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        userRepository.save(user);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("修改成功！");
    }

    @RequestMapping(value = "modify/{id}/{md5Code}")
    public ControllerResult<?> modifyUser(@RequestBody @Valid UserDto userDto, @PathVariable long id, @PathVariable String md5Code, BindingResult result) {
        /**
         * 错位验证结果返回
         */
        if (result.hasErrors()) {
            StringBuilder builder = new StringBuilder();
            for (ObjectError error : result.getAllErrors())
                builder.append(error.getDefaultMessage());
            return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage(builder.toString());
        }

        try {
            //转化请求参数md5
            String params = objectMapper.writeValueAsString(userDto);
            //判断请求参数的MD5码是否与传入码相同
            if (!DigestUtils.md5Hex(params).equals(md5Code)) {
                return new ControllerResult<>()
                        .setRet_code(-1)
                        .setRet_values("")
                        .setMessage("非法请求！");
            }
        } catch (JsonProcessingException e) {
            LOGGER.info(e.getLocalizedMessage());
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("登录失败！");
        }
        User user = userRepository.findOne(id);
        BeanUtils.copyNotNullProperties(userDto, user);
        userRepository.save(user);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(user)
                .setMessage("保存成功！");
    }

    @RequestMapping(value = "supplement", method = RequestMethod.POST)
    public ControllerResult<?> supplementUserInfo(@RequestBody SupplementInfo supplementInfo) {
        User user = userRepository.findOne(securityService.getUserId());
        BeanUtils.copyNotNullProperties(supplementInfo, user);
        user.setStatus(Status.effective);
        userRepository.save(user);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("更新成功！");
    }

    @RequestMapping(value = "signIn", method = RequestMethod.POST)
    public ControllerResult<?> signIn() {

        Long userId = securityService.getUserId();
        String str = DateFormatUtils.format(new Date(), "yyyyMMdd");
        String key = "youle:user:signIn:" + userId + "_" + str;

        int integral = RandomUtils.nextInt(1, 100);
        Boolean absent = validCodeService.setIfAbsent(key, String.valueOf(integral));
        if (absent) {
            validCodeService.put(key, String.valueOf(integral), 2 * 24 * 60 * 60 * 1000);
            User user = userRepository.findOne(userId);
            userService.updateUserAndIntegrals(user, integral, PointsEvent.signIn);
        } else {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("已经签到！");
        }

        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(Collections.singletonMap("integral", integral))
                .setMessage("签到成功！");
    }

    @Override
    protected MyRepository<User, Long> getRepository() {
        return userRepository;
    }

    @Override
    protected String getPathPrefix() {
        return "users/";
    }
}
