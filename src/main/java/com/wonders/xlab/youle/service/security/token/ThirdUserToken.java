package com.wonders.xlab.youle.service.security.token;

import org.apache.shiro.authc.UsernamePasswordToken;

/**
 * Created by yk on 15/12/10.
 */
public class ThirdUserToken extends UsernamePasswordToken {


    private String token;


    public ThirdUserToken(String username, String password) {
        super(username, password);
       this.token = username;
    }

    @Override
    public Object getPrincipal() {
        return super.getPrincipal();
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
