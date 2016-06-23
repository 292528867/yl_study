package com.wonders.xlab.youle.entity.event;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.entity.user.User;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 * Created by Jeffrey on 15/8/21.
 */
@Entity
@Table(name = "yl_article_praised")
public class ArticlePraised extends AbstractBaseEntity<Long> {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    public ArticlePraised() {
    }

    public ArticlePraised(User user, Article article) {
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
