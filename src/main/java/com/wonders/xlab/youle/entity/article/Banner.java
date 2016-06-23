package com.wonders.xlab.youle.entity.article;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.framework.entity.AbstractBaseEntity;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Table;

/**
 * Created by Jeffrey on 15/9/1.
 */
@Entity
@Table(name = "yl_banner")
public class Banner extends AbstractBaseEntity<Long> {

    @JsonIgnore
    private String name;

    @JsonIgnore
    private String description;

    private String iconUrl;

    @JsonIgnore
    private int sortSequence;

    private String synthesis;

    @Enumerated
    private LinkType linkType;

    @Enumerated
    @JsonIgnore
    private Type type;

    public enum Type {
        recommend, moment, mall
    }

    public enum LinkType {
        /**
         * 内部链接
         */
        inside,
        /**
         * 外部链接
         */
        outside,
        /**
         * 积分规则
         */
        integral,
        /**
         * 试用
         */
        tryout
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public int getSortSequence() {
        return sortSequence;
    }

    public void setSortSequence(int sortSequence) {
        this.sortSequence = sortSequence;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getSynthesis() {
        return synthesis;
    }

    public void setSynthesis(String synthesis) {
        this.synthesis = synthesis;
    }

    public LinkType getLinkType() {
        return linkType;
    }

    public void setLinkType(LinkType linkType) {
        this.linkType = linkType;
    }
}
