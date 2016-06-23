package com.wonders.xlab.youle.controller.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wonders.xlab.youle.dto.result.ControllerErrorResult;
import com.wonders.xlab.youle.dto.result.ControllerResult;
import com.wonders.xlab.youle.dto.user.ThirdUserInfo;
import com.wonders.xlab.youle.entity.base.Location;
import com.wonders.xlab.youle.entity.security.UrlFilter;
import com.wonders.xlab.youle.entity.user.ThirdUser;
import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.mall.UrlFiltersRepository;
import com.wonders.xlab.youle.repository.user.ThirdUserRepository;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.redis.valid.ValidCodeService;
import com.wonders.xlab.youle.service.security.LoginRetryException;
import com.wonders.xlab.youle.service.security.filter.AppRequestAuthenticationFilter;
import com.wonders.xlab.youle.service.security.mgt.MySubject;
import com.wonders.xlab.youle.service.security.principal.PrimaryPrincipal;
import com.wonders.xlab.youle.service.security.realm.MallUserRealm;
import com.wonders.xlab.youle.service.security.token.TelPasswordToken;
import com.wonders.xlab.youle.service.security.token.ThirdUserToken;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.PathMatchingFilter;
import org.apache.shiro.web.filter.mgt.DefaultFilterChainManager;
import org.apache.shiro.web.filter.mgt.PathMatchingFilterChainResolver;
import org.apache.shiro.web.servlet.AbstractShiroFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.Filter;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.lang.reflect.Field;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 安全控制器。
 * @author xu
 */
@RestController
@RequestMapping(value = "security")
public class SysMC {

