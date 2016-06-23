package com.wonders.xlab.youle.service.mall;

import org.activiti.engine.*;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.activiti.spring.SpringProcessEngineConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

/**
 * activiti bpm配置。
 * @author xu
 *
 */
@Configuration
public class ActivitiConfiguration {
	@Autowired
	private DataSource dataSource;
	@Autowired
	private PlatformTransactionManager transactionManager;
	
	@Bean(name = "processEngineConfiguration")
	public SpringProcessEngineConfiguration getSpringProcessEngineConfiguration() {
		SpringProcessEngineConfiguration config = new SpringProcessEngineConfiguration();
		config.setHistory("full");
		config.setDataSource(dataSource);
		config.setTransactionManager(transactionManager);
		config.setJobExecutorActivate(false);
		config.setDatabaseSchemaUpdate("false");
		
		return config;
	}
	@Bean(name = "processEngine")
	public ProcessEngineFactoryBean getProcessEngineFactoryBean(SpringProcessEngineConfiguration processEngineConfiguration) {
		ProcessEngineFactoryBean fb = new ProcessEngineFactoryBean();
		fb.setProcessEngineConfiguration(processEngineConfiguration);
		return fb;
	}
	
	@Bean(name = "repositoryService")
	public RepositoryService getRepositoryService(ProcessEngine processEngine) {
		return processEngine.getRepositoryService();
	}
	@Bean(name = "runtimeService")
	public RuntimeService getRuntimeService(ProcessEngine processEngine) {
		return processEngine.getRuntimeService();
	}
	@Bean(name = "taskService")
	public TaskService getTaskService(ProcessEngine processEngine) {
		return processEngine.getTaskService();
	}
	@Bean(name = "historyService")
	public HistoryService getHistoryService(ProcessEngine processEngine) {
		return processEngine.getHistoryService();
	}
	@Bean(name = "managementService")
	public ManagementService getManagementService(ProcessEngine processEngine) {
		return processEngine.getManagementService();
	}
	@Bean(name = "formService")
	public FormService getFormService(ProcessEngine processEngine) {
		return processEngine.getFormService();
	}
}
