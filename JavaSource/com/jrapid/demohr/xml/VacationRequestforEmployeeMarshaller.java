	
package com.jrapid.demohr.xml;	
	
import com.jrapid.demohr.entities.*;

import com.jrapid.controller.MarshallerBase;
import java.io.Writer;

public class VacationRequestforEmployeeMarshaller extends MarshallerBase  {	

	public VacationRequestforEmployeeMarshaller() {
		super(null, false, VacationRequestforEmployeeMarshaller.class);
	}	
	
	

	
		
	public void marshal(Writer writer, String nodeName, VacationRequest obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + obj.getId() + "'  style='" + obj.getStyle() + "'>");
						
		writer.write("</" + nodeName + ">");
	}	
		
	
}

	