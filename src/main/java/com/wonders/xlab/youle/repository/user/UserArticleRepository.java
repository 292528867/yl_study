package com.wonders.xlab.youle.repository.user;

import com.wonders.xlab.framework.repository.MyRepository;
import com.wonders.xlab.youle.entity.user.UserArticle;
import com.wonders.xlab.youle.enums.Status;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * 用户发布文章关联表Repository
 * Created by Jeffrey on 15/8/13.
 */
public interface UserArticleRepository extends MyRepository<UserArticle, Long> {

    @Query(
            "select distinct ua from UserArticle ua "+
            "left join ua.pk.article a left join a.cells c "+
            "left join c.tags where a.category = :category "+
            "and a.status = 1  and a.removed = 0 and c.type = '1' order by "+
            "a.arithmeticValue desc , a.clickAmount desc, c.cellSort asc"
    )
    List<UserArticle> findOnlyHasPic(@Param("category") String category, Pageable pageable);

    @Query(
            "select distinct ua from UserArticle ua "+
                    "left join ua.pk.article a left join a.cells c "+
                    "left join c.tags where a.category = :category "+
                    "and a.status = 1  and a.removed = 0 order by a.arithmeticValue desc , "+
                    "a.clickAmount desc , c.cellSort asc"
    )
    List<UserArticle> findByCategory(@Param("category") String category, Pageable pageable);

    @Query(
            "from UserArticle ua left join fetch ua.pk.article a "+
                    "left join fetch a.cells c left join fetch c.tags "+
                    "where a.id = :articleId order by c.cellSort asc"
    )
    UserArticle findByPkArticleIdOrderByPkArticleCellsCellSortAsc(@Param("articleId") long articleId);

    @Query(
            "from UserArticle ua left join fetch ua.pk.article a "+
                    "left join fetch ua.pk.user u where a.moments.id = :momentId "+
                    "and a.status = 1  and a.removed = 0 group by u.id order by count(u.id) desc"
    )
    List<UserArticle> findTop5ByMomentId(@Param("momentId") long momentId, Pageable pageable);

//    @Query(
//            "select ua from UserArticle ua "+
//                    "left join fetch ua.pk.article a where a.status = 1 "+
//                    "and a.moments.id = :momentId"
//    )
    List<UserArticle> findByPkArticleMomentsIdAndPkArticleStatus(long momentId, Status status, Pageable pageable);

    List<UserArticle> findByPkUserIdAndPkArticleStatus(long userId, Status status);

    @Query(
            "select distinct ua from UserArticle ua "+
                    "left join ua.pk.article a left join a.cells c "+
                    "left join c.tags where a.status = 1 and a.removed = 0 "+
                    "order by a.arithmeticValue desc , "+
                    "a.clickAmount desc , c.cellSort asc"
    )
    List<UserArticle> findHotArticle(Pageable pageable);

    @Query("select count(*) from UserArticle ua where ua.pk.user.id = ?1 ")
    Long selectCountByUserId(Long userId);

    UserArticle findByPkArticleId(long articleId);

}
