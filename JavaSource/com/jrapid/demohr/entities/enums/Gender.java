
/* AUTO GENERATED FILE: DO NOT EDIT!!! EDIT .java INSTEAD! */
package com.jrapid.demohr.entities.enums;

public enum Gender {

	M("Male")
		,F("Female")
		;
	
	private String label;
	
	Gender() {
		this.label = name();
	}
	
	Gender(String label) {
		this.label = label;
	}
	
	public String getLabel() {
		return label;
	}
	
}
	