package com.wonders.xlab.youle.service.mall;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;

import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseOperation;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import com.github.springtestdbunit.annotation.DatabaseTearDown;
import com.wonders.xlab.youle.entity.mall.MallActiviti;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;
import com.wonders.xlab.youle.entity.mall.MallActivitiProductPK;
import com.wonders.xlab.youle.entity.mall.MallOrder;
import com.wonders.xlab.youle.entity.mall.MallOrderStatus;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.mall.MallActivitiProductRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiRepository;
import com.wonders.xlab.youle.repository.mall.MallOrderRepository;
import com.wonders.xlab.youle.repository.mall.MallProductRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.mall.config.TestApplication;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {TestApplication.class})
@ActiveProfiles("local")
@TestExecutionListeners(listeners = {
	DbUnitTestExecutionListener.class, 
	DependencyInjectionTestExecutionListener.class, 
	DirtiesContextTestExecutionListener.class, 
	TransactionalTestExecutionListener.class
})
public class TryActivitiBpmTest {
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private TryActivitiProcessService tryActivitiProcessService;
	@Autowired
	private MallOrderRepository mallOrderRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private MallProductRepository mallProductRepository;
	@Autowired
	private MallActivitiRepository mallActivitiRepository;
	@Autowired
	private MallActivitiProductRepository mallActivitiProductRepository;
	
//	@Test
//	public void uploadActivitiBpm() throws Exception {
//		// #1、部署流程
//		String deploymentID = repositoryService
//				.createDeployment()
//				.addClasspathResource("com/wonders/xlab/youle/service/mall/TryActivitiProcess.bpmn")
//				.deploy()
//				.getId();
//		Deployment deployment = repositoryService
//				.createDeploymentQuery()
//				.singleResult();
//		assertNotNull(deployment);
//		assertEquals(deploymentID, deployment.getId());
//	}
	
