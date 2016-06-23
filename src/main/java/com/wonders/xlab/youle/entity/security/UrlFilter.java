package com.wonders.xlab.youle.entity.security;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;



/**
 * shiro url过滤器配置。
 * @author xu
 *
 */
@Entity
@Table(name = "YL_MALL_SEC_URL_FILTERS")
public class UrlFilter extends AbstractBaseEntity<Long> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/** 过滤的url */
	private String url;
	/** 使用的过滤器（多个用逗号分隔） */
	private String filters;
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getFilters() {
		return filters;
	}
	public void setFilters(String filters) {
		this.filters = filters;
	}
}
