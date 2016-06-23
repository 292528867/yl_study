package com.wonders.xlab.youle.repository.event;

import com.wonders.xlab.youle.common.AbstractTestCase;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

/**
 * Created by Jeffrey on 15/9/6.
 */
public class UserCommentsRepositoryTest extends AbstractTestCase {

    @Autowired
    private UserCommentsRepository userCommentsRepository;

    @Test
    public void testFindByPkArticleIdOrderByCreatedDateDesc() throws Exception {
        userCommentsRepository.findByPkArticleIdOrderByCreatedDateDesc(8l, new PageRequest(0, 10));
    }
}