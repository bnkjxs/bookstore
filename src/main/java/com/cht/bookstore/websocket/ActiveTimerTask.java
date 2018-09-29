package com.cht.bookstore.websocket;

import java.util.TimerTask;

public class ActiveTimerTask extends TimerTask{
	
	public void run(){
		WebSocketTest.sendMessage("#");
	}
}
