package com.wonders.xlab.youle.service.security.realm;

import com.wonders.xlab.youle.service.security.LoginRetryException;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authc.AccountException;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;

import com.wonders.xlab.youle.entity.user.User;
import com.wonders.xlab.youle.repository.user.UserRepository;
import com.wonders.xlab.youle.service.security.token.TelPasswordToken;

/**
 * 商城用户Realm。
 * @author xu
 */
public class MallUserRealm extends AuthorizingRealm {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	@Qualifier("hostLoginRetryCache")
	private Cache hostLoginRetryCache;

	public MallUserRealm() {
		// realm域名
		setName("userDbRealm");
		// 开启cache ,缓存管理器 使用Ehcache实现
		setCachingEnabled(true);
		// 启用session authentication缓存，并设定缓存名
		setAuthenticationCachingEnabled(true);
		setAuthenticationCacheName("myAuthenticationCache");
		// 启用session authorization缓存，并设定缓存名
		setAuthorizationCachingEnabled(true);
		setAuthorizationCacheName("myAuthorizationCache");
	}
	
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(
			AuthenticationToken token) throws AuthenticationException {
		TelPasswordToken upToken = (TelPasswordToken) token;
		
		String tel = upToken.getUsername();
		String password = new String(upToken.getPassword());
//		String host = upToken.getHost();

		if (StringUtils.isEmpty(tel)) {
			throw new AccountException("用户手机必须填写！");
		}
		
		try {

			if (StringUtils.isNotEmpty(tel)) { // token有tel时判定重复次数
//				String retryKey = host + "_login_retry";
				String retryKey = tel + "_login_retry";
				Element element = new Element(retryKey, 1);
				element = hostLoginRetryCache.putIfAbsent(element);
				int retryCount = Integer.parseInt(hostLoginRetryCache.get(retryKey).getObjectValue().toString());
				if (retryCount > 5) {
					throw new LoginRetryException("尝试登录次数10分钟内超过五次，请10分钟后再尝试登录！");
				} else {
					retryCount ++;
					element = new Element(retryKey, retryCount);
					hostLoginRetryCache.put(element);

					User user = this.userRepository.findByTel(tel);
					if (user == null || StringUtils.isEmpty(user.getTel()))
//				throw new UnknownAccountException("手机号为：" + tel + " 的账户不存在！");
						throw new UnknownAccountException("用户名或密码错误");
					if (user.getPassword() == null || !user.getPassword().equals(password))
//				throw new IncorrectCredentialsException("密码错误");
						throw new IncorrectCredentialsException("用户名或密码错误");

					// 返回身份验证信息
					return new MallUserAccount(getName(), user);
				}

			} else {
				User user = this.userRepository.findByTel(tel);
				if (user == null || StringUtils.isEmpty(user.getTel()))
//				throw new UnknownAccountException("手机号为：" + tel + " 的账户不存在！");
					throw new UnknownAccountException("用户名或密码错误");
				if (user.getPassword() == null || !user.getPassword().equals(password))
//				throw new IncorrectCredentialsException("密码错误");
					throw new IncorrectCredentialsException("用户名或密码错误");

				// 返回身份验证信息
				return new MallUserAccount(getName(), user);
			}



		} catch (IncorrectCredentialsException exp) {
			throw exp;
		} catch (LockedAccountException exp) {
			throw exp;
		} catch (UnknownAccountException exp) {
			throw exp;
		} catch (LoginRetryException exp) {
			throw exp;
		} catch (DataAccessException exp) {
			exp.printStackTrace();
			throw new AuthenticationException("数据访问对象异常！", exp);
		} catch (RuntimeException exp) {
			exp.printStackTrace();
			throw new AuthenticationException("运行时异常！", exp);
		} catch (Exception exp) {
			exp.printStackTrace();
			throw new AuthenticationException("其他错误！", exp);
		}
		
	}
	
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(
			PrincipalCollection principals) {
		// TODO Auto-generated method stub
		return null;
	}
	
	/**
	 * 删除指定user的验证信息。
	 * @param user
	 */
	public void clearAuthenticationInfoForUser(User user) {
		// 因为TelPasswordToken用的key值是tel，所以这里也必须是tel，以后再改
		SimplePrincipalCollection spc = new SimplePrincipalCollection(user.getTel(), getName());
		super.clearCachedAuthenticationInfo(spc);
	}
}
