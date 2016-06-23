package com.wonders.xlab.youle.enums;

/**
 * Created by yk on 15/12/10.
 */
public enum  ThirdResource {
    qq,weChat,sinaBlog;

    public String toString() {
        switch (this) {
            case qq:
                return "QQ";
            case weChat:
                return "微信";
            case sinaBlog:
                return "新浪微博";
            default:
                return "其他来源";
        }
    }
}
