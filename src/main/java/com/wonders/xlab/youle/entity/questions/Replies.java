package com.wonders.xlab.youle.entity.questions;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.user.User;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by Jeffrey on 15/9/6.
 */
@Entity
@Table(name = "yl_replies")
public class Replies extends AbstractBaseEntity<Long> {

    private RepliesPk pk;

    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id_to")
    private User to;

    public RepliesPk getPk() {
        return pk;
    }

    public void setPk(RepliesPk pk) {
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
