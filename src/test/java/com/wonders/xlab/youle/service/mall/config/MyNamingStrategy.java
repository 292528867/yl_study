package com.wonders.xlab.youle.service.mall.config;

import org.hibernate.cfg.ImprovedNamingStrategy;

public class MyNamingStrategy extends ImprovedNamingStrategy {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

//	@Override
//	public String columnName(String columnName) {
////		System.out.println("dfdfdfdfdfdfdfdf");
//		return columnName.toUpperCase();
//	}
	
	@Override
	public String propertyToColumnName(String propertyName) {
		
//		System.out.println(propertyName);
		
		return propertyName.toUpperCase().replace(".", "_");
	}
}
