package com.cht.bookstore.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cht.bookstore.entity.User;
import com.cht.bookstore.service.UserService;
import com.cht.bookstore.util.MD5Util;

@Controller
public class UserController {
	
	@Autowired
	private UserService userService;
	
	/**
	 * 查询所有用户
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/manage_user_getusers",method = RequestMethod.POST)
	public Map<String, Object> getUsers(){
		String msg = "操作失败";
		List<User> users = new ArrayList<>();
		
		try {
			users = userService.getUsers();
			msg = "操作成功";
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("msg", msg);
		result.put("users", users);
		return result;
	}
	
	/**
	 * 根据用户账号查询用户
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/manage_user_getuserbyname",method = RequestMethod.POST)
	public Map<String, Object> getUserByName(String userName){
		String msg = "操作失败";
		User user = null;
		
		try {
			user = userService.getUserByName(userName);
			msg = "操作成功";
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("msg", msg);
		result.put("user", user);
		return result;
	}
	
	/**
	 * 新增用户
	 * @param user
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/manage_user_add",method = RequestMethod.POST)
	public Map<String, Object> addUser(User user){
		String msg = "操作失败";
		try {
			if(userService.getUserByName(user.getUserName()) == null){
				user.setUserPD(MD5Util.MD5(user.getUserPD()));
				userService.addUser(user);
				msg = "操作成功";
			} else{
				msg = "操作失败，用户已存在";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("msg", msg);
		return result;
	}
		
	/**
	 * 修改用户
	 * @param user
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/manage_user_update",method = RequestMethod.POST)
	public Map<String, Object> updateUser(User user){
		String msg = "操作失败";
		
		try {
			if(userService.getUserByName(user.getUserName()) != null){
				Integer userId = userService.getUserByName(user.getUserName()).getId();
				user.setId(userId);
				user.setUserPD(MD5Util.MD5(user.getUserPD()));
				userService.updateUser(user);
				msg = "操作成功";
			} else{
				msg = "操作失败，用户不存在";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("msg", msg);
		return result;
	}
	
	/**
	 * 删除用户
	 * @param user
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/manage_user_delete",method = RequestMethod.POST)
	public Map<String, Object> deleteUser(String ids){
		String msg = "操作失败";
		
		try {
			String[] idsArr = ids.split(",");
			for (int i = 0; i < idsArr.length; i++) {
				int id = Integer.parseInt(idsArr[i]);
				User user = new User();
				user.setId(id);
				userService.deleteUser(user);
			}
			msg = "操作成功";
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("msg", msg);
		return result;
	}
}
