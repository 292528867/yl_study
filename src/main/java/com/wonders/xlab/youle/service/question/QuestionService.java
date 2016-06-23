package com.wonders.xlab.youle.service.question;

import com.wonders.xlab.youle.dto.question.QuestionDto;
import com.wonders.xlab.youle.entity.questions.Questions;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.locale.converters.DateLocaleConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.InvocationTargetException;
import java.util.*;

/**
 * Created by Jeffrey on 15/9/15.
 */
@Service
@Transactional
public class QuestionService {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public List<QuestionDto> findByPage(final Questions.Type type,final Pageable page) {

        StringBuilder hql = new StringBuilder();
        hql.append("select q.id, q.title, q. description, q.pic_url picUrl, q.user_id userId ");
        hql.append(", q.created_date createdDate, q.title enumType, q.type, u.nick_name nickName, u.icon_url ");
        hql.append("iconUrl, count(a.id) countReplies from yl_questions q left join ");
        hql.append("yl_replies a on q.id = a.question_id left join yl_user u on ");
        hql.append("q.user_id = u.id where q.type =:type group by q.id limit :number , :size");

        List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(hql.toString(), new HashMap<String, Object>() {{
            put("number", page.getPageNumber() * page.getPageSize());
            put("size", page.getPageSize());
            put("type", type.ordinal());
        }});

        if (null != queryForList && !queryForList.isEmpty()) {

            List<QuestionDto> questionDtos = new ArrayList<>();

            for (Map<String, Object> map : queryForList) {
                try {
                    QuestionDto dto = new QuestionDto();
                    ConvertUtils.register(new DateLocaleConverter(), Date.class);
                    BeanUtils.populate(dto, map);
                    questionDtos.add(dto);
                } catch (IllegalAccessException | InvocationTargetException ignored) {
                }
            }
            return questionDtos;
        }
        return null;
    }

}
