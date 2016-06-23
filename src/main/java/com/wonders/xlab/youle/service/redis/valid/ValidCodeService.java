package com.wonders.xlab.youle.service.redis.valid;

import com.wonders.xlab.youle.service.redis.AbstractRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

/**
 * redis验证码存放
 * Created by Jeffrey on 15/8/17.
 */
@Service
public class ValidCodeService extends AbstractRedisService<String, Long> {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    protected RedisTemplate getRedisTemplate() {
        return redisTemplate;
    }
}
