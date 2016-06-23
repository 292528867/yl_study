package com.wonders.xlab.youle.dto.question;

/**
 * Created by Jeffrey on 15/9/6.
 */
public class RepliesDto {

    private String content;

    private long questionId;

    private Long targetUserId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Long targetUserId) {
        this.targetUserId = targetUserId;
    }
}
