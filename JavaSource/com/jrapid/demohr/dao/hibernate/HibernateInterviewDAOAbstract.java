
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT HibernateInterviewDAO.java INSTEAD! */
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
import com.jrapid.demohr.dao.InterviewDAOAbstract;

public abstract class HibernateInterviewDAOAbstract extends HibernateDAO<Interview> implements InterviewDAOAbstract {

	private EL el = new EL(new FunctionMapper());
		
	public HibernateInterviewDAOAbstract() {
		super(Interview.class);
	}
	
	// subsets
	
	public List<Interview> findForEmployee(Employee employeeParam, Filter filters, String order, int first, int max, String hints) {
		return findMany(getForEmployeeSubsetFilter( employeeParam).and(filters), order, first, max, hints);
	}

	
	
	// filters	
	
	
	// subset filters
	
	public Filter getForEmployeeSubsetFilter(Employee employeeParam) {
		 // step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("employeeParam", employeeParam);
		
		// step 3: build restrictions
		Filter filter = new HibernateFilter();
		
            
            filter = filter.and(new HibernateFilter("me.employee = ?", el.evaluate("${employeeParam}", map)));
        
		
		return filter;
	}
	
	
	// code for suggest
	
}



	