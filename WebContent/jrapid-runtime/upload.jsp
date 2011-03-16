<% response.setHeader("Cache-Control", "max-age=3600"); %>
<html>
	<head>
		<title>Upload files</title>
	</head>
	<body style="font-family: tahoma; font-size: 11px;">
		<form action="../upload/<%=p(request, "entity")%>" 
			id="form" method="post" enctype="multipart/form-data">
			<fieldset>
				<legend>Selected file</legend>
				<input name="file" type="file" class="textbox" style="width: 360px;" onchange="document.getElementById('form').submit();" />
			</fieldset>
			<input name="width" type="hidden" value="<%=p(request, "width")%>" />
			<input name="height" type="hidden" value="<%=p(request, "height")%>" />				
		</form>
		
	</body>
</html>
<%!
	String p(HttpServletRequest r, String n) {
		String s = r.getParameter(n);
		return s == null ? "" : s.replace('<', ' ');
	}
%>