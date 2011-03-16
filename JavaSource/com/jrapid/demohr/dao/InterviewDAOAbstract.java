
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT InterviewDAO.java INSTEAD! */
/**
 * This interface defines methods to access the data layer for the Interview entity.
 *
 * This methods are usually used from the classes in the package com.jrapid.demohr.services.
 *
 * According to current settings, this interface is implemented by com.jrapid.demohr.dao.hibernate.HibernateInterviewDAO  
 *
 * @see com.jrapid.demohr.entitities.Interview
 * @see com.jrapid.demohr.services.InterviewServices
 * @see com.jrapid.demohr.dao.hibernate.HibernateInterviewDAO 
 */	
	
package com.jrapid.demohr.dao;

import java.util.List;
import com.jrapid.dao.Filter;
import com.jrapid.dao.DAO;

import com.jrapid.demohr.entities.*;

public interface InterviewDAOAbstract extends DAO<Interview> {
		
	
	public List<Interview> findForEmployee(Employee employeeParam, Filter filters, String order, int first, int max, String hints);
	
	public Filter getForEmployeeSubsetFilter(Employee employeeParam);
	
	
}

	