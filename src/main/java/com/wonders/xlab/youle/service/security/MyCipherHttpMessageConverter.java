package com.wonders.xlab.youle.service.security;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.controller.security.UserRegisterInfo;
import com.wonders.xlab.youle.dto.user.ThirdUserInfo;
import com.wonders.xlab.youle.entity.user.ThirdUser;
import com.wonders.xlab.youle.enums.Sex;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.Base64Utils;

import java.io.IOException;
import java.lang.reflect.Type;

/**
 * Created by xu on 15/9/29.
 */
public class MyCipherHttpMessageConverter extends MappingJackson2HttpMessageConverter {
    public MyCipherHttpMessageConverter(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    public MyCipherHttpMessageConverter() {
    }

    @Override
    public Object read(Type type, Class<?> contextClass, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        JavaType javaType = getJavaType(type, contextClass);
        try {
            Object object = this.objectMapper.readValue(inputMessage.getBody(), javaType);
            if (object instanceof UserRegisterInfo) { // 只针对注册用的@RequestBody注解的UserRegisterInfo类
                // 将注册的内容解密后再@valid
                UserRegisterInfo userRegisterInfo = (UserRegisterInfo) object;
                String encryptCode = userRegisterInfo.getCode();
                String encryptTel = userRegisterInfo.getTel();

                if (StringUtils.isNotEmpty(encryptCode)) {
                    // base64解密
                    userRegisterInfo.setCode(new String(Base64Utils.decodeFromString(encryptCode), "UTF-8"));
                }
                if (StringUtils.isNotEmpty(encryptTel)) {
                    // base64解密
                    userRegisterInfo.setTel(new String(Base64Utils.decodeFromString(encryptTel), "UTF-8"));
                }

            }

            if (object instanceof ThirdUserInfo) {
                ThirdUserInfo thirdUserInfo = (ThirdUserInfo) object;
                String encryptToken = thirdUserInfo.getToken();
                String encryptSex = thirdUserInfo.getSex().toString();
                String encryptNickName = thirdUserInfo.getNickName();
                String encryptIconUrl = thirdUserInfo.getIconUrl();

                if (StringUtils.isNotEmpty(encryptToken)) {
                    thirdUserInfo.setToken(new String(Base64Utils.decodeFromString(encryptToken),"UTF-8"));
                }
//                if (StringUtils.isNotEmpty(encryptSex)) {
//                    String sex = new String(Base64Utils.decodeFromString(encryptSex), "UTF-8");
//                    if (sex.equals(Sex.female)) {
//                        thirdUserInfo.setSex(Sex.female);
//                    }
//                    thirdUserInfo.setSex(Sex.male);
//                }
                if (StringUtils.isNotEmpty(encryptNickName)) {
                    thirdUserInfo.setNickName(new String(Base64Utils.decodeFromString(encryptNickName),"UTF-8"));
                }
                if (StringUtils.isNotEmpty(encryptIconUrl)) {
                    thirdUserInfo.setIconUrl(new String(Base64Utils.decodeFromString(encryptIconUrl),"UTF-8"));
                }

            }

            return object;
        }
        catch (IOException ex) {
            throw new HttpMessageNotReadableException("Could not read document: " + ex.getMessage(), ex);
        }
    }

    @Override
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException {

        JavaType javaType = getJavaType(clazz, null);

        try {
            Object object = this.objectMapper.readValue(inputMessage.getBody(), javaType);
            if (object instanceof UserRegisterInfo) { // 只针对注册用的@RequestBody注解的UserRegisterInfo类
                // 将注册的内容解密后再@valid
                UserRegisterInfo userRegisterInfo = (UserRegisterInfo) object;
                String encryptCode = userRegisterInfo.getCode();
                String encryptTel = userRegisterInfo.getTel();

                if (StringUtils.isNotEmpty(encryptCode)) {
                    // base64解密
                    userRegisterInfo.setCode(new String(Base64Utils.decodeFromString(encryptCode), "UTF-8"));
                }
                if (StringUtils.isNotEmpty(encryptTel)) {
                    // base64解密
                    userRegisterInfo.setTel(new String(Base64Utils.decodeFromString(encryptTel), "UTF-8"));
                }

            }

            if (object instanceof ThirdUserInfo) {
                ThirdUserInfo thirdUserInfo = (ThirdUserInfo) object;
                String encryptToken = thirdUserInfo.getToken();
                String encryptSex = thirdUserInfo.getSex().toString();
                String encryptNickName = thirdUserInfo.getNickName();
                String encryptIconUrl = thirdUserInfo.getIconUrl();

                if (StringUtils.isNotEmpty(encryptToken)) {
                    thirdUserInfo.setToken(new String(Base64Utils.decodeFromString(encryptToken),"UTF-8"));
                }
                if (StringUtils.isNotEmpty(encryptSex)) {
                    String sex = new String(Base64Utils.decodeFromString(encryptSex), "UTF-8");
                    if (sex.equals(Sex.female)) {
                        thirdUserInfo.setSex(Sex.female);
                    }
                    thirdUserInfo.setSex(Sex.male);
                }
                if (StringUtils.isNotEmpty(encryptNickName)) {
                    thirdUserInfo.setToken(new String(Base64Utils.decodeFromString(encryptNickName),"UTF-8"));
                }
                if (StringUtils.isNotEmpty(encryptIconUrl)) {
                    thirdUserInfo.setToken(new String(Base64Utils.decodeFromString(encryptIconUrl),"UTF-8"));
                }

            }

            return object;
        }
        catch (IOException ex) {
            throw new HttpMessageNotReadableException("Could not read document: " + ex.getMessage(), ex);
        }
    }
}
