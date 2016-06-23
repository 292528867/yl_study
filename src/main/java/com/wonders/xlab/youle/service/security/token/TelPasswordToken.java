package com.wonders.xlab.youle.service.security.token;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.shiro.authc.UsernamePasswordToken;

import java.io.Serializable;

public class TelPasswordToken extends UsernamePasswordToken implements Serializable {

	/** 登录平台 */
	private String appPlateform;
	public String getAppPlateform() {
		return appPlateform;
	}
	public void setAppPlateform(String appPlateform) {
		this.appPlateform = appPlateform;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public TelPasswordToken(final String tel, final String password, final boolean rememberMe, final String host, String appPlateform) {
		// 使用电话号码作为用户名
		super(tel, password, rememberMe, host);
		this.appPlateform = appPlateform;
	}
	
	@Override
	public Object getPrincipal() {
		// 这个是key值，默认返回用户名，以后要改
		return super.getPrincipal();
	}
	
	@Override
	public boolean equals(Object other) {
		if (this == other)
			return true;
		if (!(other instanceof TelPasswordToken))
			return false;
		TelPasswordToken castOther = (TelPasswordToken) other;
		return new EqualsBuilder()
			.append(this.getUsername(), castOther.getUsername())
			.append(this.getPassword(), castOther.getPassword())
			.isEquals();
	}
	
	@Override
	public int hashCode() {
		return new HashCodeBuilder()
			.append(this.getUsername())
			.append(this.getPassword())
			.hashCode();
	}
	
	@Override
	public String toString() {
		return super.toString();
	}
}
