package com.wonders.xlab.youle.controller.mall.app;

import com.wonders.xlab.youle.dto.mall.*;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.article.Banner;
import com.wonders.xlab.youle.entity.article.Banner.LinkType;
import com.wonders.xlab.youle.entity.article.Banner.Type;
import com.wonders.xlab.youle.entity.mall.*;
import com.wonders.xlab.youle.entity.mall.MallActiviti.ActivitiType;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.article.BannerRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiProductRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiRepository;
import com.wonders.xlab.youle.repository.mall.MallOrderRepository;
import com.wonders.xlab.youle.repository.mall.MallProductRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.mall.TryActivitiProcessService;
import com.wonders.xlab.youle.service.security.SecurityService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * app 商品试用
 *
 */
@RestController
@RequestMapping(value="mall/app")
public class AppMallActivitiController {
	@Autowired
	private MallActivitiProductRepository mallActivitiProductRepository;
	@Autowired
	private TryActivitiProcessService tryActivitiProcessService;
	@Autowired
	private SecurityService securityService;
	@Autowired
	private MallOrderRepository mallOrderRepository;
	@Autowired
	private MallProductRepository mallProductRepository;
	@Autowired
	private MallActivitiRepository mallActivitiRepository;
	@Autowired
	private BannerRepository bannerRepository;
	@Autowired
	private UserRepository userRepository;
	
	/**
	 * 商城首页。
	 */
	@RequestMapping(value = "activiti/index")
	public ControllerResult<?> mallIndex() {
		Map<String, List<?>> mapList = new HashMap<>();
		
		// 1、banner条数据
		List<Object> bannerList = new ArrayList<>();
		mapList.put("banner", bannerList);
		List<Banner> bList = bannerRepository.findTop5ByTypeOrderBySortSequenceDesc(Type.mall);
		for (Banner banner : bList) {
			if (banner.getLinkType() == LinkType.inside) {
				// TODO：此处都不做错误检查了，sorry
				long activitiId = Long.parseLong(banner.getSynthesis().split("_")[0]);
				long productId = Long.parseLong(banner.getSynthesis().split("_")[1]);
				MallActivitiProductPK pk = new MallActivitiProductPK();
				pk.setMallActiviti(this.mallActivitiRepository.findOne(activitiId));
				pk.setMallProduct(this.mallProductRepository.findOne(productId));
				MallBannerInsideTypeVo vo = new MallBannerInsideTypeVo(
						this.mallActivitiProductRepository.findOne(pk)
				);
				vo.setPictureUrl(banner.getIconUrl());
				vo.setBannerId(banner.getId());
				bannerList.add(vo);
			} else if (banner.getLinkType() == LinkType.outside) {
				// TODO：此处都不做错误检查了，sorry
				long productId = Long.parseLong(banner.getSynthesis());
				MallProduct p = this.mallProductRepository.findOne(productId);
				MallBannerOutsideTypeVo vo = new MallBannerOutsideTypeVo(p);
				vo.setPictureUrl(banner.getIconUrl());
				vo.setBannerId(banner.getId());
				bannerList.add(vo);
			} else if (banner.getLinkType() == LinkType.tryout) {
				// 全部试用商品
				bannerList.add(new MallBannerTryOutTypeVo(banner));
			}
		}
		
		// 2、试用商品2个，规则暂时用时间排序取2个
		List<TryActivitiProductVo> mallActivitiProductList = new ArrayList<>();
		mapList.put("mallProducts", mallActivitiProductList);
		List<MallActivitiProduct> apList = this.mallActivitiProductRepository.queryProducts(
				ActivitiType.TRY, true, true, new PageRequest(0, 2)).getContent();
		for (MallActivitiProduct p : apList) 
			mallActivitiProductList.add(new TryActivitiProductVo(p));
		
		// 3、外链商品2个，规则暂时用时间排序取2个
		List<NormalActivitiProductVo> otherMallProductList = new ArrayList<>();
		mapList.put("otherProducts", otherMallProductList);
		List<MallActivitiProduct> opList = this.mallActivitiProductRepository.queryProducts(
				ActivitiType.NORMAL, true, true, new PageRequest(0, 2)).getContent();
		for (MallActivitiProduct p : opList) 
			otherMallProductList.add(new NormalActivitiProductVo(p.getPk().getMallProduct()));
				
		return new ControllerResult<>().setRet_code(0).setRet_values(mapList).setMessage("首页");
	}
	
