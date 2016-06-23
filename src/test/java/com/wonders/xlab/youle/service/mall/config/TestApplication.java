package com.wonders.xlab.youle.service.mall.config;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.wonders.xlab.framework.repository.MyRepositoryFactoryBean;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = {"com.wonders.xlab.youle.repository"}, 
	repositoryFactoryBeanClass = MyRepositoryFactoryBean.class)
@EntityScan(value = {"com.wonders.xlab.youle.entity"})
@ComponentScan(value = {"com.wonders.xlab.youle.service.mall"})
public class TestApplication {

}
