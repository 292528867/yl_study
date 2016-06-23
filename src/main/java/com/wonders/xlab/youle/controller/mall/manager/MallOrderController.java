package com.wonders.xlab.youle.controller.mall.manager;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.framework.controller.AbstractBaseController;
import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.dto.result.ExtFormResponse;
import com.wonders.xlab.youle.entity.mall.MallOrder;
import com.wonders.xlab.youle.repository.mall.MallOrderRepository;
import com.wonders.xlab.youle.service.mall.TryActivitiProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "mall/manager/order")
public class MallOrderController extends AbstractBaseController<MallOrder, Long> {
    @Autowired
    private MallOrderRepository mallOrderRepository;
    @Autowired
    private TryActivitiProcessService tryActivitiProcessService;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected MyRepository<MallOrder, Long> getRepository() {
        return mallOrderRepository;
    }

    @RequestMapping(value = "deliveryOrder", method = RequestMethod.POST)
    public String deliveryOrder(Long orderId, String shippingNo, String shippingInfo, String processInstanceId) throws Exception {
        try {
            this.tryActivitiProcessService.deliveryOrder(orderId, shippingNo, shippingInfo, processInstanceId);
            return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg("Yeah，成功了！"));
        } catch (Exception exp) {
            return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(false).setMsg("请重新刷新订单列表！"));
        }
    }

    @RequestMapping(value = "confirmDeliveryOrder", method = RequestMethod.POST)
    public String confirmDeliveryOrder(Long orderId, String processInstanceId) throws Exception {
        try {
            this.tryActivitiProcessService.confirmDeliveryOrder(orderId, processInstanceId);
            return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(true).setMsg("Yeah，成功了！"));
        } catch (Exception exp) {
            return objectMapper.writeValueAsString(new ExtFormResponse().setSuccess(false).setMsg("请重新刷新订单列表！"));
        }
    }
}
