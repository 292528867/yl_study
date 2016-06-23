package com.wonders.xlab.youle.service.security;

import com.wonders.xlab.youle.entity.security.UrlFilter;
import com.wonders.xlab.youle.repository.mall.UrlFiltersRepository;
import com.wonders.xlab.youle.service.security.cache.RedisSessionDAO;
import com.wonders.xlab.youle.service.security.filter.AppRequestAuthenticationFilter;
import com.wonders.xlab.youle.service.security.mgt.MySessionListener;
import com.wonders.xlab.youle.service.security.mgt.MySubjectFactory;
import com.wonders.xlab.youle.service.security.mgt.MyWebSessionManager;
import com.wonders.xlab.youle.service.security.realm.MallUserRealm;
import com.wonders.xlab.youle.service.security.realm.ThirdUserRealm;
import net.sf.ehcache.CacheManager;
import org.apache.shiro.authc.pam.AtLeastOneSuccessfulStrategy;
import org.apache.shiro.authc.pam.FirstSuccessfulStrategy;
import org.apache.shiro.authc.pam.ModularRealmAuthenticator;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.session.SessionListener;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.AnonymousFilter;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.redis.core.RedisTemplate;

import javax.servlet.Filter;
import java.util.*;

/**
 * Shiro安全框架配置。
 * @author xu
 *
 */
@Configuration
public class ShiroConfiguration {
	@Autowired
	private UrlFiltersRepository urlFiltersRepository;
	@Autowired
	private RedisTemplate redisTemplate;
	
	/**
	 * BeanPostProcessor是spring容器的一个扩展点，注意这里配置成static。
	 * shiro的这个扩展，用于自动执行init()方法，destory()方法，
	 * init() 是 org.apache.shiro.util.Initializable 接口实现方法
	 * destory() 是 org.apache.shiro.util.Destroyable 接口实现方法
	 * @return
	 */
	@Bean(name = "lifecycleBeanPostProcessor")
	public static LifecycleBeanPostProcessor getLifecycleBeanPostProcessor() {
		return new LifecycleBeanPostProcessor();
	}

	/**
	 * 自定义 shiro EhCacheManager。
	 * ehcache从2.5开始只允许一个jvm一个cachemanager实例，shiro默认创建一个，
	 * 因为hibernate也用了，所以这边要确保只有一个， 使用自定义的ehcacheManager
	 */
	@Bean(name = "shiroEhcacheManager")
	public EhCacheManager getShiroEhCacheManager(CacheManager ehcacheManager) {
		EhCacheManager em = new EhCacheManager();
		em.setCacheManager(ehcacheManager);
		return em;
	}
	
	/**
	 * 权限realm。
	 * @return
	 */
	@Bean(name = "userDbRealm")
	@DependsOn("lifecycleBeanPostProcessor")
	public MallUserRealm getUserDbRealm() {
		final MallUserRealm realm = new MallUserRealm();
		return realm;
	}

    @Bean(name = "thirdUserRealm")
    @DependsOn("lifecycleBeanPostProcessor")
    public ThirdUserRealm getThirdUserRealm() {
        return new ThirdUserRealm();
    }

	/**
	 * Resis Session 自定义Dao。
	 * @param redisTemplate {@link RedisTemplate}
	 */
	@Bean(name = "redisSessionDAO")
	public RedisSessionDAO getRedisSessionDAO(RedisTemplate redisTemplate) {
		RedisSessionDAO redisSessionDAO = new RedisSessionDAO(redisTemplate);
		return redisSessionDAO;
	}


    /**
     * 定义一个验证策略处理多个realm
     * @return
     */
    @Bean(name = "authenticator")
    public ModularRealmAuthenticator getAuthenticator() {
        ModularRealmAuthenticator authenticator = new ModularRealmAuthenticator();
        authenticator.setAuthenticationStrategy(getAtLeastOneSuccessfulStrategy());
        Collection<Realm> realms = new ArrayList<>();
        realms.add(getUserDbRealm());
        realms.add(getThirdUserRealm());
        authenticator.setRealms(realms);
        return authenticator;
    }

