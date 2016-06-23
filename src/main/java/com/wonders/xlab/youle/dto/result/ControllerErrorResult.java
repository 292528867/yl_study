package com.wonders.xlab.youle.dto.result;

/**
 * 控制器返回result。
 * @author xu
 *
 */
public class ControllerErrorResult {
	private Integer ret_code;
	private String message;

	public Integer getRet_code() {
		return ret_code;
	}

	public ControllerErrorResult setRet_code(Integer ret_code) {
		this.ret_code = ret_code;
		return this;
	}

	public String getMessage() {
		return message;
	}

	public ControllerErrorResult setMessage(String message) {
		this.message = message;
		return this;
	}
}
