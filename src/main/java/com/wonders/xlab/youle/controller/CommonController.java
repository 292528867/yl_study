package com.wonders.xlab.youle.controller;

import com.wonders.xlab.framework.controller.AbstractBaseController;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import org.apache.commons.collections.MapUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.Serializable;

/**
 * Created by Jeffrey on 15/8/20.
 */
public abstract class CommonController<T, PK extends Serializable> extends AbstractBaseController<T, PK> {

    @RequestMapping(value = "find/{id}", method = RequestMethod.GET)
    public ControllerResult<?> findById(@PathVariable PK id) {
        return new ControllerResult<>().setRet_code(0)
                .setRet_values(getRepository().findOne(id))
                .setMessage("获取成功！");
    }

    @RequestMapping(value = "queryAll", method = RequestMethod.GET)
    public ControllerResult<?> queryAll() {
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(findAll())
                .setMessage("获取成功！");
    }

    @RequestMapping(value = "queryByPage", method = RequestMethod.GET)
    public ControllerResult<?> queryAll(Pageable pageable) {
        return new ControllerResult<>()
                .setRet_code(0)
                .setRet_values(getRepository().findAll(MapUtils.EMPTY_MAP, pageable))
                .setMessage("获取成功！");
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    public ControllerResult<?> deleteData(@PathVariable PK id) {
        try {
            delete(id);
            return new ControllerResult<>()
                    .setRet_code(0)
                    .setRet_values("")
                    .setMessage("删除成功！");
        } catch (Exception e) {
            return new ControllerResult<>()
                    .setRet_code(-1)
                    .setRet_values("")
                    .setMessage("删除失败！");
        }

    }
}