    @Bean
    public AtLeastOneSuccessfulStrategy getAtLeastOneSuccessfulStrategy() {
        return new AtLeastOneSuccessfulStrategy();
    }

	/**
	 * 安全管理器，使用自定义WebSessionManager，{@link MyWebSessionManager}。
	 * @param shiroEhcacheManager 缓存管理器，注入
	 * @param mallUserRealm 用户realm，注入
	 * @param redisSessionDAO Resis Session 自定义Dao
	 */
	@Bean(name = "securityManager")
	public DefaultWebSecurityManager getDefaultWebSecurityManager(
			EhCacheManager shiroEhcacheManager,
			MallUserRealm mallUserRealm,
			RedisSessionDAO redisSessionDAO) {
		DefaultWebSecurityManager dwsm = new DefaultWebSecurityManager();


		dwsm.setSubjectFactory(new MySubjectFactory());

		// 使用自定义的WebSessionManager注入
		MyWebSessionManager msm = new MyWebSessionManager();
//		DefaultWebSessionManager msm = new DefaultWebSessionManager();
		dwsm.setSessionManager(msm);
		// 使用Resis Session 自定义Dao
		msm.setSessionDAO(redisSessionDAO);
		// 取消session失效检测机制，由后台控制，invalid session
		msm.setSessionValidationSchedulerEnabled(false);
		// 定义session监听器
		List<SessionListener> sessionListeners = new ArrayList<>();
		sessionListeners.add(new MySessionListener());
		msm.setSessionListeners(sessionListeners);
//		// 设置realm
//        Collection<Realm> realms = new ArrayList<>();
//        realms.add(mallUserRealm);
//        realms.add(getThirdUserRealm());
//        dwsm.setRealms(realms);
		// 设置缓存控制器
		dwsm.setCacheManager(shiroEhcacheManager);
        //设置验证器
        dwsm.setAuthenticator(getAuthenticator());
		
		return dwsm;
	}
	
	/**
	 * 创建一个ShiroFilterFactoryBean工厂，用于构建shiro的内部过滤器链。
	 * @param securityManager
	 * @return
	 */
	@Bean(name = "shiroFilter")
	public ShiroFilterFactoryBean getShiroFilterFactoryBean(SecurityManager securityManager) {
		// 创建ShiroFilterFactoryBean工厂
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		// 设置内部注入的安全管理器
		shiroFilterFactoryBean.setSecurityManager(securityManager);
		
		// 创建自定义filter，可以考虑放入属性文件／数据库中读取，或者可以动态修改
		// 1、用于app登录，及之后验证的filter
		AppRequestAuthenticationFilter araf = new AppRequestAuthenticationFilter();
		araf.setAppLoginUrl("/security/app/login");
		araf.setAppLoginSuccessUrl("/security/app/loginSuccess");
		araf.setAppLoginFailureUrl("/security/app/loginFailure");
		araf.setTelParam("tel");
		araf.setPasswordParam("password");
		// 2、匿名登录filter
		AnonymousFilter af = new AnonymousFilter();
		
		// 定义过滤器别名映射map
		Map<String, Filter> filters = new HashMap<String, Filter>();
		filters.put("appauthc", araf);
		filters.put("anon", af);
		shiroFilterFactoryBean.setFilters(filters);
		
		// 定义过滤器链，定义过滤器和url的映射
		Map<String, String> filterChainDefinitions = new HashMap<String, String>();
		// 默认必须添加的过滤规则
		filterChainDefinitions.put("/security/app/login", "appauthc");
		filterChainDefinitions.put("/security/app/logout", "anon");
		filterChainDefinitions.put("/security/app/loginSuccess", "appauthc");
		filterChainDefinitions.put("/security/app/loginFailure", "appauthc");
		
		// 从数据库中获取其余配置的过滤规则
		List<UrlFilter> urlFilters = this.urlFiltersRepository.findAll();
		for (UrlFilter urlFilter : urlFilters) 
			filterChainDefinitions.put(urlFilter.getUrl(), urlFilter.getFilters());		
		
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitions);
		
		return shiroFilterFactoryBean;
	}
}
