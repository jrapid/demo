	
package com.jrapid.demohr.xml;	
	
import com.jrapid.demohr.entities.*;

import com.jrapid.controller.MarshallerBase;
import java.io.Writer;

public class InterviewforEmployeeMarshaller extends MarshallerBase  {	

	public InterviewforEmployeeMarshaller() {
		super(null, false, InterviewforEmployeeMarshaller.class);
	}	
	
	

	
		
	public void marshal(Writer writer, String nodeName, Interview obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + obj.getId() + "'  style='" + obj.getStyle() + "'>");
						
		writer.write("</" + nodeName + ">");
	}	
		
	
}

	