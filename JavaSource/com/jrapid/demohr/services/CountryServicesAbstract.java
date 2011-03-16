

/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT CountryServices.java INSTEAD! */
/**
 * CountryServicesAbstract.java
 *
 * This file contains services that are exported for the Country entity.
 * Methods are exported as REST Web Services by com.jrapid.demohr.controller.MainController
 *
 * /xml/Country/(0-9) -> find()
 * /xml/Country -> findPage()
 *
 *
 * @see com.jrapid.demohr.entitities.Country
 * @see com.jrapid.demohr.dao.CountryDAO
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

public abstract class CountryServicesAbstract extends com.jrapid.services.Services {

	
	protected EL el = new EL(new FunctionMapper());
	protected Logger logger = Logger.getLogger(CountryServices.class);
	
	
	protected CountryDAO dao = (CountryDAO) Country.DAO();
	
	
	
	
	

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
	 * /xml/Country/(0-9+)
	 *
	 */	
	public Country find(String id) {
	
		Country obj = null;
		
		// step 1: build map
		Session session = Session.getMySession();
		Map<String, Object> map = new HashMap<String, Object>();
		
		if (id.equals("0")) {	
			// step 2: new object
			obj = new Country();
			
			// step 3: setvalues
						
				
		} else {
			obj = Country.DAO().findById(id);
		}
		
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
	/**
	 *
	 *
	 */	
	public Object store(String id, Country voobj) {
		Country obj;		
		
		if (id.equals("0")) {
			obj = new Country();	
					
			
			
		} else {
			obj = Country.DAO().findById(id);
		}
		
		
		
		boolean isNewCountryN65941 = obj.getId() == null || obj.getId().equals(0L);
		
		
		obj.setName(voobj.getName()); 
		
		
		Collection<State> currentN65952 = new HashSet<State>();
		for (State itemN65952:voobj.getStates()) {
			State newState;
			if (itemN65952.getId() == null || itemN65952.getId().equals(0L) || isNewCountryN65941) {
				newState = new State();
			} else {
				newState = State.DAO().findBy(itemN65952);
			}

			State vonewState = itemN65952;
			
			
		
		boolean isNewStateN65961 = newState.getId() == null || newState.getId().equals(0L);
		
		
		newState.setName(vonewState.getName()); 
		
			if (itemN65952.getId() == null || itemN65952.getId().equals(0L) || isNewCountryN65941) {
				newState.setCountry(obj);
				obj.getStates().add(newState);
			}	
			
			currentN65952.add(newState);
		}
		obj.getStates().retainAll(currentN65952);
		
		return obj.store();
						
	}	
	
	/**
	 * /xml/Country
	 *
	 */	
	public Collection<Country> findPage(Map<String, String> params) {
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
		
		if (order == null) {
			order = "name";
		}
		
		
		int count = dao.count(filters);
		List<Country> list = dao.findMany(filters, order, first, max, hints);
		return new Page<Country>(list, pageNumber, (count-1)/max+1, count);		
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

	