package com.wonders.xlab.youle.dto.article;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.common.AbstractTestCase;
import org.junit.Before;
import org.junit.Test;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Jeffrey on 15/8/20.
 */
public class ArticleDtoTest extends AbstractTestCase {

    ArticleDto articleDto = new ArticleDto();

    @Before
    public void setUp() throws Exception {
        articleDto.setMomentsId(1);
        articleDto.setTitle("健康管家");
        articleDto.setSubTitle("管家");

        ArticleCellDto articleCellDto = new ArticleCellDto();
        articleCellDto.setCellSort(1);
        articleCellDto.setPicUrl("xxxxxxxxxxxxxxx");
        articleCellDto.setPicHeight(220);
        articleCellDto.setPicWidth(300);
        articleCellDto.setDescription("啊哈哈哈");
        articleCellDto.setType("1");

        Set<TagDto> tagDtos = new HashSet<>();

        TagDto tagDto = new TagDto();
//        tagDto.setTagId(1l);
        tagDto.setTagX(233d);
        tagDto.setTagY(234d);

        tagDtos.add(tagDto);

        tagDto = new TagDto();
//        tagDto.setTagId(2l);
        tagDto.setTagX(2332d);
        tagDto.setTagY(832d);

        tagDtos.add(tagDto);

        articleCellDto.setTags(tagDtos);

        Set<ArticleCellDto> articleCellDtos = new HashSet<>();
        articleCellDtos.add(articleCellDto);
        articleDto.setCells(articleCellDtos);
    }

    @Test
    public void testJson() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String asString = mapper.writeValueAsString(articleDto);
        System.out.println("asString = " + asString);
    }
}