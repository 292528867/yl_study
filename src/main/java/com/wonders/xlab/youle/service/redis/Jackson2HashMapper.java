package com.wonders.xlab.youle.service.redis;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import org.springframework.data.redis.hash.HashMapper;

import java.util.Map;

/**
 * Created by Jeffrey on 15/8/20.
 */
public class Jackson2HashMapper<T> implements HashMapper<T, String, Object> {

    private  ObjectMapper mapper;

    private final JavaType userType;

    private final JavaType mapType = TypeFactory.defaultInstance()
            .constructMapType(Map.class, String.class, Object.class);

    public Jackson2HashMapper(Class<T> type) {
        this(type, new ObjectMapper());
    }

    public Jackson2HashMapper(Class<T> type, ObjectMapper mapper) {
        this.mapper = mapper;
        this.userType = TypeFactory.defaultInstance().constructType(type);
    }

    @Override
    public Map<String, Object> toHash(T object) {
        return mapper.convertValue(object, mapType);
    }

    @Override
    public T fromHash(Map<String, Object> hash) {
        return (T) mapper.convertValue(hash, userType);
    }
}
