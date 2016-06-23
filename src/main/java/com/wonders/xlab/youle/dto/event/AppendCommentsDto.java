package com.wonders.xlab.youle.dto.event;

import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;

/**
 * Created by Jeffrey on 15/8/21.
 */
public class AppendCommentsDto {


    private Long toUserId;

    @NotNull(message = "关联文章不能为空！")
    private Long articleId;

    @NotBlank(message = "评论信息不能为空！")
    private String content;

    public Long getToUserId() {
        return toUserId;
    }

    public void setToUserId(Long toUserId) {
        this.toUserId = toUserId;
    }

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
