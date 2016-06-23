package com.wonders.xlab.youle.service.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.reflect.MethodUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BulkMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.query.SortQuery;
import org.springframework.data.redis.core.query.SortQueryBuilder;
import org.springframework.data.redis.hash.DecoratingStringHashMapper;
import org.springframework.data.redis.hash.HashMapper;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;
import org.springframework.data.redis.support.collections.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * redis抽象类
 * Created by Jeffrey on 15/8/17.
 */
public abstract class AbstractRedisService<T, ID extends Serializable> {

    private static ValueOperations<String, String> valueOperations;
    private HashMapper<T, String, String> entityMapper;
    private Class<T> entityClass;

    private String redisHashKey;
    private String redisJsonKey;
    private String redisListKey;

    @Autowired
    private ObjectMapper mapper;

    protected AbstractRedisService() {
        entityClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        redisHashKey = "youle:" + entityClass.getSimpleName().toLowerCase() + ":hash:";
        redisJsonKey = "youle:" + entityClass.getSimpleName().toLowerCase() + ":json:";
        redisListKey = "youle:" + entityClass.getSimpleName().toLowerCase() + ":list";
    }

    @PostConstruct
    private void init(){
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        entityMapper = new DecoratingStringHashMapper<>(new Jackson2HashMapper<>(entityClass, mapper));
    }

    /**
     * 根据
     *
     * @param id
     * @return
     */
    public T findById(ID id) {
        String json = valueOps().get(redisJsonKey + id);
        try {
            return mapper.readValue(json.replaceAll("\"\"","null"), entityClass);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 添加数据
     *
     * @param entity
     */
    public boolean save(T entity) {
        ID id = null;
        try {
            id = (ID) MethodUtils.invokeMethod(entity, "getId");
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
        Assert.notNull(id);
        try {
            redisMap(redisHashKey + id).putAll(entityMapper.toHash(entity));
            put(redisJsonKey + id, mapper.writeValueAsString(entity));
            if (!redisList(redisListKey).contains(id.toString())) {
                redisList(redisListKey).addFirst(id.toString());
            }
            return true;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<T> findAll() {
        SortQuery<String> query = SortQueryBuilder.sort(redisListKey).get(redisJsonKey + "*").build();
        BulkMapper<T, String> hm = new BulkMapper<T, String>() {
            public T mapBulk(List<String> bulk) {
                Iterator<String> iterator = bulk.iterator();
                if (iterator.hasNext()) {
                    try {
                        T t = mapper.readValue(iterator.next().replaceAll("\"\"","null"), entityClass);
                        return t;
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                return null;
            }
        };

        return getRedisTemplate().sort(query, hm);
    }

    @Transactional
    public boolean save(List<T> entities) {
        for (T entity : entities) {
            if (!save(entity)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获取自增索引
     *
     * @param key
     * @return
     */
    public String incrementAndGet(String key) {
        if (StringUtils.isNotEmpty(key)) {
            RedisAtomicLong entityIdCounter = new RedisAtomicLong(key, getRedisTemplate().getConnectionFactory());
            return String.valueOf(entityIdCounter.incrementAndGet());
        } else
            return "";

    }

    public void addListOne(String key, String value) {
        redisList(key).addFirst(value);
    }


    /**
     * 判断key是否存在
     *
     * @param key
     * @return
     */
    public boolean hasKey(String key) {
        return getRedisTemplate().hasKey(key);
    }


    /**
     * 获取MAP操作项
     *
     * @return
     */
    private RedisMap<String, String> redisMap(String key) {
        return new DefaultRedisMap<>(key, getRedisTemplate());
    }

    /**
     * 获取Set操作项
     *
     * @return
     */
    private RedisSet<String> redisSet(String key) {
        return new DefaultRedisSet<>(key, getRedisTemplate());
    }

    /**
     * 获取List操作项
     *
     * @return
     */
    private RedisList<String> redisList(String key) {
        return new DefaultRedisList<>(key, getRedisTemplate());
    }

    /**
     * 获取String操作项
     *
     * @return
     */
    private ValueOperations<String, String> valueOps() {
        if (valueOperations == null) {
            valueOperations = getRedisTemplate().opsForValue();
        }
        return valueOperations;
    }

    public void put(String key, String value) {
        valueOps().set(key, value);
    }

    public void put(String key, String value, long expire) {
        valueOps().set(key, value, expire, TimeUnit.MINUTES);
    }

    public Boolean setIfAbsent(String key, String value) {
        return valueOps().setIfAbsent(key, value);
    }

    public Object get(Object key) {
        return getRedisTemplate().opsForValue().get(key);
    }

    protected abstract RedisTemplate getRedisTemplate();
}
