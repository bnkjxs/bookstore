package com.cht.bookstore.entity;

import java.io.Serializable;

/**
 * 用户的实体类
 */
public class User implements Serializable{

	private static final long serialVersionUID = 1L;

	private String sessionId;
	
	private Integer id;// 用户ID

	private String userName;// 用户名字

	private String userPD;// 用户密码

	private String userJobNum;// 用户工号

	private String userTel;// 用户电话号码

	private String userState;// 用户登录状态

	private int companyId;//公司编号
	
	private int roleId;//角色编号

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	/**
	 * 推送状态 1推送 0未推送
	 */
	private int pushState;

	/**
	 * 序号
	 */
	private int number;

	/**
	 * 推送 表ID
	 */
	private int pushID;

	private String sessionID;

	public String getSessionID() {
		return sessionID;
	}

	public void setSessionID(String sessionID) {
		this.sessionID = sessionID;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserPD() {
		return userPD;
	}

	public void setUserPD(String userPD) {
		this.userPD = userPD;
	}

	public String getUserJobNum() {
		return userJobNum;
	}

	public void setUserJobNum(String userJobNum) {
		this.userJobNum = userJobNum;
	}

	public String getUserTel() {
		return userTel;
	}

	public void setUserTel(String userTel) {
		this.userTel = userTel;
	}

	public String getUserState() {
		return userState;
	}

	public void setUserState(String userState) {
		this.userState = userState;
	}

	public int getPushState() {
		return pushState;
	}

	public void setPushState(int pushState) {
		this.pushState = pushState;
	}

	public int getPushID() {
		return pushID;
	}

	public void setPushID(int pushID) {
		this.pushID = pushID;
	}

	public int getCompanyId() {
		return companyId;
	}

	public void setCompanyId(int companyId) {
		this.companyId = companyId;
	}

	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	@Override
	public String toString() {
		return "UserEntity [userName=" + userName + ", sessionID=" + sessionID + "]";
	}
}
