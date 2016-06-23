package com.wonders.xlab.youle.entity.article;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.tags.Tag;

import javax.persistence.*;
import java.util.Set;

/**
 * Created by Jeffrey on 15/8/17.
 */
@Entity
@Table(name = "yl_article_cell")
public class ArticleCell extends AbstractBaseEntity<Long> {

    /**
     * 图片地址
     */
    private String picUrl;

    /**
     * 文章叙述
     */
    @Lob
    private String description;

    /**
     * 文章单元顺序
     */
    @OrderBy(value = "cellSort asc")
    private int cellSort;

    /**
     * type 1为图片单元，0为文字单元
     */
    private String type;

    /**
     * 文章图片宽比
     */
    private double picWidth = 1;

    /**
     * 文章图片高比
     */
    private double picHeight = 1;

    @OneToMany(
            fetch = FetchType.EAGER,
            mappedBy = "articleCell",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    private Set<Tag> tags;

    public ArticleCell() {
    }

    public ArticleCell(String picUrl, String description, int cellSort, double picWidth, double picHeight) {
        this.picUrl = picUrl;
        this.description = description;
        this.cellSort = cellSort;
        this.picWidth = picWidth;
        this.picHeight = picHeight;
    }

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

    public double getPicHeight() {
        return picHeight;
    }

    public void setPicHeight(double picHeight) {
        this.picHeight = picHeight;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
