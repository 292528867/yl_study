package com.wonders.xlab.youle.entity.event;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.user.User;

import javax.persistence.*;

/**
 * Created by Jeffrey on 15/8/20.
 */
@Entity
@Table(name = "yl_user_comments")
public class UserComments extends AbstractBaseEntity<Long> {

    @Embedded
    private UserCommentPk pk;

    private String content;

    @ManyToOne
    @JoinColumn(name = "to_user_id")
    private User to;



    public UserComments(UserCommentPk pk, String content, User to) {
        this.pk = pk;
        this.content = content;
        this.to = to;
    }

    public UserComments() {
    }

    public UserComments(UserCommentPk pk) {
        this.pk = pk;
    }

    public UserCommentPk getPk() {
        return pk;
    }

    public void setPk(UserCommentPk pk) {
        this.pk = pk;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getTo() {
        return to;
    }

    public void setTo(User to) {
        this.to = to;
    }
}