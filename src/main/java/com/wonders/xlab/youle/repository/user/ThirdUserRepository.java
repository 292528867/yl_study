package com.wonders.xlab.youle.repository.user;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.user.ThirdUser;

/**
 * Created by yk on 15/12/10.
 */
public interface ThirdUserRepository extends MyRepository<ThirdUser,Long> {
    ThirdUser findByToken(String token);
}
