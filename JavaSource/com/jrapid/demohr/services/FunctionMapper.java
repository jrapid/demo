
package com.jrapid.demohr.services;
		

import com.jrapid.demohr.entities.*;

import com.jrapid.demohr.dao.MainDAOLocator;

import java.lang.reflect.Method;
import java.util.Collection;

import com.jrapid.entities.types.Time;
import com.jrapid.entities.types.TimeQuantity;
import com.jrapid.entities.types.TimeRange;
import com.jrapid.controller.Session;

import javax.servlet.jsp.el.ELException;
import org.apache.commons.el.ExpressionEvaluatorImpl;
import com.jrapid.services.ExpressionVariableResolver;


public class FunctionMapper extends com.jrapid.services.FunctionMapper {

	private static MainDAOLocator locator = MainDAOLocator.get();
		
	
	public static Employee find_Employee(Long id) {
		return locator.getEmployeeDAO().findById(id);
	}	
	public static Collection<Employee> findAll_Employee() {
		return locator.getEmployeeDAO().findAll();
	}
	public static Collection<Employee> findManyBy_Employee(String field, Object value) {
		return locator.getEmployeeDAO().findManyBy(field, value);
	}
	public static Employee findOneBy_Employee(String field, Object value) {
		return locator.getEmployeeDAO().findOneBy(field, value);
	}			
	
	public static Country find_Country(Long id) {
		return locator.getCountryDAO().findById(id);
	}	
	public static Collection<Country> findAll_Country() {
		return locator.getCountryDAO().findAll();
	}
	public static Collection<Country> findManyBy_Country(String field, Object value) {
		return locator.getCountryDAO().findManyBy(field, value);
	}
	public static Country findOneBy_Country(String field, Object value) {
		return locator.getCountryDAO().findOneBy(field, value);
	}			
	
	public static State find_State(Long id) {
		return locator.getStateDAO().findById(id);
	}	
	public static Collection<State> findAll_State() {
		return locator.getStateDAO().findAll();
	}
	public static Collection<State> findManyBy_State(String field, Object value) {
		return locator.getStateDAO().findManyBy(field, value);
	}
	public static State findOneBy_State(String field, Object value) {
		return locator.getStateDAO().findOneBy(field, value);
	}			
	
	public static Qualification find_Qualification(Long id) {
		return locator.getQualificationDAO().findById(id);
	}	
	public static Collection<Qualification> findAll_Qualification() {
		return locator.getQualificationDAO().findAll();
	}
	public static Collection<Qualification> findManyBy_Qualification(String field, Object value) {
		return locator.getQualificationDAO().findManyBy(field, value);
	}
	public static Qualification findOneBy_Qualification(String field, Object value) {
		return locator.getQualificationDAO().findOneBy(field, value);
	}			
	
	public static Interview find_Interview(Long id) {
		return locator.getInterviewDAO().findById(id);
	}	
	public static Collection<Interview> findAll_Interview() {
		return locator.getInterviewDAO().findAll();
	}
	public static Collection<Interview> findManyBy_Interview(String field, Object value) {
		return locator.getInterviewDAO().findManyBy(field, value);
	}
	public static Interview findOneBy_Interview(String field, Object value) {
		return locator.getInterviewDAO().findOneBy(field, value);
	}			
	
	public static Course find_Course(Long id) {
		return locator.getCourseDAO().findById(id);
	}	
	public static Collection<Course> findAll_Course() {
		return locator.getCourseDAO().findAll();
	}
	public static Collection<Course> findManyBy_Course(String field, Object value) {
		return locator.getCourseDAO().findManyBy(field, value);
	}
	public static Course findOneBy_Course(String field, Object value) {
		return locator.getCourseDAO().findOneBy(field, value);
	}			
	
	public static CourseTaken find_CourseTaken(Long id) {
		return locator.getCourseTakenDAO().findById(id);
	}	
	public static Collection<CourseTaken> findAll_CourseTaken() {
		return locator.getCourseTakenDAO().findAll();
	}
	public static Collection<CourseTaken> findManyBy_CourseTaken(String field, Object value) {
		return locator.getCourseTakenDAO().findManyBy(field, value);
	}
	public static CourseTaken findOneBy_CourseTaken(String field, Object value) {
		return locator.getCourseTakenDAO().findOneBy(field, value);
	}			
	
	public static VacationRequest find_VacationRequest(Long id) {
		return locator.getVacationRequestDAO().findById(id);
	}	
	public static Collection<VacationRequest> findAll_VacationRequest() {
		return locator.getVacationRequestDAO().findAll();
	}
	public static Collection<VacationRequest> findManyBy_VacationRequest(String field, Object value) {
		return locator.getVacationRequestDAO().findManyBy(field, value);
	}
	public static VacationRequest findOneBy_VacationRequest(String field, Object value) {
		return locator.getVacationRequestDAO().findOneBy(field, value);
	}			
	
	
	@SuppressWarnings("unchecked")
	public static Object fetchSet(Collection<Object> objs, String expr) throws ELException {
		ExpressionEvaluatorImpl el = new ExpressionEvaluatorImpl();
		Collection<Object> ret = new java.util.HashSet<Object>();
		java.util.Map<String, Object> map = new java.util.HashMap<String, Object>();
		ExpressionVariableResolver evr = new ExpressionVariableResolver(map);
		
		for (Object obj:objs) {
			map.put("obj", obj);
			Collection<Object> current = (Collection<Object>) el.evaluate("${obj." + expr + "}", Object.class, evr, new FunctionMapper());
			if (current != null) {
				ret.addAll(current);
			}
		}
		return ret;
	}
	
	public Method resolveFunction(String prefix, String name) {
		try {
			Method[] methods = FunctionMapper.class.getMethods();
			Method m = null;
			for (int i=0; i < methods.length; i++) {
				if (methods[i].getName().equals((prefix == null || "".equals(prefix) || "f".equals(prefix)) ? name : (name + "_" + prefix))) {
					m = methods[i];
					break;
				}
			}
			return m;
		} catch (SecurityException e) {
			return null;
		}
	}
}
	