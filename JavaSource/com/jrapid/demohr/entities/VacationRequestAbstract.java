
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT VacationRequest.java INSTEAD! */
/**
 * VacationRequestAbstract.java
 *
 * This file contains the POJO definition for the VacationRequest entity.
 *
 *
 * @see com.jrapid.demohr.dao.VacationRequestDAO
 * @see com.jrapid.demohr.dao.HibernateVacationRequestDAO
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

import com.jrapid.demohr.dao.VacationRequestDAO;



/**
  * 
  */  
public abstract class VacationRequestAbstract
		
		implements com.jrapid.entities.Entity  {

	
	private Employee emplyee;
	
	private java.util.GregorianCalendar fromDate;
	
	private java.util.GregorianCalendar toDate;
	
	private Boolean granted;
	
	public Employee getEmplyee() {
		return emplyee;
	}
	
	public void setEmplyee(Employee emplyee) {
		this.emplyee = emplyee;
	}
	
	
	public java.util.GregorianCalendar getFromDate() {
		return fromDate;
	}
	
	public void setFromDate(java.util.GregorianCalendar fromDate) {
		this.fromDate = fromDate;
	}
	
	
	public java.util.GregorianCalendar getToDate() {
		return toDate;
	}
	
	public void setToDate(java.util.GregorianCalendar toDate) {
		this.toDate = toDate;
	}
	
	
	public Boolean getGranted() {
		return granted;
	}
	
	public void setGranted(Boolean granted) {
		this.granted = granted;
	}
	
	
	
	
	
	public static VacationRequestDAO DAO() {
		return (VacationRequestDAO) MainDAOLocator.get().getVacationRequestDAO();		
	}
	
	

	protected com.jrapid.dao.DAO<? extends Entity> myDAO() {
		return VacationRequest.DAO();
	}
	
	@Override
	public String toString() {
		StringBuffer buf = new StringBuffer();		
		
			buf.append(emplyee + " ");
						
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
	