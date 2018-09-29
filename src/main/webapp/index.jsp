<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- <jsp:forward page="BookController.do?act=ListBook"></jsp:forward> --%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<html>
<head>
<meta charset="utf-8">
<title>test</title> 
</head>
<body >
<form method ="POST" action="LoginController.do?act=login" name="frmLogin"  >
<fieldset>
<table style="width:933px;height: 412px;">
 <tr height="170">
 <td width="570px"> </td>
 <td> </td>
 </tr> 
 <tr>
<td> </td>        
<td>
<table>
 <tr>
 <td>用户名：</td>
 <td><input type="text" name="userName" value="admin" placeholder="Your name" size="20" maxlength="20" onfocus="if (this.value=='Your name')  this.value='';" /></td>
 <td > </td>
 <td> </td>
 </tr>
 <tr>
 <td>密  码：</td>
 <td><input type="password" name="userPD" value="123456" placeholder="Your password" size="20" maxlength="20" onfocus="if (this.value=='Your password')  this.value='';" /></td>
 <td> </td>
 <td> </td>
 </tr>
 <tr>
 <td colspan="4"> <p style="color: red">${message}</p></td>
 </tr>
 <tr>
 <td><input type="checkbox" name="zlogin" value="1">自动登录</td>
 </tr>
 </table>
 </td>
  <tr>
  <td> </td>   
  <td><table>
   <tr>
  <td><input type="submit" name="login" value="登录" onClick="return validateLogin()"/></td>
  </tr>
 </table>
 </td>
 </table>
</fieldset>
</form>
<script>
  function validateLogin(){
    var sUserName = document.frmLogin.userName.value ;
    var sPassword = document.frmLogin.userPD.value ;
    if ((sUserName =="") || (sUserName=="Your name")){
     alert("请输入用户名!");
     return false ;
    }
     
    if ((sPassword =="") || (sPassword=="Your password")){
     alert("请输入密码!");
     return false ;
    }
   } 
  </script>
  <script type="text/javascript" charset="utf-8" src="js/data.js"></script>
  <script type="text/javascript" charset="utf-8" src="js/datacaculate.js"></script>
</body>
</html>
