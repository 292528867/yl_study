package com.wonders.xlab.youle.service.mall;

import com.wonders.xlab.youle.entity.mall.*;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.mall.MallActivitiProductRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiRepository;
import com.wonders.xlab.youle.repository.mall.MallOrderRepository;
import com.wonders.xlab.youle.repository.mall.MallProductRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import org.activiti.engine.FormService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service("tryActivitiProcessService")
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED)
public class TryActivitiProcessServiceImpl implements TryActivitiProcessService {
	/** 日志记录器 */
	private final static Logger LOG = LoggerFactory.getLogger(TryActivitiProcessServiceImpl.class);
	
	/** 用于保存订单取消的错误描述 */
	private final static ThreadLocal<String> TryActivitiConditionFailureDesc = new ThreadLocal<>();
	
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private TaskService taskService;
	@Autowired
	private FormService formService;
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private MallProductRepository mallProductRepository;
	@Autowired
	private MallActivitiRepository mallActivitiRepository;
	@Autowired
	private MallActivitiProductRepository mallActivitiProductRepository;
	@Autowired
	private MallOrderRepository mallOrderRepository;
	
	@Override
	public void applyNewTryActiviti(Long userId, Long productId,
			Long tryActivitiId, Integer score, String receiver,
			String receiverPhone, String receiverAddress) {
		// 启动流程
		Map<String, Object> vm = new HashMap<>(); // 流程变量
		vm.put("user_id", userId);
		ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("tryActiviti", vm);
		// 启动后完成第一个任务，申请试用表单的数据
		Task task = taskService.createTaskQuery()
				.processInstanceId(processInstance.getId())
				.taskAssignee(String.valueOf(userId))
				.singleResult();
		
		Map<String, String> form = new HashMap<>();
		form.put("userId", String.valueOf(userId));
		form.put("productId", String.valueOf(productId));
		form.put("tryActivitiId", String.valueOf(tryActivitiId));
		form.put("score", String.valueOf(score));
		
		form.put("receiver", String.valueOf(receiver));
		form.put("receiverPhone", String.valueOf(receiverPhone));
		form.put("receiverAddress", String.valueOf(receiverAddress));
		
		formService.submitTaskFormData(task.getId(), form);
		
	}
	
	@Override
	public void calcuTryActivitiCondition(DelegateExecution execution) {
		// 此处判定用户是否可以申请商品试用
		// 1、积分不够不能申请
		// 2、试用商品数量不够
		// 3、同一商品不能重复申请
		
		// 获取流程变量，用户id，商品id，活动id，商品所需积分
		Long userId = Long.parseLong(execution.getVariable("userId").toString());
		Long productId = Long.parseLong(execution.getVariable("productId").toString());
		Long tryActivitiId = Long.parseLong(execution.getVariable("tryActivitiId").toString());
		Integer score = Integer.parseInt(execution.getVariable("score").toString());
		
		// 获取用户、商品、及关联信息
		User user = userRepository.findOne(userId);
		MallProduct mallProduct = mallProductRepository.findOne(productId);
		MallActiviti mallActiviti = mallActivitiRepository.findOne(tryActivitiId);
		
		// 1、判定用户积分是否够，这里可能会脏读，暂时不管
		if (user.getIntegrals() < score) {
			int _s = score - user.getIntegrals();

			execution.setVariable("condition", "1");
//			execution.setVariable("orderCancelDesc", "用户积分不够！");
//			TryActivitiConditionFailureDesc.set("用户积分不够！"); // 暂时用threadlocal处理给同一线程不同对象共享

			execution.setVariable("orderCancelDesc", "哎呀！您的积分不够了，还差" + _s + "分！可以先去发布测评赚取积分");
			TryActivitiConditionFailureDesc.set("哎呀！您的积分不够了，还差" + _s + "分！可以先去发布测评赚取积分"); // 暂时用threadlocal处理给同一线程不同对象共享
		} else {
			// 2、判定试用商品数量是否还有
			MallActivitiProductPK pk = new MallActivitiProductPK(mallActiviti, mallProduct);
			MallActivitiProduct mallActivitiProduct = mallActivitiProductRepository.findOne(pk);
			if (mallActivitiProduct.getCount() < 0) {
				execution.setVariable("condition", "1");
				execution.setVariable("orderCancelDesc", "商品试用数量不够！");
				TryActivitiConditionFailureDesc.set("商品试用数量不够！"); // 暂时用threadlocal处理给同一线程不同对象共享
			} else {
				// 3、判定同一商品不能重复申请
				long count = mallOrderRepository.countByUserIdAndMallProductIdsAndOrderCompletedFalse(userId, String.valueOf(productId));
				if (count > 0) {
					execution.setVariable("condition", "1");
					execution.setVariable("orderCancelDesc", "商品已经下单，请完成购买后再尝试试用！");
					TryActivitiConditionFailureDesc.set("商品已经下单，请完成购买后再尝试试用！"); // 暂时用threadlocal处理给同一线程不同对象共享
				} else {
					// 都满足条件，则减积分，减商品数量，这里可能脏读，以后用version
					user.setIntegrals(user.getIntegrals() - score);
					mallActivitiProduct.setCount(mallActivitiProduct.getCount() - 1);
					execution.setVariable("condition", "0");
				}
			}
		}
	}
	
