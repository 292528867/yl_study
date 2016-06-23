package com.wonders.xlab.youle.entity.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.entity.base.Location;
import com.wonders.xlab.youle.enums.AppPlatform;
import com.wonders.xlab.youle.enums.MotherType;
import com.wonders.xlab.youle.enums.Sex;
import com.wonders.xlab.youle.enums.Status;

import javax.persistence.*;
import java.util.Date;

import static javax.persistence.TemporalType.DATE;

/**
 * 用户
 * Created by Jeffrey on 15/8/12.
 */
@Entity
@Table(name = "YL_USER")
public class User extends AbstractBaseEntity<Long> {

    /**
     * 用户地址
     */
    @Embedded
    private Location location;

    /**
     * 手机号
     */
    private String tel;

    @JsonIgnore
    private String password;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 生日
     */
    @Temporal(DATE)
    private Date birthday;

    @Enumerated
    private Sex sex = Sex.female;

    /**
     * 照片路径
     */
    private String iconUrl;

    /**
     * 用户积分
     */
    private int integrals = 0;

    /**
     * 用户邀请二维码地址
     */
    private String inviteUrl;

    /**
     * 自我介绍
     */
    private String selfIntroduction;

    @Enumerated
    private Status status = Status.ineffective;

    /**
     * 平台信息
     */
    @Enumerated
    @JsonIgnore
    private AppPlatform appPlatform;

    @Enumerated
    private MotherType motherType;

    @Temporal(DATE)
    private Date childBirthday;

    private Integer pregnancyWeek;

    private Integer pregnancyDay;

    /**
     * appUser app用户
     * backgroundUser 运营账号
     */
    public enum AccountType {
        appUser, backgroundUser
    }

    /**
     * 区分用户类型
     */
    private AccountType accountType = AccountType.appUser;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
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

    public int getIntegrals() {
        return integrals;
    }

    public void setIntegrals(int integrals) {
        this.integrals = integrals;
    }

    public String getInviteUrl() {
        return inviteUrl;
    }

    public void setInviteUrl(String inviteUrl) {
        this.inviteUrl = inviteUrl;
    }

    public String getSelfIntroduction() {
        return selfIntroduction;
    }

    public void setSelfIntroduction(String selfIntroduction) {
        this.selfIntroduction = selfIntroduction;
    }

    public AppPlatform getAppPlatform() {
        return appPlatform;
    }

    public void setAppPlatform(AppPlatform appPlatform) {
        this.appPlatform = appPlatform;
    }

    public MotherType getMotherType() {
        return motherType;
    }

    public void setMotherType(MotherType motherType) {
        this.motherType = motherType;
    }

    public Date getChildBirthday() {
        return childBirthday;
    }

    public void setChildBirthday(Date childBirthday) {
        this.childBirthday = childBirthday;
    }

    public Integer getPregnancyWeek() {
        return pregnancyWeek;
    }

    public void setPregnancyWeek(Integer pregnancyWeek) {
        this.pregnancyWeek = pregnancyWeek;
    }

    public Integer getPregnancyDay() {
        return pregnancyDay;
    }

    public void setPregnancyDay(Integer pregnancyDay) {
        this.pregnancyDay = pregnancyDay;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isEmpty() {
        return null == this || null == this.getId();
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}
