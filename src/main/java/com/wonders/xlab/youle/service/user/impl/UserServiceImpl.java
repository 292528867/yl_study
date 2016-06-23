package com.wonders.xlab.youle.service.user.impl;

import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.entity.user.UserIntegralRecord;
import com.wonders.xlab.youle.enums.PointsEvent;
import com.wonders.xlab.youle.repository.user.UserIntegralRecordRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by lixuanwu on 15/10/29.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserIntegralRecordRepository userIntegralRecordRepository;

    @Override
    public Map<String, Object> updateUserAndIntegrals(User user, int integral, PointsEvent type) {
        int addIntegral = integral;
        Assert.notNull(user);
        Map<String, Object> resultMap = new HashMap();
        int result = userRepository.updateUserIntegrals(integral, user.getId());
        if(result == 1){
            UserIntegralRecord record = new UserIntegralRecord(integral, type.toString(), user);
            userIntegralRecordRepository.save(record);
            resultMap.put("integral", addIntegral);
            resultMap.put("success", true);
        } else {
            resultMap.put("integral", addIntegral);
            resultMap.put("success", false);
        }
        return resultMap;
    }
}
