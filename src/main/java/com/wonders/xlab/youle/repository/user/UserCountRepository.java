package com.wonders.xlab.youle.repository.user;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.user.UserCount;

/**
 * Created by lixuanwu on 15/11/4.
 */
public interface UserCountRepository extends MyRepository<UserCount, Long> {

    UserCount findByFlag(String i);
}
