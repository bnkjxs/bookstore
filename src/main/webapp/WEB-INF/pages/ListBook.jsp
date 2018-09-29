<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="css/main.css" type="text/css" rel="stylesheet" />
<script src="jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
<title>图书管理</title>
</head>
<body>
    <div class="main">
        <h2 class="title"><span>图书管理</span></h2>
        <p><span>用户：${user.userName}</span></p>
        <form action="BookController.do?act=Deletes" method="post">
        <table border="1" width="100%" class="tab">
            <tr>
                <th><input type="checkbox" id="chbAll"></th>
                <th>编号</th>
                <th>书名</th>
                <th>价格</th>
                <th>出版日期</th>
                <th>操作</th>
            </tr>
            <c:forEach var="book" items="${books}">
                <tr>
                    <th><input type="checkbox" name="ids" value="${book.id}"></th>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.price}</td>
                    <td><fmt:formatDate value="${book.publishDate}" pattern="yyyy年MM月dd日"/></td>
                    <td>
                    <a href="BookController.do?act=Delete&id=${book.id}" class="abtn">删除</a>
                    <a href="BookController.do?act=EditBook&id=${book.id}" class="abtn">编辑</a>
                    </td>
                </tr>
            </c:forEach>
        </table>
        <p style="color: red">${message}</p>
        <p>
            <a href="BookController.do?act=AddBook" class="abtn">添加</a>
            <input type="submit"  value="删除选择项" class="btn"/>
        </p>
    </form>
    </div>
    <div id="websocketTest">
    	<div style="width: 600px;height: 400px;overflow-x: hidden;overflow-y: auto;margin-left: 50px;">
    		<ul id="chetPanel"></ul>
    	</div>
		<div>
			<input id="chetInput" type="text" style="width: 500px;margin-left: 50px;"><input type="button" value="发送" style="margin-left: 10px;" onclick="sendMessage();">
		</div>
    </div>
    <script type="text/javascript">
//    	/* var websocket = new WebSocket("ws://localhost:9600/bookstore/websocket/test"); */
    	var websocket = new WebSocket("ws://localhost:9600/bookstore/websocket/test/小白");
    	websocket.onmessage = function(event){
    		if(event.data != "#"){
	    		$("#chetPanel").append("<li>" + event.data + "</li>");
    		}
    	}
    	
    	 websocket.onerror = function () {
    		 console.log("WebSocket连接发生错误");
    	 }

    	 websocket.onopen  = function () {
    		 console.log("WebSocket连接成功");
    		 websocket.send("WebSocket连接成功");
    	 }
    	 
    	 websocket.onclose = function () {
    		 console.log("WebSocket连接关闭");
    	 }
    	 
    	 window.onbeforeunload = function () {
    		 websocket.close();
    	 }
    	 
    	function sendMessage(){
    		var msg = $("#chetInput").val();
    		console.log(msg);
    		websocket.send(msg);
    	}
    </script>
</body>
</html>