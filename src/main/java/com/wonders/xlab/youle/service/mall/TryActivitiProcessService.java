package com.wonders.xlab.youle.service.mall;

import org.activiti.engine.delegate.DelegateExecution;

/**
 * 试用活动流程服务。
 * @author xu
 *
 */
public interface TryActivitiProcessService {
		
	/**
	 * 申请商品试用。
	 * @param userId 用户id
	 * @param productId 商品id
	 * @param tryActivitiId 活动id
	 * @param score 所需积分
	 * @param receiver 收货人
	 * @param receiverPhone 收货人电话
	 * @param receiverAddress 收货人地址
	 */
	public void applyNewTryActiviti(
			Long userId, Long productId, Long tryActivitiId, Integer score, 
			String receiver, String receiverPhone, String receiverAddress);
	
	/**
	 * 计算活动试用条件。
	 * @param execution
	 */
	public void calcuTryActivitiCondition(DelegateExecution execution);
	
	/**
	 * 获取计算活动试用失败原因。
	 * @return
	 */
	public String getTryActivitiConditionFailureDesc();
	
	/**
	 * 生成订单。
	 * @param execution
	 */
	public void builderOrder(DelegateExecution execution);
	/**
	 * 发货订单。
	 */
	public void deliveryOrder(Long mallOrderId, String shippingNo, String shippingInfo, String processInstanceId);
	/**
	 * 确认收货。
	 */
	public void confirmDeliveryOrder(Long mallOrderId, String processInstanceId);
	
	/**
	 * 流程结束监听器。
	 * @param execution
	 */
	public void processEndListener(DelegateExecution execution);
}
