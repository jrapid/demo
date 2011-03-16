<%@taglib uri="http://www.jrapid.com/bi" prefix="bi" %><html xmlns:bi="http://www.jrapid.com/bi">
<body>
<bi:crosstab>
<crosstab title="Employee">
<factquery expr="employee"></factquery>
<measure expr="COUNT(*)" name="count" formatter="com.jrapid.bi.decorators.IntegerFormatter" styler="com.jrapid.bi.decorators.PercentileStyler"></measure>
<dimension name="picture" column="picture" label="picture"></dimension>
<dimension name="thumb" column="thumb" label="thumb"></dimension>
<dimension name="firstName" column="firstName" label="firstName"></dimension>
<dimension name="lastName" column="lastName" label="lastName"></dimension>
<dimension name="fileNumber" column="fileNumber" label="fileNumber"></dimension>
<dimension name="status" column="status" label="status" defaultcolumn="defaultcolumn"></dimension>
<dimension name="ssn" column="ssn" label="ssn"></dimension>
<dimension name="dateOfBirth_month" column="MONTH(facttable.dateOfBirth)" label="dateOfBirth_month" factjoin="" factjoinname=""></dimension>
<dimension name="dateOfBirth_day" column="DAY(facttable.dateOfBirth)" label="dateOfBirth_day" factjoin="" factjoinname=""></dimension>
<dimension name="dateOfBirth_year" column="YEAR(facttable.dateOfBirth)" label="dateOfBirth_year" factjoin="" factjoinname=""></dimension>
<dimension name="dateOfBirth" column="facttable.dateOfBirth" label="dateOfBirth" factjoin="" factjoinname=""></dimension>
<dimension name="gender" column="gender" label="gender"></dimension>
<dimension name="email" column="email" label="email"></dimension>
<dimension name="phone" column="phone" label="phone"></dimension>
<dimension name="mobile" column="mobile" label="mobile"></dimension>
<dimension name="maritalStatus" column="maritalStatus" label="maritalStatus"></dimension>
<dimension name="spouse" column="spouse" label="spouse" defaultcolumn="defaultcolumn"></dimension>
<dimension name="address" column="address" label="address"></dimension>
<dimension name="country" column="country" label="country" defaultrow="defaultrow" table="country" tablepk="id" tabledisplay="name"></dimension>
<dimension name="country_name" column="country.name" label="country.name" factjoin=" LEFT OUTER JOIN country AS country ON facttable.country=country.id " factjoinname="country"></dimension>
<dimension name="state" column="state" label="state" table="state" tablepk="id" tabledisplay="name"></dimension>
<dimension name="state_name" column="state.name" label="state.name" factjoin=" LEFT OUTER JOIN state AS state ON facttable.state=state.id " factjoinname="state"></dimension>
<dimension name="state_country" column="state.country" label="state.country" table="country" tablepk="id" tabledisplay="name" factjoin=" LEFT OUTER JOIN state AS state ON facttable.state=state.id " factjoinname="state"></dimension>
<dimension name="city" column="city" label="city"></dimension>
<dimension name="cv" column="cv" label="cv"></dimension>
<dimension name="empty" column="''" label="empty"></dimension>
<linktable name="default" linkmethod="BI.openForm" linkparams="&quot;Employee&quot;" select="facttable.id 
		, facttable.thumb
		, facttable.firstName
		, facttable.lastName
		, facttable.fileNumber
		, facttable.status
		, facttable.email"></linktable>
<linkaction label="Add to My Reports" entity="Report" defaultset="forUrl"></linkaction>
</crosstab>
</bi:crosstab>
<script type="text/javascript">
 		jrapid.experience(
 			'../jrapid-runtime', 
 			'flash', 
 			'web', 
 			'', 
 			'default'
 		);
 	</script>
</body>
</html>
