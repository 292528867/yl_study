package com.wonders.xlab.youle.service.security;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Service;

import com.wonders.xlab.youle.service.security.principal.PrimaryPrincipal;

@Service
public class SecurityService {
	
	/**
	 * 获取用户id。
	 * @return
	 */
	public Long getUserId() {
		Subject subject = SecurityUtils.getSubject();
		if (!subject.isAuthenticated())
			throw new RuntimeException("未登录系统！");
		PrimaryPrincipal pp = (PrimaryPrincipal) subject.getPrincipal();
		return pp.getUserId();
	}
}