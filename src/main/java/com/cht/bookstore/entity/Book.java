package com.cht.bookstore.entity;

import java.util.Date;

/**
 * 
 * 图书实体
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月5日
 */
public class Book {
	/**
	 * 编号
	 */
	private int id;
	
	/**
	 * 书名
	 */
	private String title;
	
	/**
	 * 价格
	 */
	private double price;
	
	/**
	 * 出版日期
	 */
	private Date publishDate;
	
	public Book(){}
	public Book(int id, String title, double price,Date punishDate){
		this.id = id;
		this.title = title;
		this.price = price;
		this.publishDate = punishDate;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public Date getPublishDate() {
		return publishDate;
	}

	public void setPublishDate(Date publishDate) {
		this.publishDate = publishDate;
	}
}
