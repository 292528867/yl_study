package com.wonders.xlab.youle.service.security.realm;

import java.util.Collection;

import org.apache.shiro.authc.Account;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;

import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.service.security.principal.PrimaryPrincipal;

/**
 * 商城用户账户（包括认证、授权信息）。
 * @author xu
 */
public class MallUserAccount implements Account {
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/** 身份信息一，主身份 */
	private PrimaryPrincipal primaryPrincipal;
	
	// TODO：还有其他身份，角色，权限信息
	
	/** realm名字（单个realm） */
	private String realmName;
	/** principal 集合 */
	private SimplePrincipalCollection spc;
	
	/**
	 * 构造商城用户账户。
	 * @param realmName 域名
	 * @param user 数据库user
	 */
	public MallUserAccount(String realmName, User user) {
		this.realmName = realmName;
		this.spc = new SimplePrincipalCollection();
		PrimaryPrincipal p = new PrimaryPrincipal(
			user.getNickName(),
			user.getTel(), 
			user.getPassword(),
			user.getId());
		this.primaryPrincipal = p;
		this.spc.add(p, this.realmName);
		
		// TODO：
	}
	
	
	
	@Override
	public Object getCredentials() {
		String password = this.primaryPrincipal.getPassword(); // 暂时不加密
		return password;
	}
	@Override
	public Collection<Permission> getObjectPermissions() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public PrincipalCollection getPrincipals() {
		return this.spc;
	}
	@Override
	public Collection<String> getRoles() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public Collection<String> getStringPermissions() {
		// TODO Auto-generated method stub
		return null;
	}
}
