package com.wonders.xlab.youle.dto.question;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.youle.entity.questions.Questions;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Jeffrey on 15/9/15.
 */
public class QuestionDto {

    private Long id;

    private String title;

    private String description;

    private Date createdDate;

    @JsonIgnore
    private Integer enumType;

    @JsonIgnore
    private String picUrl;

    private Long userId;

    private String nickName;

    private String iconUrl;

    private Questions.Type type;

    private int countReplies;

    private List<Picture> pictures = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }

    public Questions.Type getType() {
        return Questions.Type.values()[enumType];
    }

    public void setType(Integer type) {
        this.type = Questions.Type.values()[type];
    }

    public List<Picture> getPictures() {
        if (null == picUrl) {
            return pictures;
        } else {
            String[] urlList = picUrl.split(";");
            for (String url : urlList) {
                String[] split = url.split("___");
                if (split.length == 4) {
                    pictures.add(new Picture(url, Integer.valueOf(split[1]), Integer.valueOf(split[2])));
                }
            }
        }
        return pictures;
    }

    public void setPictures(List<Picture> pictures) {
        this.pictures = pictures;
    }

    public int getCountReplies() {
        return countReplies;
    }

    public void setCountReplies(int countReplies) {
        this.countReplies = countReplies;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Integer getEnumType() {
        return enumType;
    }

    public void setEnumType(Integer enumType) {
        this.enumType = enumType;
    }
}
