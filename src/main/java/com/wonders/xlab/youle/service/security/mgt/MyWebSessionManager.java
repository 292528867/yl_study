package com.wonders.xlab.youle.service.security.mgt;

import java.io.Serializable;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.web.servlet.ShiroHttpServletRequest;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 自定义web session管理器。
 * @author xu
 *
 */
public class MyWebSessionManager extends DefaultWebSessionManager {
	/** 日志记录器 */
	private final static Logger LOG = LoggerFactory.getLogger(MyWebSessionManager.class);
	
	/**
	 * 获取session id的方式，默认从cookie，取不到从path中取，还取不到从request param中获取，key为JSESSIONID。
	 * 这里自定义其他方式，不使用cookie，path，request param方式，
	 * 在request头中获取token，代替sessionid的作用，token命名为hctoken。
	 */
	@Override
	protected Serializable getSessionId(ServletRequest request,
			ServletResponse response) {
		// 从http头中获取hctoken
		String hctoken = WebUtils.toHttp(request).getHeader("hctoken");
		if (StringUtils.isNotEmpty(hctoken)) {
			// 定义id来源于cookie，这里不需要
//			request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE,
//                    ShiroHttpServletRequest.COOKIE_SESSION_ID_SOURCE);
			// 定义id来源于url，这里不需要
//			request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE,
//                    ShiroHttpServletRequest.URL_SESSION_ID_SOURCE);
			
			request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID, hctoken);
			request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_IS_VALID, Boolean.TRUE);
		
			if (LOG.isInfoEnabled()) 
				LOG.info("从http请求头中获取hctoken={}", hctoken);
		} else {
//			if (LOG.isInfoEnabled()) 
//				LOG.info("hctoken为空，fuck！");
		}
		
		return hctoken;
	}
	
}
