package com.wonders.xlab.youle.dto.user;

import com.wonders.xlab.youle.enums.MotherType;

import java.util.Date;

/**
 * Created by Jeffrey on 15/9/2.
 */
public class SupplementInfo {
    /**
     * 生日
     */
    private Date birthday;

    private MotherType motherType;

    private Date childBirthday;

    private Integer pregnancyWeek;

    private Integer pregnancyDay;

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
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
}
