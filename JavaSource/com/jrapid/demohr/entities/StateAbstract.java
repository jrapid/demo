
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT State.java INSTEAD! */
/**
 * StateAbstract.java
 *
 * This file contains the POJO definition for the State entity.
 *
 *
 * @see com.jrapid.demohr.dao.StateDAO
 * @see com.jrapid.demohr.dao.HibernateStateDAO
 * @see com.jrapid.demohr.dao.hbm.Main.hbm.xml
 * @see com.jrapid.demohr.services.MainServices
 */


package com.jrapid.demohr.entities;

import org.apache.commons.el.ExpressionEvaluatorImpl;
import javax.servlet.jsp.el.ELException;
import java.util.regex.Pattern;

import com.jrapid.services.ExpressionVariableResolver;
import com.jrapid.dao.DAO;
import com.jrapid.entities.Entity;
import com.jrapid.demohr.dao.MainDAOLocator;
import static com.jrapid.services.Services.ID_SEPARATOR;
import static com.jrapid.services.Services.ESCAPE_CHARACTER;
import com.jrapid.demohr.services.FunctionMapper;

import com.jrapid.demohr.dao.StateDAO;



/**
  * 
  */  
public abstract class StateAbstract
		
		implements com.jrapid.entities.Entity  {

	
	private String name;
	
	private Country country;
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	
	public Country getCountry() {
		return country;
	}
	
	public void setCountry(Country country) {
		this.country = country;
	}
	
	
	
	
	
	public static StateDAO DAO() {
		return (StateDAO) MainDAOLocator.get().getStateDAO();		
	}
	
	

	protected com.jrapid.dao.DAO<? extends Entity> myDAO() {
		return State.DAO();
	}
	
	@Override
	public String toString() {
		StringBuffer buf = new StringBuffer();		
		
			buf.append(name + " ");
						
		return buf.toString();
	}
	

	
	public String getStyle() {
		return null;
	}
	
	
	public void remove() {
		myDAO().remove(this);		
	}

	public Long store() {
		return myDAO().store(this);		
	}
	
	
	
	private Long id;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
			

}
	