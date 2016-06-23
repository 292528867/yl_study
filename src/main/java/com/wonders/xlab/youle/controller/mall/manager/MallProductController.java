package com.wonders.xlab.youle.controller.mall.manager;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.framework.controller.AbstractBaseController;
import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.framework.utils.QiniuUtils;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.dto.result.ExtFormResponse;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import com.wonders.xlab.youle.repository.mall.MallActivitiProductRepository;
import com.wonders.xlab.youle.repository.mall.MallActivitiRepository;
import com.wonders.xlab.youle.repository.mall.MallProductRepository;
import org.apache.commons.beanutils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping(value = "mall/manager/product")
public class MallProductController extends AbstractBaseController<MallProduct, Long> {
	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private MallActivitiProductRepository mallActivitiProductRepository;
	@Autowired
	private MallActivitiRepository mallActivitiRepository;
	@Autowired
	private MallProductRepository mallProductRepository;
	
	@Override
	protected MyRepository<MallProduct, Long> getRepository() {
		return this.mallProductRepository;
	}

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@RequestMapping(value = "categoryProduct", method = RequestMethod.POST)
	public String categoryProduct(String pids, String cname) throws Exception {
		String sql = "update xlab_youle.yl_mall_product set category = ? where id in (" + pids + ")";
		this.jdbcTemplate.update(sql, cname);
		return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg("成功"));
	}

	@RequestMapping(value = "queryCategories", method = RequestMethod.GET)
	public ControllerResult<List<Categories_for_ext>> queryCategory() {
		return new ControllerResult()
				.setRet_code(0)
				.setRet_values(Categories_for_ext.generateCategories(this.mallProductRepository.queryCategories()))
				.setMessage("分类查询成功！");
	}

	public static class Categories_for_ext {
		private String cname;

		public String getCname() {
			return cname;
		}

		public Categories_for_ext setCname(String cname) {
			this.cname = cname;
			return this;
		}

		public static List<Categories_for_ext> generateCategories(List<String> cnames) {
			List<Categories_for_ext> list = new ArrayList<>();
			if (cnames != null)
				for (String name : cnames)
					list.add(new Categories_for_ext().setCname(name));
			return list;
		}
	}

	@RequestMapping(value = "queryProductAcitiviInfo", method = RequestMethod.GET)
	public ControllerResult<Map<Long, List<String>>> queryProductAcitiviInfo(String pids) {
		Long[] pids_long = (Long[]) ConvertUtils.convert(pids.split(","), new Long[0].getClass());
		Map<Long, List<String>> longListMap_product = new HashMap<>();
		for (Long pid : pids_long)
			longListMap_product.put(pid, new ArrayList<String>());

		// 查找每个商品的活动关联信息
		for (Long pid : pids_long) {
			List<MallActivitiProduct> mallActivitiProductList = this.mallActivitiProductRepository.findByPkMallProductId(pid);
			List<String> infos = longListMap_product.get(pid);
			for (MallActivitiProduct mallActivitiProduct : mallActivitiProductList)
				infos.add(mallActivitiProduct.toHtmlString());
		}
		return new ControllerResult<Map<Long, List<String>>>().setRet_code(0).setRet_values(longListMap_product).setMessage("商品活动信息");
	}


	// 上传图片
	@RequestMapping(value = "uploadPicture", method = RequestMethod.POST)
	public String uploadPic(MultipartFile file1) throws Exception {
		
		if (file1 != null && !file1.isEmpty()) {
			try {
				String fileName = "yl-icon-" + String.valueOf((new Date()).getTime());

				// 这个七牛util越改越烦
				boolean uploadStatus = QiniuUtils.upload(file1.getBytes(), FileUploadController.getBucketName(), fileName);
				if (!uploadStatus)
					throw new Exception("七牛上传图片失败！");
				String iconUrl = FileUploadController.getBucketUrl().concat(fileName);

				return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg(iconUrl));
			} catch (Exception exp) {
				exp.printStackTrace();
				return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(false).setMsg(exp.getLocalizedMessage()));
			}
		} else {
			return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(false).setMsg("上传文件为空！"));
		}
	}
	
}
