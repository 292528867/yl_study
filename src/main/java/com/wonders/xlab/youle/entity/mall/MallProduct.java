package com.wonders.xlab.youle.entity.mall;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

/**
 * 商城商品表。
 * @author xu
 *
 */
@Entity
@Table(name = "YL_MALL_PRODUCT")
public class MallProduct extends AbstractBaseEntity<Long> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/** 商品名称 */
	private String name;
	/** 商品简介 */
	private String summary;
	/** 商品原价 */
	private double originalPrice;
	/** 商品现价 */
	private double currentPrice;
	/** 商品图片 */
	private String pictureUrl;
	/** 商品图片列表（用逗号分隔） */
	private String pictureUrlList;
	/** 商品描述（具体图文描述html） */
	@Lob
	private String productDesc;
	
	/** TODO：类别，暂时这样放 */
	private String category;
	/** 排序字段 */
	private long orderValue;
	
	/** 商品外链接 */
	private String productExternalUrl;
    
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public double getOriginalPrice() {
		return originalPrice;
	}
	public void setOriginalPrice(double originalPrice) {
		this.originalPrice = originalPrice;
	}
	public double getCurrentPrice() {
		return currentPrice;
	}
	public void setCurrentPrice(double currentPrice) {
		this.currentPrice = currentPrice;
	}
	public String getPictureUrl() {
		return pictureUrl;
	}
	public void setPictureUrl(String pictureUrl) {
		this.pictureUrl = pictureUrl;
	}
	
	public String getProductDesc() {
		return productDesc;
	}
	public void setProductDesc(String productDesc) {
		this.productDesc = productDesc;
	}
	public String getPictureUrlList() {
		return pictureUrlList;
	}
	public void setPictureUrlList(String pictureUrlList) {
		this.pictureUrlList = pictureUrlList;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getProductExternalUrl() {
		return productExternalUrl;
	}
	public void setProductExternalUrl(String productExternalUrl) {
		this.productExternalUrl = productExternalUrl;
	}

	public long getOrderValue() {
		return orderValue;
	}

	public void setOrderValue(long orderValue) {
		this.orderValue = orderValue;
	}
}
