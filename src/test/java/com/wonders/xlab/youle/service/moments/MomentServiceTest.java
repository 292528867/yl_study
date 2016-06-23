package com.wonders.xlab.youle.service.moments;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.dto.recommend.Statistic;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by Jeffrey on 15/9/8.
 */
public class MomentServiceTest extends AbstractTestCase {

    @Autowired
    private MomentService momentService;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testMomentStatistics() throws Exception {
        Statistic statistic = momentService.momentStatistics(1l);
        System.out.println("mapper.writeValueAsString(statistic) = " + mapper.writeValueAsString(statistic));
    }
}