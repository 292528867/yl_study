package com.wonders.xlab.youle.enums;

/**
 * Created by Jeffrey on 15/8/12.
 */
public enum Sex {
    male,
    female;

    public String toString() {
        switch (this) {
            case male:
                return "male";
            case female:
                return "female";
            default:
                return "";
        }
    }
}
