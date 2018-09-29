package com.cht.bookstore.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cht.bookstore.entity.Book;
import com.cht.bookstore.mapper.BookMapper;

/**
 * 
 * 图书管理服务层
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月5日
 */
@Service
public class BookService {
	
	@Autowired
	private BookMapper bookMapper;
	
	 /**
     * 获得所有图书
     */
    public List<Book> getAllBooks(){
    	return bookMapper.getAllBooks();
    }
    
    
    /**
     * 根据图书编号获得图书对象
     */
    public Book getBookById(int id){
    	return bookMapper.getBookById(id);
    }
    
    /**
     * 添加图书
     */
    public int add(Book entity){
    	return bookMapper.add(entity);
    }
    
    /**
     * 批量添加图书
     */
    public int addBatchs(List<Book> books){
    	return bookMapper.addBatchs(books);
    }
    
    /**
     * 更新图书
     */
    public int update(Book entity){
    	return bookMapper.update(entity);
    }
    
    /**
     * 根据图书编号删除图书
     */
    public int delete(int id){
    	return bookMapper.delete(id);
    }
    
    /**
     * 批量根据图书编号删除图书
     */
    public int deleteBatchs(int[] ids){
    	return bookMapper.deleteBatchs(ids);
    }
    
    /**
     * 根据图书编号删除图书
     */
    public int deleteAll(String[] ids){
    	int num = 0;
    	for (String id : ids) {
    		if(id != null && "".equals(id)){
    			num += bookMapper.delete(Integer.parseInt(id));
    		}
		}
    	return num;
    }
}
