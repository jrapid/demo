<%@page import="java.io.File"%>
<%
	File[] files = new File(application.getRealPath("/jrapid-runtime/css")).listFiles();

	for (File f:files) {
		if (f.isFile() && f.getName().endsWith(".css")) {
			out.println(f.getName());
		}
		
	}


%>