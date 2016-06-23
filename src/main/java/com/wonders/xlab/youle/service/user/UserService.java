package com.wonders.xlab.youle.service.user;

import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.enums.PointsEvent;

import java.util.Map;

/**
 * Created by lixuanwu on 15/10/29.
 */
public interface UserService {

    Map<String, Object> updateUserAndIntegrals(User user,int integral,PointsEvent type);
}
