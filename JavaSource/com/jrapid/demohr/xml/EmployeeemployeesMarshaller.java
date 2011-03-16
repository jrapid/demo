	
package com.jrapid.demohr.xml;	
	
import com.jrapid.demohr.entities.*;

import com.jrapid.controller.MarshallerBase;
import java.io.Writer;

public class EmployeeemployeesMarshaller extends MarshallerBase  {	

	public EmployeeemployeesMarshaller() {
		super(null, false, EmployeeemployeesMarshaller.class);
	}	
	
	

	
		
	public void marshal(Writer writer, String nodeName, Employee obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + obj.getId() + "'  style='" + obj.getStyle() + "'>");
						
		writer.write("</" + nodeName + ">");
	}	
		
	
}

	