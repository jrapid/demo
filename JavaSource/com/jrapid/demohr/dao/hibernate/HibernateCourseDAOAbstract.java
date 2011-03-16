
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT HibernateCourseDAO.java INSTEAD! */
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
import com.jrapid.demohr.dao.CourseDAOAbstract;

public abstract class HibernateCourseDAOAbstract extends HibernateDAO<Course> implements CourseDAOAbstract {

	private EL el = new EL(new FunctionMapper());
		
	public HibernateCourseDAOAbstract() {
		super(Course.class);
	}
	
	// subsets
	
	
	// filters	
	
	
	// subset filters
	
	
	// code for suggest
	
}



	