package com.wonders.xlab.youle.repository.mall;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.mall.MallActivitiProduct;
import com.wonders.xlab.youle.entity.mall.MallActivitiProductPK;
import com.wonders.xlab.youle.entity.mall.MallActiviti.ActivitiType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MallActivitiProductRepository extends MyRepository<MallActivitiProduct, MallActivitiProductPK> {

	Page<MallActivitiProduct> findByOrderByLastModifiedDateDesc(Pageable pageable);
	
	@Query(" select mp from MallActivitiProduct mp "
			+ " where mp.pk.mallActiviti.type = :type "
			+ " and mp.pk.mallActiviti.enabled = :activitiEnable "
			+ " and mp.enabled = :productEnable "
			+ " order by mp.lastModifiedDate desc ")
	Page<MallActivitiProduct> queryProducts(
			@Param("type") ActivitiType type, 
			@Param("activitiEnable") boolean activitiEnable, 
			@Param("productEnable") boolean productEnable, 
			Pageable page);
	
	@Query(" select mp from MallActivitiProduct mp "
			+ " where mp.pk.mallActiviti.type = :type "
			+ " and mp.pk.mallActiviti.enabled = :activitiEnable "
			+ " and mp.enabled = :productEnable "
			+ " order by mp.lastModifiedDate desc ")
	List<MallActivitiProduct> queryProducts(
			@Param("type") ActivitiType type, 
			@Param("activitiEnable") boolean activitiEnable, 
			@Param("productEnable") boolean productEnable);
	
	List<MallActivitiProduct> findByPkMallActivitiId(Long activitiId);

	List<MallActivitiProduct> findByPkMallProductId(long productId);
}
