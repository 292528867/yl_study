package com.wonders.xlab.youle.service.security.filter;

import com.wonders.xlab.youle.service.security.mgt.MySubject;
import com.wonders.xlab.youle.service.security.token.TelPasswordToken;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.AuthenticatingFilter;
import org.apache.shiro.web.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Base64Utils;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

/**
 * app应用请求的验证控制filter。
 * @author xu
 *
 */
public class AppRequestAuthenticationFilter extends AuthenticatingFilter {
	/** 日志记录器 */
	private static final Logger LOG = LoggerFactory.getLogger(AppRequestAuthenticationFilter.class);
	
	/** app登录url */
	private String appLoginUrl;
	/** app登录成功url */
	private String appLoginSuccessUrl;
	/** app登录失败url */
	private String appLoginFailureUrl;
	
	
	/** 默认的tel的httprequest的key名字 */
	public static final String DEFAULT_TEL_PARAM = "tel";
	/** 默认的password的httprequest的key名字 */
	public static final String DEFAULT_PASSWORD_PARAM = "password";
	/** 默认的appPlatform的httprequest的key名字 */
	public static final String DEFAULT_APPPLATFORM_PARAM = "appPlatform";
	
    /** 电话httprequest的key */
    private String telParam = DEFAULT_TEL_PARAM;
    /** 密码httprequest的key */
    private String passwordParam = DEFAULT_PASSWORD_PARAM;
	/** 登录平台httprequest的key */
	private String appPlatformParam = DEFAULT_APPPLATFORM_PARAM;
    
    /** 默认的登录失败异常httprequest的key名字 */
    public static final String DEFAULT_ERROR_KEY_ATTRIBUTE_NAME = "shiroLoginFailure";
	
	public String getAppLoginUrl() {
		return appLoginUrl;
	}

	public void setAppLoginUrl(String appLoginUrl) {
		this.appLoginUrl = appLoginUrl;
	}

	public String getAppLoginSuccessUrl() {
		return appLoginSuccessUrl;
	}

	public void setAppLoginSuccessUrl(String appLoginSuccessUrl) {
		this.appLoginSuccessUrl = appLoginSuccessUrl;
	}

	public String getAppLoginFailureUrl() {
		return appLoginFailureUrl;
	}

	public void setAppLoginFailureUrl(String appLoginFailureUrl) {
		this.appLoginFailureUrl = appLoginFailureUrl;
	}
    	
	public String getTelParam() {
		return telParam;
	}

	public void setTelParam(String telParam) {
		this.telParam = telParam;
	}
	
	public String getPasswordParam() {
		return passwordParam;
	}

	public void setPasswordParam(String passwordParam) {
		this.passwordParam = passwordParam;
	}

	public String getAppPlatformParam() {
		return appPlatformParam;
	}

	public void setAppPlatformParam(String appPlatformParam) {
		this.appPlatformParam = appPlatformParam;
	}

	@Override
	protected AuthenticationToken createToken(ServletRequest request,
			ServletResponse response) {
		// 使用自定义token
		String base64Tel = WebUtils.getCleanParam(request, telParam);
		String md5Password = WebUtils.getCleanParam(request, passwordParam);

		// 电话号码，base64加密的，需要解密
		String tel = new String(Base64Utils.decodeFromString(base64Tel));
		// 密码，md5加密，直接保存
		String password = md5Password;
		// 登录平台
		String appPlatform = WebUtils.getCleanParam(request, appPlatformParam);

		TelPasswordToken token = new TelPasswordToken(
				tel, password, isRememberMe(request), getHost(request), appPlatform);

		// 重要：把token放入subject中
		MySubject mySubject = (MySubject) SecurityUtils.getSubject();
		mySubject.setToken(token);

		return token;		
	}

	@Override
	protected String getHost(ServletRequest request) {

		HttpServletRequest httpServletRequest = (HttpServletRequest) request;

		String ipAddress = httpServletRequest.getHeader("x-forwarded-for");
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress))
			ipAddress = httpServletRequest.getHeader("Proxy-Client-IP");
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress))
			ipAddress = httpServletRequest.getHeader("WL-Proxy-Client-IP");
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
			ipAddress = httpServletRequest.getRemoteAddr();
//			if ("127.0.0.1".equals(ipAddress) || "0:0:0:0:0:0:0:1".equals(ipAddress)) {
//				// 根据网卡取本机配置的ip
//				InetAddress inet = null;
//				try {
//					inet = InetAddress.getLocalHost();
//					ipAddress = inet.getHostAddress();
//				} catch (UnknownHostException exp) {
//					exp.printStackTrace();
//				}
//			}
		}

		// 对于通过多个代理的情况，ip地址以逗号分割，第一个不是unknown的ip为真实ip
		if (StringUtils.isNotEmpty(ipAddress)) {
			String[] ips = ipAddress.split(",");
			for (String ip : ips) {
				if (!"unknown".equals(ip)) {
					ipAddress = ip;
					break;
				}
			}
		}

		if (StringUtils.isEmpty(ipAddress)) {
			if (LOG.isWarnEnabled())
				LOG.warn("哇塞，还是没有解析出来，没办法罗，哈哈哈哈！");
		}

		return ipAddress;
	}

	@Override
	protected boolean onLoginSuccess(AuthenticationToken token,
			Subject subject, ServletRequest request, ServletResponse response)
			throws Exception {
		// 不用原来filter的请求重定向，使用请求转发，这样就不会再一次filter了
		RequestDispatcher rd = request.getServletContext().getRequestDispatcher(this.appLoginSuccessUrl);
		rd.forward(request, response);
		
		return false;
	}
	
	@Override
	protected boolean onLoginFailure(AuthenticationToken token,
			AuthenticationException e, ServletRequest request,
			ServletResponse response) {
		// 不用原来filter的请求重定向，使用请求转发，这样就不会再一次filter了
		request.setAttribute(DEFAULT_ERROR_KEY_ATTRIBUTE_NAME, e);
		RequestDispatcher rd = request.getServletContext().getRequestDispatcher(this.appLoginFailureUrl);
		try {
			rd.forward(request, response);
		} catch (Exception e1) {
			throw new RuntimeException(e1);
		}
		
		return false;
	}

	@Override
	protected boolean onAccessDenied(ServletRequest request,
			ServletResponse response) throws Exception {
        if (isLoginRequest(request, response)) { // 是login请求
        	// 判定是否是post请求，只允许post请求的验证
        	if (WebUtils.toHttp(request).getMethod().equalsIgnoreCase(POST_METHOD)) {
        		if (LOG.isTraceEnabled()) 
        			LOG.trace("开始验证用户");
        		return executeLogin(request, response);
        	} else {
        		if (LOG.isTraceEnabled()) 
        			LOG.trace("验证请求不是post请求！");
        		AuthenticationException e = new AuthenticationException("验证请求不是post请求！");
            	return onLoginFailure(null, e, request, response);
        	}
        } else {
        	if (LOG.isTraceEnabled()) 
        		LOG.trace("用户未验证，请先登录app！");
        	AuthenticationException e = new AuthenticationException("用户未验证，请先登录app！");
        	return onLoginFailure(null, e, request, response);
        }
	}
	
	@Override
	protected boolean isLoginRequest(ServletRequest request,
			ServletResponse response) {
		// 使用apploginin url 匹配登录request
		return pathsMatch(this.getAppLoginUrl(), request);
	}
}
