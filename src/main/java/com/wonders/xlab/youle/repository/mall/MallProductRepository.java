package com.wonders.xlab.youle.repository.mall;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.mall.MallProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MallProductRepository extends MyRepository<MallProduct, Long> {

	Page<MallProduct> findByOrderByLastModifiedDateDesc(Pageable pageable);

	@Query("select p.category from MallProduct p where p.category is not null group by p.category ")
	List<String> queryCategories();
}
