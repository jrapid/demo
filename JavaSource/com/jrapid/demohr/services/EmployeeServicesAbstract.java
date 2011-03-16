

/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT EmployeeServices.java INSTEAD! */
/**
 * EmployeeServicesAbstract.java
 *
 * This file contains services that are exported for the Employee entity.
 * Methods are exported as REST Web Services by com.jrapid.demohr.controller.MainController
 *
 * /xml/Employee/(0-9) -> find()
 * /xml/Employee -> findPage()
 *
 *
 * @see com.jrapid.demohr.entitities.Employee
 * @see com.jrapid.demohr.dao.EmployeeDAO
 * @see com.jrapid.demohr.controller.MainController
 */

		
		
package com.jrapid.demohr.services;


import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

import org.apache.log4j.Logger;

import com.jrapid.demohr.entities.*;
import com.jrapid.demohr.dao.*;
import com.jrapid.demohr.services.FunctionMapper;
import com.jrapid.demohr.dao.MainDAOLocator;

import com.jrapid.dao.Order;
import com.jrapid.dao.DAO;
import com.jrapid.dao.Filter;
import com.jrapid.services.Page;
import com.jrapid.util.EL;
import com.jrapid.exception.ServiceException;
import com.jrapid.exception.ConfirmationException;
import com.jrapid.controller.Session;
import com.jrapid.entities.Entity;

public abstract class EmployeeServicesAbstract extends com.jrapid.services.Services {

	
	protected EL el = new EL(new FunctionMapper());
	protected Logger logger = Logger.getLogger(EmployeeServices.class);
	
	
	protected EmployeeDAO dao = (EmployeeDAO) Employee.DAO();
	
	
	
	
	

	public Boolean remove(String id) {
		dao.findById(id).remove();
		return true;
	}
	
	public Boolean removeMany(Collection<String> ids) {
		for (String id:ids) {
			this.remove(id);
		}
		return true;
	}

	
	/**
	 * /xml/Employee/(0-9+)
	 *
	 */	
	public Employee find(String id) {
	
		Employee obj = null;
		
		// step 1: build map
		Session session = Session.getMySession();
		Map<String, Object> map = new HashMap<String, Object>();
		
		if (id.equals("0")) {	
			// step 2: new object
			obj = new Employee();
			
			// step 3: setvalues
						
				
		} else {
			obj = Employee.DAO().findById(id);
		}
		
		
		
		// step 5: foreach
		
		
		// step 6: return
		return obj;
	}
	
	/**
	 *
	 *
	 */	
	public Object store(String id, Employee voobj) {
		Employee obj;		
		
		if (id.equals("0")) {
			obj = new Employee();	
					
			
			
		} else {
			obj = Employee.DAO().findById(id);
		}
		
		
		
		boolean isNewEmployeeN65606 = obj.getId() == null || obj.getId().equals(0L);
		
		
		
		if (voobj.getPicture() != null
			&& !voobj.getPicture().equals(obj.getPicture())) {
			voobj.setThumb(
				com.jrapid.util.ImageResizer.copyResizedImage(voobj.getPicture(), "120", ""));
		}
		obj.setPicture(voobj.getPicture()); 
		obj.setThumb(voobj.getThumb()); 
		obj.setFirstName(voobj.getFirstName()); 
		obj.setLastName(voobj.getLastName()); 
		obj.setFileNumber(voobj.getFileNumber()); 
		obj.setStatus(voobj.getStatus()); 
		obj.setSsn(voobj.getSsn()); 
		obj.setDateOfBirth(voobj.getDateOfBirth()); 
		obj.setGender(voobj.getGender()); 
		obj.setEmail(voobj.getEmail()); 
		obj.setPhone(voobj.getPhone()); 
		obj.setMobile(voobj.getMobile()); 
		obj.setMaritalStatus(voobj.getMaritalStatus()); 
		obj.setSpouse(voobj.getSpouse()); 
		obj.setAddress(voobj.getAddress()); 
		obj.setCity(voobj.getCity()); 
		obj.setCv(voobj.getCv()); 
		obj.getChildren().clear();
		obj.getChildren().addAll(voobj.getChildren());
		obj.getSkills().clear();
		obj.getSkills().addAll(voobj.getSkills());
		
		
		Collection<CourseTaken> currentN65856 = new HashSet<CourseTaken>();
		for (CourseTaken itemN65856:voobj.getCoursesTaken()) {
			CourseTaken newCourseTaken;
			if (itemN65856.getId() == null || itemN65856.getId().equals(0L) || isNewEmployeeN65606) {
				newCourseTaken = new CourseTaken();
			} else {
				newCourseTaken = CourseTaken.DAO().findBy(itemN65856);
			}

			CourseTaken vonewCourseTaken = itemN65856;
			
			
		
		boolean isNewCourseTakenN66105 = newCourseTaken.getId() == null || newCourseTaken.getId().equals(0L);
		
		
		newCourseTaken.setCompleted(vonewCourseTaken.getCompleted()); 
		newCourseTaken.setCourse(Course.DAO().findBy(vonewCourseTaken.getCourse()));			
		
			if (itemN65856.getId() == null || itemN65856.getId().equals(0L) || isNewEmployeeN65606) {
				newCourseTaken.setEmployee(obj);
				obj.getCoursesTaken().add(newCourseTaken);
			}	
			
			currentN65856.add(newCourseTaken);
		}
		obj.getCoursesTaken().retainAll(currentN65856);
		
		
		Collection<Qualification> currentN65844 = new HashSet<Qualification>();
		
		for (Qualification itemN65844:voobj.getQualifications()) {
			Qualification newQualificationN65844 = Qualification.DAO().findBy(itemN65844);
			obj.getQualifications().add(newQualificationN65844);
			currentN65844.add(newQualificationN65844);
		}
		obj.getQualifications().retainAll(currentN65844);
		obj.setCountry(Country.DAO().findBy(voobj.getCountry()));			
		obj.setState(State.DAO().findBy(voobj.getState()));			
		
		return obj.store();
						
	}	
	
