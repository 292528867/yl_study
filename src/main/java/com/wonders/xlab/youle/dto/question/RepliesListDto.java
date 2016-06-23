package com.wonders.xlab.youle.dto.question;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.wonders.xlab.youle.entity.user.User;
import org.joda.time.DateTime;

import java.util.Date;

/**
 * Created by Jeffrey on 15/9/7.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RepliesListDto {

    private User from;

    private User to;

    private String content;

    private Date createdDate;

    public RepliesListDto() {
    }

    public RepliesListDto(User from, User to, String content, DateTime createdDate) {
        this.from = from;
        this.to = to;
        this.content = content;
        this.createdDate = createdDate.toDate();
    }

    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public User getTo() {
        return to;
    }

    public void setTo(User to) {
        this.to = to;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate.toDate();
    }
}
