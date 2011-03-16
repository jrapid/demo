
package com.jrapid.demohr.dao;
		

import com.jrapid.demohr.entities.*;
import com.jrapid.demohr.dao.hibernate.*;

import com.jrapid.dao.DAO;
import com.jrapid.dao.hibernate.HibernateDAO;

public class MainDAOLocator extends com.jrapid.dao.DAOLocator  {

	private static MainDAOLocator me = new MainDAOLocator();
	
	private MainDAOLocator() {
		super();
		setAll();
	}
	
	public void setAll() {
		
		setDAO(Employee.class, new HibernateEmployeeDAO());
						
			
		
		setDAO(Country.class, new HibernateCountryDAO());
						
			
		
		setDAO(State.class, new HibernateStateDAO());
						
			
		
		setDAO(Qualification.class, new HibernateQualificationDAO());
						
			
		
		setDAO(Interview.class, new HibernateInterviewDAO());
						
			
		
		setDAO(Course.class, new HibernateCourseDAO());
						
			
		
		setDAO(CourseTaken.class, new HibernateCourseTakenDAO());
						
			
		
		setDAO(VacationRequest.class, new HibernateVacationRequestDAO());
						
			
							
	}
	
	public static MainDAOLocator get() {
		return me;
	}
	
	
	public DAO<Employee> getEmployeeDAO() {
		return me.getDAO(Employee.class);
	}			
	
	public DAO<Country> getCountryDAO() {
		return me.getDAO(Country.class);
	}			
	
	public DAO<State> getStateDAO() {
		return me.getDAO(State.class);
	}			
	
	public DAO<Qualification> getQualificationDAO() {
		return me.getDAO(Qualification.class);
	}			
	
	public DAO<Interview> getInterviewDAO() {
		return me.getDAO(Interview.class);
	}			
	
	public DAO<Course> getCourseDAO() {
		return me.getDAO(Course.class);
	}			
	
	public DAO<CourseTaken> getCourseTakenDAO() {
		return me.getDAO(CourseTaken.class);
	}			
	
	public DAO<VacationRequest> getVacationRequestDAO() {
		return me.getDAO(VacationRequest.class);
	}			
	
}
	