	private final static Logger LOG = LoggerFactory.getLogger(SysMC.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ValidCodeService validCodeService;
    @Autowired
    private UrlFiltersRepository urlFiltersRepository;
    @Autowired
    private ShiroFilterFactoryBean shiroFilterFactoryBean;
    
    @Autowired
    private MallUserRealm realm;

	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private HttpServletRequest request;

    @Autowired
    private ThirdUserRepository thirdUserRepository;
    
//	protected static final String DEFAULT_LF_INC_MESSAGE = "密码错误";
	protected static final String DEFAULT_LF_INC_MESSAGE = "用户名或密码错误";
	protected static final String DEFAULT_LF_UA_MESSAGE = "账号不存在";
	protected static final String DEFAULT_LF_LA_MESSAGE = "账号被锁定";
	protected static final String DEFAULT_LF_UE_MESSAGE = "未知错误";
	protected static final String DEFAULT_NOT_LOGIN_MESSAGE = "未登录系统";

	/** -10 */
	protected String incorrectCredentialsmessage = DEFAULT_LF_INC_MESSAGE;
	/** -11 */
	protected String unknownaccountmessage = DEFAULT_LF_UA_MESSAGE;
	/** -12 */
	protected String lockedaccountmessage = DEFAULT_LF_LA_MESSAGE;
	/** -13 */
	protected String unknownexceptionmessage = DEFAULT_LF_UE_MESSAGE;
	/** -15 */
	protected String notloginmessage = DEFAULT_NOT_LOGIN_MESSAGE;
	
	/** 用户数原子计数 */
	private AtomicLong userCount;
	@PostConstruct
	public void initUserCount() {
		userCount = new AtomicLong(this.userRepository.count());
	}

	/**
	 * 修改密码。
	 * @param info
	 * @param result
	 * @return
	 */
	@RequestMapping(value = "/password/change")
	public ControllerResult<String> passwordChange(@RequestBody @Valid UserRegisterInfo info, BindingResult result) {
		if (result.hasErrors()) { // 判定参数有无错误
			StringBuilder builder = new StringBuilder();
			for (ObjectError error : result.getAllErrors())
				builder.append(error.getDefaultMessage());
			return new ControllerResult<String>()
					.setRet_code(-1)
					.setRet_values(builder.toString())
					.setMessage(builder.toString());
		}

		User user = this.userRepository.findByTel(info.getTel());
		if (user == null) // 判定用户是否存在
			return new ControllerResult<String>()
					.setRet_code(-1)
					.setRet_values("用户不存在")
					.setMessage("用户不存在");

		Object code = validCodeService.get("youle:validCode:" + info.getTel());
		if (null == code || StringUtils.isBlank(code.toString())) { // 判定短信验证码是否失效
			return new ControllerResult<String>()
					.setRet_code(-1)
					.setRet_values("验证码失效")
					.setMessage("验证码失效");
		} else if (!code.toString().equals(info.getCode())) { // 判定短信验证码是否输入错误
			return new ControllerResult<String>()
					.setRet_code(-1)
					.setRet_values("验证码输入错误")
					.setMessage("验证码输入错误");
		} else { // 更新密码
			user.setPassword(info.getPassword());
			this.userRepository.save(user);

			// 直接登录
			TelPasswordToken token = new TelPasswordToken(
					info.getTel(),
					info.getPassword(),
					false,
					getHost(request),
					info.getAppPlatform().toString());
			MySubject subject = (MySubject) SecurityUtils.getSubject();
			subject.setToken(token);
			subject.login(token);

			return new ControllerResult<String>()
					.setRet_code(0)
					.setRet_values(subject.getSession().getId().toString())
					.setMessage(subject.getSession().getId().toString());
		}
	}

    /**
     * 注册用户。
     * @param info {@link UserRegisterInfo}
     * @param result JSR 303验证错误结果
     */
	@RequestMapping(value = "/register")
	public ControllerResult<String> register(@RequestBody @Valid UserRegisterInfo info, BindingResult result) {
		if (result.hasErrors()) { // 判定参数有无错误
            StringBuilder builder = new StringBuilder();
            for (ObjectError error : result.getAllErrors())
                builder.append(error.getDefaultMessage());
            return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values(builder.toString())
                    .setMessage(builder.toString());
        }
		User user = this.userRepository.findByTel(info.getTel());
		if (user != null && user.getId() != null) // 判定用户是否存在
			return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values("用户已存在")
                    .setMessage("用户已存在");
		
		Object code = validCodeService.get("youle:validCode:" + info.getTel());
        if (null == code || StringUtils.isBlank(code.toString())) { // 判定短信验证码是否失效
            return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values("验证码失效")
                    .setMessage("验证码失效");
        } else if (!code.toString().equals(info.getCode())) { // 判定短信验证码是否输入错误
            return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values("验证码输入错误")
                    .setMessage("验证码输入错误");
        } else { // 保存注册用户
        	user = new User();
        	user.setTel(info.getTel());
        	user.setPassword(info.getPassword());
        	user.setAppPlatform(info.getAppPlatform());
			//下载注册送200积分，长期奖励
			user.setIntegrals(200);
        	Location location = new Location("", 0, 0);
        	user.setLocation(location);
        	
        	// 生成用户昵称，用户数原子计数
        	long c_random = userCount.addAndGet(1);
        	user.setNickName("yl" + String.format("%06d", c_random));
        	
        	this.userRepository.save(user);
        	
        	// 直接登录
    		TelPasswordToken token = new TelPasswordToken(
    				info.getTel(), 
    				info.getPassword(), 
    				false, 
    				getHost(request),
					info.getAppPlatform().toString());
    		MySubject subject = (MySubject) SecurityUtils.getSubject();
			subject.setToken(token);
            subject.login(token);

        	return new ControllerResult<String>()
                    .setRet_code(0)
                    .setRet_values(subject.getSession().getId().toString())
                    .setMessage(subject.getSession().getId().toString());
        }
	}
	
	/**
	 * 登出。
	 */
	@RequestMapping(value = "/app/logout")
	public ControllerResult<String> appLogout() {
		Subject subject = SecurityUtils.getSubject();
		if (!subject.isAuthenticated())
			return new ControllerResult<String>()
				.setRet_code(0)
				.setRet_values("登出")
				.setMessage("登出");
		PrimaryPrincipal pp = (PrimaryPrincipal) subject.getPrincipal();
		User user = this.userRepository.findOne(pp.getUserId());
		realm.clearAuthenticationInfoForUser(user);
		subject.logout();
		return new ControllerResult<String>()
				.setRet_code(0)
				.setRet_values("登出")
				.setMessage("登出");
	}
	
	/**
	 * 登录标记。
	 */
	@RequestMapping(value = "/app/login")
	public ControllerResult<String> appLogin() {
		// AppRequestAuthenticationFilter内部处理请求操作，不会到这里的，
		// 这里只做一个标识，凡是登录肯定是这个mapping url
		return new ControllerResult<String>()
				.setRet_code(0)
				.setRet_values("这只是一个登录标记，直接访问是会跳转的，请查看shiro配置！")
				.setMessage("这只是一个登录标记，直接访问是会跳转的，请查看shiro配置！");
	}

    /**
     * 三方登陆
     * @return
     */
    @RequestMapping(value = "/app/thirdLogin")
    public ControllerResult<String> appThirdLogin(@RequestBody  @Valid ThirdUserInfo thirdUserInfo,BindingResult result) throws Exception{
        if (result.hasErrors()) { // 判定参数有无错误
            StringBuilder builder = new StringBuilder();
            for (ObjectError error : result.getAllErrors())
                builder.append(error.getDefaultMessage());
            return new ControllerResult<String>()
                    .setRet_code(-1)
                    .setRet_values(builder.toString())
                    .setMessage(builder.toString());
        }
        ThirdUser thirdUser = thirdUserRepository.findByToken(thirdUserInfo.getToken());
        if (thirdUser == null) {
            User user = new User();
            user.setAppPlatform(thirdUserInfo.getAppPlatform());
            user.setSex(thirdUserInfo.getSex());
            user.setNickName(thirdUserInfo.getNickName());
            user.setIconUrl(thirdUserInfo.getIconUrl());
            user.setLocation(new Location("", 0, 0));
            user = userRepository.save(user);

            thirdUser = new ThirdUser();
            thirdUser.setUser(user);
            thirdUser.setToken(thirdUserInfo.getToken());
            thirdUser.setResource(thirdUserInfo.getThirdResource());
            thirdUser = thirdUserRepository.save(thirdUser);
        }

        Subject subject = SecurityUtils.getSubject();
        subject.login(new ThirdUserToken(thirdUser.getToken(),""));

        return new ControllerResult<String>()
                .setRet_code(0)
                .setRet_values(subject.getSession().getId().toString())
                .setMessage(subject.getSession().getId().toString());
    }

	/**
	 * 登录成功url。
	 */
	@RequestMapping(value = "/app/loginSuccess")
	public ControllerResult<String> appLoginSuccess() {
		// 目前放回sessionid，以后根据需求再修正
		Subject subject = SecurityUtils.getSubject();
		if (!subject.isAuthenticated()) // 这种情况可能就是配置shiro过滤url时，没有包含此url
			throw new RuntimeException("shiro配置有问题，登录成功后，subject显示未成功登录！");
		return new ControllerResult<String>()
				.setRet_code(0)
				.setRet_values(subject.getSession().getId().toString())
				.setMessage(subject.getSession().getId().toString());
	}
	/**
	 * 登录失败url。
	 */
	@RequestMapping(value = "/app/loginFailure")
	public ControllerErrorResult appLoginFailure(HttpServletRequest request) {
		// 获取异常
		AuthenticationException e = (AuthenticationException) request.getAttribute(AppRequestAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME);
		if (e == null) // 这种情况可能就是配置shiro过滤url时，没有包含此url
			throw new RuntimeException("shiro配置有问题，登录失败后，request里没有取到异常对象！");
		
//		StringWriter sw = new StringWriter();
//		PrintWriter pw = new PrintWriter(sw);
//		e.printStackTrace(pw);

//		// 动态创建objectmapper的writer
//		ObjectWriter ow = objectMapper.writer(
//				new SimpleFilterProvider().addFilter("f1", SimpleBeanPropertyFilter.serializeAllExcept("return_values"))
//		);

//		objectMapper.setAnnotationIntrospector(new JacksonAnnotationIntrospector() {
//			@Override
//			public Object findFilterId(Annotated a) {
//				return a.getName();
//			}
//		});

		// TODO：filterde方式再议

		if (IncorrectCredentialsException.class.isInstance(e))
			return new ControllerErrorResult()
				.setRet_code(-10)
				.setMessage(this.incorrectCredentialsmessage);
		else if (UnknownAccountException.class.isInstance(e))
			return new ControllerErrorResult()
				.setRet_code(-11)
				.setMessage(this.unknownaccountmessage);
		else if (LockedAccountException.class.isInstance(e)) 
			return new ControllerErrorResult()
				.setRet_code(-12)
				.setMessage(this.lockedaccountmessage);
		else if (LoginRetryException.class.isInstance(e))
			return new ControllerErrorResult()
					.setRet_code(-13)
					.setMessage(e.getLocalizedMessage());
		else if (AuthenticationException.class.isInstance(e))
			return new ControllerErrorResult()
				.setRet_code(-15)
				.setMessage(this.notloginmessage);
		else
			return new ControllerErrorResult()
				.setRet_code(-13)
				.setMessage(this.unknownexceptionmessage + ":" + e.getLocalizedMessage());
	}
	
	@RequestMapping(value = "/test1", method = RequestMethod.GET)
	public String test1() {
		return "test1";
	}
	
	@RequestMapping(value = "/test2", method = RequestMethod.GET)
	public String test2() {
		return "test2";
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/reloadUrlFilters", method = RequestMethod.GET)
	public void reloadUrlFilter() throws Exception {
		AbstractShiroFilter shiroFilter = (AbstractShiroFilter) this.shiroFilterFactoryBean.getObject();
		// 获取DefaultFilterChainManager
		DefaultFilterChainManager filterChainManager =  
				(DefaultFilterChainManager) ((PathMatchingFilterChainResolver) shiroFilter.getFilterChainResolver()).getFilterChainManager();
		for (Entry<String, Filter> filterEntry : filterChainManager.getFilters().entrySet()) {
			if (PathMatchingFilter.class.isInstance(filterEntry.getValue())) {
				PathMatchingFilter filter = PathMatchingFilter.class.cast(filterEntry.getValue());
				
				Field appliedPathsFields = null;
				for(Class<?> superClass = filter.getClass(); superClass != Object.class; superClass = superClass.getSuperclass()){  
		            try {  
		            	appliedPathsFields = superClass.getDeclaredField("appliedPaths");
		            	break;
		            } catch (NoSuchFieldException e) {  
		                //Field 不在当前类定义, 继续向上转型  
		            }  
		        }
				
				// TODO：写的比较乱，以后再改，fuck
				appliedPathsFields.setAccessible(true);
				
				Map<String, Object> appliedPaths = (Map<String, Object>) appliedPathsFields.get(filter);
				synchronized (appliedPaths) {
					appliedPaths.clear();
				}
			}
		}
		synchronized (filterChainManager.getFilterChains()) {
			filterChainManager.getFilterChains().clear();
			// 重新添加过滤path
			// 1、添加必须的filter
			filterChainManager.createChain("/security/app/login", "appauthc");
			filterChainManager.createChain("/security/app/logout", "anon");
			filterChainManager.createChain("/security/app/loginSuccess", "appauthc");
			filterChainManager.createChain("/security/app/loginFailure", "appauthc");
			// 2、从数据库中获取其余配置的过滤规则
			List<UrlFilter> urlFilters = this.urlFiltersRepository.findAll();
			for (UrlFilter urlFilter : urlFilters) 
				filterChainManager.createChain(urlFilter.getUrl(), urlFilter.getFilters());
		}
	}

	private String getHost(HttpServletRequest httpServletRequest) {
		String ipAddress = httpServletRequest.getHeader("x-forwarded-for");
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress))
			ipAddress = httpServletRequest.getHeader("Proxy-Client-IP");
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress))
			ipAddress = httpServletRequest.getHeader("WL-Proxy-Client-IP");
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
			ipAddress = httpServletRequest.getRemoteAddr();
			if ("127.0.0.1".equals(ipAddress) || "0:0:0:0:0:0:0:1".equals(ipAddress)) {
				// 根据网卡取本机配置的ip
				InetAddress inet = null;
				try {
					inet = InetAddress.getLocalHost();
					ipAddress = inet.getHostAddress();
				} catch (UnknownHostException exp) {
					exp.printStackTrace();
				}
			}
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
}
