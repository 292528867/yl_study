package com.wonders.xlab.youle.dto.user;

import com.wonders.xlab.youle.enums.AppPlatform;
import com.wonders.xlab.youle.enums.Sex;
import com.wonders.xlab.youle.enums.ThirdResource;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Created by yk on 15/12/10.
 */
public class ThirdUserInfo implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    /**
     * 第三方token
     */
    @NotBlank(message = "第三方token不能为空")
     private String token;
    /**
     * 性别
     */
     private Sex sex;
    /**
     * 昵称
     */
     private String nickName;
    /**
     * 人物头像url
     */
     private String iconUrl;

    @NotNull(message = "登入的第三方来源不能为空")
    private ThirdResource thirdResource;

    /**
     * 登入平台
     */
    @NotNull(message = "登入的手机平台不能为空")
    private AppPlatform appPlatform;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public AppPlatform getAppPlatform() {
        return appPlatform;
    }

    public void setAppPlatform(AppPlatform appPlatform) {
        this.appPlatform = appPlatform;
    }

    public ThirdResource getThirdResource() {
        return thirdResource;
    }

    public void setThirdResource(ThirdResource thirdResource) {
        this.thirdResource = thirdResource;
    }
}
