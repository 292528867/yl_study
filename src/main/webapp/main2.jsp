<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>电池监控平台</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<!-- EXTJS基础CSS -->
	<link rel="stylesheet" type="text/css" href="./jscomponent/extjs/desktop/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="./jscomponent/extjs/desktop/css/desktop.css" />
	
	<!-- EXTJS基础JS -->
	<script type="text/javascript" src="./jscomponent/extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="./jscomponent/extjs/ext-lang-zh_CN.js"></script>
	
	<!-- 扩展JS -->
	<script type="text/javascript" src="./jscomponent/extjs/ux/form/SearchField.js"></script>
	<script type="text/javascript" src="./modules/sys/SearchFieldFix.js"></script>
	<script type="text/javascript" src="./jscomponent/extjs/ux/ProgressBarPager.js"></script>
	<script type="text/javascript" src="./jscomponent/extjs/ux/data/PagingMemoryProxy.js"></script>
	<script type="text/javascript" src="./jscomponent/extjs/ux/Notification.js"></script>
	
	<!-- desktop core js -->
	<script type="text/javascript" src="./js/core/Module.js"></script>
	<script type="text/javascript" src="./js/core/Video.js"></script>
	<script type="text/javascript" src="./js/core/Wallpaper.js"></script>
	<script type="text/javascript" src="./js/core/FitAllLayout.js"></script>
	<script type="text/javascript" src="./js/core/StartMenu.js"></script>
	<script type="text/javascript" src="./js/core/TaskBar.js"></script>
	<script type="text/javascript" src="./js/core/ShortcutModel.js"></script>
	<script type="text/javascript" src="./js/core/Desktop.js"></script>
	<script type="text/javascript" src="./js/core/App.js"></script>
	<!-- desktop module js -->
	<!-- 注意这边先注释掉，否则会报ext js  Missing required class BogusModule类似的错误，以后用到的话，必须在app.js里一起实例化，否则也报错
	<script type="text/javascript" src="./modules/BogusMenuModule.js"></script>
	<script type="text/javascript" src="./modules/BogusModule.js"></script>
	 -->
	<script type="text/javascript" src="./modules/Notepad.js"></script>
	<script type="text/javascript" src="./modules/SystemStatus.js"></script>
	<script type="text/javascript" src="./modules/TabWindow.js"></script>
	<script type="text/javascript" src="./modules/VideoWindow.js"></script>
	<script type="text/javascript" src="./modules/WallpaperModel.js"></script>
	
	<!-- 自定义的module -->
	<script type="text/javascript" src="./modules/sys/SysBatteryBusInfo.js"></script>
	<script type="text/javascript" src="./modules/sys/SysOrganization.js"></script>
	<script type="text/javascript" src="./modules/sys/SysRole.js"></script>
	<script type="text/javascript" src="./modules/sys/SysResource.js"></script>
	<script type="text/javascript" src="./modules/sys/SysPermission.js"></script>
	<script type="text/javascript" src="./modules/sys/SysAlterPassword.js"></script>
	<script type="text/javascript" src="./modules/TableMonitorWindow.js"></script>
	<script type="text/javascript" src="./modules/SystemMonitor.js"></script>
	<script type="text/javascript" src="./modules/MonitorMap.js"></script>

	<!-- desktop setting js -->
	<script type="text/javascript" src="./jscomponent/extjs/desktop/Settings.js"></script>
	
	<!-- 百度地图API js -->
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=5es2reHA61bVDpz1Eg1GUe4t"></script>
	
	
	<!-- 引用 MyDesktop.App 定义 -->
	<script type="text/javascript">
		<jsp:include page="/WEB-INF/jsp/commons/desktopmodule.jsp"></jsp:include>
	</script>
	
	<script type="text/javascript">
		Ext.Loader.setConfig({
			enabled:true
		});

		var myDesktopApp;
		/*
		Ext.Loader.setPath({
			// 'Ext.ux.form' : 'http://localhost:8088/jscomponent/extjs/ux/form', // 动态加载ext的扩展组件，设定目录，貌似跨域，不可以
			'Ext.ux.desktop':'js', 
			MyDesktop:''
		});
		Ext.require('MyDesktop.App');
		*/

		Ext.onReady(function(){
			myDesktopApp=new MyDesktop.App();
		});
	</script>

	

  </head>
  
  <body>
	<input type="hidden" id="adminuserId" value="">
	<input type="hidden" id="adminrealname" value="${username}">
	
	<form id="logoutform" action="web/security/sysMC/logoutpre" method="get" target="_self">
	</form>
  </body>
</html>
