package com.wonders.xlab.youle.repository.moments;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.moments.Moment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by Jeffrey on 15/8/13.
 */
public interface MomentRepository extends MyRepository<Moment, Long> {

    List<Moment> findByTypeNotNullOrderByCompositorDescTypeAscIdAsc();

    @Query("select m.name from Moment m where m.isHot = :isHot order by m.compositor desc, m.id asc")
    List<String> findByMomentsNames(@Param("isHot")Moment.Hot ishot);
}
