package com.wonders.xlab.youle.service.security.mgt;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.SessionListenerAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * shiro session监听器。
 * @author xu
 *
 */
public class MySessionListener extends SessionListenerAdapter {
	/** 日志记录器 */
	private final static Logger LOG = LoggerFactory.getLogger(MySessionListener.class);
	
	@Override
	public void onStart(Session session) {
		// 记录日志
		LOG.info("session id={}，start！", session.getId());
	}
	@Override
	public void onStop(Session session) {
		// 记录日志
		LOG.info("session id={}，stop！", session.getId());
	}
	@Override
	public void onExpiration(Session session) {
		// 记录日志
		LOG.info("session id={}，expire！", session.getId());
	}
}
