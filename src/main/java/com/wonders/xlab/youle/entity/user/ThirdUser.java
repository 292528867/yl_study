package com.wonders.xlab.youle.entity.user;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.enums.ThirdResource;

import javax.persistence.*;

/**
 * Created by yk on 15/12/9.
 */
@Entity
@Table(name = "yl_other_user")
public class ThirdUser extends AbstractBaseEntity<Long> {

    /**
     * 第三方平台token
     */
    private String token;

    /**
     * 第三方平台
     */
    @Enumerated
    private ThirdResource resource;

    /**
     * 第三方平台描述
     */
    private String resouceDesc;

    /**
     * 用户信息
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User user;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ThirdResource getResource() {
        return resource;
    }

    public void setResource(ThirdResource resource) {
        this.resource = resource;
    }

    public String getResouceDesc() {
        return resouceDesc;
    }

    public void setResouceDesc(String resouceDesc) {
        this.resouceDesc = resouceDesc;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
