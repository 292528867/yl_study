package com.wonders.xlab.youle.dto.recommend;

import com.wonders.xlab.youle.entity.moments.Moment;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Jeffrey on 15/9/2.
 */
public class MomentDto {

    /**
     * 朋友圈名
     */
    private Long id;

    private String name;

    private String smallIconUrl;

    private String description;

    private String backgroundColor;

    private Moment.Type type;

    private Set<ArticleDto> articles = new HashSet<>();

    private Set<QuestionDto> questions = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSmallIconUrl() {
        return smallIconUrl;
    }

    public void setSmallIconUrl(String smallIconUrl) {
        this.smallIconUrl = smallIconUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<ArticleDto> getArticles() {
        return articles;
    }

    public void setArticles(Set<ArticleDto> articles) {
        this.articles = articles;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public Set<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(Set<QuestionDto> questions) {
        this.questions = questions;
    }

    public Moment.Type getType() {
        return type;
    }

    public void setType(Moment.Type type) {
        this.type = type;
    }
}
