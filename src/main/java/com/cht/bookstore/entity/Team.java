package com.cht.bookstore.entity;

/**
 * 公司表
 * 
 * @author Admin
 */
public class Team {

	private int number;

	private int id;

	private String teamName; // 公司名称

	private String teamNote; // 公司描述

	private Integer teamParentID;

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTeamName() {
		return teamName;
	}

	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}

	public String getTeamNote() {
		return teamNote;
	}

	public void setTeamNote(String teamNote) {
		this.teamNote = teamNote;
	}

	public Integer getTeamParentID() {
		return teamParentID;
	}

	public void setTeamParentID(Integer teamParentID) {
		this.teamParentID = teamParentID;
	}

	@Override
	public String toString() {
		return "TeamEntity [id=" + id + ", teamName=" + teamName + ", teamNote=" + teamNote + ", teamParentID="
				+ teamParentID + "]";
	}

	// private TeamEntity parentTeam;

}
