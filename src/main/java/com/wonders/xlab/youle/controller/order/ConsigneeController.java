package com.wonders.xlab.youle.controller.order;

import com.wonders.xlab.framework.controller.AbstractBaseController;
import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.entity.order.ConsigneeInfo;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.order.ConsigneeInfoRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.order.ConsigneeService;
import com.wonders.xlab.youle.service.security.SecurityService;
import com.wonders.xlab.youle.utils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
@RestController
@RequestMapping("order")
public class ConsigneeController extends AbstractBaseController<ConsigneeInfo, Long> {

    @Autowired
    private ConsigneeInfoRepository consigneeInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private ConsigneeService consigneeService;

    @RequestMapping(value = "pose", method = RequestMethod.POST)
    public ControllerResult<?> poseConsigneeAddress(@RequestBody ConsigneeInfo consignee) {
        User user = userRepository.findOne(securityService.getUserId());
        if (StringUtils.isBlank(consignee.getAddress()) ||
                StringUtils.isBlank(consignee.getCity()) ||
                StringUtils.isBlank(consignee.getTel()) ||
                StringUtils.isBlank(consignee.getRealName())) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("信息不能为空！");
        }
        int countAddress = consigneeInfoRepository.countByUserId(user.getId());
        if (0 == countAddress) {
            consignee.setDefaultAddress(true);
        }
        consignee.setUser(user);
        consigneeInfoRepository.save(consignee);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("地址保存成功！");
    }

    @RequestMapping(value = "consigneeList", method = RequestMethod.GET)
    public ControllerResult<?> addressList() {
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(consigneeInfoRepository.findByUserId(securityService.getUserId()))
                .setMessage("获取收货地址成功！");
    }

    @RequestMapping(value = "modify/{consigneeId}", method = RequestMethod.POST)
    public ControllerResult<?> modify(@PathVariable long consigneeId, @RequestBody ConsigneeInfo consignee) {

        if (StringUtils.isBlank(consignee.getAddress()) ||
                StringUtils.isBlank(consignee.getCity()) ||
                StringUtils.isBlank(consignee.getTel()) ||
                StringUtils.isBlank(consignee.getRealName())) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("信息不能为空！");
        }

        User user = userRepository.findOne(securityService.getUserId());
        ConsigneeInfo consigneeInfo = consigneeInfoRepository.findOne(consigneeId);
        BeanUtils.copyNotNullProperties(consignee, consigneeInfo);
        consigneeInfo.setUser(user);
        modify(consigneeInfo);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("地址修改成功！");
    }

    @RequestMapping("modify/{consigneeId}/defaultAddress")
    public ControllerResult<?> defaultAddress(@PathVariable long consigneeId) {
        Long userId;
        try {
            userId = securityService.getUserId();
        } catch (Exception e) {
            return new ControllerResult<>()
                    .setRet_code(-15)
                    .setRet_values("")
                    .setMessage("未登录系统！");
        }
        User user = userRepository.findOne(userId);
        ConsigneeInfo defaultConsignee = consigneeInfoRepository.findByUserIdAndDefaultAddressTrue(user.getId());
        if (!defaultConsignee.isEmpty() && defaultConsignee.getId().equals(consigneeId)) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("当前地址已经是默认地址！");
        }
        ConsigneeInfo modifiedConsignee = consigneeInfoRepository.findOne(consigneeId);
        modifiedConsignee.setDefaultAddress(true);
        List<ConsigneeInfo> consigneeInfos = new ArrayList<>();
        consigneeInfos.add(modifiedConsignee);
        if (!defaultConsignee.isEmpty()) {
            consigneeInfos.add(defaultConsignee);
            defaultConsignee.setDefaultAddress(false);
        }
        consigneeInfoRepository.save(consigneeInfos);
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values("")
                .setMessage("默认地址设置成功！");
    }

    @RequestMapping("delete/{consigneeId}")
    public ControllerResult<?> delete(@PathVariable long consigneeId) {
        Long userId;
        try {
            userId = securityService.getUserId();
        } catch (Exception e) {
            return new ControllerResult<>()
                    .setRet_code(-15)
                    .setRet_values("")
                    .setMessage("未登录系统！");
        }

        if (consigneeService.deleteAddress(consigneeId, userId)) {
            return new ControllerResult<>()
                    .setRet_code(0)
                    .setRet_values("")
                    .setMessage("删除成功！");
        } else {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("删除失败!");
        }
    }

    @Override
    protected MyRepository<ConsigneeInfo, Long> getRepository() {
        return consigneeInfoRepository;
    }
}
