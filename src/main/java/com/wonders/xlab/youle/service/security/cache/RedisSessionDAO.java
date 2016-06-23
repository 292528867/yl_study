package com.wonders.xlab.youle.service.security.cache;

import com.wonders.xlab.youle.service.security.mgt.MySubject;
import com.wonders.xlab.youle.service.security.token.TelPasswordToken;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.UnknownSessionException;
import org.apache.shiro.session.mgt.SimpleSession;
import org.apache.shiro.session.mgt.eis.AbstractSessionDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;

import java.io.Serializable;
import java.util.Collection;

/**
 * Resis Session 自定义Dao。
 */
public class RedisSessionDAO extends AbstractSessionDAO {
    /** 日志记录器 */
    private final static Logger LOG = LoggerFactory.getLogger(RedisSessionDAO.class);

    /** spring jdbc template 操作类 */
    private RedisTemplate redisTemplate;
    public RedisTemplate getRedisTemplate() {
        return redisTemplate;
    }
    public void setRedisTemplate(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /** 保存的key前缀 */
    private String sessionKeyPrefix = "shiro_redis_session:";
    public String getSessionKeyPrefix() {
        return sessionKeyPrefix;
    }
    public void setSessionKeyPrefix(String sessionKeyPrefix) {
        this.sessionKeyPrefix = sessionKeyPrefix;
    }

    public RedisSessionDAO(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /** 用于session计数的key */
    private String sessionCountskey = "shiro_redis_session_count";

    @Override
    protected Serializable doCreate(Session session) {
        //uuid
        Serializable sessionId = super.generateSessionId(session);
        this.assignSessionId(session, sessionId);
        this.update(session);
        return sessionId;
    }

    @Override
    protected Session doReadSession(final Serializable sessionId) {
        if (sessionId == null) {
            LOG.error("session id is null");
            System.out.println("session id is null");
            return null;
        }


        
        Object r_v = this.redisTemplate.execute(new RedisCallback() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                byte[] key = getKeyWithSession(sessionId);
                if (!connection.exists(key))
                    return null;
                byte[] value = connection.get(key);
                return redisTemplate.getDefaultSerializer().deserialize(value);
            }
        });

        if (r_v == null)
            return null;
        else { // 这里奇怪，create的时候timeout是－1，序列化后read出来不是－1了，见鬼了以后再查。
            SimpleSession s = (SimpleSession) r_v;
            s.setTimeout(-1);
            s.setExpired(false);
            s.setStopTimestamp(null);
            return s;
        }
    }

    @Override
    public void delete(final Session session) {
        if (session == null || session.getId() == null) {
            LOG.error("session or session id is null");
            System.out.println("session or session id is null");
            return;
        }

        redisTemplate.execute(new RedisCallback() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                byte[] key = getKeyWithSession(session.getId());
                if (connection.exists(key))
                    connection.del(key);
                return null;
            }
        });

    }

    @Override
    public void update(final Session session) throws UnknownSessionException {
        if (session == null || session.getId() == null) {
            LOG.error("session or session id is null");
            System.out.println("session or session id is null");
            return;
        }



        this.redisTemplate.execute(new RedisCallback() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                // 注意：session永远有效，以后再改
                byte[] key = getKeyWithSession(session.getId());
                byte[] value = redisTemplate.getDefaultSerializer().serialize(session);
                session.setTimeout(-1); // 一直有效
                connection.set(key, value);
                return null;
            }
        });

    }

    @Override
    public Collection<Session> getActiveSessions() {
        return null;
    }

    @Override
    protected Serializable generateSessionId(Session session) {
        // 获取subject，并转换成自定义的MySubjct
        MySubject mySubject = (MySubject) SecurityUtils.getSubject();
        TelPasswordToken telPasswordToken = mySubject.getToken();
        long counts = (Long) this.redisTemplate.execute(new RedisCallback() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.incr(sessionCountskey.getBytes());
            }
        });

        // 获取ip地址
        String clientIp = StringUtils.isEmpty(telPasswordToken.getHost()) ?
                "UnResolver_clientIp" : telPasswordToken.getHost();
        // 获取登录平台
        String appPlatform = StringUtils.isEmpty(telPasswordToken.getAppPlateform()) ?
                "UnResolver_appPlatform" : telPasswordToken.getAppPlateform();

        return telPasswordToken.getUsername() + "_" +
                clientIp + "_" +
                appPlatform + "_" +
                counts;
    }

    //----------------------------------- 生成key的方法 --------------------------------------//

    /**
     * 获取session保存用的key。
     * @param sessionId session Id
     * @return byte[]类型key
     */
    private byte[] getKeyWithSession(Serializable sessionId) {
        String prekey = sessionKeyPrefix + sessionId;
        return prekey.getBytes();
    }

}
