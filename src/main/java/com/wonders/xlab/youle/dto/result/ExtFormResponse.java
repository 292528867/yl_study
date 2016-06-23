package com.wonders.xlab.youle.dto.result;

/**
 * Ext4 form提交（即action操作）返回格式。
 * @author user
 *
 */
public class ExtFormResponse {
	private boolean success;
	private String msg;
	public boolean isSuccess() {
		return success;
	}
	public ExtFormResponse setSuccess(boolean success) {
		this.success = success;
		return this;
	}
	public String getMsg() {
		return msg;
	}
	public ExtFormResponse setMsg(String msg) {
		this.msg = msg;
		return this;
	}	
}