	@Test
	@DatabaseSetup(type=DatabaseOperation.CLEAN_INSERT, value="classpath:com/wonders/xlab/youle/service/mall/dataset/TryActivitiBpmDataSet.xml")
	public void tryActivitiBpmTest() throws Exception {		
		// #1、部署流程
		String deploymentID = repositoryService
				.createDeployment()
				.addClasspathResource("com/wonders/xlab/youle/service/mall/TryActivitiProcess.bpmn")
				.deploy()
				.getId();
		Deployment deployment = repositoryService
				.createDeploymentQuery()
				.singleResult();
		assertNotNull(deployment);
		assertEquals(deploymentID, deployment.getId());
		
		// #2-1、获取用户，试用商品，试用商品所需积分
		User user = userRepository.findOne(1L);
		assertNotNull("用户不存在！", user);
		assertEquals("用户id不对啊！", 1L, user.getId().longValue());
		MallProduct mallProduct = mallProductRepository.findOne(1L);
		assertNotNull("商品不存在！", user);
		assertEquals("商品id不对啊！", 1L, mallProduct.getId().longValue());
		MallActiviti mallActiviti = mallActivitiRepository.findOne(1L);
		assertNotNull("试用活动不存在", mallActiviti);
		assertEquals("试用活动id不对啊", 1L, mallActiviti.getId().longValue());
		MallActivitiProductPK pk = new MallActivitiProductPK(mallActiviti, mallProduct);
		MallActivitiProduct mallActivitiProduct = mallActivitiProductRepository.findOne(pk);
		assertNotNull("试用活动商品不存在", mallActivitiProduct);
		assertEquals("试用活动商品id不对啊", 1L, mallActivitiProduct.getPk().getMallProduct().getId().longValue());
		assertEquals("试用活动商品积分不对啊", 3000L, new Long(mallActivitiProduct.getScore()).longValue());
		assertEquals("试用活动商品数量不对啊", 10L, new Long(mallActivitiProduct.getCount()).longValue());
		
		// 试验插入一个产品
		MallProduct p = new MallProduct();
		p.setName("name2");
		mallProductRepository.save(p);
		
		// #2-2、启动商品试用流程，并申请，通过条件检测，生成订单
		tryActivitiProcessService.applyNewTryActiviti(1L, 1L, 1L, 3000, "收货人1", "收货人电话1", "收货人地址1");
		
		assertEquals("错误描述不对！", "用户积分不够！", this.tryActivitiProcessService.getTryActivitiConditionFailureDesc());
		
//		List<MallOrder> mallOrderList = mallOrderRepository.findByOrderStatus(MallOrderStatus.WAITSHIP);
//		assertEquals("订单数量不对啊", 1L, new Long(mallOrderList.size()).longValue());
//		MallOrder mallOrder = mallOrderList.get(0);
//		assertEquals("订单的商品id", "1", mallOrder.getMallProductIds());
//		assertEquals("订单的商品花费积分", 3000L, new Long(mallOrder.getScore()).longValue());
//		assertEquals("订单状态", MallOrderStatus.WAITSHIP, mallOrder.getOrderStatus());
//		user = userRepository.findOne(1L);
//		assertEquals("用户积分", 0L, new Long(user.getIntegrals()).longValue());
//		mallActivitiProduct = mallActivitiProductRepository.findOne(pk);
//		assertEquals("试用商品数量", 9L, new Long(mallActivitiProduct.getCount()).longValue());
//		assertEquals("订单完成", Boolean.FALSE, mallOrder.isOrderCompleted());
//	
//		// #3、订单发货
//		mallOrderList = mallOrderRepository.findByOrderStatus(MallOrderStatus.WAITSHIP);
//		assertEquals("订单数量不对啊", 1L, new Long(mallOrderList.size()).longValue());
//		mallOrder = mallOrderList.get(0);
//		tryActivitiProcessService.deliveryOrder(mallOrder.getId(), "123456", mallOrder.getActivitiBpmProcessInstanceId());
//		mallOrder = mallOrderRepository.findOne(mallOrder.getId());
//		assertEquals("订单物流号", "123456", mallOrder.getShippingNo());
//		assertEquals("订单状态", MallOrderStatus.SHIPPED, mallOrder.getOrderStatus());
//		assertEquals("订单完成", Boolean.FALSE, mallOrder.isOrderCompleted());
//		
//		// #4、确认收货
//		mallOrderList = mallOrderRepository.findByOrderStatus(MallOrderStatus.SHIPPED);
//		assertEquals("订单数量不对啊", 1L, new Long(mallOrderList.size()).longValue());
//		mallOrder = mallOrderList.get(0);
//		tryActivitiProcessService.confirmDeliveryOrder(mallOrder.getId(), mallOrder.getActivitiBpmProcessInstanceId());
//		mallOrder = mallOrderRepository.findOne(mallOrder.getId());
//		assertEquals("订单状态", MallOrderStatus.DELIVERIED, mallOrder.getOrderStatus());
		
//		// #5、流程结束，listener完成
//		assertEquals("订单完成", Boolean.TRUE, mallOrder.isOrderCompleted());
	}
	
//	@Test
//	@DatabaseSetup(type=DatabaseOperation.CLEAN_INSERT, value="classpath:com/wonders/xlab/healthcloud/mall/testDataSet.xml")
//	@DatabaseTearDown(type=DatabaseOperation.CLEAN_INSERT, value="classpath:com/wonders/xlab/healthcloud/mall/testDataSet.xml")
//	public void t1() throws Exception {
//		System.out.println("dfdfdfdiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii" + realm);
//		
//		TestDomain d = this.testDomainRepository.findOne(1L);
//		assertEquals("id不一致见鬼了！", 1L, d.getId().longValue());
//	}
	
//	@Test
//	@DatabaseSetup(type=DatabaseOperation.CLEAN_INSERT, value="classpath:com/wonders/xlab/healthcloud/mall/MallTestDataSet.xml")
//	@DatabaseTearDown(type=DatabaseOperation.CLEAN_INSERT, value="classpath:com/wonders/xlab/healthcloud/mall/MallTestDataSet.xml")
//	public void MallProductTest() throws Exception {
//		MallProduct mp = this.mallProductRepository.findOne(1L);
//		System.out.println(mp.getCreatedDate());
//		assertEquals("id不一致见鬼了！", 1L, mp.getId().longValue());
//		assertEquals("商品名称不一致见鬼了", "商品名称1", mp.getName());
//		assertEquals("类别名称不一致见鬼了", "测试类别", mp.getCategory());
//	}
}
