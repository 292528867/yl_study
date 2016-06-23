package com.wonders.xlab.youle.entity.mall;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Set;


/**
 * 商城活动。
 * @author xu
 *
 */
@Entity
@Table(name = "YL_MALL_ACTIVITI")
public class MallActiviti extends AbstractBaseEntity<Long> {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	/** 活动名字 */
	private String activitiName;
	/** 活动说明 */
	private String activitiDesc;
	
	/** 活动流程key */
	private String activitiProcessDefinitionKey;

	/** 评论（待用） */
	private String remark;
	
	/** 活动关联的商品 */
	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
	@JoinTable(
			name = "YL_MALL_ACTIVITI_PRODUCT", 
			joinColumns = @JoinColumn(name = "MALL_ACTIVITI_ID"), 
			inverseJoinColumns = @JoinColumn(name = "MALL_PRODUCT_ID")
	)
	private Set<MallProduct> products;

	/** 是否启用 */
	@Type(type="yes_no")
	private boolean enabled;
	
	/** 活动类型 */
	@Enumerated
	private ActivitiType type;
	
	public enum ActivitiType {
		NORMAL, // 一般，外链商品
		TRY; // 试用商品
	}
	
	// TODO：
	
	
	public String getActivitiName() {
		return activitiName;
	}

	public void setActivitiName(String activitiName) {
		this.activitiName = activitiName;
	}

	public String getActivitiDesc() {
		return activitiDesc;
	}

	public void setActivitiDesc(String activitiDesc) {
		this.activitiDesc = activitiDesc;
	}

	public String getActivitiProcessDefinitionKey() {
		return activitiProcessDefinitionKey;
	}

	public void setActivitiProcessDefinitionKey(String activitiProcessDefinitionKey) {
		this.activitiProcessDefinitionKey = activitiProcessDefinitionKey;
	}

	public Set<MallProduct> getProducts() {
		return products;
	}

	public void setProducts(Set<MallProduct> products) {
		this.products = products;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public ActivitiType getType() {
		return type;
	}

	public void setType(ActivitiType type) {
		this.type = type;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
}
