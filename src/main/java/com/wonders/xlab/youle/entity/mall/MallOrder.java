package com.wonders.xlab.youle.entity.mall;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Table;

/**
 * 商城订单。
 * @author xu
 *
 */
@Entity
@Table(name = "YL_MALL_ORDER")
public class MallOrder extends AbstractBaseEntity<Long> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/** 用户id */
	private Long userId;
	/** 用户名字 */
	private String userName;
	/** 商城商品id列表，用逗号隔开 */
	private String mallProductIds;
	/** 商城商品名字列表，用逗号隔开 */
	private String mallProductNames;
	/** 商城商品图片列表 */
	private String mallProductPictureUrls;
	/** 花费的钱 */
	private Double cost;
	/** 花费的积分 */
	private Integer score;
	/** 订单状态 */
	@Enumerated
	private MallOrderStatus orderStatus;
	/** 订单状态描述 */
	private String orderStatusDesc;

	/** 物流信息（快递公司名字等） */
	private String shippingInfo;
	/** 物流Id */
	private String shippingNo;
	
	/** 收货人 */
	private String receiver;
	/** 收货人电话 */
	private String receiverPhone;
	/** 收货人地址 */
	private String receiverAddress;
	
	/** 订单是否已经结束 */
	@Type(type="yes_no")
	private boolean orderCompleted;
	/** 活动流程id */
	private String activitiBpmProcessInstanceId;

	// TODO：

	public String getMallProductPictureUrls() {
		return mallProductPictureUrls;
	}

	public void setMallProductPictureUrls(String mallProductPictureUrls) {
		this.mallProductPictureUrls = mallProductPictureUrls;
	}

	public String getMallProductIds() {
		return mallProductIds;
	}

	public void setMallProductIds(String mallProductIds) {
		this.mallProductIds = mallProductIds;
	}

	public Double getCost() {
		return cost;
	}

	public void setCost(Double cost) {
		this.cost = cost;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public String getActivitiBpmProcessInstanceId() {
		return activitiBpmProcessInstanceId;
	}

	public void setActivitiBpmProcessInstanceId(String activitiBpmProcessInstanceId) {
		this.activitiBpmProcessInstanceId = activitiBpmProcessInstanceId;
	}

	public MallOrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(MallOrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	public String getOrderStatusDesc() {
		return orderStatusDesc;
	}

	public void setOrderStatusDesc(String orderStatusDesc) {
		this.orderStatusDesc = orderStatusDesc;
	}

	public String getShippingNo() {
		return shippingNo;
	}

	public void setShippingNo(String shippingNo) {
		this.shippingNo = shippingNo;
	}

	public boolean isOrderCompleted() {
		return orderCompleted;
	}

	public void setOrderCompleted(boolean orderCompleted) {
		this.orderCompleted = orderCompleted;
	}

	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public String getReceiverPhone() {
		return receiverPhone;
	}

	public void setReceiverPhone(String receiverPhone) {
		this.receiverPhone = receiverPhone;
	}

	public String getReceiverAddress() {
		return receiverAddress;
	}

	public void setReceiverAddress(String receiverAddress) {
		this.receiverAddress = receiverAddress;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getMallProductNames() {
		return mallProductNames;
	}

	public void setMallProductNames(String mallProductNames) {
		this.mallProductNames = mallProductNames;
	}

	public String getShippingInfo() {
		return shippingInfo;
	}

	public void setShippingInfo(String shippingInfo) {
		this.shippingInfo = shippingInfo;
	}
}
