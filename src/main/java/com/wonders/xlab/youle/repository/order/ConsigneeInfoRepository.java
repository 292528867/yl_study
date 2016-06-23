package com.wonders.xlab.youle.repository.order;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.order.ConsigneeInfo;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
public interface ConsigneeInfoRepository extends MyRepository<ConsigneeInfo, Long> {

    List<ConsigneeInfo> findByUserId(long userId);

    ConsigneeInfo findByUserIdAndDefaultAddressTrue(long userId);

    ConsigneeInfo findTop1ByUserIdAndDefaultAddressFalseOrderByLastModifiedDateDesc(long userId);

    int countByUserId(long userId);
}
