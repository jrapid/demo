

/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT QualificationServices.java INSTEAD! */
/**
 * QualificationServicesAbstract.java
 *
 * This file contains services that are exported for the Qualification entity.
 * Methods are exported as REST Web Services by com.jrapid.demohr.controller.MainController
 *
 * /xml/Qualification/(0-9) -> find()
 * /xml/Qualification -> findPage()
 *
 *
 * @see com.jrapid.demohr.entitities.Qualification
 * @see com.jrapid.demohr.dao.QualificationDAO
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

public abstract class QualificationServicesAbstract extends com.jrapid.services.Services {

	
	protected EL el = new EL(new FunctionMapper());
	protected Logger logger = Logger.getLogger(QualificationServices.class);
	
	
	protected QualificationDAO dao = (QualificationDAO) Qualification.DAO();
	
	
	
	
	

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
	 * /xml/Qualification/(0-9+)
	 *
	 */	
	public Qualification find(String id) {
	
		Qualification obj = null;
		
		// step 1: build map
		Session session = Session.getMySession();
		Map<String, Object> map = new HashMap<String, Object>();
		
		if (id.equals("0")) {	
			// step 2: new object
			obj = new Qualification();
			
			// step 3: setvalues
						
				
		} else {
			obj = Qualification.DAO().findById(id);
		}
		
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
	/**
	 *
	 *
	 */	
	public Object store(String id, Qualification voobj) {
		Qualification obj;		
		
		if (id.equals("0")) {
			obj = new Qualification();	
					
			
			
		} else {
			obj = Qualification.DAO().findById(id);
		}
		
		
		
		boolean isNewQualificationN65991 = obj.getId() == null || obj.getId().equals(0L);
		
		
		obj.setName(voobj.getName()); 
		
		return obj.store();
						
	}	
	
	/**
	 * /xml/Qualification
	 *
	 */	
	public Collection<Qualification> findPage(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"name",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}		
		
		
		int count = dao.count(filters);
		List<Qualification> list = dao.findMany(filters, order, first, max, hints);
		return new Page<Qualification>(list, pageNumber, (count-1)/max+1, count);		
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

	