	/**
	 * 获取全部试用商品列表。
	 * @return
	 */
	@RequestMapping(value = "activiti/products")
	public ControllerResult<Page<TryActivitiProductVo>> getTryActivitiProduct(Pageable pageable) {
		List<TryActivitiProductVo> voList = new ArrayList<>();
		Page<MallActivitiProduct> page = this.mallActivitiProductRepository.queryProducts(
				ActivitiType.TRY, true, true, pageable);
		for (MallActivitiProduct p : page.getContent()) 
			voList.add(new TryActivitiProductVo(p));
		
		PageImpl<TryActivitiProductVo> newPage = new PageImpl<>(voList, pageable, page.getTotalElements());
		return new ControllerResult<Page<TryActivitiProductVo>>().setRet_code(0).setRet_values(newPage).setMessage("成功返回！");
	}

	/**
	 * 获取试用商品明细。
	 * @param dto
	 * @return
	 */
	@RequestMapping(value = "activiti/product/detail")
	public ControllerResult<TryActivitiProductDetailVo> getTryActivitiProductDetail(@RequestBody TryActivitiProductDetailDto dto) {
		MallProduct p = this.mallProductRepository.findOne(dto.getProductId());
		MallActiviti a = this.mallActivitiRepository.findOne(dto.getTryActivitiId());
		MallActivitiProductPK pk = new MallActivitiProductPK();
		pk.setMallProduct(p);
		pk.setMallActiviti(a);
		MallActivitiProduct mp = this.mallActivitiProductRepository.findOne(pk);

		return new ControllerResult<TryActivitiProductDetailVo>()
				.setRet_code(0)
				.setRet_values(new TryActivitiProductDetailVo(mp))
				.setMessage("试用商品明细！");

	}
	
	/**
	 * 获取全部外链商品。
	 * @param pageable
	 * @return
	 */
	@RequestMapping(value = "other/products")
	public ControllerResult<Page<NormalActivitiProductVo>> getOtherProduct(Pageable pageable) {
		List<NormalActivitiProductVo> voList = new ArrayList<>();
		Page<MallActivitiProduct> page = this.mallActivitiProductRepository.queryProducts(
				ActivitiType.NORMAL, true, true, pageable);
		for (MallActivitiProduct p : page.getContent()) 
			voList.add(new NormalActivitiProductVo(p.getPk().getMallProduct()));
			
		PageImpl<NormalActivitiProductVo> newPage = new PageImpl<>(voList, pageable, page.getTotalElements());
		return new ControllerResult<Page<NormalActivitiProductVo>>().setRet_code(0).setRet_values(newPage).setMessage("成功返回！");
	}
	
	/**
	 * 开始试用商品活动。
	 * @param dto
	 * @return
	 */
	@RequestMapping(value = "activiti/order")
	public ControllerResult<String> startTryActivitiProduct(@RequestBody StartTryActivitiProductDto dto) {
		Long userId = securityService.getUserId();
		this.tryActivitiProcessService.applyNewTryActiviti(
				userId, 
				dto.getProductId(), 
				dto.getTryActivitiId(), 
				dto.getScore(), 
				dto.getReceiver(), 
				dto.getReceiverPhone(), 
				dto.getReceiverAddress());
		
		String failureDesc = this.tryActivitiProcessService.getTryActivitiConditionFailureDesc();
		if (StringUtils.isBlank(failureDesc))		
			return new ControllerResult<String>().setRet_code(0).setRet_values("ok").setMessage("ok");
		else
			return new ControllerResult<String>().setRet_code(-1).setRet_values(failureDesc).setMessage(failureDesc);
	}

