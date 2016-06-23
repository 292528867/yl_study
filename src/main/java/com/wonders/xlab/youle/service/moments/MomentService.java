package com.wonders.xlab.youle.service.moments;

import com.wonders.xlab.youle.dto.recommend.Statistic;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Jeffrey on 15/9/8.
 */
@Service
public class MomentService {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public Statistic momentStatistics(final long momentId) {

        StringBuilder hql = new StringBuilder();
        hql.append("select count(distinct(u.id)) totalUser, count(distinct(a.id)) totalArticle, count(distinct(p.id)) totalPraised from yl_user u ")
                .append("left join yl_user_article ua ")
                .append("on u.id = ua.user_id ")
                .append("left join yl_article a ")
                .append("on ua.article_id = a.id ")
                .append("left join yl_article_praised p ")
                .append("on a.id = p.article_id ")
                .append("where a.moment_id = :momentId ")
                .append("order by count(u.id) desc");

        Map<String, Object> queryForMap = jdbcTemplate.queryForMap(hql.toString(), new HashMap<String, Object>() {{
            put("momentId", momentId);
        }});

        if (null != queryForMap && !queryForMap.isEmpty()) {
            try {
                Statistic statistic = new Statistic();
                BeanUtils.populate(statistic, queryForMap);
                return statistic;
            } catch (IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
                return null;
            }
        }
        return null;
    }

}
