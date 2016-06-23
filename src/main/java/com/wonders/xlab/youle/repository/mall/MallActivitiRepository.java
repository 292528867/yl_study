package com.wonders.xlab.youle.repository.mall;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.mall.MallActiviti;

public interface MallActivitiRepository extends MyRepository<MallActiviti, Long> {

    MallActiviti findFirstByEnabledAndTypeOrderByCreatedDateDesc(boolean enabled, MallActiviti.ActivitiType type);
}
