package com.wonders.xlab.youle.entity.questions;

import com.wonders.xlab.youle.entity.user.User;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * Created by Jeffrey on 15/9/6.
 */
@Embeddable
public class RepliesPk implements Serializable {

    @ManyToOne
    @JoinColumn(name = "user_id_from", nullable = false)
    private User from;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Questions questions;

    public RepliesPk() {
    }

    public RepliesPk(User from, Questions questions) {
        this.from = from;
        this.questions = questions;
    }

    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public Questions getQuestions() {
        return questions;
    }

    public void setQuestions(Questions questions) {
        this.questions = questions;
    }
}
