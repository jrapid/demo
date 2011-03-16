

package com.jrapid.demohr.controller;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;

import com.jrapid.controller.Filter;
import com.jrapid.controller.FilterManager;
import com.jrapid.dao.hibernate.HibernateBeginFilter;
import com.jrapid.dao.hibernate.HibernateCommitFilter;
import com.jrapid.dao.hibernate.HibernateRollbackFilter;

public class MainController extends MainControllerAbstract {
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		
		FilterManager.registerFilter(Filter.BEGIN, new HibernateBeginFilter());		
		FilterManager.registerFilter(Filter.COMMIT, new HibernateCommitFilter());		
		FilterManager.registerFilter(Filter.ROLLBACK, new HibernateRollbackFilter());
		
	} 
	
}





	