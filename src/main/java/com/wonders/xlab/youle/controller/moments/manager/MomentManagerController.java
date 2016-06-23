package com.wonders.xlab.youle.controller.moments.manager;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.entity.moments.Moment;
import com.wonders.xlab.youle.enums.Status;
import com.wonders.xlab.youle.repository.moments.MomentRepository;
import com.wonders.xlab.youle.service.redis.moments.MomentRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Jeffrey on 15/10/8.
 */
@RestController
@RequestMapping("manager/moments")
public class MomentManagerController extends FileUploadController<Moment, Long> {

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private MomentRedisService momentRedisService;

    @RequestMapping(value = "{momentId}/status", method = RequestMethod.POST)
    public boolean modifyMomentStatus(@PathVariable long momentId, Status status) {
        Moment moment = momentRepository.findOne(momentId);
        moment.setStatus(status);
        momentRepository.save(moment);
        return true;
    }

    @Override
    protected String getPathPrefix() {
        return "moments/";
    }

    @Override
    protected MyRepository<Moment, Long> getRepository() {
        return momentRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public Moment add(@RequestBody Moment entity) {
        Moment moment = super.add(entity);
        momentRedisService.save(moment);
        return moment;
    }

    @Override
    @RequestMapping(method = RequestMethod.PUT)
    public Moment modify(@RequestBody Moment entity) {
        Moment moment = super.modify(entity);
        momentRedisService.save(moment);
        return moment;
    }
}
