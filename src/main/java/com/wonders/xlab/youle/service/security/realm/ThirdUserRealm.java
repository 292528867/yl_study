package com.wonders.xlab.youle.service.security.realm;

import com.wonders.xlab.youle.entity.user.ThirdUser;
import com.wonders.xlab.youle.repository.user.ThirdUserRepository;
import com.wonders.xlab.youle.service.security.token.ThirdUserToken;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by yk on 15/12/10.
 */
public class ThirdUserRealm extends AuthorizingRealm {

    @Autowired
    private ThirdUserRepository thirdUserRepository;

    public ThirdUserRealm() {
        setName("thirdUserRealm");
        // 开启cache ,缓存管理器 使用Ehcache实现
        setCachingEnabled(true);
        // 启用session authentication缓存，并设定缓存名
        setAuthenticationCachingEnabled(true);
        setAuthenticationCacheName("myAuthenticationCache");
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        ThirdUserToken thirdUserToken = (ThirdUserToken)authenticationToken;
        ThirdUser thirdUser = thirdUserRepository.findByToken(thirdUserToken.getToken());
        if (thirdUser == null) {
            throw new UnknownAccountException("第三方登陆错误");
        }
        return new ThirdUserAccount(getName(),thirdUser);
    }
}
