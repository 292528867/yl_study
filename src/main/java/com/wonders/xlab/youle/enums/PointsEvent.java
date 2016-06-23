package com.wonders.xlab.youle.enums;

import com.wonders.xlab.youle.utils.EnumUtils;

/**
 * 积分变更事件
 * Created by wukai on 15/10/30.
 */
public enum PointsEvent {
    //签到
    signIn("每日签到"),
    //首次发表评测
    firstPublish("首次发表评测"),
    //发评测
    publish("发表评测"),
    //评论
    comment("评论"),
    //兑换
    exchange("兑换");

    PointsEvent(String value){
        EnumUtils.changeNameTo(this, value);
    };
}
