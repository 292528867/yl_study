package com.wonders.xlab.youle.repository.article;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.entity.article.Banner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/1.
 */
public class BannerRepositoryTest extends AbstractTestCase {

    @Autowired
    private BannerRepository bannerRepository;

    @Test
    public void testFindTop5ByOrderBySortSequenceDesc() throws Exception {
        List<Banner> top5ByOrderBySortSequenceDesc = bannerRepository.findTop5ByTypeOrderBySortSequenceDesc(Banner.Type.moment);
        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(top5ByOrderBySortSequenceDesc);
        System.out.println("top5ByOrderBySortSequenceDesc.size() = " + s);
    }
}