package com.wonders.xlab.youle.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;

/**
 * Created by wukai on 15/11/3.
 */
public final class EnumUtils {
    private static final Logger LOG = LoggerFactory.getLogger(EnumUtils.class);
    /**
     * 修改Enum的name
     *
     * @param enumInstance 枚举常量
     * @param value 枚举常量的value
     * @param <T> 枚举的类型参数
     */
    public static <T extends Enum<T>> void changeNameTo(T enumInstance, String value) {
        try {
            Field fieldName = enumInstance.getClass().getSuperclass().getDeclaredField("name");
            fieldName.setAccessible(true);
            fieldName.set(enumInstance, value);
            fieldName.setAccessible(false);
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
        }
    }
}