	@Override
	public String getTryActivitiConditionFailureDesc() {
		return TryActivitiConditionFailureDesc.get();
	}

	@Override
	public void builderOrder(DelegateExecution execution) {
		// 获取流程变量
		Long userId = Long.parseLong(execution.getVariable("userId").toString());
		String productId = execution.getVariable("productId").toString();
		Integer score = Integer.parseInt(execution.getVariable("score").toString());
		String processInstanceId = execution.getProcessInstanceId();
		
		String receiver = execution.getVariable("receiver").toString();
		String receiverPhone = execution.getVariable("receiverPhone").toString();
		String receiverAddress = execution.getVariable("receiverAddress").toString();
		
		User user = userRepository.findOne(userId);
		MallProduct product = mallProductRepository.findOne(Long.valueOf(productId));
		MallOrder mallOrder = new MallOrder();
		mallOrder.setUserId(user.getId());
		mallOrder.setUserName(user.getNickName());
		mallOrder.setMallProductIds(productId); // 暂时为一个商品
		mallOrder.setMallProductNames(product.getName()); // 暂时为一个商品
		mallOrder.setMallProductPictureUrls(product.getPictureUrl()); // 暂时为一个商品
		mallOrder.setCost(0D);
		mallOrder.setScore(score);
		mallOrder.setReceiver(receiver);
		mallOrder.setReceiverPhone(receiverPhone);
		mallOrder.setReceiverAddress(receiverAddress);
		mallOrder.setActivitiBpmProcessInstanceId(processInstanceId);
		mallOrder.setOrderStatus(MallOrderStatus.WAITSHIP);
		mallOrder.setOrderStatusDesc(MallOrderStatus.WAITSHIP.toString());
		
		this.mallOrderRepository.save(mallOrder);
	}

	@Override
	public void deliveryOrder(Long mallOrderId, String shippingNo, String shippingInfo, String processInstanceId) {
		// 修改订单状态，添加物流单号
		MallOrder mallOrder = mallOrderRepository.findOne(mallOrderId);
		mallOrder.setShippingNo(shippingNo);
		mallOrder.setShippingInfo(shippingInfo);
		mallOrder.setOrderStatus(MallOrderStatus.SHIPPED);
		mallOrder.setOrderStatusDesc(MallOrderStatus.SHIPPED.toString());
		
		// 提交task
		Task task = taskService.createTaskQuery()
				.processInstanceId(processInstanceId)
				.taskAssignee("manager")
				.singleResult();
		
		Map<String, String> form = new HashMap<>();
		form.put("orderId", String.valueOf(mallOrder.getId()));
		formService.submitTaskFormData(task.getId(), form);
	}

	@Override
	public void confirmDeliveryOrder(Long mallOrderId, String processInstanceId) {
		// 修改订单状态，确认收货，这个以后改成自动触发
		MallOrder mallOrder = mallOrderRepository.findOne(mallOrderId);
		mallOrder.setOrderStatus(MallOrderStatus.DELIVERIED);
		mallOrder.setOrderStatusDesc(MallOrderStatus.DELIVERIED.toString());
		
		// 提交task
		Task task = taskService.createTaskQuery()
				.processInstanceId(processInstanceId)
				.taskAssignee("manager")
				.singleResult();
		taskService.complete(task.getId());
	}
	
	@Override
	public void processEndListener(DelegateExecution execution) {
		// 获取订单判定条件
		String condition = String.valueOf(execution.getVariable("condition"));
		if ("0".equals(condition)) {
			MallOrder mallOrder = mallOrderRepository.findOne(
					Long.parseLong(String.valueOf(execution.getVariable("orderId"))));
			mallOrder.setOrderCompleted(true);
		} else if ("1".equals(condition)) {
			// 日志打印
			if (LOG.isInfoEnabled()) 
				LOG.info(String.valueOf(execution.getVariable("orderCancelDesc")));
		} else {
			// 暂时不可能
		}
	}
	
}
