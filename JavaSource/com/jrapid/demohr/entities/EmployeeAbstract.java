
	
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT Employee.java INSTEAD! */
/**
 * EmployeeAbstract.java
 *
 * This file contains the POJO definition for the Employee entity.
 *
 *
 * @see com.jrapid.demohr.dao.EmployeeDAO
 * @see com.jrapid.demohr.dao.HibernateEmployeeDAO
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

import com.jrapid.demohr.dao.EmployeeDAO;



/**
  * 
  */  
public abstract class EmployeeAbstract
		
		implements com.jrapid.entities.Entity  {

	
	private String picture;
	
	private String thumb;
	
	private String firstName;
	
	private String lastName;
	
	private String fileNumber;
	
	private String status;
	
	private String ssn;
	
	private java.util.GregorianCalendar dateOfBirth;
	
	private String gender;
	
	private String email;
	
	private String phone;
	
	private String mobile;
	
	private String maritalStatus;
	
	private String spouse;
	
	private java.util.Set<String> children = new java.util.HashSet<String>();
	
	private String address;
	
	private Country country;
	
	private State state;
	
	private String city;
	
	private String cv;
	
	private java.util.Set<String> skills = new java.util.HashSet<String>();
	
	private java.util.Set<Qualification> qualifications = new java.util.HashSet<Qualification>();
	
	private java.util.Set<CourseTaken> coursesTaken = new java.util.HashSet<CourseTaken>();
	
	public String getPicture() {
		return picture;
	}
	
	public void setPicture(String picture) {
		this.picture = picture;
	}
	
	
	public String getThumb() {
		return thumb;
	}
	
	public void setThumb(String thumb) {
		this.thumb = thumb;
	}
	
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	
	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	
	public String getFileNumber() {
		return fileNumber;
	}
	
	public void setFileNumber(String fileNumber) {
		this.fileNumber = fileNumber;
	}
	
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	
	public String getSsn() {
		return ssn;
	}
	
	public void setSsn(String ssn) {
		this.ssn = ssn;
	}
	
	
	public java.util.GregorianCalendar getDateOfBirth() {
		return dateOfBirth;
	}
	
	public void setDateOfBirth(java.util.GregorianCalendar dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	
	
	public String getGender() {
		return gender;
	}
	
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	
	public String getPhone() {
		return phone;
	}
	
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	
	public String getMobile() {
		return mobile;
	}
	
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	
	
	public String getMaritalStatus() {
		return maritalStatus;
	}
	
	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}
	
	
	public String getSpouse() {
		return spouse;
	}
	
	public void setSpouse(String spouse) {
		this.spouse = spouse;
	}
	
	
	public java.util.Set<String> getChildren() {
		return children;
	}
	
	public void setChildren(java.util.Set<String> children) {
		this.children = children;
	}
	
	
	public String getAddress() {
		return address;
	}
	
	public void setAddress(String address) {
		this.address = address;
	}
	
	
	public Country getCountry() {
		return country;
	}
	
	public void setCountry(Country country) {
		this.country = country;
	}
	
	
	public State getState() {
		return state;
	}
	
	public void setState(State state) {
		this.state = state;
	}
	
	
	public String getCity() {
		return city;
	}
	
	public void setCity(String city) {
		this.city = city;
	}
	
	
	public String getCv() {
		return cv;
	}
	
	public void setCv(String cv) {
		this.cv = cv;
	}
	
	
	public java.util.Set<String> getSkills() {
		return skills;
	}
	
	public void setSkills(java.util.Set<String> skills) {
		this.skills = skills;
	}
	
	
	public java.util.Set<Qualification> getQualifications() {
		return qualifications;
	}
	
	public void setQualifications(java.util.Set<Qualification> qualifications) {
		this.qualifications = qualifications;
	}
	
	
	public java.util.Set<CourseTaken> getCoursesTaken() {
		return coursesTaken;
	}
	
	public void setCoursesTaken(java.util.Set<CourseTaken> coursesTaken) {
		this.coursesTaken = coursesTaken;
	}
	
	
	
	
	
	public static EmployeeDAO DAO() {
		return (EmployeeDAO) MainDAOLocator.get().getEmployeeDAO();		
	}
	
	

	protected com.jrapid.dao.DAO<? extends Entity> myDAO() {
		return Employee.DAO();
	}
	
	@Override
	public String toString() {
		StringBuffer buf = new StringBuffer();		
		
			buf.append(firstName + " ");
		
			buf.append(lastName + " ");
		
			buf.append(email + " ");
						
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
	