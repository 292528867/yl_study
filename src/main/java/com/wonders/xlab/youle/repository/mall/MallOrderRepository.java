package com.wonders.xlab.youle.repository.mall;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.mall.MallOrder;
import com.wonders.xlab.youle.entity.mall.MallOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MallOrderRepository extends MyRepository<MallOrder, Long> {
//	public MallOrder findByUserIdAndMallProductIdsAndOrderStatus(Long userId, String pids);
	
	public List<MallOrder> findByOrderStatus(MallOrderStatus orderStatus);
	public Long countByUserIdAndMallProductIdsAndOrderCompletedFalse(Long userId, String pids);

	public Page<MallOrder> findByUserId(Long userId, Pageable page);
}
