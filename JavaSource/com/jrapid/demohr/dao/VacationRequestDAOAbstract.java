
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT VacationRequestDAO.java INSTEAD! */
/**
 * This interface defines methods to access the data layer for the VacationRequest entity.
 *
 * This methods are usually used from the classes in the package com.jrapid.demohr.services.
 *
 * According to current settings, this interface is implemented by com.jrapid.demohr.dao.hibernate.HibernateVacationRequestDAO  
 *
 * @see com.jrapid.demohr.entitities.VacationRequest
 * @see com.jrapid.demohr.services.VacationRequestServices
 * @see com.jrapid.demohr.dao.hibernate.HibernateVacationRequestDAO 
 */	
	
package com.jrapid.demohr.dao;

import java.util.List;
import com.jrapid.dao.Filter;
import com.jrapid.dao.DAO;

import com.jrapid.demohr.entities.*;

public interface VacationRequestDAOAbstract extends DAO<VacationRequest> {
		
	
	public List<VacationRequest> findForEmployee(Employee employeeParam, Filter filters, String order, int first, int max, String hints);
	
	public Filter getForEmployeeSubsetFilter(Employee employeeParam);
	
	
}

	