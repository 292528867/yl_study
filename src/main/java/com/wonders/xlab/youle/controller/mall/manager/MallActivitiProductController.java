package com.wonders.xlab.youle.controller.mall.manager;

import com.wonders.xlab.youle.entity.mall.MallActiviti;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;
import com.wonders.xlab.youle.entity.mall.MallActivitiProductPK;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import com.wonders.xlab.youle.repository.mall.MallActivitiProductRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiRepository;
import com.wonders.xlab.youle.repository.mall.MallProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "mall/manager/activiti/product")
public class MallActivitiProductController {
	@Autowired
	private MallActivitiProductRepository mallActivitiProductRepository;
	@Autowired
	private MallProductRepository mallProductRepository;
	@Autowired
	private MallActivitiRepository mallActivitiRepository;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<MallActivitiProductVo> find(Long activitiId) {
		List<MallActivitiProductVo> volist = new ArrayList<>();
		List<MallActivitiProduct> maplist = this.mallActivitiProductRepository.findByPkMallActivitiId(activitiId);
		for (MallActivitiProduct mallActivitiProduct : maplist) 
			volist.add(new MallActivitiProductVo(mallActivitiProduct));
		return volist;
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public MallActivitiProductVo create(@RequestBody MallActivitiProductVo vo) {
		MallActivitiProduct map = new MallActivitiProduct();
		map.setPk(getMallActivitiProductPK(vo.getActivitiId(), vo.getProductId()));
		map.setScore(vo.getScore());
		map.setCount(vo.getCount());
		map.setEnabled(vo.isEnabled());
		map.setValidStartTime(vo.getValidStartTime());
		map.setValidEndTime(vo.getValidEndTime());
		this.mallActivitiProductRepository.save(map);
		
		vo.setId(vo.getActivitiId() + "_" + vo.getProductId());
		return vo;
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable String id) {
		mallActivitiProductRepository.delete(getMallActivitiProductPK(
			Long.valueOf(id.split("_")[0]),
			Long.valueOf(id.split("_")[1])
		));
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.PUT)
	public MallActivitiProductVo update(@PathVariable String id, @RequestBody MallActivitiProductVo vo) {
		String newId = vo.getActivitiId() + "_" + vo.getProductId();
		if (newId.equals(vo.getId())) {
			MallActivitiProduct map = new MallActivitiProduct();
			map.setPk(getMallActivitiProductPK(vo.getActivitiId(), vo.getProductId()));
			map.setScore(vo.getScore());
			map.setCount(vo.getCount());
			map.setEnabled(vo.isEnabled());
			map.setValidStartTime(vo.getValidStartTime());
			map.setValidEndTime(vo.getValidEndTime());
			this.mallActivitiProductRepository.save(map);
		} else {
			MallActivitiProductPK oldPk = getMallActivitiProductPK(
				Long.valueOf(vo.getId().split("_")[0]), 
				Long.valueOf(vo.getId().split("_")[1]));
			this.mallActivitiProductRepository.delete(oldPk);
			
			vo.setId(vo.getActivitiId() + "_" + vo.getProductId());
			MallActivitiProduct map = new MallActivitiProduct();
			map.setPk(getMallActivitiProductPK(vo.getActivitiId(), vo.getProductId()));
			map.setScore(vo.getScore());
			map.setCount(vo.getCount());
			map.setEnabled(vo.isEnabled());
			map.setValidStartTime(vo.getValidStartTime());
			map.setValidEndTime(vo.getValidEndTime());
			this.mallActivitiProductRepository.save(map);
		}
		
		return vo;
	}
	
	private MallActivitiProductPK getMallActivitiProductPK(Long activitiId, Long productId) {
		MallProduct mp = mallProductRepository.findOne(productId);
		MallActiviti ma = mallActivitiRepository.findOne(activitiId);
		MallActivitiProductPK pk = new MallActivitiProductPK(ma, mp);
		return pk;
	}
	
	public static class MallActivitiProductVo  {
		private String id;		
		private Long activitiId;
		private Long productId;
		private Integer count;
		private Integer score;
		private boolean enabled;
		private String productName;
		private Date validStartTime;
		private Date validEndTime;
		
		public MallActivitiProductVo() {}
		
		public MallActivitiProductVo(MallActivitiProduct mallActivitiProduct) {
			this.setActivitiId(mallActivitiProduct.getPk().getMallActiviti().getId());
			this.setProductId(mallActivitiProduct.getPk().getMallProduct().getId());
			this.setScore(mallActivitiProduct.getScore());
			this.setCount(mallActivitiProduct.getCount());
			this.setId(this.getActivitiId() + "_" + this.getProductId());
			this.setEnabled(mallActivitiProduct.isEnabled());
			this.setProductName(mallActivitiProduct.getPk().getMallProduct().getName());
			this.setValidStartTime(mallActivitiProduct.getValidStartTime());
			this.setValidEndTime(mallActivitiProduct.getValidEndTime());
		}
		
		public Long getActivitiId() {
			return activitiId;
		}
		public void setActivitiId(Long activitiId) {
			this.activitiId = activitiId;
		}
		public Long getProductId() {
			return productId;
		}
		public void setProductId(Long productId) {
			this.productId = productId;
		}
		public Integer getCount() {
			return count;
		}
		public void setCount(Integer count) {
			this.count = count;
		}
		public Integer getScore() {
			return score;
		}
		public void setScore(Integer score) {
			this.score = score;
		}
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public boolean isEnabled() {
			return enabled;
		}
		public void setEnabled(boolean enabled) {
			this.enabled = enabled;
		}
		public String getProductName() {
			return productName;
		}
		public void setProductName(String productName) {
			this.productName = productName;
		}

		@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
		public Date getValidStartTime() {
			return validStartTime;
		}

		public void setValidStartTime(Date validStartTime) {
			this.validStartTime = validStartTime;
		}

		@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
		public Date getValidEndTime() {
			return validEndTime;
		}

		public void setValidEndTime(Date validEndTime) {
			this.validEndTime = validEndTime;
		}
	}
}
