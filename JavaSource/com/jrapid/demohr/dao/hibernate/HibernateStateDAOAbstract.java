
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT HibernateStateDAO.java INSTEAD! */
package com.jrapid.demohr.dao.hibernate;


import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.jrapid.dao.Filter;
import com.jrapid.dao.FilterMethod;
import com.jrapid.dao.hibernate.HibernateDAO;
import com.jrapid.dao.hibernate.HibernateFilter;
import com.jrapid.util.EL;

import com.jrapid.demohr.entities.*;
import com.jrapid.demohr.services.FunctionMapper;
import com.jrapid.demohr.dao.StateDAOAbstract;

public abstract class HibernateStateDAOAbstract extends HibernateDAO<State> implements StateDAOAbstract {

	private EL el = new EL(new FunctionMapper());
		
	public HibernateStateDAOAbstract() {
		super(State.class);
	}
	
	// subsets
	
	public List<State> findForCountry(Country countryParam, Filter filters, String order, int first, int max, String hints) {
		return findMany(getForCountrySubsetFilter( countryParam).and(filters), order, first, max, hints);
	}

	
	
	// filters	
	
	
	// subset filters
	
	public Filter getForCountrySubsetFilter(Country countryParam) {
		 // step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("countryParam", countryParam);
		
		// step 3: build restrictions
		Filter filter = new HibernateFilter();
		
            
            filter = filter.and(new HibernateFilter("me.country = ?", el.evaluate("${countryParam}", map)));
        
		
		return filter;
	}
	
	
	// code for suggest
	
}



	