package com.wonders.xlab.youle.service.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * 使用spring4.1的新功能，ResponseBodyAdvice，在convert前做advice。
 * 对指定包中的所有 @ResponseBody 标注的返回加密成字符串输出。
 */
@Order(1)
@ControllerAdvice(basePackages = {
        "com.wonders.xlab.youle.controller.mall.app",
        "com.wonders.xlab.youle.controller.security",
        "com.wonders.xlab.youle.controller.aritcle.app",
        "com.wonders.xlab.youle.controller.event",
        "com.wonders.xlab.youle.controller.message",
        "com.wonders.xlab.youle.controller.moments.app",
        "com.wonders.xlab.youle.controller.order",
        "com.wonders.xlab.youle.controller.question.app",
        "com.wonders.xlab.youle.controller.tags.app",
        "com.wonders.xlab.youle.controller.user.app"
})
public class MyEncryptResponseBodyAdvice implements ResponseBodyAdvice<Object> {
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request, ServerHttpResponse response) {
        try {
            // 把返回的对象序列化成json
            String jsonstr = this.objectMapper.writeValueAsString(body);
            // 直接Base64加密
            String encrptyBodyString = Base64Utils.encodeToString(jsonstr.getBytes("utf-8"));
            EncryptBodyObject ret = new EncryptBodyObject(encrptyBodyString);

            return ret;
        } catch (Exception exp) {
            exp.printStackTrace();
            throw new HttpMessageNotWritableException("Could not write content: " + exp.getMessage(), exp);
        }


    }

    /**
     * 加密返回的对象。
     */
    public static class EncryptBodyObject {
        private String encode;

        public EncryptBodyObject(String encode) {
            this.encode = encode;
        }

        public String getEncode() {
            return encode;
        }

        public void setEncode(String encode) {
            this.encode = encode;
        }
    }
}
