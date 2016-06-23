package com.wonders.xlab.youle.repository.user;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.user.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

/**
 * Created by Jeffrey on 15/8/13.
 */
public interface UserRepository extends MyRepository<User, Long> {

    User findByTel(String tel);

    User findByNickName(String name);

    @Modifying
    @Query("update User u set u.integrals = u.integrals + ?1 where u.id =?2")
    int updateUserIntegrals(int integral, long userId);

    List<User> findByAccountType(User.AccountType accountType);
}
