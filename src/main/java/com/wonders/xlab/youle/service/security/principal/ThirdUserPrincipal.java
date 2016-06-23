package com.wonders.xlab.youle.service.security.principal;

import java.io.Serializable;

/**
 * Created by yk on 15/12/10.
 */
public class ThirdUserPrincipal implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    /**  第三方token  */
    private String token;

    /** 内部用户id */
    private Long userId;

    public ThirdUserPrincipal(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
