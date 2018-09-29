package com.cht.bookstore.action;

import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.cht.bookstore.entity.User;
import com.cht.bookstore.service.UserService;
import com.cht.bookstore.util.CtxUtil;
import com.cht.bookstore.util.SessionListener;

/**
 * 
 * 登录控制器
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月9日
 */
@WebServlet("/LoginController.do")
public class LoginController extends BaseController{
	
	private static final long serialVersionUID = 1L;
	
	private UserService userService;
	
	@Override
    public void init() throws ServletException {
		userService = CtxUtil.getBean(UserService.class);
    }
	
	//登录Action
	@SuppressWarnings("unchecked")
	public String login(HttpServletRequest request, HttpServletResponse response){
		String userName = request.getParameter("userName");
		String userPD = request.getParameter("userPD");
		
		if(userName == null || "".equals(userName)){
			request.setAttribute("message","输入用户名不能为空!");
			 return "/login.jsp";
		}

		if(userPD == null || "".equals(userPD)){
			request.setAttribute("message","输入密码不能为空!");
			return "/login.jsp";
		}
		
		User user = userService.getUserByName(userName);
		if(user == null){
			 request.setAttribute("message","用户不存在!");
			 return "/index.jsp";
		} 
		else if(!userPD.equals(user.getUserPD())){
			 request.setAttribute("message","密码错误!");
			 return "/index.jsp";
		}
		
		HttpSession session = request.getSession();
		String sessionID = session.getId();
		user.setSessionID(session.getId());
		
		Map<String, HttpSession> ssns = SessionListener.sessionMap;
		
		HttpSession ssn = ssns.get(userName);
		if(user != null && ssn != null && !sessionID.equals(ssn.getId())){
			request.setAttribute("message","用户已在其他地方登录!");
			return "/index.jsp";
		}
		else {
			request.setAttribute("user",user);
			ssns.put(userName, session);
			return "/BookController.do?act=ListBook";
		}
	}
}
