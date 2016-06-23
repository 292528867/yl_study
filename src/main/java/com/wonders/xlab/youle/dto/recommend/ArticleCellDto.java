package com.wonders.xlab.youle.dto.recommend;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Jeffrey on 15/8/27.
 */
public class ArticleCellDto {

    /**
     * 图片地址
     */
    private String picUrl;

    /**
     * 文章叙述
     */
    private String description;

    /**
     * 文章单元顺序
     */
    private int cellSort;

    /**
     * 文章图片宽比
     */
    private double picWidth;

    private String type;

    private Set<TagDto> tags = new HashSet<>();

    /**
     * 文章图片高比
     */
    private double picHeight;

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCellSort() {
        return cellSort;
    }

    public void setCellSort(int cellSort) {
        this.cellSort = cellSort;
    }

    public double getPicWidth() {
        return picWidth;
    }

    public void setPicWidth(double picWidth) {
        this.picWidth = picWidth;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Set<TagDto> getTags() {
        return tags;
    }

    public void setTags(Set<TagDto> tags) {
        this.tags = tags;
    }

    public double getPicHeight() {
        return picHeight;
    }

    public void setPicHeight(double picHeight) {
        this.picHeight = picHeight;
    }
}
