package com.wonders.xlab.youle.service.order;

import com.wonders.xlab.youle.entity.order.ConsigneeInfo;
import com.wonders.xlab.youle.repository.order.ConsigneeInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by Jeffrey on 15/10/19.
 */
@Service
public class ConsigneeService {

    @Autowired
    private ConsigneeInfoRepository consigneeInfoRepository;

    @Transactional
    public boolean deleteAddress(long consigneeId, long userId) {
        try {
            ConsigneeInfo consigneeInfo = consigneeInfoRepository.findOne(consigneeId);
            if (!consigneeInfo.isEmpty() && consigneeInfo.isDefaultAddress()) {
                ConsigneeInfo defaultConsignee = consigneeInfoRepository.findTop1ByUserIdAndDefaultAddressFalseOrderByLastModifiedDateDesc(userId);
                defaultConsignee.setDefaultAddress(true);
                consigneeInfoRepository.save(defaultConsignee);
            }
            consigneeInfoRepository.delete(consigneeId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