	/**
	 * 测试开始试用商品活动。
	 * @param dto
	 * @return
	 */
	@RequestMapping(value = "activiti/test/order")
	public ControllerResult<String> testTryActivitiProcess(@RequestBody TestTryActivitiProductDto dto) {

		// 此处判定用户是否可以申请商品试用
		// 1、积分不够不能申请
		// 2、试用商品数量不够
		// 3、同一商品不能重复申请

		// 获取流程变量，用户id，商品id，活动id，商品所需积分
		Long userId = securityService.getUserId();
		Long productId = dto.getProductId();
		Long tryActivitiId = dto.getTryActivitiId();
		Integer score = dto.getScore();

		// 获取用户、商品、及关联信息
		User user = userRepository.findOne(userId);
		MallProduct mallProduct = mallProductRepository.findOne(productId);
		MallActiviti mallActiviti = mallActivitiRepository.findOne(tryActivitiId);

		// 1、判定用户积分是否够，这里可能会脏读，暂时不管
		if (user.getIntegrals() < score) {
			return new ControllerResult<String>()
					.setRet_code(-1)
					.setRet_values("哎呀！您的积分不够了，还差" + (score - user.getIntegrals()) + "分！可以先去发布测评赚取积分")
					.setMessage("哎呀！您的积分不够了，还差" + (score - user.getIntegrals()) + "分！可以先去发布测评赚取积分");
		} else {
			// 2、判定试用商品数量是否还有
			MallActivitiProductPK pk = new MallActivitiProductPK(mallActiviti, mallProduct);
			MallActivitiProduct mallActivitiProduct = mallActivitiProductRepository.findOne(pk);
			if (mallActivitiProduct.getCount() < 0) {
				return new ControllerResult<String>()
						.setRet_code(-1)
						.setRet_values("商品试用数量不够！")
						.setMessage("商品试用数量不够！");
			} else {
				// 3、判定同一商品不能重复申请
				long count = mallOrderRepository.countByUserIdAndMallProductIdsAndOrderCompletedFalse(userId, String.valueOf(productId));
				if (count > 0) {
					return new ControllerResult<String>()
							.setRet_code(-1)
							.setRet_values("商品已经下单，请完成购买后再尝试试用！")
							.setMessage("商品已经下单，请完成购买后再尝试试用！");
				} else {
					// 都满足条件，则减积分，减商品数量，这里可能脏读，以后用version
					return new ControllerResult<String>()
							.setRet_code(0)
							.setRet_values("可以下单！")
							.setMessage("可以下单！");
				}
			}
		}


	}

	
	/**
	 * 获取试用商品订单。
	 * @param pageable
	 * @return
	 */
	@RequestMapping(value = "activiti/orderList")
	public ControllerResult<Page<TryActivitiOrderVo>> getTryActivitiOrder(Pageable pageable) {
		List<TryActivitiOrderVo> voList = new ArrayList<>();
		Long userId = securityService.getUserId();
		Page<MallOrder> page = mallOrderRepository.findByUserId(userId, pageable);
		for (MallOrder mallOrder : page.getContent()) {
			TryActivitiOrderVo vo = new TryActivitiOrderVo();
			vo.setScore(mallOrder.getScore());
			vo.setOrderUpdateDate(mallOrder.getLastModifiedDate().toDate());
			vo.setOrderStatus(mallOrder.getOrderStatusDesc());
			
			Long productId = Long.valueOf(mallOrder.getMallProductIds());
			MallProduct mallProduct = mallProductRepository.findOne(productId);
			vo.setProductId(mallProduct.getId());
			vo.setProductName(mallProduct.getName());
			vo.setProductUrl(mallProduct.getPictureUrl());
			vo.setOrderId(mallOrder.getId());
			
			voList.add(vo);
		}
		
		PageImpl<TryActivitiOrderVo> newPage = new PageImpl<>(voList, pageable, page.getTotalElements());
		
		return new ControllerResult<Page<TryActivitiOrderVo>>().setRet_code(0).setRet_values(newPage).setMessage("成功！");
	}

}
