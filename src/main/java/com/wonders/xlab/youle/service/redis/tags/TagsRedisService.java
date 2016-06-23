package com.wonders.xlab.youle.service.redis.tags;

import com.wonders.xlab.youle.entity.tags.Tag;
import com.wonders.xlab.youle.service.redis.AbstractRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

/**
 * Created by Jeffrey on 15/8/18.
 */
@Service
public class TagsRedisService extends AbstractRedisService<Tag, Long>{

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    protected RedisTemplate getRedisTemplate() {
        return redisTemplate;
    }
}
