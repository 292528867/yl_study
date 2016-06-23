package com.wonders.xlab.youle.entity.user;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by Jeffrey on 15/8/12.
 */
@Entity
@Table(name = "YL_USER_ARTICLE")
public class UserArticle extends AbstractBaseEntity<Long> {

    @Embedded
    private UserArticlePk pk;

    public UserArticlePk getPk() {
        return pk;
    }

    public void setPk(UserArticlePk pk) {
        this.pk = pk;
    }

    public boolean isEmpty() {
        return null == this || pk.getUser().isEmpty() || pk.getArticle().isEmpty();
    }
}
