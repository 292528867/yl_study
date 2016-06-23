package com.wonders.xlab.youle.entity.order;

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
@Table(name = "yl_consignee_info")
public class ConsigneeInfo extends AbstractBaseEntity<Long> {

    private String tel;

    private String realName;

    private String city;

    private String address;

    private boolean defaultAddress;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public boolean isDefaultAddress() {
        return defaultAddress;
    }

    public void setDefaultAddress(boolean defaultAddress) {
        this.defaultAddress = defaultAddress;
    }

    public boolean isEmpty() {
        return this == null || this.getId() == null;
    }
}
