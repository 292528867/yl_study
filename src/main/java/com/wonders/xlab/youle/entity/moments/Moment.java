package com.wonders.xlab.youle.entity.moments;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.tags.Tag;
import com.wonders.xlab.youle.enums.Status;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Jeffrey on 15/8/12.
 */
@Entity
@Table(name = "YL_MOMENTS")
public class Moment extends AbstractBaseEntity<Long> {

    /**
     * 朋友圈名
     */
    private String name;

    private String smallIconUrl;

    private String coverIconUrl;

    private String description;

    private String backgroundColor;
    /**
     * 朋友圈标签
     */
    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "YL_MOMENTS_TAG",
            joinColumns = @JoinColumn(name = "MOMENTS_ID"),
            inverseJoinColumns = @JoinColumn(name = "TAG_ID")
    )
    @JsonIgnore
    private Set<Tag> tags = new HashSet<>();

    /**
     * 排序字段
     */
    @OrderBy(value = "compositor desc")
    private Integer compositor = 0;

    /**
     * 圈子类型（文章，问答）
     */
    @Enumerated
    private Type type = Type.article;

    /**
     * 圈子有效状态
     */
    @Enumerated
    private Status status = Status.effective;

    /**
     * 是否热门（用于在首页展示圈子）
     */
    private Hot isHot = Hot.no;

    public enum Type {
        article, qa
    }

    public enum Hot {
        no, yes
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSmallIconUrl() {
        return smallIconUrl;
    }

    public void setSmallIconUrl(String smallIconUrl) {
        this.smallIconUrl = smallIconUrl;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getCoverIconUrl() {
        return coverIconUrl;
    }

    public void setCoverIconUrl(String coverIconUrl) {
        this.coverIconUrl = coverIconUrl;
    }

    public Hot getIsHot() {
        return isHot;
    }

    public void setIsHot(Hot isHot) {
        this.isHot = isHot;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getCompositor() {
        return compositor;
    }

    public void setCompositor(Integer compositor) {
        this.compositor = compositor;
    }
}
