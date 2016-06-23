package com.wonders.xlab.youle.dto.user;

import com.wonders.xlab.youle.entity.base.Location;
import com.wonders.xlab.youle.enums.Sex;

/**
 * Created by Jeffrey on 15/8/17.
 */
public class UserDto{
    /**
     * 用户地址
     */
    private Location location;

    /**
     * 手机号
     */
    private String tel;

    /**
     * 昵称
     */
    private String nickName;

    private Sex sex;

    /**
     * 照片路径
     */
    private String iconUrl;

    /**
     * 自我介绍
     */
    private String selfIntroduction;

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getSelfIntroduction() {
        return selfIntroduction;
    }

    public void setSelfIntroduction(String selfIntroduction) {
        this.selfIntroduction = selfIntroduction;
    }
}
