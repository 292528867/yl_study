package com.wonders.xlab.youle.service.security.mgt;

import org.apache.shiro.mgt.DefaultSubjectFactory;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.subject.SubjectContext;
import org.apache.shiro.web.subject.WebSubjectContext;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * 自定义Subject工厂。
 */
public class MySubjectFactory extends DefaultSubjectFactory {
    @Override
    public Subject createSubject(SubjectContext context) {

        WebSubjectContext wsc = (WebSubjectContext) context;
        org.apache.shiro.mgt.SecurityManager securityManager = wsc.resolveSecurityManager();
        Session session = wsc.resolveSession();
        boolean sessionEnabled = wsc.isSessionCreationEnabled();
        PrincipalCollection principals = wsc.resolvePrincipals();
        boolean authenticated = wsc.resolveAuthenticated();
        String host = wsc.resolveHost();
        ServletRequest request = wsc.resolveServletRequest();
        ServletResponse response = wsc.resolveServletResponse();

        return new MySubject(principals, authenticated, host, session, sessionEnabled,
                request, response, securityManager);
    }
}
