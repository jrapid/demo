
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT Interview.java INSTEAD! */
/**
 * InterviewAbstract.java
 *
 * This file contains the POJO definition for the Interview entity.
 *
 *
 * @see com.jrapid.demohr.dao.InterviewDAO
 * @see com.jrapid.demohr.dao.HibernateInterviewDAO
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

import com.jrapid.demohr.dao.InterviewDAO;



/**
  * 
  */  
public abstract class InterviewAbstract
		
		implements com.jrapid.entities.Entity  {

	
	private Employee employee;
	
	private String title;
	
	private java.util.GregorianCalendar interviewDate;
	
	private com.jrapid.entities.types.Time start;
	
	private com.jrapid.entities.types.Time end;
	
	private Boolean allDay;
	
	public Employee getEmployee() {
		return employee;
	}
	
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	
	public java.util.GregorianCalendar getInterviewDate() {
		return interviewDate;
	}
	
	public void setInterviewDate(java.util.GregorianCalendar interviewDate) {
		this.interviewDate = interviewDate;
	}
	
	
	public com.jrapid.entities.types.Time getStart() {
		return start;
	}
	
	public void setStart(com.jrapid.entities.types.Time start) {
		this.start = start;
	}
	
	
	public com.jrapid.entities.types.Time getEnd() {
		return end;
	}
	
	public void setEnd(com.jrapid.entities.types.Time end) {
		this.end = end;
	}
	
	
	public Boolean getAllDay() {
		return allDay;
	}
	
	public void setAllDay(Boolean allDay) {
		this.allDay = allDay;
	}
	
	
	
	
	
	public static InterviewDAO DAO() {
		return (InterviewDAO) MainDAOLocator.get().getInterviewDAO();		
	}
	
	

	protected com.jrapid.dao.DAO<? extends Entity> myDAO() {
		return Interview.DAO();
	}
	
	@Override
	public String toString() {
		StringBuffer buf = new StringBuffer();		
		
			buf.append(employee + " ");
		
			buf.append(title + " ");
						
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
	