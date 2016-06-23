package com.wonders.xlab.youle.repository.article;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.article.Article;
import com.wonders.xlab.youle.enums.Status;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by Jeffrey on 15/8/13.
 */
public interface ArticleRepository extends MyRepository<Article, Long> {

    List<Article> findByCategoryAndStatus(String category, Status status);

    /**
     * 分组分页去重相同文章，查询｛category｝下为图片文章单元的所有文章信息
     * @param category 文章分类
     * @return 去重文章列表 List<Article>
     */
    @Query("from Article a left join fetch a.cells c left join fetch c.tags where a.status = 1 and c.type = '1'  and a.removed = 0 and a.category = :category group by a")
    List<Article> findOnlyHasPic(@Param("category") String category);

    /**
     * 分组去重查询文章的所有分类，按照sortCategory排序
     * @return List<String>
     */
    @Query("select a.category from Article a where a.status = 1 and a.removed = 0 and a.category <> '' group by a.category order by a.sortCategory asc")
    List<String> findCategoryGroupByCategory();

    //    /**
//     * 分组分页去重相同文章，查询｛momentsId｝下为图片文章单元的所有文章信息
//     * @param momentsId 圈子id
//     * @param pageable 分页
//     * @return 去重文章列表 List<Article>
//     */
//    @Query("from Article a where a.status = 1 and a.moments.id = :momentsId group by a ")
//    List<Article> findByMoments(@Param("momentsId") long momentsId, Pageable pageable);
    List<Article> findByStatusAndMomentsIdOrderByClickAmountDesc(Status status, long momentId, Pageable pageable);
}
