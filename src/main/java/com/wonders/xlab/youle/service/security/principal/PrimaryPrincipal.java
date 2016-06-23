package com.wonders.xlab.youle.service.security.principal;

import java.io.Serializable;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 主身份。
 * @author xu
 *
 */
public class PrimaryPrincipal implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/** 登录用户名 */
	private String loginName;
	/** 电话号码 */
	private String tel;
	/** 密码 */
	private String password;
	/** 内部用户id */
	private Long userId;
	
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public PrimaryPrincipal(String loginName, String tel, String password,
			Long userId) {
		super();
		this.loginName = loginName;
		this.tel = tel;
		this.password = password;
		this.userId = userId;
	}
	@Override
	public int hashCode() {
		return new HashCodeBuilder()
			.append(this.userId)
			.hashCode();
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PrimaryPrincipal other = (PrimaryPrincipal) obj;
		
		return new EqualsBuilder()
			.append(this.userId, other.userId)
			.isEquals();
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
			.append(this.userId)
			.append(this.tel)
			.toString();
	}
	
}
