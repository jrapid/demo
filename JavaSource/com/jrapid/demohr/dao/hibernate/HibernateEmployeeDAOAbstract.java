
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT HibernateEmployeeDAO.java INSTEAD! */
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
import com.jrapid.demohr.dao.EmployeeDAOAbstract;

public abstract class HibernateEmployeeDAOAbstract extends HibernateDAO<Employee> implements EmployeeDAOAbstract {

	private EL el = new EL(new FunctionMapper());
		
	public HibernateEmployeeDAOAbstract() {
		super(Employee.class);
	}
	
	// subsets
	
	public List<Employee> findEmployees(Filter filters, String order, int first, int max, String hints) {
		return findMany(getEmployeesSubsetFilter().and(filters), order, first, max, hints);
	}

	
	public List<Employee> findFormer(Filter filters, String order, int first, int max, String hints) {
		return findMany(getFormerSubsetFilter().and(filters), order, first, max, hints);
	}

	
	public List<Employee> findEmployee(Filter filters, String order, int first, int max, String hints) {
		return findMany(getEmployeeSubsetFilter().and(filters), order, first, max, hints);
	}

	
	public List<Employee> findCandidate(Filter filters, String order, int first, int max, String hints) {
		return findMany(getCandidateSubsetFilter().and(filters), order, first, max, hints);
	}

	
	public List<Employee> findProspects(Filter filters, String order, int first, int max, String hints) {
		return findMany(getProspectsSubsetFilter().and(filters), order, first, max, hints);
	}

	
	
	// filters	
	
	@FilterMethod("lastName")
	public Filter getLastNameFilter(String lastName) {
		return new HibernateFilter("me.lastName LIKE CONCAT(?, '%')", lastName);
	}
	
	
	@FilterMethod("ssnFilter")
	public Filter getSsnFilterFilter(String ssnFilter) {
		return new HibernateFilter("me.ssn LIKE CONCAT(?, '%')", ssnFilter);
	}
	
	
	@FilterMethod("country")
	public Filter getCountryFilter(Country country) {
		return new HibernateFilter("me.country = ?", country);
	}
	
	
	@FilterMethod("qualificationsFilter")
	public Filter getQualificationsFilterFilter(Qualification qualificationsFilter) {
		
		// step 2: build param map 
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("qualificationsFilter", qualificationsFilter);
		
		// step 3: build filter
		Filter filter = new HibernateFilter();		
	
            filter = filter.and(new HibernateFilter("me.qualifications", el.evaluate("${qualificationsFilter}", map), CONTAINS));
	
        				
		return filter;
	
	
	}
	
	
	@FilterMethod("gender")
	public Filter getGenderFilter(String gender) {
		return new HibernateFilter("me.gender = ?", gender);
	}
	
	
	@FilterMethod("countriesFilter")
	public Filter getCountriesFilterFilter(List<Country> countriesFilter) {
		
		// step 2: build param map 
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("countriesFilter", countriesFilter);
		
		// step 3: build filter
		Filter filter = new HibernateFilter();		
	
            filter = filter.and(new HibernateFilter("me.country", el.evaluate("${countriesFilter}", map), IN));
	
        				
		return filter;
	
	
	}
	
	
	
	// subset filters
	
	public Filter getEmployeesSubsetFilter() {
		 // step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		// step 3: build restrictions
		Filter filter = new HibernateFilter();
		
            filter = filter.and(new HibernateFilter("me.status = ?", el.evaluate("${'E'}", map)));
        
		
		return filter;
	}
	
	public Filter getFormerSubsetFilter() {
		 // step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		// step 3: build restrictions
		Filter filter = new HibernateFilter();
		
            filter = filter.and(new HibernateFilter("me.status = ?", el.evaluate("${'F'}", map)));
        
		
		return filter;
	}
	
	public Filter getEmployeeSubsetFilter() {
		 // step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		// step 3: build restrictions
		Filter filter = new HibernateFilter();
		
            filter = filter.and(new HibernateFilter("me.status = ?", el.evaluate("${'E'}", map)));
        
		
		return filter;
	}
	
	public Filter getCandidateSubsetFilter() {
		 // step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		// step 3: build restrictions
		Filter filter = new HibernateFilter();
		
            filter = filter.and(new HibernateFilter("me.status = ?", el.evaluate("${'C'}", map)));
        
		
		return filter;
	}
	
	public Filter getProspectsSubsetFilter() {
		 // step 2: build param map 
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		// step 3: build restrictions
		Filter filter = new HibernateFilter();
		
            filter = filter.and(new HibernateFilter("me.status = ?", el.evaluate("${'P'}", map)));
        
		
		return filter;
	}
	
	
	// code for suggest
	
	public List<Object> suggestCity(String prefix) {
		List<Object> values = new java.util.ArrayList<Object>();
		
		values.addAll(com.jrapid.dao.hibernate.HibernateUtil.getSession().createQuery("SELECT city FROM Employee WHERE city LIKE concat(?, '%')").setString(0, prefix).list());		
		
		return values;
	}
	
}



	