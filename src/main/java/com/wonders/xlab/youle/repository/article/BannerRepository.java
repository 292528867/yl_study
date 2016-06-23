package com.wonders.xlab.youle.repository.article;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.article.Banner;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/1.
 */
public interface BannerRepository extends MyRepository<Banner, Long> {

    /**
     *  按照banner的类型查询banner信息并按照SortSequence排序
     * @param type
     * @return
     */
    List<Banner> findTop5ByTypeOrderBySortSequenceDesc(Banner.Type type);

}
