package com.wonders.xlab.youle.controller.tags.app;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.CommonController;
import com.wonders.xlab.youle.entity.tags.Tag;
import com.wonders.xlab.youle.repository.tags.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Jeffrey on 15/8/13.
 */
@RestController
@RequestMapping("tags")
public class TagsController extends CommonController<Tag, Long> {

    @Autowired
    private TagRepository tagRepository;

    @Override
    protected MyRepository<Tag, Long> getRepository() {
        return tagRepository;
    }
//
//    @Override
//    @RequestMapping(value = "queryAll",method = RequestMethod.GET)
//    public ControllerResult<?> queryAll() {
//        return new ControllerResult<>()
//                .setRet_code(0)
//                .setRet_values(tagsRedisService.findAll())
//                .setMessage("获取成功！");
//    }
//
//    @Override
//    @RequestMapping(method = RequestMethod.POST)
//    public Tag add(@RequestBody Tag entity) {
//        Tag tag = super.add(entity);
//        tagsRedisService.save(tag);
//        return tag;
//    }
//
//    @Override
//    @RequestMapping(method = RequestMethod.PUT)
//    public Tag modify(@RequestBody Tag entity) {
//        Tag tag = super.modify(entity);
//        tagsRedisService.save(tag);
//        return tag;
//    }
}
