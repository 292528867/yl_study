package com.wonders.xlab.youle.dto.recommend;

import org.joda.time.DateTime;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Jeffrey on 15/8/27.
 */
public class ArticleDto {

    private Long id;

    private String title;

    private String nickName;

    private Date createdDate;

    private String iconUrl;

    /**
     * 文章总点赞
     */
    private Long totalPraised;

    /**
     * 文章总回复
     */
    private Long totalComments;

    private Boolean isPraised;

    private Set<ArticleCellDto> cells = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<ArticleCellDto> getCells() {
        return cells;
    }

    public void setCells(Set<ArticleCellDto> cells) {
        this.cells = cells;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public DateTime getCreatedDate() {
        return null == this.createdDate?null:new DateTime(this.createdDate);
    }

    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = null == createdDate?null:createdDate.toDate();
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Long getTotalPraised() {
        return totalPraised;
    }

    public void setTotalPraised(Long totalPraised) {
        this.totalPraised = totalPraised;
    }

    public Long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(Long totalComments) {
        this.totalComments = totalComments;
    }

    public Boolean getIsPraised() {
        return isPraised;
    }

    public void setIsPraised(Boolean isPraised) {
        this.isPraised = isPraised;
    }
}
