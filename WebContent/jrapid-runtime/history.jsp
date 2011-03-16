<%@page import="com.jrapid.dao.hibernate.HibernateUtil"%>
<%@page import="com.jrapid.controller.Session"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.sql.Connection"%>
<%@page import="java.sql.PreparedStatement"%>
<%
	Connection conn = HibernateUtil.getSession().connection();
	PreparedStatement stmt = conn.prepareStatement("SELECT auditdate, username, actionname, '' AS oldvalue , '' AS newvalue FROM auditentity WHERE entity = ? AND rowid = ? " +
				"UNION ALL SELECT auditdate, username, property, oldvalue, newvalue FROM auditproperty WHERE entity = ? AND rowid = ? ORDER BY auditdate DESC");
	stmt.setString(1, request.getParameter("entity"));
	stmt.setString(2, request.getParameter("id"));
	stmt.setString(3, request.getParameter("entity"));
	stmt.setString(4, request.getParameter("id"));
	ResultSet r = stmt.executeQuery();
%>
<html>
	<head>
		<title>History</title>
		<link rel="stylesheet" type="text/css" href="css/jrapid-tags.css"/>
	</head>
	<body>	
		<table id="history" border="0">
			<thead>
				<th class="history">Date</th>
				<th class="history">User</th>
				<th class="history">Action</th>
				<th class="history">From</th>
				<th class="history">To</th>
			</thead>
			<% while (r.next()) { %>
				<tr>
					<td><%=r.getTimestamp("auditdate") %></td>
					<td><%=r.getString("username") %></td>
					<td><%=r.getString("actionname") %></td>
					<td><%=r.getString("oldvalue") %></td>
					<td><%=r.getString("newvalue") %></td>
				</tr>
			<% } r.close(); %>
		</table>	
	</body>
</html>