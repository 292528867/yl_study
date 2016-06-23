package com.wonders.xlab.youle.entity.user;

import com.wonders.xlab.framework.entity.AbstractBaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by lixuanwu on 15/11/4.
 */
@Entity
@Table(name = "YL_USER_COUNT")
public class UserCount extends AbstractBaseEntity<Long> {

    /**
     * 真实用户数
     */
    private int realData;

    /**
     * 虚假用户数
     */
    private int addData;

    /**
     * 总的用户数
     */
    private int totalData;

    /**
     * 活动的开始
     */
    private String activityBeginTime;

    /**
     * 活动的天数
     */
    private String activityEndTime;

    /**
     * 活动是否上线(0:未上线，1:上线)
     */
    private String flag;

    public UserCount() {
    }

    public UserCount(int realData, int totalData, String flag, String activityEndTime) {
        this.realData = realData;
        this.totalData = totalData;
        this.flag = flag;
        this.activityEndTime = activityEndTime;

    }

    public int getAddData() {
        return addData;
    }

    public void setAddData(int addData) {
        this.addData = addData;
    }

    public int getRealData() {
        return realData;
    }

    public void setRealData(int realData) {
        this.realData = realData;
    }

    public int getTotalData() {
        return totalData;
    }

    public void setTotalData(int totalData) {
        this.totalData = totalData;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getActivityEndTime() {
        return activityEndTime;
    }

    public void setActivityEndTime(String activityEndTime) {
        this.activityEndTime = activityEndTime;
    }

    public String getActivityBeginTime() {
        return activityBeginTime;
    }

    public void setActivityBeginTime(String activityBeginTime) {
        this.activityBeginTime = activityBeginTime;
    }
}
