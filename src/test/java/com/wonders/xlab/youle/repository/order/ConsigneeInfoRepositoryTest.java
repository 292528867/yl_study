package com.wonders.xlab.youle.repository.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.entity.order.ConsigneeInfo;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by Jeffrey on 15/10/19.
 */
public class ConsigneeInfoRepositoryTest extends AbstractTestCase{

    @Autowired
    private ConsigneeInfoRepository consigneeInfoRepository;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testFindByUserIdAndDefaultAddressTrue() throws Exception {
        ConsigneeInfo aTrue = consigneeInfoRepository.findByUserIdAndDefaultAddressTrue(8l);
        System.out.println("mapper.writeValueAsString(aTrue) = " + mapper.writeValueAsString(aTrue));
    }

    @Test
    public void testCountByUserId() throws Exception {
        int countByUserId = consigneeInfoRepository.countByUserId(8l);
        System.out.println("countByUserId = " + countByUserId);
    }

    @Test
    public void testFindOneByUserIdAndDefaultAddressFalseOrderByLastModifiedDateDesc() throws Exception {
        ConsigneeInfo dateDesc = consigneeInfoRepository.findTop1ByUserIdAndDefaultAddressFalseOrderByLastModifiedDateDesc(47l);
        System.out.println("mapper.writeValueAsString(dateDesc) = " + mapper.writeValueAsString(dateDesc));
    }
}