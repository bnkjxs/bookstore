package com.cht.bookstore.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cht.bookstore.entity.User;
import com.cht.bookstore.mapper.UserMapper;

/**
 * 
 * 用户管理Service类
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月9日
 */
@Service
public class UserService {
	
	@Autowired
	private UserMapper userMapper;
	
	/**
	 * 查询所有用户
	 * @return
	 */
	public List<User> getUsers(){
		return userMapper.getUsers();
	}
	
	/**
	 * 根据用户账号查询用户
	 * @return
	 */
	public User getUserByName(String name){
		return userMapper.getUserByName(name);
	}
	
	/**
	 * 新增用户
	 * @param user
	 * @return
	 */
	public int addUser(User user){
		return userMapper.addUser(user);
	}
		
	/**
	 * 修改用户
	 * @param user
	 * @return
	 */
	public int updateUser(User user){
		return userMapper.updateUser(user);
	}
	
	/**
	 * 删除用户
	 * @param user
	 * @return
	 */
	public int deleteUser(User user){
		return userMapper.deleteUser(user);
	}
}
