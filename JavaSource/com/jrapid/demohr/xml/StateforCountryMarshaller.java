	
package com.jrapid.demohr.xml;	
	
import com.jrapid.demohr.entities.*;

import com.jrapid.controller.MarshallerBase;
import java.io.Writer;

public class StateforCountryMarshaller extends MarshallerBase  {	

	public StateforCountryMarshaller() {
		super(null, false, StateforCountryMarshaller.class);
	}	
	
	

	
		
	public void marshal(Writer writer, String nodeName, State obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + obj.getId() + "'  style='" + obj.getStyle() + "'>");
						
		writer.write("</" + nodeName + ">");
	}	
		
	
}

	