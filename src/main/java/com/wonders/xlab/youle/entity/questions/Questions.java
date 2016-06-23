package com.wonders.xlab.youle.entity.questions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.framework.entity.AbstractBaseEntity;
import com.wonders.xlab.youle.dto.question.Picture;
import com.wonders.xlab.youle.entity.user.User;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
@Entity
@Table(name = "yl_questions")
public class Questions extends AbstractBaseEntity<Long> {

    private String title;

    private String description;

    @JsonIgnore
    @Lob
    private String picUrl;

    @Transient
    @JsonIgnore
    private String[] picUrls;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated
    private Type type;


    @Transient
    private List<Picture> pictures = new ArrayList<>();

    public enum Type{
        parenting, psychology
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String[] getPicUrls() {
        if (null == picUrl) {
            picUrls = new String[1];
        } else {
            picUrls = picUrl.split(";");
        }
        return picUrls;
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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
