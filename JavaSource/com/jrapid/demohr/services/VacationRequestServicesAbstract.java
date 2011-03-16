

/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT VacationRequestServices.java INSTEAD! */
/**
 * VacationRequestServicesAbstract.java
 *
 * This file contains services that are exported for the VacationRequest entity.
 * Methods are exported as REST Web Services by com.jrapid.demohr.controller.MainController
 *
 * /xml/VacationRequest/(0-9) -> find()
 * /xml/VacationRequest -> findPage()
 *
 *
 * @see com.jrapid.demohr.entitities.VacationRequest
 * @see com.jrapid.demohr.dao.VacationRequestDAO
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

public abstract class VacationRequestServicesAbstract extends com.jrapid.services.Services {

	
	protected EL el = new EL(new FunctionMapper());
	protected Logger logger = Logger.getLogger(VacationRequestServices.class);
	
	
	protected VacationRequestDAO dao = (VacationRequestDAO) VacationRequest.DAO();
	
	
	
	
	

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
	 * /xml/VacationRequest/(0-9+)
	 *
	 */	
	public VacationRequest find(String id) {
	
		VacationRequest obj = null;
		
		// step 1: build map
		Session session = Session.getMySession();
		Map<String, Object> map = new HashMap<String, Object>();
		
		if (id.equals("0")) {	
			// step 2: new object
			obj = new VacationRequest();
			
			// step 3: setvalues
						
				
		} else {
			obj = VacationRequest.DAO().findById(id);
		}
		
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
	/**
	 *
	 *
	 */	
	public Object store(String id, VacationRequest voobj) {
		VacationRequest obj;		
		
		if (id.equals("0")) {
			obj = new VacationRequest();	
					
			
			
		} else {
			obj = VacationRequest.DAO().findById(id);
		}
		
		
		
		boolean isNewVacationRequestN66125 = obj.getId() == null || obj.getId().equals(0L);
		
		
		obj.setFromDate(voobj.getFromDate()); 
		obj.setToDate(voobj.getToDate()); 
		obj.setGranted(voobj.getGranted()); 
		obj.setEmplyee(Employee.DAO().findBy(voobj.getEmplyee()));			
		
		return obj.store();
						
	}	
	
	/**
	 * /xml/VacationRequest
	 *
	 */	
	public Collection<VacationRequest> findPage(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"emplyee.firstName","emplyee.lastName","emplyee.email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}		
		
		
		int count = dao.count(filters);
		List<VacationRequest> list = dao.findMany(filters, order, first, max, hints);
		return new Page<VacationRequest>(list, pageNumber, (count-1)/max+1, count);		
	}
	
	
	
	/**
	 * /xml/VacationRequest/forEmployee
	 *
	 */	
	public Collection<VacationRequest> findSubsetForEmployee(String employeeParamId, Map<String, String> params) {
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
			String[] columns = new String[]{"emplyee.firstName","emplyee.lastName","emplyee.email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}				
		
		if (order == null) {
			order = "fromDate";
		}
		
		
		int count = dao.count(filters.and(dao.getForEmployeeSubsetFilter(employeeParam)));
		List<VacationRequest> list = dao.findForEmployee(employeeParam,  filters, order, first, max, hints);
		return new Page<VacationRequest>(list, pageNumber, (count-1)/max+1, count);		 
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
	
	public Object storeForEmployeeDef(String employeeParamId,VacationRequest voobj) {
		
		return store(voobj.getId() == null ? "0" : voobj.getId().toString(), voobj);
			
	}
	
	public VacationRequest findForEmployeeDef(String employeeParamId) {
		// step 1: find params
		Employee employeeParam = Employee.DAO().findById(employeeParamId);
			

		// step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("employeeParam", employeeParam);
		
		// step 3: set defaults	
		VacationRequest obj = new VacationRequest();
		obj.setEmplyee((Employee)el.evaluate("${employeeParam}", Employee.class, map));
	
		
		// step 4: check if exists
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
}

	