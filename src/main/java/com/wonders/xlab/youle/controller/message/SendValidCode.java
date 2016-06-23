package com.wonders.xlab.youle.controller.message;

import com.wonders.xlab.framework.utils.SmsUtils;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.redis.valid.ValidCodeService;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * 发送短信验证码
 * Created by Jeffrey on 15/8/17.
 */
@RestController
@RequestMapping("message")
public class SendValidCode {

    private static final Logger LOGGER = LoggerFactory.getLogger(SendValidCode.class);

    private static final String SMS_VALID_CODE_CONTENT = "验证码为:%s。有了评测。别急，10分钟内输入还是有效的。";

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private ValidCodeService validCodeService;

    @Autowired
    @Qualifier("hostSendCodeCache")
    private Cache hostSendCodeCache;

    /**
     * 获取验证码，并且放入缓存中
     *
     * @param mobiles
     * @return
     * @throws RuntimeException
     */

    @RequestMapping(value = "sendValidCode/{mobiles}", method = RequestMethod.GET)
    public ControllerResult sendValidCode(@PathVariable String mobiles, HttpServletRequest request) throws RuntimeException {
        // 限制时间内尝试获取短信的次数，10分钟内5次

//        String retryKey = request.getRemoteHost() + "_sendCode_retry";
        String retryKey = mobiles + "_sendCode_retry";
        Element element = new Element(retryKey, 1);
        element = hostSendCodeCache.putIfAbsent(element);
        int retryCount = Integer.parseInt(hostSendCodeCache.get(retryKey).getObjectValue().toString());
        if (retryCount > 5) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("获取短信验证码10分钟内超过五次，请10分钟后再尝试登录！");
        } else {
            retryCount++;
            element = new Element(retryKey, retryCount);
            hostSendCodeCache.put(element);

//            User user = this.userRepository.findByTel(mobiles);
//            if (user != null)
//                return new ControllerResult<>().setRet_code(-1).setRet_values("用户已存在").setMessage("用户已存在");

            String code = RandomStringUtils.randomNumeric(6);
            LOGGER.info(new Date() + ", 验证码：" + code);

            boolean success = SmsUtils.sendMsg("wanvip5", "Txb123456", mobiles,
                    String.format(SMS_VALID_CODE_CONTENT, code));

            if (success) {
                validCodeService.put("youle:validCode:" + mobiles, code, 10);
                return new ControllerResult<>().setRet_code(0).setRet_values("").setMessage("已成功发送，请耐心等待!");
            }
            return new ControllerResult<>().setRet_code(-1).setRet_values("").setMessage("发送失败!");
        }

    }
}
