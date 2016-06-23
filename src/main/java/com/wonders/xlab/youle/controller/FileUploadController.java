package com.wonders.xlab.youle.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wonders.xlab.framework.utils.QiniuUtils;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.dto.result.ExtFormResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.net.URLDecoder;
import java.util.Collections;

/**
 * Created by Jeffrey on 15/9/7.
 */
public abstract class FileUploadController<T, PK extends Serializable> extends CommonController<T, PK> {

    private static final String QINIU_YOULE_BUCKET_NAME = "youle";
    private static final String QINIU_YOULE_BUCKET_URL = "http://7xii0x.com2.z0.glb.qiniucdn.com/";

    /**
     * 图片文件上传七牛
     *
     * @param file 文件
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "uploadPic", method = RequestMethod.POST)
    public Object uploadPic(@RequestParam("file") MultipartFile file) {
        if (!file.isEmpty()) {
            boolean success;
            String key;
            try {
                key = String.valueOf(System.currentTimeMillis()).concat("/") +
                        getPathPrefix() + URLDecoder.decode(file.getOriginalFilename(), "UTF-8");
                success = QiniuUtils.upload(file.getBytes(), QINIU_YOULE_BUCKET_NAME, key);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            if (success) {
                return new ControllerResult<>().setRet_code(0)
                        .setRet_values(Collections.singletonMap("url", QINIU_YOULE_BUCKET_URL.concat(key)))
                        .setMessage("图片上传成功!");
            }
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("图片上传失败！");
        }
        return new ControllerResult<>()
                .setRet_code(-1)
                .setRet_values("")
                .setMessage("上传图片不能为空！");
    }

    /**
     * Ext调用文件上传七牛
     *
     * @param file 文件
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "uploadPicture", method = RequestMethod.POST)
    public Object uploadPictureForExtJs(@RequestParam("file") MultipartFile file) throws JsonProcessingException {
        if (!file.isEmpty()) {
            boolean success;
            String key;
            try {
                key = String.valueOf(System.currentTimeMillis()).concat("/") +
                        getPathPrefix() + URLDecoder.decode(file.getOriginalFilename(), "UTF-8");
                success = QiniuUtils.upload(file.getBytes(), QINIU_YOULE_BUCKET_NAME, key);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            if (success) {
                return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg(QINIU_YOULE_BUCKET_URL.concat(key)));
            }
            return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(false).setMsg("上传文件失败！"));
        }
        return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(false).setMsg("上传文件为空！"));
    }



    protected abstract String getPathPrefix();

    public static String getBucketName() {
        return QINIU_YOULE_BUCKET_NAME;
    }

    public static String getBucketUrl() {
        return QINIU_YOULE_BUCKET_URL;
    }
}
