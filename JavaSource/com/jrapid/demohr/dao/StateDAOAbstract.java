
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT StateDAO.java INSTEAD! */
/**
 * This interface defines methods to access the data layer for the State entity.
 *
 * This methods are usually used from the classes in the package com.jrapid.demohr.services.
 *
 * According to current settings, this interface is implemented by com.jrapid.demohr.dao.hibernate.HibernateStateDAO  
 *
 * @see com.jrapid.demohr.entitities.State
 * @see com.jrapid.demohr.services.StateServices
 * @see com.jrapid.demohr.dao.hibernate.HibernateStateDAO 
 */	
	
package com.jrapid.demohr.dao;

import java.util.List;
import com.jrapid.dao.Filter;
import com.jrapid.dao.DAO;

import com.jrapid.demohr.entities.*;

public interface StateDAOAbstract extends DAO<State> {
		
	
	public List<State> findForCountry(Country countryParam, Filter filters, String order, int first, int max, String hints);
	
	public Filter getForCountrySubsetFilter(Country countryParam);
	
	
}

	