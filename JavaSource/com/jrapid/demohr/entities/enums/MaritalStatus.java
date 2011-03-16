
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT .java INSTEAD! */
package com.jrapid.demohr.entities.enums;

public enum MaritalStatus {

	S("Single")
		,M("Married")
		,D("Divorced")
		,W("Widowed")
		;
	
	private String label;
	
	MaritalStatus() {
		this.label = name();
	}
	
	MaritalStatus(String label) {
		this.label = label;
	}
	
	public String getLabel() {
		return label;
	}
	
}
	