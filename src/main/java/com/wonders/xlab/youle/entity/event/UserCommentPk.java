package com.wonders.xlab.youle.entity.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.entity.user.User;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * Created by Jeffrey on 15/8/20.
 */
@Embeddable
public class UserCommentPk implements Serializable{

    @ManyToOne
    @JoinColumn(name = "from_user_id", nullable = false)
    private User from;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    @JsonIgnore
    private Article article;

    public User getFrom() {
        return from;
    }

    public UserCommentPk() {
    }

    public UserCommentPk(User from, Article article) {
        this.from = from;
        this.article = article;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }
}
