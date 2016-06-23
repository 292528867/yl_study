package com.wonders.xlab.youle.dto.event;

/**
 * Created by Jeffrey on 15/9/6.
 */
public class ReplyUserDto {

    private Long id;

    /**
     * 手机号
     */
    private String tel;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 照片路径
     */
    private String iconUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
