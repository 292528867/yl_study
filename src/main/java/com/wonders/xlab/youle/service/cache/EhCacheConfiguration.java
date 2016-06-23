package com.wonders.xlab.youle.service.cache;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.config.PersistenceConfiguration;
import net.sf.ehcache.config.PersistenceConfiguration.Strategy;
import net.sf.ehcache.store.MemoryStoreEvictionPolicy;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * EhCache配置。
 * @author xu
 */
@Configuration
public class EhCacheConfiguration {
    @Bean
    public CacheManager ehcacheManager() {
        // 使用默认 ehcache-failsafe.xml 配置，配置一个单例缓存管理器
    	CacheManager cm = CacheManager.create();

    	// 定义shiro内部使用的缓存，这部分缓存暂时不需要暴露到外部（以bean的形式）
    	// 1、创建shiroCache缓存，这个貌似是全局的
    	Cache shiroCache = new Cache(
                new CacheConfiguration(
                        "shiroCache", // 缓存名
                        1000 // 缓存最大个数
                )
                .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.FIFO) // 当缓存满时，使用先进先出清理内存
                .eternal(false) // 对象是否永久有效
                .timeToIdleSeconds(120) // 对象失效前允许的闲置时间， 0，闲置时间无穷大
                .timeToLiveSeconds(120) // 对象的失效时间，这里设置失效时间 120秒
                .diskExpiryThreadIntervalSeconds(120) // 10秒间隔检测 idle 和 live状态
                .persistence(new PersistenceConfiguration().strategy(Strategy.NONE)) // 当缓存满了，或者重启时，不持久化数据
        );
        cm.addCache(shiroCache); // 必须加入缓存，不要忘了
        // 2、创建authentication缓存，在自定义的realm中名字定义为myAuthenticationCache
        Cache myAuthenticationCache = new Cache(
                new CacheConfiguration(
                        "myAuthenticationCache", // 这个是默认session的缓存
                        10000 // 缓存最大个数
                )
                .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.FIFO) // 当缓存满时，使用先进先出清理内存
                .eternal(true) // 对象永久有效
                .persistence(new PersistenceConfiguration().strategy(Strategy.NONE)) // 当缓存满了，或者重启时，不持久化数据
        );
        cm.addCache(myAuthenticationCache); // 必须加入缓存，不要忘了
        // 3、创建authorization缓存，在自定义的realm中名字定义为myAuthorizationCache
        Cache myAuthorizationCache = new Cache(
                new CacheConfiguration(
                        "myAuthorizationCache", // 这个是默认session的缓存
                        10000 // 缓存最大个数
                )
                .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.FIFO) // 当缓存满时，使用先进先出清理内存
                .eternal(true) // 对象永久有效
                .persistence(new PersistenceConfiguration().strategy(Strategy.NONE)) // 当缓存满了，或者重启时，不持久化数据
        );
        cm.addCache(myAuthorizationCache); // 必须加入缓存，不要忘了
        // 4、创建session缓存，默认名字定义为shiro-activeSessionCache
        Cache shiro_activeSessionCache = new Cache(
                new CacheConfiguration(
                        "shiro-activeSessionCache", // 这个是默认session的缓存
                        10000 // 缓存最大个数
                )
                .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.FIFO) // 当缓存满时，使用先进先出清理内存
                .eternal(true) // 对象是否永久有效
                .persistence(new PersistenceConfiguration().strategy(Strategy.NONE)) // 当缓存满了，或者重启时，持久化数据到磁盘
                .maxEntriesLocalDisk(0) // 磁盘中最大缓存对象数，0表示无限大
        );
        cm.addCache(shiro_activeSessionCache); // 必须加入缓存，不要忘了

        return cm;
    }

    @Bean(name = "hostLoginRetryCache")
    public Cache hostLoginRetryCache(CacheManager ehcacheManager) {
        // 创建用户验证编码缓存
        Cache cache = new Cache(
                new CacheConfiguration(
                        "hostLoginRetryCache", // 缓存名
                        5000 // 缓存最大个数
                )
                .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.FIFO) // 当缓存满时，使用先进先出清理内存
                .eternal(false) // 对象是否永久有效
                .timeToIdleSeconds(0) // 对象失效前允许的闲置时间， 0，闲置时间无穷大
                .timeToLiveSeconds(10 * 60) // 对象的失效时间，这里设置失效时间 10分钟
                .diskExpiryThreadIntervalSeconds(10) // 10秒间隔检测 idle 和 live状态
                .persistence(new PersistenceConfiguration().strategy(Strategy.LOCALTEMPSWAP)) // 当缓存满了，或者重启时，不持久化数据
        );
        ehcacheManager.addCache(cache); // 必须加入缓存，不要忘了
        return cache;
    }

    @Bean(name = "hostSendCodeCache")
    public Cache hostSendCodeCache(CacheManager ehcacheManager) {
        // 创建用户验证编码缓存
        Cache cache = new Cache(
                new CacheConfiguration(
                        "hostSendCodeCache", // 缓存名
                        5000 // 缓存最大个数
                )
                        .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.FIFO) // 当缓存满时，使用先进先出清理内存
                        .eternal(false) // 对象是否永久有效
                        .timeToIdleSeconds(0) // 对象失效前允许的闲置时间， 0，闲置时间无穷大
                        .timeToLiveSeconds(10 * 60) // 对象的失效时间，这里设置失效时间 10分钟
                        .diskExpiryThreadIntervalSeconds(10) // 10秒间隔检测 idle 和 live状态
                        .persistence(new PersistenceConfiguration().strategy(Strategy.LOCALTEMPSWAP)) // 当缓存满了，或者重启时，不持久化数据
        );
        ehcacheManager.addCache(cache); // 必须加入缓存，不要忘了
        return cache;
    }
}
