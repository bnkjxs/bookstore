package com.cht.bookstore.entity;

import java.util.Date;

/**
 * 角色表
 * 
 * @author Admin
 *
 */
public class Role {

	private Integer id;

	private String roleName;// 角色名称

	private String roleNote;// 角色信息,介绍

	private Date creatTime;

	public Date getCreatTime() {
		return creatTime;
	}

	public void setCreatTime(Date creatTime) {
		this.creatTime = creatTime;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getRoleNote() {
		return roleNote;
	}

	public void setRoleNote(String roleNote) {
		this.roleNote = roleNote;
	}

	public Role() {
		super();
	}

	public Role(Integer id, String roleName, String roleNote, Date creatTime) {
		super();
		this.id = id;
		this.roleName = roleName;
		this.roleNote = roleNote;
		this.creatTime = creatTime;
	}

	@Override
	public String toString() {
		return "RoleEntity [id=" + id + ", roleName=" + roleName + ", roleNote=" + roleNote + ", creatTime=" + creatTime
				+ "]";
	}

}
