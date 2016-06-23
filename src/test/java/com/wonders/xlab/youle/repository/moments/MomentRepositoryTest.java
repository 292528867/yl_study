package com.wonders.xlab.youle.repository.moments;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import com.wonders.xlab.youle.entity.moments.Moment;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by Jeffrey on 15/9/2.
 */
public class MomentRepositoryTest extends AbstractTestCase {

    @Autowired
    private MomentRepository momentRepository;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testFindByMomentsNames() throws Exception {
        List<String> names = momentRepository.findByMomentsNames(Moment.Hot.yes);

        System.out.println("mapper.writeValueAsString(names) = " + mapper.writeValueAsString(names));
    }
}