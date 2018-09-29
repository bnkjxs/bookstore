package com.cht.bookstore.websocket;

import java.util.Timer;

import javax.servlet.http.HttpServlet;

public class ActiveStart extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public void init(){
		System.out.println("------------------启动心跳推送--------------------");
		ActiveTimerTask timerTask = new ActiveTimerTask();
		Timer timer = new Timer();
		timer.schedule(timerTask, 3000, 3000);
	}
}
