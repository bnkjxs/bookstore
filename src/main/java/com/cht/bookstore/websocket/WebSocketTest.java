package com.cht.bookstore.websocket;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/websocket/test/{param}")
public class WebSocketTest {
	//连接对象
	public static CopyOnWriteArraySet<WebSocketTest> sets = new CopyOnWriteArraySet<>();

	//在线数
	private static int onlineCount = 0;
	
	//会话
	private Session session;
	
	//进入
	@OnOpen
	public void onOpen(@PathParam(value="param")String param ,Session session){
		this.session = session;
		WebSocketTest.addOnlineCount(this);
		
		System.out.println("params:"+param);
		System.out.println("有SessionID为"+session.getId()+"的新连接加入！当前在线人数为" + getOnlineCount());
	}
	
	//退出
	@OnClose
	public void onClose(){
		String id = this.session.getId();
		WebSocketTest.subOnlineCount(this);
		System.out.println("有SessionID为"+id+"的连接退出！当前在线人数为" + getOnlineCount());
	}
	
	//错误
	@OnError
	public void onError(Session session,Throwable error){
		System.out.println("发生错误！");
		error.printStackTrace();
	}
	
	@OnMessage
	public void OnMessage(String message,Session session) throws IOException{
		String msg = "收到来自SessionID为"+session.getId()+"消息: "+ message;
		WebSocketTest.sendMessage(msg);
	}
	
	//发送消息
	public static synchronized void sendMessage(String msg){
		Set<WebSocketTest> removeList = new HashSet<>();
		for (WebSocketTest webSocketTest : WebSocketTest.sets) {
			try {
				webSocketTest.session.getBasicRemote().sendText(msg);
			} catch (Exception e) {
				removeList.add(webSocketTest);
			}
		}
		
		for (WebSocketTest webSocketTest : removeList) {
			WebSocketTest.subOnlineCount(webSocketTest);
		}
	}
	
	//获取在线连接数
	public static synchronized int getOnlineCount() {
		return onlineCount;
	}

	//新增在线连接数
	public static synchronized void addOnlineCount(WebSocketTest webSocketTest) {
		WebSocketTest.sets.add(webSocketTest);
		onlineCount++;
	}

	//删除在线连接数
	public static synchronized void subOnlineCount(WebSocketTest webSocketTest) {
		WebSocketTest.sets.remove(webSocketTest);
		onlineCount--;
	}
}
