package com.wonders.xlab.youle.controller.tags.manager;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.controller.FileUploadController;
import com.wonders.xlab.youle.entity.tags.Tag;
import com.wonders.xlab.youle.repository.tags.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Jeffrey on 15/10/8.
 */
@RestController
@RequestMapping("manager/tags")
public class TagsManagerController extends FileUploadController<Tag, Long> {

    @Autowired
    private TagRepository tagRepository;

    @Override
    protected String getPathPrefix() {
        return "tags/";
    }

    @Override
    protected MyRepository<Tag, Long> getRepository() {
        return tagRepository;
    }
}
