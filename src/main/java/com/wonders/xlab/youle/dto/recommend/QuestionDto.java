package com.wonders.xlab.youle.dto.recommend;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wonders.xlab.youle.dto.question.Picture;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jeffrey on 15/9/6.
 */
public class QuestionDto {

    private Long id;

    private String description;

    @JsonIgnore
    private String picUrl;

    private List<Picture> pictures = new ArrayList<>();

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
