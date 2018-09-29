package com.cht.bookstore.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cht.bookstore.entity.User;

/**
 * 
 * 用户映射接口
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月9日
 */
public interface UserMapper {
	/**
	 * 查询所有用户
	 * @return
	 */
	public List<User> getUsers();
	
	/**
	 * 根据用户账号查询用户
	 * @return
	 */
	public User getUserByName(@Param("name")String name);
	
	/**
	 * 新增用户
	 * @param user
	 * @return
	 */
	public int addUser(User user);
		
	/**
	 * 修改用户
	 * @param user
	 * @return
	 */
	public int updateUser(User user);
	
	/**
	 * 删除用户
	 * @param user
	 * @return
	 */
	public int deleteUser(User user);
}
