package com.wonders.xlab.youle.service.security.mgt;

import com.wonders.xlab.youle.service.security.token.TelPasswordToken;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.web.subject.support.WebDelegatingSubject;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * 自定义Subject。
 */
public class MySubject extends WebDelegatingSubject {
    /** 登录用的token，上下文注入 */
    private TelPasswordToken token;

    public TelPasswordToken getToken() {
        return token;
    }

    public void setToken(TelPasswordToken token) {
        this.token = token;
    }

    public MySubject(PrincipalCollection principals, boolean authenticated,
                     String host, Session session, ServletRequest request,
                     ServletResponse response, SecurityManager securityManager) {
        super(principals, authenticated, host, session, request, response, securityManager);
    }

    public MySubject(PrincipalCollection principals, boolean authenticated,
                     String host, Session session, boolean sessionEnabled,
                     ServletRequest request, ServletResponse response, SecurityManager securityManager) {
        super(principals, authenticated, host, session, sessionEnabled, request, response, securityManager);
    }
}
