package com.wonders.xlab.youle.service.security.realm;

import com.wonders.xlab.youle.entity.user.ThirdUser;
import com.wonders.xlab.youle.service.security.principal.PrimaryPrincipal;
import com.wonders.xlab.youle.service.security.principal.ThirdUserPrincipal;
import org.apache.shiro.authc.Account;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;

import java.util.Collection;

/**
 * Created by yk on 15/12/10.
 */
public class ThirdUserAccount implements Account {

    private String realm;

    /** 身份信息一，主身份 */
    private ThirdUserPrincipal thirdUserPrincipal;

    /** principal 集合 */
    private SimplePrincipalCollection spc;

    public ThirdUserAccount(String realm, ThirdUser thirdUser) {
        this.realm = realm;
        ThirdUserPrincipal tp = new ThirdUserPrincipal(
                thirdUser.getToken(),
                thirdUser.getUser().getId()
        );
        thirdUserPrincipal = tp;
        this.spc = new SimplePrincipalCollection();
        spc.add(tp,realm);
    }



    @Override
    public PrincipalCollection getPrincipals() {
        return spc;
    }

    @Override
    public Object getCredentials() {
        return thirdUserPrincipal.getToken();
    }

    @Override
    public Collection<String> getRoles() {
        return null;
    }

    @Override
    public Collection<String> getStringPermissions() {
        return null;
    }

    @Override
    public Collection<Permission> getObjectPermissions() {
        return null;
    }

    public String getRealm() {
        return realm;
    }

    public void setRealm(String realm) {
        this.realm = realm;
    }

    public ThirdUserPrincipal getThirdUserPrincipal() {
        return thirdUserPrincipal;
    }

    public void setThirdUserPrincipal(ThirdUserPrincipal thirdUserPrincipal) {
        this.thirdUserPrincipal = thirdUserPrincipal;
    }
}
