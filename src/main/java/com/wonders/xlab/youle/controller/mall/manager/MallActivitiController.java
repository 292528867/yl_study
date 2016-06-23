package com.wonders.xlab.youle.controller.mall.manager;

import com.wonders.xlab.framework.controller.AbstractBaseController;
import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.dto.result.ExtFormResponse;
import com.wonders.xlab.youle.entity.mall.MallActiviti;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;
import com.wonders.xlab.youle.entity.mall.MallActivitiProductPK;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import com.wonders.xlab.youle.repository.mall.MallActivitiProductRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiRepository;
import com.wonders.xlab.youle.repository.mall.MallProductRepository;
import org.apache.commons.beanutils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * 商品活动控制器。
 * @author xu
 *
 */
@RestController
@RequestMapping(value="mall/manager/activiti")
public class MallActivitiController extends AbstractBaseController<MallActiviti, Long> {
	@Autowired
	private MallActivitiProductRepository mallActivitiProductRepository;
	@Autowired
	private MallProductRepository mallProductRepository;
	@Autowired
	private MallActivitiRepository mallActivitiRepository;

	@Override
	protected MyRepository<MallActiviti, Long> getRepository() {
		return mallActivitiRepository;
	}

	@RequestMapping(value = "otheractivitiProduct", method = RequestMethod.POST)
	public String otheractivitiProduct(String pids) throws Exception {

		// 1、查找最新创建的有效的试用商品活动
		MallActiviti mallActiviti = this.mallActivitiRepository.findFirstByEnabledAndTypeOrderByCreatedDateDesc(true, MallActiviti.ActivitiType.NORMAL);
		if (mallActiviti == null)
			return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg("暂无商品试用活动信息，请先添加活动！"));

		// 2、查找指定activiti包含的商品关联
		List<MallActivitiProduct> mallActivitiProductList = this.mallActivitiProductRepository.findByPkMallActivitiId(mallActiviti.getId());
		// 3、查找欲修改的商品列表
		List<MallProduct> mallProductList = this.mallProductRepository.findAll(
				Arrays.asList(
						(Long[]) ConvertUtils.convert(pids.split(","), new Long[0].getClass())
				));

		// 4、比较已经关联的商品，存在的话，修改属性，不存在，添加关联
		boolean isActivitiProduct = false;
		for (MallProduct mallProduct : mallProductList) {
			isActivitiProduct = false;
			for (MallActivitiProduct mallActivitiProduct : mallActivitiProductList) {
				if (mallProduct.getId() == mallActivitiProduct.getPk().getMallProduct().getId()) {
					// 如果添加过，跳过
					isActivitiProduct = true;
					break;
				}
			}
			if (!isActivitiProduct) {
				MallActivitiProduct mallActivitiProduct = new MallActivitiProduct();
				MallActivitiProductPK pk = new MallActivitiProductPK();
				pk.setMallActiviti(mallActiviti);
				pk.setMallProduct(mallProduct);
				mallActivitiProduct.setPk(pk);
				mallActivitiProduct.setEnabled(true);
				this.mallActivitiProductRepository.save(mallActivitiProduct);
			} else {
				// 添加过的，就不处理了
			}
		}

		return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg("成功"));
	}

	@RequestMapping(value = "tryactivitiProduct", method = RequestMethod.POST)
	public String tryactivitiProduct(String pids, String fromDateStr, String toDateStr, Integer score, Integer totalCount) throws Exception {
		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date fromDate = sf.parse(fromDateStr);
		Date toDate = sf.parse(toDateStr);

		// 1、查找最新创建的有效的试用商品活动
		MallActiviti mallActiviti = this.mallActivitiRepository.findFirstByEnabledAndTypeOrderByCreatedDateDesc(true, MallActiviti.ActivitiType.TRY);
		if (mallActiviti == null)
			return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg("暂无商品试用活动信息，请先添加活动！"));

		// 2、查找指定activiti包含的商品关联
		List<MallActivitiProduct> mallActivitiProductList = this.mallActivitiProductRepository.findByPkMallActivitiId(mallActiviti.getId());
		// 3、查找欲修改的商品列表
		List<MallProduct> mallProductList = this.mallProductRepository.findAll(
				Arrays.asList(
						(Long[]) ConvertUtils.convert(pids.split(","), new Long[0].getClass())
				));

		// 4、比较已经关联的商品，存在的话，修改属性，不存在，添加关联
		boolean isActivitiProduct = false;
		for (MallProduct mallProduct : mallProductList) {
			isActivitiProduct = false;
			for (MallActivitiProduct mallActivitiProduct : mallActivitiProductList) {
				if (mallProduct.getId() == mallActivitiProduct.getPk().getMallProduct().getId()) {
					// 如果添加过，跳过
					isActivitiProduct = true;
					break;
				}
			}
			if (!isActivitiProduct) {
				MallActivitiProduct mallActivitiProduct = new MallActivitiProduct();
				MallActivitiProductPK pk = new MallActivitiProductPK();
				pk.setMallActiviti(mallActiviti);
				pk.setMallProduct(mallProduct);
				mallActivitiProduct.setPk(pk);
				mallActivitiProduct.setTotalCount(totalCount);
				mallActivitiProduct.setCount(totalCount);
				mallActivitiProduct.setScore(score);
				mallActivitiProduct.setValidStartTime(fromDate);
				mallActivitiProduct.setValidEndTime(toDate);
				mallActivitiProduct.setEnabled(true);
				this.mallActivitiProductRepository.save(mallActivitiProduct);
			} else {
				// 添加过的，就不处理了
			}
		}

		return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg("成功"));
	}

	@Override
	public MallActiviti modify(@RequestBody MallActiviti entity) {
		// 这里的更新不更新内部的商品描述
		MallActiviti ma = this.mallActivitiRepository.findOne(entity.getId());
		
		ma.setActivitiDesc(entity.getActivitiDesc());
		ma.setActivitiName(entity.getActivitiName());
		ma.setActivitiProcessDefinitionKey(entity.getActivitiProcessDefinitionKey());
		ma.setEnabled(entity.isEnabled());
		ma.setRemark(entity.getRemark());
		ma.setType(entity.getType());
		
		this.mallActivitiRepository.save(ma);
		
		return ma;
	}
}
