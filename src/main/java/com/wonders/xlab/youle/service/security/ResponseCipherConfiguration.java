package com.wonders.xlab.youle.service.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import java.util.Iterator;

/**
 * 请求加密配置（AOP）
 */
@Configuration
public class ResponseCipherConfiguration {
//    /**
//     * 对@ResponseBody 的jackson 反序列化操作设置pointcut
//     */
//    @Pointcut("execution(* org.springframework.http.converter.json.MappingJackson2HttpMessageConverter.writeInternal(..))")
//    private void test() {}
//
//
//    @Around("test()")
//    public void testReturn(ProceedingJoinPoint pjp) {
////        JsonEncoding encoding = getJsonEncoding(outputMessage.getHeaders().getContentType());
////        JsonGenerator jsonGenerator =
////                this.objectMapper.getJsonFactory().createJsonGenerator(outputMessage.getBody(), encoding);
////        try {
////            if (this.prefixJson) {
////                jsonGenerator.writeRaw("{} && ");
////            }
////            this.objectMapper.writeValue(jsonGenerator, object);
////        }
////        catch (IOException ex) {
////            throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
////        }
//
//        new AnnotationMethodHandlerAdapter()
//
//        System.out.println("dlfjdlkfldsjfdfl");
//
//    }

    @Autowired
    private ObjectMapper objectMapper;

    @Bean(name = "cipherConfigBean")
    public Object cipherConfigBean(RequestMappingHandlerAdapter requestMappingHandlerAdapter) {
        MyCipherHttpMessageConverter myCipherHttpMessageConverter = new MyCipherHttpMessageConverter(this.objectMapper);

        // 删除默认的MappingJackson2HttpMessageConverter转换器
        Iterator<HttpMessageConverter<?>> iter = requestMappingHandlerAdapter.getMessageConverters().iterator();
        while (iter.hasNext()) {
            if (iter.next() instanceof MappingJackson2HttpMessageConverter) {
                iter.remove();
            }
        }
        // 插入自定义的转换器
        requestMappingHandlerAdapter.getMessageConverters().add(myCipherHttpMessageConverter);
        return new Object();
    }


}
