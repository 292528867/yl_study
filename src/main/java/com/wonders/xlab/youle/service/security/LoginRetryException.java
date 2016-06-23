package com.wonders.xlab.youle.service.security;

import org.apache.shiro.authc.AuthenticationException;

/**
 * 登录次数限制异常。
 */
public class LoginRetryException extends AuthenticationException {
    public LoginRetryException() {
    }

    public LoginRetryException(String message) {
        super(message);
    }

    public LoginRetryException(Throwable cause) {
        super(cause);
    }

    public LoginRetryException(String message, Throwable cause) {
        super(message, cause);
    }
}
