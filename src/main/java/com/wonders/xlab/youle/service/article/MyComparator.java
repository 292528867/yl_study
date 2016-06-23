package com.wonders.xlab.youle.service.article;

import com.wonders.xlab.youle.dto.recommend.ArticleCellDto;
import com.wonders.xlab.youle.entity.article.ArticleCell;

import java.util.Comparator;

/**
 * Created by Jeffrey on 15/9/23.
 */
public class MyComparator implements Comparator {

    @Override
    public int compare(Object o1, Object o2) {

        if (o1 instanceof ArticleCell && o2 instanceof ArticleCell) {
            ArticleCell cell1 = (ArticleCell) o1;
            ArticleCell cell2 = (ArticleCell) o2;
            return cell1.getCellSort() - cell2.getCellSort();
        }
        if (o1 instanceof ArticleCellDto && o2 instanceof ArticleCellDto) {
            ArticleCellDto cell1 = (ArticleCellDto) o1;
            ArticleCellDto cell2 = (ArticleCellDto) o2;
            return cell1.getCellSort() - cell2.getCellSort();
        }
        throw new RuntimeException("Sorry");
    }
}
