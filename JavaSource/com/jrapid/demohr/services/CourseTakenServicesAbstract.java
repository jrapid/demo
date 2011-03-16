

/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT CourseTakenServices.java INSTEAD! */
/**
 * CourseTakenServicesAbstract.java
 *
 * This file contains services that are exported for the CourseTaken entity.
 * Methods are exported as REST Web Services by com.jrapid.demohr.controller.MainController
 *
 * /xml/CourseTaken/(0-9) -> find()
 * /xml/CourseTaken -> findPage()
 *
 *
 * @see com.jrapid.demohr.entitities.CourseTaken
 * @see com.jrapid.demohr.dao.CourseTakenDAO
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

public abstract class CourseTakenServicesAbstract extends com.jrapid.services.Services {

	
	protected EL el = new EL(new FunctionMapper());
	protected Logger logger = Logger.getLogger(CourseTakenServices.class);
	
	
	protected CourseTakenDAO dao = (CourseTakenDAO) CourseTaken.DAO();
	
	
	
	
	

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
	 * /xml/CourseTaken/(0-9+)
	 *
	 */	
	public CourseTaken find(String id) {
	
		CourseTaken obj = null;
		
		// step 1: build map
		Session session = Session.getMySession();
		Map<String, Object> map = new HashMap<String, Object>();
		
		if (id.equals("0")) {	
			// step 2: new object
			obj = new CourseTaken();
			
			// step 3: setvalues
						
				
		} else {
			obj = CourseTaken.DAO().findById(id);
		}
		
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
	/**
	 *
	 *
	 */	
	public Object store(String id, CourseTaken voobj) {
		CourseTaken obj;		
		
		if (id.equals("0")) {
			obj = new CourseTaken();	
					
			
			
		} else {
			obj = CourseTaken.DAO().findById(id);
		}
		
		
		
		boolean isNewCourseTakenN66104 = obj.getId() == null || obj.getId().equals(0L);
		
		
		obj.setCompleted(voobj.getCompleted()); 
		obj.setCourse(Course.DAO().findBy(voobj.getCourse()));			
		obj.setEmployee(Employee.DAO().findBy(voobj.getEmployee()));			
		
		return obj.store();
						
	}	
	
	/**
	 * /xml/CourseTaken
	 *
	 */	
	public Collection<CourseTaken> findPage(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}		
		
		
		int count = dao.count(filters);
		List<CourseTaken> list = dao.findMany(filters, order, first, max, hints);
		return new Page<CourseTaken>(list, pageNumber, (count-1)/max+1, count);		
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
	
}

	