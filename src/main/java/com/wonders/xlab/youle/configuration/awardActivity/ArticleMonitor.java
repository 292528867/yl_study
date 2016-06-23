package com.wonders.xlab.youle.configuration.awardActivity;

import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.enums.PointsEvent;
import com.wonders.xlab.youle.repository.user.UserArticleRepository;
import com.wonders.xlab.youle.service.user.UserService;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.Map;

/**
 * APP文章活动监控
 * Created by wukai on 15/11/3.
 */
@Component
@Aspect
public class ArticleMonitor {

    @Autowired
    private UserArticleRepository userArticleRepository;

    @Autowired
    private UserService userService;

    /***
     * 首次发表评测的奖励额外奖励30分
     */
    @AfterReturning("execution(* com.wonders.xlab.youle.service.article.ArticleService.saveArticle(com.wonders.xlab.youle.entity.user.User,..)) && args(user,..)")
    public User firstArticleReward(User user){
        Assert.notNull(user);
        Long articles = userArticleRepository.selectCountByUserId(user.getId());
        //UserArticle表仅有一条记录，说明用户是第一次发表文章
        if (articles == 1) {
            Map<String, Object> result = userService.updateUserAndIntegrals(user, 30, PointsEvent.firstPublish);
            if ((boolean)result.get("success")){
                user.setIntegrals(user.getIntegrals() + 30);
            }
        }
        return user;
    }

}
