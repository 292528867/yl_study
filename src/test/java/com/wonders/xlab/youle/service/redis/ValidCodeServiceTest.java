package com.wonders.xlab.youle.service.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.entity.moments.Moment;
import com.wonders.xlab.youle.entity.tags.Tag;
import com.wonders.xlab.youle.repository.moments.MomentRepository;
import com.wonders.xlab.youle.repository.tags.TagRepository;
import com.wonders.xlab.youle.service.redis.moments.MomentRedisService;
import com.wonders.xlab.youle.service.redis.tags.TagsRedisService;
import com.wonders.xlab.youle.service.redis.valid.ValidCodeService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.List;

/**
 * Created by Jeffrey on 15/8/18.
 */
public class ValidCodeServiceTest extends AbstractTestCase {

    @Autowired
    private ValidCodeService validCodeService;

    @Autowired
    private TagsRedisService tagsRedisService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private MomentRedisService momentRedisService;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testIncrementAndGet() throws Exception {
        String name = validCodeService.incrementAndGet("name");
        System.out.println("name = " + name);
    }

    @Test
    public void testPost() throws Exception {
//        User user = new User();
//        user.setTel("17721013012");
//        user.setAppPlatform(AppPlatform.android);
//        user.setNickName("Jeffrey");
//        user.setSex(Sex.male);
//
//        validCodeService.save(user);
    }

    @Test
    public void testFindByUid() throws Exception {

        Moment moment = momentRedisService.findById(1l);
        org.junit.Assert.assertNotNull(moment);

        String writeValueAsString = mapper.writeValueAsString(moment);
        System.out.println("writeValueAsString = " + writeValueAsString);
    }

    @Test
    public void testGet() throws Exception {
        Object o = validCodeService.get("test-list");
        ObjectMapper objectMapper = new ObjectMapper();
        String valueAsString = objectMapper.writeValueAsString(o);
        System.out.println("valueAsString = " + valueAsString);
    }

    @Test
    public void testInitData() throws Exception {
        List<Tag> tags = tagRepository.findAll();
        tagsRedisService.save(tags);

        List<Moment> moments = momentRepository.findAll();
        momentRedisService.save(moments);
    }

    @Test
    public void testFindAll() throws Exception {
        List<Moment> moments = momentRedisService.findAll();
        Assert.isTrue(moments.size() == 2);
    }
}