
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT CourseTaken.java INSTEAD! */
/**
 * CourseTakenAbstract.java
 *
 * This file contains the POJO definition for the CourseTaken entity.
 *
 *
 * @see com.jrapid.demohr.dao.CourseTakenDAO
 * @see com.jrapid.demohr.dao.HibernateCourseTakenDAO
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

import com.jrapid.demohr.dao.CourseTakenDAO;



/**
  * 
  */  
public abstract class CourseTakenAbstract
		
		implements com.jrapid.entities.Entity  {

	
	private Course course;
	
	private Employee employee;
	
	private Boolean completed;
	
	public Course getCourse() {
		return course;
	}
	
	public void setCourse(Course course) {
		this.course = course;
	}
	
	
	public Employee getEmployee() {
		return employee;
	}
	
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	
	
	public Boolean getCompleted() {
		return completed;
	}
	
	public void setCompleted(Boolean completed) {
		this.completed = completed;
	}
	
	
	
	
	
	public static CourseTakenDAO DAO() {
		return (CourseTakenDAO) MainDAOLocator.get().getCourseTakenDAO();		
	}
	
	

	protected com.jrapid.dao.DAO<? extends Entity> myDAO() {
		return CourseTaken.DAO();
	}
	
	@Override
	public String toString() {
		StringBuffer buf = new StringBuffer();		
						
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
	