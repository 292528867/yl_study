package com.wonders.xlab.youle.controller.user.app;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.CommonController;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.user.UserArticle;
import com.wonders.xlab.youle.repository.user.UserArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Jeffrey on 15/9/1.
 */
@RestController
@RequestMapping("userArticle")
public class UserArticleController extends CommonController<UserArticle, Long> {

    @Autowired
    private UserArticleRepository userArticleRepository;

    @RequestMapping("hasPic")
    public ControllerResult<?> find(Pageable pageable) {
        return new ControllerResult<>()
                .setRet_values(userArticleRepository.findOnlyHasPic("热门", pageable));
    }

    @Override
    protected MyRepository<UserArticle, Long> getRepository() {
        return userArticleRepository;
    }
}
