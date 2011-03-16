

/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT InterviewServices.java INSTEAD! */
/**
 * InterviewServicesAbstract.java
 *
 * This file contains services that are exported for the Interview entity.
 * Methods are exported as REST Web Services by com.jrapid.demohr.controller.MainController
 *
 * /xml/Interview/(0-9) -> find()
 * /xml/Interview -> findPage()
 *
 *
 * @see com.jrapid.demohr.entitities.Interview
 * @see com.jrapid.demohr.dao.InterviewDAO
 * @see com.jrapid.demohr.controller.MainController
 */

		
		
package com.jrapid.demohr.services;


import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

import org.apache.log4j.Logger;

import com.jrapid.demohr.entities.*;
import com.jrapid.demohr.dao.*;
import com.jrapid.demohr.services.FunctionMapper;
import com.jrapid.demohr.dao.MainDAOLocator;

import com.jrapid.dao.Order;
import com.jrapid.dao.DAO;
import com.jrapid.dao.Filter;
import com.jrapid.services.Page;
import com.jrapid.util.EL;
import com.jrapid.exception.ServiceException;
import com.jrapid.exception.ConfirmationException;
import com.jrapid.controller.Session;
import com.jrapid.entities.Entity;

public abstract class InterviewServicesAbstract extends com.jrapid.services.Services {

	
	protected EL el = new EL(new FunctionMapper());
	protected Logger logger = Logger.getLogger(InterviewServices.class);
	
	
	protected InterviewDAO dao = (InterviewDAO) Interview.DAO();
	
	
	
	
	

	public Boolean remove(String id) {
		dao.findById(id).remove();
		return true;
	}
	
	public Boolean removeMany(Collection<String> ids) {
		for (String id:ids) {
			this.remove(id);
		}
		return true;
	}

	
	/**
	 * /xml/Interview/(0-9+)
	 *
	 */	
	public Interview find(String id) {
	
		Interview obj = null;
		
		// step 1: build map
		Session session = Session.getMySession();
		Map<String, Object> map = new HashMap<String, Object>();
		
		if (id.equals("0")) {	
			// step 2: new object
			obj = new Interview();
			
			// step 3: setvalues
			obj.setInterviewDate((java.util.GregorianCalendar)el.evaluate("${now}", java.util.GregorianCalendar.class, map));
				
				
		} else {
			obj = Interview.DAO().findById(id);
		}
		
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
	/**
	 *
	 *
	 */	
	public Object store(String id, Interview voobj) {
		Interview obj;		
		
		if (id.equals("0")) {
			obj = new Interview();	
					
			
			
		} else {
			obj = Interview.DAO().findById(id);
		}
		
		
		
		boolean isNewInterviewN66002 = obj.getId() == null || obj.getId().equals(0L);
		
		
		obj.setTitle(voobj.getTitle()); 
		obj.setInterviewDate(voobj.getInterviewDate()); 
		obj.setStart(voobj.getStart()); 
		obj.setEnd(voobj.getEnd()); 
		obj.setAllDay(voobj.getAllDay()); 
		obj.setEmployee(Employee.DAO().findBy(voobj.getEmployee()));			
		
		return obj.store();
						
	}	
	
	/**
	 * /xml/Interview
	 *
	 */	
	public Collection<Interview> findPage(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"employee.firstName","employee.lastName","employee.email","title","interviewDate","start","end",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}		
		
		
		int count = dao.count(filters);
		List<Interview> list = dao.findMany(filters, order, first, max, hints);
		return new Page<Interview>(list, pageNumber, (count-1)/max+1, count);		
	}
	
	
	
	/**
	 * /xml/Interview/forEmployee
	 *
	 */	
	public Collection<Interview> findSubsetForEmployee(String employeeParamId, Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		Employee employeeParam = Employee.DAO().findById(employeeParamId);
			
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"employee.firstName","employee.lastName","employee.email","title","interviewDate","start","end",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}				
		
		if (order == null) {
			order = "start";
		}
		
		
		int count = dao.count(filters.and(dao.getForEmployeeSubsetFilter(employeeParam)));
		List<Interview> list = dao.findForEmployee(employeeParam,  filters, order, first, max, hints);
		return new Page<Interview>(list, pageNumber, (count-1)/max+1, count);		 
	}
	
	
	
	protected Object parse(String filter, String value) {
		
		return null;
	}
	

	 
	
	// code for dynamic values
	
	
	// code for dynamic foreach
	
	
	
	// code for suggest
	
		
	// code for conditionals
	

	// code for unique
	
			
	// code for defaultsets
	
	public Object storeForEmployeeDef(String employeeParamId,Interview voobj) {
		
		return store(voobj.getId() == null ? "0" : voobj.getId().toString(), voobj);
			
	}
	
	public Interview findForEmployeeDef(String employeeParamId) {
		// step 1: find params
		Employee employeeParam = Employee.DAO().findById(employeeParamId);
			

		// step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("employeeParam", employeeParam);
		
		// step 3: set defaults	
		Interview obj = new Interview();
		obj.setEmployee((Employee)el.evaluate("${employeeParam}", Employee.class, map));
	obj.setInterviewDate((java.util.GregorianCalendar)el.evaluate("${now}", java.util.GregorianCalendar.class, map));
	
		
		// step 4: check if exists
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
}

	