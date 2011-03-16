	
package com.jrapid.demohr.xml;	
	
	
import com.jrapid.demohr.entities.*;

import com.jrapid.controller.MarshallerBase;

import java.io.Writer;

public class DefaultMarshaller extends MarshallerBase {	

	public DefaultMarshaller(boolean full) {
		super(null, full, DefaultMarshaller.class);
	}
	
	public DefaultMarshaller() {
		super(null, false, DefaultMarshaller.class);
	}	
	
	public DefaultMarshaller(boolean full, String mapping) {
		super(mapping, full, DefaultMarshaller.class);
	}
	
		
	public void marshal(Writer writer, String nodeName, Employee obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<firstName>" + escape(obj.getFirstName()) + "</firstName>");
		writer.write("<lastName>" + escape(obj.getLastName()) + "</lastName>");
		writer.write("<email>" + escape(obj.getEmail()) + "</email>");
		if (showSecondary) {
			
		writer.write("<thumb>" + escape(obj.getThumb()) + "</thumb>");
		writer.write("<fileNumber>" + escape(obj.getFileNumber()) + "</fileNumber>");
		writer.write("<status>" + escape(obj.getStatus()) + "</status>");
		}
		
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, Employee obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<picture>" + escape(obj.getPicture()) + "</picture>");
		writer.write("<thumb>" + escape(obj.getThumb()) + "</thumb>");
		writer.write("<firstName>" + escape(obj.getFirstName()) + "</firstName>");
		writer.write("<lastName>" + escape(obj.getLastName()) + "</lastName>");
		writer.write("<fileNumber>" + escape(obj.getFileNumber()) + "</fileNumber>");
		writer.write("<status>" + escape(obj.getStatus()) + "</status>");
		writer.write("<ssn>" + escape(obj.getSsn()) + "</ssn>");
		writer.write("<dateOfBirth>" + escape(new com.jrapid.controller.servers.castor.DateHandler().convertUponGet(obj.getDateOfBirth())) + "</dateOfBirth>");
		writer.write("<gender>" + escape(obj.getGender()) + "</gender>");
		writer.write("<email>" + escape(obj.getEmail()) + "</email>");
		writer.write("<phone>" + escape(obj.getPhone()) + "</phone>");
		writer.write("<mobile>" + escape(obj.getMobile()) + "</mobile>");
		writer.write("<maritalStatus>" + escape(obj.getMaritalStatus()) + "</maritalStatus>");
		writer.write("<spouse>" + escape(obj.getSpouse()) + "</spouse>");	
		for (Object o:obj.getChildren()) {
				
			writer.write("<children>" + escape(o) + "</children>");
					
		}
		writer.write("<address>" + escape(obj.getAddress()) + "</address>");
		marshal(writer, "country", obj.getCountry(), false);
		marshal(writer, "state", obj.getState(), false);
		writer.write("<city>" + escape(obj.getCity()) + "</city>");
		writer.write("<cv>" + escape(obj.getCv()) + "</cv>");	
		for (Object o:obj.getSkills()) {
				
			writer.write("<skills>" + escape(o) + "</skills>");
					
		}
		for (Qualification o:obj.getQualifications()) {
			marshal(writer, "qualifications", o, false);
		}
		for (CourseTaken o:obj.getCoursesTaken()) {
			marshalFull(writer, "coursesTaken", o, false);
		}
		writer.write("</" + nodeName + ">");
	}	

		
	public void marshal(Writer writer, String nodeName, Country obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, Country obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		for (State o:obj.getStates()) {
			marshalFull(writer, "states", o, false);
		}
		writer.write("</" + nodeName + ">");
	}	

		
	public void marshal(Writer writer, String nodeName, State obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, State obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		marshal(writer, "country", obj.getCountry(), false);
		writer.write("</" + nodeName + ">");
	}	

		
	public void marshal(Writer writer, String nodeName, Qualification obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, Qualification obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		writer.write("</" + nodeName + ">");
	}	

		
	public void marshal(Writer writer, String nodeName, Interview obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		marshal(writer, "employee", obj.getEmployee(), false);
		writer.write("<title>" + escape(obj.getTitle()) + "</title>");
		if (showSecondary) {
			
		writer.write("<interviewDate>" + escape(new com.jrapid.controller.servers.castor.DateHandler().convertUponGet(obj.getInterviewDate())) + "</interviewDate>");
		writer.write("<start>" + escape(new com.jrapid.controller.servers.castor.TimeHandler().convertUponGet(obj.getStart())) + "</start>");
		writer.write("<end>" + escape(new com.jrapid.controller.servers.castor.TimeHandler().convertUponGet(obj.getEnd())) + "</end>");
		}
		
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, Interview obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		marshal(writer, "employee", obj.getEmployee(), false);
		writer.write("<title>" + escape(obj.getTitle()) + "</title>");
		writer.write("<interviewDate>" + escape(new com.jrapid.controller.servers.castor.DateHandler().convertUponGet(obj.getInterviewDate())) + "</interviewDate>");
		writer.write("<start>" + escape(new com.jrapid.controller.servers.castor.TimeHandler().convertUponGet(obj.getStart())) + "</start>");
		writer.write("<end>" + escape(new com.jrapid.controller.servers.castor.TimeHandler().convertUponGet(obj.getEnd())) + "</end>");
		writer.write("<allDay>" + escape(new com.jrapid.controller.servers.castor.BooleanHandler().convertUponGet(obj.getAllDay())) + "</allDay>");
		writer.write("</" + nodeName + ">");
	}	

		
	public void marshal(Writer writer, String nodeName, Course obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, Course obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		writer.write("<name>" + escape(obj.getName()) + "</name>");
		writer.write("<description>" + escape(obj.getDescription()) + "</description>");
		writer.write("<duration>" + escape(new com.jrapid.controller.servers.castor.IntegerHandler().convertUponGet(obj.getDuration())) + "</duration>");
		writer.write("</" + nodeName + ">");
	}	

		
	public void marshal(Writer writer, String nodeName, CourseTaken obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, CourseTaken obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		marshal(writer, "course", obj.getCourse(), false);
		marshal(writer, "employee", obj.getEmployee(), false);
		writer.write("<completed>" + escape(new com.jrapid.controller.servers.castor.BooleanHandler().convertUponGet(obj.getCompleted())) + "</completed>");
		writer.write("</" + nodeName + ">");
	}	

		
	public void marshal(Writer writer, String nodeName, VacationRequest obj, Boolean showSecondary) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		marshal(writer, "emplyee", obj.getEmplyee(), false);
		
		writer.write("</" + nodeName + ">");
	}
	
	public void marshalFull(Writer writer, String nodeName, VacationRequest obj, Boolean foo) throws Exception {
		if (obj == null) {
			writer.write("<" + nodeName + " id=''  />");
			return;
		}
		writer.write("<" + nodeName + " id='" + escapeAttr(obj.getId()) + "'  style='" + escape(obj.getStyle()) + "' >");
		
		marshal(writer, "emplyee", obj.getEmplyee(), false);
		writer.write("<fromDate>" + escape(new com.jrapid.controller.servers.castor.DateHandler().convertUponGet(obj.getFromDate())) + "</fromDate>");
		writer.write("<toDate>" + escape(new com.jrapid.controller.servers.castor.DateHandler().convertUponGet(obj.getToDate())) + "</toDate>");
		writer.write("<granted>" + escape(new com.jrapid.controller.servers.castor.BooleanHandler().convertUponGet(obj.getGranted())) + "</granted>");
		writer.write("</" + nodeName + ">");
	}	

	
}

	