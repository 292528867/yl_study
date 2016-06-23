package com.wonders.xlab.youle.controller.user.manager;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.entity.user.UserCount;
import com.wonders.xlab.youle.repository.user.UserCountRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.lang.model.element.Name;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Jeffrey on 15/10/8.
 */

@RestController
@RequestMapping("manager/user")
public class UserManagerController extends FileUploadController<User, Long> {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserCountRepository userCountRepository;

    @Override
    protected String getPathPrefix() {
        return "users/";
    }

    @Override
    protected MyRepository<User, Long> getRepository() {
        return userRepository;
    }

    @RequestMapping(value = "findAllUser")
    private Object findAllUser() {
        return userRepository.findAll();
    }

    @RequestMapping(value = "findUserByNickName/{name}", method = RequestMethod.GET)
    private Object findUserByNickName(@PathVariable String name) {
        return userRepository.findByNickName(name);
    }

    @RequestMapping("findAllUserByAccountType")
    private Object findAllUserByAccountType() {
        User.AccountType accountType = User.AccountType.backgroundUser;
        return userRepository.findByAccountType(accountType);
    }

    @RequestMapping("countDownloadTimes")
    private Object countDownloadTimes() throws ParseException {
        int realData = (int) userRepository.count();
        UserCount count = userCountRepository.findByFlag("1");
        Date currentDate = new Date();
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        if (null == count) {
            count = new UserCount(realData, realData,"1",df.format(currentDate));
        }else {
            count.setRealData(realData);
            count.setTotalData(realData + count.getAddData());
        }
        userCountRepository.save(count);
        Date endDate = df.parse(count.getActivityEndTime());

        long diff = endDate.getTime() - currentDate.getTime();//这样得到的差值是微秒级别
        long days = diff / (1000 * 60 * 60 * 24);
        long hours = (diff-days*(1000 * 60 * 60 * 24))/(1000* 60 * 60);
        long minutes = (diff-days*(1000 * 60 * 60 * 24)-hours*(1000* 60 * 60))/(1000* 60);

        Map resultMap = new HashMap();
        resultMap.put("day",days);
        resultMap.put("hour",hours);
        resultMap.put("minute",minutes);
        resultMap.put("totalData",count.getTotalData());
        return resultMap;
    }

}
