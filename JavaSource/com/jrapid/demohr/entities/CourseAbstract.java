
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT Course.java INSTEAD! */
/**
 * CourseAbstract.java
 *
 * This file contains the POJO definition for the Course entity.
 *
 *
 * @see com.jrapid.demohr.dao.CourseDAO
 * @see com.jrapid.demohr.dao.HibernateCourseDAO
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

import com.jrapid.demohr.dao.CourseDAO;



/**
  * 
  */  
public abstract class CourseAbstract
		
		implements com.jrapid.entities.Entity  {

	
	private String name;
	
	private String description;
	
	/**
	 *  Duration in hours
	 */
	
	private Integer duration;
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	
	public Integer getDuration() {
		return duration;
	}
	
	/**
	 *  @param durationDuration in hours
	 */
	
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	
	
	
	
	
	public static CourseDAO DAO() {
		return (CourseDAO) MainDAOLocator.get().getCourseDAO();		
	}
	
	

	protected com.jrapid.dao.DAO<? extends Entity> myDAO() {
		return Course.DAO();
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
	