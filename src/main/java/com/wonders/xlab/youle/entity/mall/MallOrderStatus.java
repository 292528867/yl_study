package com.wonders.xlab.youle.entity.mall;

public enum MallOrderStatus {
	/** 待处理发货 */
	WAITSHIP, 
	SHIPPED, // 已处理发货
	DELIVERIED, // 货物已送达
	
	ORDERCANCELED; // 订单已取消 
	
	public String toString() {
		switch (this) {
		case WAITSHIP : 
			return "待处理发货";
		case SHIPPED : 
			return "已处理发货";
		case DELIVERIED : 
			return "货物已送达";
		case ORDERCANCELED : 
			return "订单已取消";
		default : 
			return "未知状态";
		}
	}
}
