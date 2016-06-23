package com.wonders.xlab.youle.entity.mall;

import java.io.Serializable;

import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * 活动商品关联主键。
 * @author xu
 */
@Embeddable
public class MallActivitiProductPK implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/** 关联的活动 */
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "MALL_ACTIVITI_ID")
	private MallActiviti mallActiviti;
	
	/** 关联的商品 */
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "MALL_PRODUCT_ID")
	private MallProduct mallProduct;

	public MallActiviti getMallActiviti() {
		return mallActiviti;
	}

	public void setMallActiviti(MallActiviti mallActiviti) {
		this.mallActiviti = mallActiviti;
	}

	public MallProduct getMallProduct() {
		return mallProduct;
	}

	public void setMallProduct(MallProduct mallProduct) {
		this.mallProduct = mallProduct;
	}

	public MallActivitiProductPK() {
		super();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((mallActiviti == null) ? 0 : mallActiviti.hashCode());
		result = prime * result
				+ ((mallProduct == null) ? 0 : mallProduct.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		MallActivitiProductPK other = (MallActivitiProductPK) obj;
		if (mallActiviti == null) {
			if (other.mallActiviti != null)
				return false;
		} else if (!mallActiviti.equals(other.mallActiviti))
			return false;
		if (mallProduct == null) {
			if (other.mallProduct != null)
				return false;
		} else if (!mallProduct.equals(other.mallProduct))
			return false;
		return true;
	}

	public MallActivitiProductPK(MallActiviti mallActiviti,
			MallProduct mallProduct) {
		super();
		this.mallActiviti = mallActiviti;
		this.mallProduct = mallProduct;
	}
}
