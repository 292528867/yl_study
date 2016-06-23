package com.wonders.xlab.youle.configuration;

import com.wonders.xlab.youle.entity.moments.Moment;
import com.wonders.xlab.youle.repository.moments.MomentRepository;
import com.wonders.xlab.youle.service.redis.moments.MomentRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * Created by Jeffrey on 15/8/20.
 */
@Configuration
public class InitData {

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private MomentRedisService momentRedisService;

    @PostConstruct
    private void init(){
        List<Moment> moments = momentRepository.findAll();
        momentRedisService.save(moments);
    }
}
