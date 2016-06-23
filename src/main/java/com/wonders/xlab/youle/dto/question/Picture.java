package com.wonders.xlab.youle.dto.question;

/**
 * Created by Jeffrey on 15/9/11.
 */
public class Picture {
    private String url;
    private Integer width;
    private Integer height;

    public Picture() {
    }

    public Picture(String url, Integer width, Integer height) {
        this.url = url;
        this.width = width;
        this.height = height;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

}
