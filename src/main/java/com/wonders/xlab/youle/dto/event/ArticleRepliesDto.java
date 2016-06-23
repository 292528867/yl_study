package com.wonders.xlab.youle.dto.event;

import org.joda.time.DateTime;

/**
 * Created by Jeffrey on 15/9/6.
 */
public class ArticleRepliesDto {

    private ReplyUserDto to;

    private ReplyUserDto from;

    private String content;

    private DateTime createdDate;


    public ArticleRepliesDto() {
    }

    public ArticleRepliesDto(ReplyUserDto to, ReplyUserDto from, String content, DateTime createdDate) {
        this.to = to;
        this.from = from;
        this.content = content;
        this.createdDate = createdDate;
    }

    public ReplyUserDto getTo() {
        return to;
    }

    public void setTo(ReplyUserDto to) {
        this.to = to;
    }

    public ReplyUserDto getFrom() {
        return from;
    }

    public void setFrom(ReplyUserDto from) {
        this.from = from;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public DateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(DateTime createdDate) {
        this.createdDate = createdDate;
    }
}
