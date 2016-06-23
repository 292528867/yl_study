package com.wonders.xlab.youle.entity.user;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by lixuanwu on 15/10/29.
 */
@Entity
@Table(name = "YL_USER_INTEGRALS_RECORD")
public class UserIntegralRecord extends AbstractBaseEntity<Long> {

    /**
     * 一个用户对应多条纪录
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    /**
     * 增加积分的渠道
     */
    private String type;

    /**
     * 积分数
     */
    private int addIntegrals = 0;

    public UserIntegralRecord() {
    }

    public UserIntegralRecord(int addIntegrals, String type, User user) {
        this.addIntegrals = addIntegrals;
        this.type = type;
        this.user = user;
    }

    public int getAddIntegrals() {
        return addIntegrals;
    }

    public void setAddIntegrals(int addIntegrals) {
        this.addIntegrals = addIntegrals;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
