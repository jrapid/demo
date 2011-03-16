
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT EmployeeDAO.java INSTEAD! */
/**
 * This interface defines methods to access the data layer for the Employee entity.
 *
 * This methods are usually used from the classes in the package com.jrapid.demohr.services.
 *
 * According to current settings, this interface is implemented by com.jrapid.demohr.dao.hibernate.HibernateEmployeeDAO  
 *
 * @see com.jrapid.demohr.entitities.Employee
 * @see com.jrapid.demohr.services.EmployeeServices
 * @see com.jrapid.demohr.dao.hibernate.HibernateEmployeeDAO 
 */	
	
package com.jrapid.demohr.dao;

import java.util.List;
import com.jrapid.dao.Filter;
import com.jrapid.dao.DAO;

import com.jrapid.demohr.entities.*;

public interface EmployeeDAOAbstract extends DAO<Employee> {
		
	
	public List<Employee> findEmployees(Filter filters, String order, int first, int max, String hints);
	
	public List<Employee> findFormer(Filter filters, String order, int first, int max, String hints);
	
	public List<Employee> findEmployee(Filter filters, String order, int first, int max, String hints);
	
	public List<Employee> findCandidate(Filter filters, String order, int first, int max, String hints);
	
	public List<Employee> findProspects(Filter filters, String order, int first, int max, String hints);
	
	public Filter getLastNameFilter(String lastName);
	
	public Filter getSsnFilterFilter(String ssnFilter);
	
	public Filter getCountryFilter(Country country);
	
	public Filter getQualificationsFilterFilter(Qualification qualificationsFilter);
	
	public Filter getGenderFilter(String gender);
	
	public Filter getCountriesFilterFilter(List<Country> countriesFilter);
	
	public Filter getEmployeesSubsetFilter();
	
	public Filter getFormerSubsetFilter();
	
	public Filter getEmployeeSubsetFilter();
	
	public Filter getCandidateSubsetFilter();
	
	public Filter getProspectsSubsetFilter();
	
	public List<Object> suggestCity(String prefix);
	
	
}

	