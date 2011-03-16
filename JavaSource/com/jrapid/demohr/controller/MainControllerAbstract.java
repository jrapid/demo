
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT MainController.java INSTEAD! */	
	
/**
 * This file exports methods from classes in the package com.jrapid.demohr.services as REST Web Services.
 *
 * To make it work, this file must be called from the controllers.cfgs file.
 */	
	
package com.jrapid.demohr.controller;

import com.jrapid.controller.FrontController;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;

import com.jrapid.demohr.services.*;
import com.jrapid.demohr.xml.*;

public class MainControllerAbstract extends FrontController {

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		this.init(this);	
	}
		
	@Override
	protected void init(FrontController controller) {
	
		
			
			// main for Employee
			controller.registerXmlRpcService(EmployeeServices.class, "removeMany", "Employee.remove");
			controller.registerXmlService(GET, "/Employee", EmployeeServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Employee/([0-9,]+)" , EmployeeServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/Employee/([0-9,]+)", EmployeeServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/EmployeeFull.xml"), false);
			
			controller.registerXmlService(GET, "/Employee/employees", EmployeeServices.class, "findSubsetEmployees", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Employee/former", EmployeeServices.class, "findSubsetFormer", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Employee/employee", EmployeeServices.class, "findSubsetEmployee", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Employee/candidate", EmployeeServices.class, "findSubsetCandidate", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Employee/prospects", EmployeeServices.class, "findSubsetProspects", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Employee/suggestcity/(.*)", EmployeeServices.class, "suggestCity", new DefaultMarshaller());
			
			// main for Country
			controller.registerXmlRpcService(CountryServices.class, "removeMany", "Country.remove");
			controller.registerXmlService(GET, "/Country", CountryServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Country/([0-9,]+)" , CountryServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/Country/([0-9,]+)", CountryServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/CountryFull.xml"), false);
			
			
			// main for State
			controller.registerXmlRpcService(StateServices.class, "removeMany", "State.remove");
			controller.registerXmlService(GET, "/State", StateServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/State/([0-9,]+)" , StateServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/State/([0-9,]+)", StateServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/StateFull.xml"), false);
			
			controller.registerXmlService(GET, "/State/forCountry/(?:([^/&&[^;]]*))?", StateServices.class, "findSubsetForCountry", new DefaultMarshaller(), true);
			
			// main for Qualification
			controller.registerXmlRpcService(QualificationServices.class, "removeMany", "Qualification.remove");
			controller.registerXmlService(GET, "/Qualification", QualificationServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Qualification/([0-9,]+)" , QualificationServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/Qualification/([0-9,]+)", QualificationServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/QualificationFull.xml"), false);
			
			
			// main for Interview
			controller.registerXmlRpcService(InterviewServices.class, "removeMany", "Interview.remove");
			controller.registerXmlService(GET, "/Interview", InterviewServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Interview/([0-9,]+)" , InterviewServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/Interview/([0-9,]+)", InterviewServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/InterviewFull.xml"), false);
			
			controller.registerXmlService(GET, "/Interview/forEmployee/(?:([^/&&[^;]]*))?", InterviewServices.class, "findSubsetForEmployee", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Interview/forEmployeeDef/(?:([^/&&[^;]]*))?", InterviewServices.class, "findForEmployeeDef", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/Interview/forEmployeeDef/(?:([^/&&[^;]]*))?", InterviewServices.class, "storeForEmployeeDef", new DefaultMarshaller(true, "com/jrapid/demohr/xml/InterviewFull.xml"), false);
			
			// main for Course
			controller.registerXmlRpcService(CourseServices.class, "removeMany", "Course.remove");
			controller.registerXmlService(GET, "/Course", CourseServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/Course/([0-9,]+)" , CourseServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/Course/([0-9,]+)", CourseServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/CourseFull.xml"), false);
			
			
			// main for CourseTaken
			controller.registerXmlRpcService(CourseTakenServices.class, "removeMany", "CourseTaken.remove");
			controller.registerXmlService(GET, "/CourseTaken", CourseTakenServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/CourseTaken/([0-9,]+)" , CourseTakenServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/CourseTaken/([0-9,]+)", CourseTakenServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/CourseTakenFull.xml"), false);
			
			
			// main for VacationRequest
			controller.registerXmlRpcService(VacationRequestServices.class, "removeMany", "VacationRequest.remove");
			controller.registerXmlService(GET, "/VacationRequest", VacationRequestServices.class, "findPage", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/VacationRequest/([0-9,]+)" , VacationRequestServices.class, "find", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/VacationRequest/([0-9,]+)", VacationRequestServices.class, "store", new DefaultMarshaller(true, "com/jrapid/demohr/xml/VacationRequestFull.xml"), false);
			
			controller.registerXmlService(GET, "/VacationRequest/forEmployee/(?:([^/&&[^;]]*))?", VacationRequestServices.class, "findSubsetForEmployee", new DefaultMarshaller(), true);
			controller.registerXmlService(GET, "/VacationRequest/forEmployeeDef/(?:([^/&&[^;]]*))?", VacationRequestServices.class, "findForEmployeeDef", new DefaultMarshaller(true), false);
			controller.registerXmlService(POST, "/VacationRequest/forEmployeeDef/(?:([^/&&[^;]]*))?", VacationRequestServices.class, "storeForEmployeeDef", new DefaultMarshaller(true, "com/jrapid/demohr/xml/VacationRequestFull.xml"), false);
	
	}

}

	