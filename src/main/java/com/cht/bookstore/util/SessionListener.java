package com.cht.bookstore.util;

import java.util.Hashtable;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.cht.bookstore.entity.User;

/**
 * 登录 session监听
 * 
 * @author 创建作者 : LY
 * @date 创建时间 ：2018年5月17日 下午12:01:40
 */
public class SessionListener implements HttpSessionListener {
	/**
	 * 该HashMap以用户名-HttpSession对象存储一个账号只能被一个人登陆的信息。
	 */
	public static Hashtable<String, HttpSession> sessionMap = new Hashtable<String, HttpSession>();

	@SuppressWarnings("unused")
	@Override
	public void sessionCreated(HttpSessionEvent httpSessionEvent) {
		HttpSession session = httpSessionEvent.getSession();
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {

		HttpSession session = httpSessionEvent.getSession();
//		System.out.println("移除session:"+session);
		delSession(session);
	}

	private synchronized void delSession(HttpSession session) {
		if (session != null) {
			// 删除单一登录中记录的变量
			if (session.getAttribute("users") != null) {
				User user = (User) session.getAttribute("users");
				SessionListener.sessionMap.remove(user.getUserName());
			}
		}
	}
}
