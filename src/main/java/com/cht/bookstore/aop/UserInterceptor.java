package com.cht.bookstore.aop;

import java.io.IOException;
import java.io.OutputStreamWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.cht.bookstore.entity.User;
import com.cht.bookstore.util.SessionListener;


/** 
 * 用户登录session监听器
 * @author 创建作者 : LY
 * @date   创建时间 ：2018年6月20日 上午10:21:35
 */
public class UserInterceptor extends HandlerInterceptorAdapter {
	Logger logger = Logger.getLogger(UserInterceptor.class);
	// @Override
	// public boolean preHandle(HttpServletRequest request, HttpServletResponse
	// response, Object handler)throws Exception {
	// return true;
	// }

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		System.out.println("========登录验证开始...");
		String requestURI = request.getRequestURI();
		// System.out.println("requestURI:" + requestURI);
		String urlSessionID = request.getSession().getId();
		// 访问路径中如果包含了'.' 证明是静态文件 和 平板访问接口 直接放行 不需要拦截 不包含的证明为PC网页访问接口
		if (!requestURI.contains(".")) {
			User user = (User) request.getSession().getAttribute("user");

			if (user == null && StringUtils.isEmpty(user)) {
//				try {
					// response.sendRedirect("/login/loginJump");
//					request.getRequestDispatcher("/login/loginJump").include(request, response);
					String msg = "由于您长时间没有操作，登录信息已过期，请重新登录！";
					toAlert(response,msg);
					return false;
					// request.getRequestDispatcher("/login.jsp").forward(request, response);
//				} catch (Exception e) {
//					e.printStackTrace();
//					return false;
//				}

			} else {
				HttpSession httpSession = SessionListener.sessionMap.get(user.getUserName());
				if (httpSession != null && urlSessionID.equals(httpSession.getId())) {
					// && userEntity != null && !StringUtils.isEmpty(userEntity)
					System.out.println("通过登录验证拦截，继续...");
					return true;
				} else {
//					try {
						// request.getRequestDispatcher("/login.jsp").forward(request, response);
						// 重定向到new.jsp
//						response.sendRedirect("/OneOperationGAS/login.jsp");
						String msg = "由于您已在其它地方登陆，本地被迫下线，请重新登录！";
						toAlert(response,msg);
						
//					} catch (IOException e) {
//						logger.error(e.getMessage());
//						e.printStackTrace();
//					}
					return false;
				}

			}

		} else {
			System.out.println("通过登录验证拦截，继续...");
			return true;
		}
	}

	// 前台弹出alert框
	public void toAlert(HttpServletResponse response,String msg) {

		try {
			response.setContentType("text/html;charset=UTF-8");
			response.setCharacterEncoding("UTF-8");

			OutputStreamWriter out = new OutputStreamWriter(response.getOutputStream());

			msg = new String(msg.getBytes("UTF-8"));

			out.write("<meta http-equiv='Content-Type' content='text/html';charset='UTF-8'>");
			out.write("<script>");
			out.write("alert('" + msg + "');");
			out.write("setTimeout(func,\"500\");");
			out.write("function func(){top.location.href = '/OneOperationGAS/login.jsp'}; ");
			out.write("</script>");
			out.flush();
			out.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
