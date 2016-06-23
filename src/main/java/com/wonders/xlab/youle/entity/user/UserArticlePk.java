package com.wonders.xlab.youle.entity.user;

import com.wonders.xlab.youle.entity.article.Article;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * Created by Jeffrey on 15/8/12.
 */
@Embeddable
public class UserArticlePk implements Serializable {

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "ARTICLE_ID", nullable = false)
    private Article article;

    public UserArticlePk() {
    }

    public UserArticlePk(User user, Article article) {
        this.user = user;
        this.article = article;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }
}
