
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT .java INSTEAD! */
package com.jrapid.demohr.entities.enums;

public enum EmployeeStatus {

	C("Candidate")
		,E("Employee")
		,F("Former Employee")
		;
	
	private String label;
	
	EmployeeStatus() {
		this.label = name();
	}
	
	EmployeeStatus(String label) {
		this.label = label;
	}
	
	public String getLabel() {
		return label;
	}
	
}
	