	/**
	 * /xml/Employee
	 *
	 */	
	public Collection<Employee> findPage(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"firstName","lastName","fileNumber","status","email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}		
		
		if (order == null) {
			order = "lastName,firstName";
		}
		
		
		int count = dao.count(filters);
		List<Employee> list = dao.findMany(filters, order, first, max, hints);
		return new Page<Employee>(list, pageNumber, (count-1)/max+1, count);		
	}
	
	
	
	/**
	 * /xml/Employee/employees
	 *
	 */	
	public Collection<Employee> findSubsetEmployees(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"firstName","lastName","fileNumber","status","email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}				
		
		
		int count = dao.count(filters.and(dao.getEmployeesSubsetFilter()));
		List<Employee> list = dao.findEmployees( filters, order, first, max, hints);
		return new Page<Employee>(list, pageNumber, (count-1)/max+1, count);		 
	}
	
	
	/**
	 * /xml/Employee/former
	 *
	 */	
	public Collection<Employee> findSubsetFormer(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"firstName","lastName","fileNumber","status","email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}				
		
		
		int count = dao.count(filters.and(dao.getFormerSubsetFilter()));
		List<Employee> list = dao.findFormer( filters, order, first, max, hints);
		return new Page<Employee>(list, pageNumber, (count-1)/max+1, count);		 
	}
	
	
	/**
	 * /xml/Employee/employee
	 *
	 */	
	public Collection<Employee> findSubsetEmployee(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"firstName","lastName","fileNumber","status","email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}				
		
		
		int count = dao.count(filters.and(dao.getEmployeeSubsetFilter()));
		List<Employee> list = dao.findEmployee( filters, order, first, max, hints);
		return new Page<Employee>(list, pageNumber, (count-1)/max+1, count);		 
	}
	
	
	/**
	 * /xml/Employee/candidate
	 *
	 */	
	public Collection<Employee> findSubsetCandidate(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"firstName","lastName","fileNumber","status","email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}				
		
		
		int count = dao.count(filters.and(dao.getCandidateSubsetFilter()));
		List<Employee> list = dao.findCandidate( filters, order, first, max, hints);
		return new Page<Employee>(list, pageNumber, (count-1)/max+1, count);		 
	}
	
	
	/**
	 * /xml/Employee/prospects
	 *
	 */	
	public Collection<Employee> findSubsetProspects(Map<String, String> params) {
		Map<String, Object> map = buildParamsMap(params);
		Filter filters = dao.buildFiltersFromMap(map);
		
		
		int pageNumber = params.get("_page") == null ? 1 : Integer.parseInt(params.get("_page").toString());
		int first = (pageNumber-1) * 50;
		int max = params.get("_page") == null ? Integer.MAX_VALUE : 50;
		String hints = null;
		
		String order = (String) params.get("_order");
		if (order != null) {
			int index = (order.indexOf("d") > 0) ? Integer.valueOf(order.substring(0, order.indexOf("d"))) : Integer.valueOf(order);
			String[] columns = new String[]{"firstName","lastName","fileNumber","status","email",""};
			order = columns[index] + (order.indexOf("d") > 0 ? " desc": "");
		}				
		
		
		int count = dao.count(filters.and(dao.getProspectsSubsetFilter()));
		List<Employee> list = dao.findProspects( filters, order, first, max, hints);
		return new Page<Employee>(list, pageNumber, (count-1)/max+1, count);		 
	}
	
	
	
	protected Object parse(String filter, String value) {
		if ("lastName".equals(filter)) {
			
							return value;
						
		}
		else if ("ssnFilter".equals(filter)) {
			
							return value;
						
		}
		else if ("country".equals(filter)) {
			
							return Country.DAO().findById(value);
						
		}
		else if ("qualificationsFilter".equals(filter)) {
			
							return Qualification.DAO().findById(value);
						
		}
		else if ("gender".equals(filter)) {
			
							return new com.jrapid.controller.servers.castor.StringHandler().convertUponSet(value);		
						
		}
		else if ("countriesFilter".equals(filter)) {
			
							return Country.DAO().findByIds(value.split(","));
						
		}
		
		return null;
	}
	

	 
	
	// code for dynamic values
	
	
	// code for dynamic foreach
	
	
	
	// code for suggest
	
	public List<Object> suggestCity(String prefix) {
		return dao.suggestCity(prefix);
	}
	
		
	// code for conditionals
	

	// code for unique
	
			
	// code for defaultsets
	
}

	