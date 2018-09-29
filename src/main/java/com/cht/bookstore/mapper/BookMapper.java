package com.cht.bookstore.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cht.bookstore.entity.Book;

/**
 * 
 * 图书映射接口
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月5日
 */
public interface BookMapper {
	 /**
     * 获得所有图书
     */
    public List<Book> getAllBooks();
 
    /**
     * 根据图书编号获得图书对象
     */
    public Book getBookById(@Param("id") int id);
    
    /**
     * 添加图书
     */
    public int add(Book entity);

    /**
     * 批量添加图书
     */
    public int addBatchs(@Param("books")List<Book> books);
    
    /**
     * 更新图书
     */
    public int update(Book entity);
    
    /**
     * 根据图书编号删除图书
     */
    public int delete(int id);
    
    /**
     * 批量根据图书编号删除图书
     */
    public int deleteBatchs(@Param("ids")int[] ids);
}
