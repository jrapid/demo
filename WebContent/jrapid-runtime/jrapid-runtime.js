/**************************** JRAPID PUBLIC FUNCTIONS **********************************/

if (typeof(jrapid) == 'undefined') {

function JRapid(obj) { };

JRapid.prototype.form = function( params ) {
	var container = params.obj && params.obj.getContainer ? params.obj.getContainer() : null; 
	jrapid.open(
		container,      // container
		params.canvas,  // canvas
		params.url,     // url  
		params.module,  // module
		params.entity,  // entity
		'_form',        // suffix
		'.html',        // extension
		params.url,     // root 
		jrapid.load,    // handler
		params          // params
	);
};

JRapid.prototype.listing = function( params ) {
	var node = jrapid.open(
		params.obj, 		// container
		params.canvas,  	// canvas
		params.url,			// url 
		params.module, 		// module
		params.entity, 		// entity
		(params.listing ? ('_' + params.listing) : '') + '_list',   // suffix 
		'.html', 			// extension
		params.url,			// root ???
		jrapid.listingLoad,	// handler
		params				// params
	);
	
	// this code is for listings in panels
	if (params.childForms && params.childForms.length) {
		node.triggers = [];
		node.triggers[0] = function(foo, id) {
			// TODO only xsl (and just the current xsl) should be refreshed. 
			// it must work with more than one param and with defaultset
			for (var i=0, c=params.childForms, n=c.length; i < n; i++) {
				c[i].id = id;
				jrapid.form(c[i]);
			}
		};
	}
};


JRapid.prototype.crosstab = function( params ) {
	var container = params.obj && params.obj.getContainer ? params.obj.getContainer() : null;
	jrapid.open(
		container,
		params.canvas, 
		params.url, 
		params.module, 
		params.entity, 
		'_crosstab', 
		'.jsp', 
		params.url, 
		function(container) {
			if (params.target == 'window') {
				application.openWindow(params.entity, container.node);		
			}
		}, 
		params
	);	
};

JRapid.prototype.chart = function(obj) {
	var canvas = obj.canvas;
	var container = obj.obj && obj.obj.getContainer ? obj.obj.getContainer() : null;
	var url = obj.url;
	var module = obj.module;
	var entity = obj.entity;
	
	var img = document.createElement('img');
	var rootUrl = jrapid.getURL(container, url);
	img.src = rootUrl + 'bi.' + module + '/' + entity + '_crosstab.jsp?chart=pie&rows='
					+ obj.rows + '&columns=' + obj.columns;	
    
    // append source to canvas
    if (canvas && canvas.appendChild) {
    	canvas.appendChild(img);
    } else if ((typeof canvas) == 'string' && document.getElementById(canvas)) {
    	var c = document.getElementById(canvas);
    	c.appendChild(img);
    }  else {
    	document.body.appendChild(img);
    }

};


/**************************** JRAPID PRIVATE FUNCTIONS **********************************/

/* WARNING!
 * 
 * You shouldn't call functions below these lines since their signature can changed 
 * without further notice.
 * 
 */

JRapid.prototype.KEY_TAB = 9;
JRapid.prototype.KEY_ESC = 27;
JRapid.prototype.KEY_ENTER = 13;
JRapid.prototype.KEY_UP = 38;
JRapid.prototype.KEY_DOWN = 40;
JRapid.prototype.KEY_SHIFT = 16;
JRapid.prototype.KEY_CTRL = 17;
JRapid.prototype.KEY_ALT = 18;
JRapid.prototype.KEY_F9 = 120;

/**************************** ERROR HANDLING **********************************/

/******************************* UTILS ***************************************/

JRapid.prototype.wrap = function(obj) {
	return application.wrapNode(obj);	
};

JRapid.prototype.get = function(id) {
	return application.getElementById(id);	
};

JRapid.prototype.getURL = function(container, def, childContainer) {
	if ((typeof def) == 'string') {
		if (childContainer) {
			childContainer.node.setAttribute('rooturl', def);
		}
		return def;
	}
	var url = null;
	
	if (container && container.node) {
		url = container.node.getAttribute('rooturl');
		if (childContainer && url ) {
			// copy url from container
			childContainer.node.setAttribute('rooturl', url);
		}
	}
	
	return (typeof url) == 'string' ? url : (jrapid.url ? jrapid.url : '../');
};


// returns the path to the services url (root)
JRapid.prototype.getServerPath = function(container) {
	return jrapid.getURL( container ) + "xml/";
};

// public, id is a string, node is an html element.
JRapid.prototype.getElementsById = function(id, node) {
	if (document.all) {
        var n = document.all[id];
        var ret = [];
    	if (n == null) { return []; };
    	if (n.length == null || n.length == 0 || (n.tagName && n.tagName.toLowerCase() == 'select')) {
    		return [n];
    	}   
    	var isChildOf = function(obj, p) {
    		while (obj) {
    			if (obj == p) return true;
    			obj = obj.parentNode;
    		}
    		return false;
    	};
    	for (var i=0; i < n.length; i++) {
    		if (!node || isChildOf(n[i], node)) {
    			ret[ret.length] = n[i];
    		}
    	}
    	return ret;
    } else if (node && node.querySelectorAll) {
    	return node.querySelectorAll('#' + id);
    } else if (document.querySelectorAll) {
    	return document.querySelectorAll('#' + id);
    } else if (document.evaluate) {
    	var ret = new Array();    
        var result = document.evaluate("//*[@id='" + id + "']", node ? node : document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        var el;
        while (el = result.iterateNext()) {
        	ret[ret.length] = el;
        }
        return ret;
    }
};

JRapid.prototype.getParam = function(param, def) {
	var url = window.location.search.toString().substring(1);
    var params = url.split('&');
    for (var i=0; i < params.length; i++) {
        var parameter = params[i].split("=");        
        if (parameter[0] == param) {
            return parameter[1];        
        }
    }
    
	var hash = window.location.hash;
	if (hash && hash.length > 0) {
		var params = hash.substring(1).split('&');
	    for (var i=0; i < params.length; i++) {
	        var parameter = params[i].split("=");	        
	        if (parameter[0] == param) {
	        	return parameter[1];        
	        }
	    }
	}
	
    return def;
};

JRapid.prototype.createSource = function() {
	var source = document.createElement('div');
	source.setAttribute('jclass', 'JRapid_Source');
	source.setAttribute('class', 'JRapid_Source');	
	source.className = 'container__';
	return jrapid.wrap(source);
};

JRapid.prototype.replaceAll = function(string, pattern, replacement) {
    while (string.match(pattern)) {
        string = string.replace(pattern, replacement);
    }
    return string;
};

JRapid.prototype.getRowFor = function(me) {
    var row = me.outerNode;
    while (row && row.getAttribute) {
        if (row.getAttribute('row') == 'row') {
            return row;            
        }
        row = row.parentNode;
    }    
};

/********************************* UI ***************************************/

JRapid.prototype.experience = function(url, tags,layout, listing, forms, views) {
	if (!jrapid.experience.done) {
		jrapid.experience.url = url;
		jrapid.experience.done = true;
		jrapid.experienceFor(url, 'tags', tags);
		jrapid.experienceFor(url, 'layout', layout);
		jrapid.experienceFor(url, 'listing', listing);
		jrapid.experienceFor(url, 'forms', forms);
		jrapid.experienceFor(url, 'views', views);
	}
};

JRapid.prototype.expTarget = function(v) {
	jrapid.target = v;
};

JRapid.prototype.exp = function(url, name, value, check) {
	if (check) {
		var head = document.getElementsByTagName('head')[0];	
		var link = document.createElement('link');
		link.type = 'text/css';
		link.id = value;
		//link.href = value.indexOf('http://') >= 0 ? value : (url + '/css/jrapid-' + name + (value ? '.' + value : '') + '.css');
		link.href = value.indexOf('http://') >= 0 ? value : (url + '/css/' + value);
		link.rel = 'stylesheet';
		head.appendChild(link);
		
		// set cookie
		var date = new Date();
		date.setTime(new Date().getTime()+(365*24*60*60*1000));
		// TODO add path to root folder
		var v = value.substring(('jrapid-' + name).length+1);
		v = v.substring(0, v.lastIndexOf('.css'));
		document.cookie = name + "=" + v + ";" + 'expires=' + date.toGMTString() + ';';
		
	} else {
		var links = document.getElementsByTagName('link');
		for (var i=links.length-1; i >= 0; i--) {
			if (links[i].id == value) {
				links[i].parentNode.removeChild(links[i]);
			}
		}
	}
};

window.addEventListener('keyup', function(ev) {
	if (ev.keyCode == jrapid.KEY_F9) {
		jrapid.customizeExperience('jrapid-runtime');
	}				
}, true);

JRapid.prototype.customizeExperience = function() {
	var url = jrapid.experience.url;
	var ajax = new XMLHttpRequest();
	ajax.open('GET', url + '/css/stylesheets.jsp', true);
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4) {

			var libs = ajax.responseText.split('\n');
			var types = ['tags', 'layout', 'listing', 'forms'];
			var div = document.createElement('div');
			var s = '';
			
			for (var i=0; i < types.length; i++) {
				s += '<fieldset style="float: left;"><legend>' + types[i] + '</legend>';
				for (var j=0; j < libs.length; j++) {
					var l = libs[j].replace(/\s+/g, '');
					if (l.indexOf('jrapid-' + types[i]) == 0) {
						var checked = document.getElementById(l) ? 'checked="checked"' : '';
						s += '<div><input type="checkbox" ' + checked + ' onclick="jrapid.exp(\'' + url + '\', \'' + types[i] + '\', this.value, this.checked);" value="' + l + '">' + l + '</div>';
					}
				}
				s += '</fieldset>';
			}
			
			s += '<fieldset style="float: left;"><legend>vars</legend>';
			s += 'mode <select onchange="jrapid.expTarget(this.value);"><option>window</option><option>replace</option><option>append</option><option>insert</option><option>href</option></select>';
			s += '</fieldset>';
						
			div.innerHTML = s;
			document.body.appendChild(div);
			jrapid.wrap(application.openWindow('Customize experience', div)).center();
		}
	};
	ajax.send('');
	
	
};

JRapid.prototype.experienceFor = function(baseUrl, name, value) {
	////var value = "";
	// read cookie
	var cookies = document.cookie.split(';');
	var setInCookie = false;
	for (var i=0; i < cookies.length; i++) {
		var c = cookies[i].split('=');
		if (c[0].replace(/\s+/g, '') == name) {
			if (c[1]) {
				value = c[1];
			}
			break;
		}
	}
	// read url
	var url = window.location.search.toString();
	if (url.indexOf(name + '=') != -1) {
		value = url.substring(url.indexOf(name + '=') + name.length + 1);
		if (value.indexOf('&') != -1) {
			value = value.substring(0, value.indexOf('&'));
		}
		setInCookie = true;
	} 
		
	// set cookie
	if (setInCookie) {
		var date = new Date();
		date.setTime(new Date().getTime()+(365*24*60*60*1000));
	    var expires = 'expires=' + date.toGMTString() + ';';
	    // TODO add path to root folder
		document.cookie = name + "=" + value + ";" + expires;
	}
	
	// write css
	if (value) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.type = 'text/css';
		link.href = value.indexOf('http://') >= 0 ? value : (baseUrl + '/css/jrapid-' + name + (value ? '.' + value : '') + '.css');
		link.rel = 'stylesheet';
		link.id = 'jrapid-' + name + (value ? '.' + value : '') + '.css';
		head.appendChild(link);
	}
};

/********************************* NEXT ***************************************/

JRapid.prototype.nextreport = function(key, me) {
	window.open('../report/' + me.getAttribute('report') + '?' + key 
		+ (me.getAttribute('pdf') ? '&pdf=pdf' : ''), '_blank', 'width=700,height=600,resizable=yes');
};

JRapid.prototype.nextfunction = function(key, me) {
	eval(me.getAttribute('function') + '(key, me)');
};

JRapid.prototype.nextpanel = function(key, me) {
	window.location = me.getAttribute('panel') + JRapid.FILE_EXTENSION;
};

JRapid.prototype.nextform = function(key, me) {
	jrapid.form( {
		entity: me.getAttribute('entity'), 
		id: key, 
		defaultset: me.getAttribute('defaultset'),
		defaultsetparams: key,
		target: 'window'
	} );    
};

JRapid.prototype.nextmessage = function(key, me) {
	me.getContainer().getElementById('windowcontainer').outerNode.innerHTML = '<div class="jrapid_message">' + me.getAttribute('message'); + '</div>';	    
};

/********************************* CRUD ***************************************/

JRapid.prototype.message = function(m) {
	alert(m);
};

JRapid.prototype.cancel = function(obj) {
    var container = jrapid.wrap(obj).getContainer();
    container.node.parentNode.removeChild(container.node);
};

JRapid.prototype.apply = function(me, handler, confirmed, prompted, doNotClose) {

    var container = me.getContainer();
    var xml = container.getElementById('xml');
    me.setDisabled(true);
    jrapid.hasErrors = '';
    
    // rich texts
    var xmlOuter = xml.outerNode;
    if (xmlOuter && xmlOuter.triggers && xmlOuter.triggers['__onapply']) {
        for (var i=0; i < xmlOuter.triggers['__onapply'].length; i++) {
            xmlOuter.triggers['__onapply'][i].execute(null, me);
        }
    }
    
    // validate
    if (jrapid.hasErrors.length || !this.validate(container.getElementById('form').outerNode)) {
        if (jrapid.hasErrors.length) {
            jrapid.message(jrapid.hasErrors);
        }
        me.setDisabled(false);
        return false;
    }

    
    // confirmation handling
    if (!jrapid.url) {
    	// TODO make it work with proxy
    	this.setConfirmedAndPrompted(xml, confirmed, prompted);
    }
    
    // set timeout
    var t;
    if (jrapid.timeoutSeconds) {
        var timeout = function() {
                //jrapid.endTransaction(transactionId);
        	if (t && !confirm(jrapid.timeoutSeconds + ' seconds have passed. \n\nPlease verify your Internet connection.\n\nKeep waiting?')) {
                me.setDisabled(false);
                xml.abort();
            } else if (t) {
                t = setTimeout(timeout, jrapid.timeoutSeconds*1000);
            }
        };
        t = setTimeout(timeout, jrapid.timeoutSeconds*1000);
    }
    
    // init transation
    var tx = jrapid.startConsole('Applying', false, 'green');
  
    // send the post
    xml.post(function(xmlDoc, status) {
    
    	// end console
    	jrapid.endConsole(tx);    		
   	
        // clear timeout
        if (t) { clearTimeout(t); t = null; }
        
		// check network error
		if (status != 200) {
			me.setDisabled(false);
			jrapid.startConsole('Network error', true, 'red');
			return false;
		}
    
        // do the work
        if (xmlDoc == null || xmlDoc.documentElement == null || xmlDoc.documentElement.tagName == 'exception') {
            me.setDisabled(false); 
            jrapid.startConsole('Error', true, 'red');
            if (xmlDoc != null && xmlDoc.documentElement && xmlDoc.documentElement.hasChildNodes()) {
                jrapid.message(xmlDoc.documentElement.childNodes[0].nodeValue);
            } else {
            	jrapid.message('Unable to store');
            }
            return false;
        } else if (xmlDoc.documentElement.tagName == 'confirmation') {
            jrapid.startConsole('Confirm', true, 'yellow');
            if (confirm(xmlDoc.documentElement.childNodes[0].nodeValue)) {
                return jrapid.apply(me, handler, (confirmed ? (confirmed+',') : '') + xmlDoc.documentElement.getAttribute('code'));
            } else {
                me.setDisabled(false);
                return;
            }
        } else if (xmlDoc.documentElement.tagName == 'prompt') {
            jrapid.startConsole('Prompt', true, 'yellow');
            var value;
            if (value = prompt(xmlDoc.documentElement.childNodes[0].nodeValue, '')) {
                return jrapid.apply(me, handler, confirmed, (prompted ? (prompted+',') : '') + xmlDoc.documentElement.getAttribute('code') + '=' + value);
            } else {
                me.setDisabled(false);
                return;
            }
        } 
        
        jrapid.startConsole('Saved', true, 'green');
        if (container.node && container.node.listingContainer) {
        	var xsl = jrapid.listingGetXsl(container.node.listingContainer);
        	if (xsl && xsl.refresh) {
        		xsl.refresh();
        	}
        }
        
		if (doNotClose) {
			var id =  xmlDoc.documentElement.childNodes[0].nodeValue;
			var oldDoc = xml.getXmlDocument();
			oldDoc.selectSingleNode('/*').setAttribute('id', id);
			xml.setXml(oldDoc.xml);
			me.setDisabled(false);
		}

        if (handler) {
            handler(xmlDoc.documentElement && xmlDoc.documentElement.hasChildNodes() ? xmlDoc.documentElement.childNodes[0].nodeValue : null);
        }
		
        try { 
        	if (!doNotClose && !xml.getAttribute('repeat')) {
        		container.close();        		
			}
		} catch (e) {
	    }
		me.setDisabled(false);
        
    });
    
};

JRapid.prototype.setConfirmedAndPrompted = function(xml, confirmed, prompted) {
    var url = xml.getUrl();
    if (url.indexOf('?') >= 0) {
        url = url.split('?')[0];
    }
    url += '?';
    if (confirmed) {
        url += 'confirmed=' + confirmed;
    }
    if (prompted) {
        var prompts = prompted.split(',');
        var promptParam = '';
        for (var i=0; i < prompts.length; i++) {
            promptParam += (i > 0 ? ',' : '') + prompts[i].split('=')[0];
            url += '&' + prompts[i];
        }            
        url += '&prompted=' + promptParam;
    }
    xml.setUrl(url);
};

JRapid.prototype.store = function(me, handler, isAsync, entity) {
	this.apply(
		me, 
		function(key) {
	    	var container = me.getContainer();
	    	if (handler) {
		        if (handler(key, me)) {
		        	return;
		        }
			}
			if (isAsync) {
				jrapid.startAsyncConsole(container, key, entity);
			}
			var xml = container.getElementById('xml');
			if (xml && xml.getAttribute('repeat')) {
		        jrapid.loadForm( me.getContainer(), entity, '0', null, false, null, null, null, true );
	        }
	    }, 
	    null, 
	    null, 
	    handler == jrapid.nextmessage
	);
};

// TODO: use only one JSON param
JRapid.prototype.open = function(container, canvas, url, module, entity, suffix, extension, root, handler, params) {
	
	var target = params.target ? params.target : jrapid.target;
	var insert = target == 'insert';
	var replace = target == 'replace';
	params.openWindow = target == 'window';
	canvas = canvas ? canvas : (target != 'window' ? document.getElementById('panel') : null);
	
    // clone source
    var source = jrapid.createSource(true);
    params.source = source.outerNode.id = 'source_' + Math.random();    
    
    // append source to canvas
    var c = null;
    if (canvas && canvas.appendChild) {
    	c = canvas;
    } else if ((typeof canvas) == 'string' && document.getElementById(canvas)) {
    	// TODO: should we validate that there is only one element with the canvas id ??
    	c = document.getElementById(canvas);
    } 
    
    if ( c ) {
    	if (replace) { 
    		c.innerHTML = ''; 
    	} 
    	if (insert && c.children.length) { 
    		c.insertBefore( source.outerNode, c.children[0] );
    	} else {
    		c.appendChild( source.outerNode );
    	}
    } else {
    	document.body.appendChild( source.outerNode );
    }
   
    // window
   /* var w;
    if (openWindow) {
    	w = application.openWindow(entity, source.outerNode);
    	w.setAttribute('onresizewindow', 'jrapid.onResizeListWindow(this, "' + id + '");');
		w.helpButton.setAttribute("onhelpclick", "jrapid.openHelp(jrapid.wrap(this),'" + entity + "',false)");
    }*/
	    
    // console
    var console = jrapid.startConsole('Opening listing', false, 'green');
	   
    // load source
    var childContainer = source.getChildContainer();
    
    var rootUrl = jrapid.getURL( container, url, childContainer );
    source.setUrl(rootUrl + jrapid.prefix + module + '/' + entity + suffix + extension);
    params.sourceUrl = source.getUrl();
    
    // set the listingContainer value of the opener container to this container (used in refresh, for ex.)
    childContainer.node.listingContainer = container; 
    
    if (target == 'href') {
    	window.location = source.getUrl();
    }
    
    source.open(function() {
    	jrapid.endConsole(console);    	
    	handler(childContainer, rootUrl, entity, params);
    });
    
    return source.outerNode;
};


JRapid.prototype.formOnLoad = function(entity) {
	jrapid.load(application, jrapid.getURL(), entity, {
		inOnLoad: true,
		openWindow: jrapid.getParam('w'),
		id: jrapid.getParam('id'),
		defaultset: jrapid.getParam('defaultset'),
		defaultsetparams: jrapid.getParam('defaultsetparams'),
		noscroll: true
	});	
};

JRapid.prototype.listingOnLoad = function(entity, subset, label) {
	jrapid.listingLoad(
		application, 
		jrapid.getURL(), 
		entity, 
		{   inOnLoad: true,
			openWindow: jrapid.getParam('w'),
			subset: subset ? subset : null,
			label: label
		}
	);	
};

JRapid.prototype.close = function(id) {
	var e = document.getElementById(id);
	e.parentNode.removeChild(e);
};

// TODO: separate subset from subsetparams
JRapid.prototype.listingLoad = function(container, rootUrl, entity, params) { 
	
	var inOnLoad = params.inOnLoad;
	var subset = params.subset;
	var openWindow = params.openWindow;
	var canvas = openWindow ? null : application.getElementById(params.canvas);
	var handler = params.handler;
	var defaultset = params.defaultset;
	var defaultsetparams = params.defaultsetparams;
	var evaldsps = params.evaldsps;
	
	if (inOnLoad && !document.location.toString().match(new RegExp(entity + "([_a-zA-Z0-9]*)_list.html"))) {
		return;
	}
	
	// NOTE: in listings with tabs, xsl_1_1 is the first tab
    var xsl = container.getElementById('xsl_1_1');
    var baseurl = rootUrl + 'xml/' + entity + (subset && subset.length > 0 ? ('/' + subset) : '');
    xsl.setUrl(baseurl + ';_page=1');
    xsl.setAttribute('baseurl', baseurl);
    xsl.setAttribute('entity', entity);    
    xsl.getStyle().display = '';

    var w;
    if (openWindow) {
    	var label = params.label ? params.label : entity;
    	w = application.openWindow(label, container.getElementById('maindiv').outerNode);
    	w.setAttribute('onresizewindow', 'jrapid.onResizeListWindow(this, "' + params.source + '");');
		w.helpButton.setAttribute("onhelpclick", "jrapid.openHelp(jrapid.wrap(this),'" + entity + "',false)");
		w.setAttribute('onclosewindow', 'jrapid.close("' + params.source + '");');
    }

    if (canvas) {
		if (container.node) {
            container.node.canvas = canvas;
        } else {
            application.canvas = canvas;
        }
    }
    
    // console
    var tx = jrapid.startConsole('Loading listing...', false, 'green');

    xsl.refresh(function() {
    	// end console
    	jrapid.endConsole(tx);
    	
    	// check network error
    	//if (status != 200) {
    	//	jrapid.startConsole('Network error', true, 'green');  
    	//	return;
    	//}
    	
    	// check service error
    	/*if (xmlDoc == null || xmlDoc.documentElement == null || xmlDoc.documentElement.tagName == 'exception') {
    		jrapid.startConsole('Network error', true, 'red'); 
			if (xmlDoc != null && xmlDoc.documentElement && xmlDoc.documentElement.hasChildNodes()) {
				jrapid.message(xmlDoc.documentElement.childNodes[0].nodeValue);
			} else {
				jrapid.message('Unable to read');
			}
    		return; 
    	}*/
    	
    	var add = container.getElementById('add');
    	
		if (add && defaultset) {
			add.setAttribute('defaultset', defaultset);
			add.setAttribute('defaultsetparams', defaultsetparams);
			add.setAttribute('evaldsps', evaldsps);
		}
    	
    	// call handler
    	if (handler) {
            handler(xsl.getContainer());                
        }
        
        // resize window
    	if (w) {
    		var maindiv = xsl.getContainer().getElementById('maindiv');
    		var m =	maindiv.outerNode;
    		m.style.position = 'absolute';
    		m.style.top = '0px';
    		var h = Math.min(maindiv.getHeight(), document.documentElement.clientHeight-m.getBoundingClientRect().top-52);
    		jrapid.wrap(w).resizeTo(maindiv.getWidth() + 'px', h, true);
    		m.style.width = '100%';
    		m.style.position = '';
    		
    	}
    }, true);
};
JRapid.prototype.resizeTable = function(xsl, win) {
	var container = xsl.getContainer();
	var canvas;
	if (win) {
		canvas = win;
	} else {
		//alert(container.node);
		//alert(container.node.canvas.outerNode.outerHTML);
		canvas = (container.node && container.node.canvas) ? container.node.canvas : (application.canvas ? application.canvas : null);
	}	
	if (canvas) {
		var table = jrapid.listingGetTable(container);
		if (!table) {
			return;
		} 
		if (table.outerNode.tagName.toLowerCase() == 'table') {
			table = table.getParentNode();
		} 
		var filters = container.getElementById('filterfieldset');
		/*if (filters) {
		filters.getStyle().display = 'none';
		}*/
		xsl.getStyle().display = 'none';
		//alert(canvas.outerNode.outerHTML);
		var canvasHeight = canvas.getHeight() - (win ? jrapid.WINDOW_HEIGHT : 0);
		xsl.getStyle().display = '';
		var diff = canvasHeight - container.getElementById('maindiv').getHeight();
		var h = table.getHeight() + diff - 2;
		if (h > 0) table.getStyle().height = h+'px';
		table.getStyle().width = '100%';
		table.getStyle().overflowY = 'scroll';
		if (table.getAttribute('onresize')) { 
			eval('table.outerNode.aux = function(ev) {'  + table.getAttribute('onresize') + '};');
			table.outerNode.aux();
		}
		if (filters) {
			filters.getStyle().display = '';
		}
	}
};

JRapid.prototype.onResizeListWindow = function(me, id) {
	/* at the moment of calling this function the window is not visible, just the 
        dotted box shown at resizing time, so timeout is needed */
	setTimeout(function() { jrapid.resizeTable(jrapid.listingGetXsl(new Container(document.getElementById(id))), me); }, 10);
};

JRapid.prototype.load = function(container, rootUrl, entity, params) {
	/*container, entity, id, defaultset, openWindow, handler, confirmed, prompted, repeat, serverPath, inOnLoad, center*/
	var openWindow = params.openWindow;
	var inOnLoad = params.inOnLoad;
	
	// if (defaultset), don't use the id, use dsparams 
	var id = params.id ? encodeURIComponent( params.id ) : 0;
	var ds = params.defaultset;
	var dsparams = params.defaultsetparams;
		
	var repeat = params.repeat;
	var confirmed = params.confirmed;
	var prompted = params.prompted;
	var handler = params.handler;
	var center = params.center;
	
	if (inOnLoad && entity != 'Login' && !document.location.toString().match(new RegExp(entity + "([_a-zA-Z0-9]*)_form.html"))) {
		return;
	}
	
	var children = container.getElementById('xmlmultiple').getChildren();
    for (var i=0; i < children.getLength(); i++) {
        if (children.item(i).getAttribute('baseurl')) {
            children.item(i).setUrl(rootUrl + 'xml/' + children.item(i).getAttribute('baseurl'));
        }
    }
    
    // decorate form with a window
    var w;
    var windowcontainer = container.getElementById('windowcontainer').outerNode;
    if (openWindow) {    	
    	w = application.openWindow(windowcontainer.getAttribute('label'), windowcontainer, null, null, true, true);
		w.helpButton.setAttribute("onhelpclick", "jrapid.openHelp(jrapid.wrap(this),'" + entity + "',true)");
		w.setAttribute('onclosewindow', 'jrapid.close("' + params.source + '");');
		w.style.display = 'none';
	}

    var xsl = container.getElementById('xsl');
    var xml = container.getElementById('xml');
    
    var url;
    var baseUrl = rootUrl + 'xml/' + entity + '/';
    
    // if (defaultset), don't use the id, use dsparams 
    if (ds) {
    	baseUrl += ds;
    	url = baseUrl; 
    	if (dsparams) {
    		baseUrl += '/';
        	url = baseUrl;
    		
    		// NOTE: previously, the dsparams were of type String. now it can be an Array
        	if ((typeof dsparams).toLowerCase() == "string") {
        		url += dsparams;
        	} else if ((typeof dsparams).toLowerCase() == "object") {
        		if (dsparams.length) {
					// it's of type Array
					url += dsparams.join( "/" );	
				}
        	}
    	}
    } else {
    	url = baseUrl + id;
    }
    xml.setUrl( url );
	xml.setAttribute('repeat', repeat ? 'repeat' : '');
	xml.setAttribute('baseurl', baseUrl );			
	xml.setAttribute('entity', entity);
	
	// confirmation handling
	if (!jrapid.url) {
		// TODO make it work with proxy
		jrapid.setConfirmedAndPrompted(xml, confirmed, prompted);
	}
    
    // console
	var tx = jrapid.startConsole('Loading form...', false, 'green');
	
	xml.setUrl( xml.getUrl() + '&' + new Date().getTime() );    
	
    xsl.refresh( function(foo, xmlDoc, status) {
    	// end console
    	jrapid.endConsole(tx);

    	if (status != 200) {
    		alert('Network error');
    		jrapid.startConsole('Network error', true, 'red');
    		if (handler) { handler(false); }
            return;
    	}
    	
    	var xmlDoc = xml.getXmlDocument();  
    	if (!JRapid.ignoreErrors) {  
    		if (xmlDoc == null || xmlDoc.documentElement == null || xmlDoc.documentElement.tagName == 'exception') {
	            jrapid.startConsole('Error', true, 'red');
	            if (xmlDoc != null && xmlDoc.documentElement && xmlDoc.documentElement.hasChildNodes()) {
	                alert(xmlDoc.documentElement.childNodes[0].nodeValue);
	            } else {
	                alert('Unable to read');
	            }
	            if (handler) { handler(false); }
	            return false;
	        } else if (xmlDoc.documentElement.tagName == 'confirmation') {
	            jrapid.startConsole('Confirm', true, 'yellow');
	            if (confirm(xmlDoc.documentElement.childNodes[0].nodeValue)) {
	            	if (handler) { handler(false); }
		            return jrapid.loadForm(container, entity, id, defaultset, false, handler, (confirmed ? (confirmed+',') : '') + xmlDoc.documentElement.getAttribute('code'));
	            } else {
	            	if (handler) { handler(false); }
		            return;
	            }
	        } else if (xmlDoc.documentElement.tagName == 'prompt') {
	            jrapid.startConsole('Prompt', true, 'yellow');
	            var value;
	            if (value = prompt(xmlDoc.documentElement.childNodes[0].nodeValue, '')) {
	            	if (handler) { handler(false); }
		            return jrapid.loadForm(container, entity, id, defaultset, false, handler, confirmed, xmlDoc.documentElement.getAttribute('code') + '=' + value);
	            } else {
	            	if (handler) { handler(false); }
		            return;
	            }
	        } 
	    	jrapid.startConsole('Form loaded', true, 'green');
		}   
    	
    	if (w) { 
    		w.style.display = '';
    		var size = document.documentElement.clientHeight-windowcontainer.getBoundingClientRect().top-52;
    		if (!params.noscroll && size < windowcontainer.offsetHeight && size > 0) { 
    			windowcontainer.style.overflowY = 'scroll'; 
    			windowcontainer.style.height = size + 'px';
    		}
    		if (document.all && inOnLoad) {
    			// patch for ie to avoid 100%-width windows
    			xsl.outerNode.style.display = 'inline';
    			w.style.width = (xsl.outerNode.offsetWidth + 60) + 'px';
    		}
    		if (center) { 
    			jrapid.wrap(w).center(); 
    		}
    	}
    		
        if (handler) { 
        	handler(true); 
        }
    }, true);
};

// this function is called from a listing's ADD button.
// to open a form to ADD a new entity.
// 3 possibilities, regarding defaultsets.
//   a) no defaultset
//   b) defaultset, no params
//   c) defaultset with params
// 2 possibilities: 
//	 a) embeddedlisting (evaluate dsp on runtime)
//	 b) regular listing (dsp SHOULD come pre-evaluated)
JRapid.prototype.openFormFromListing = function( params ){
	// pass params to variables:
	var me = jrapid.wrap( params.actionSrc ); // (the html element that fires the action)
	var module = params.module;
	var entity = params.entity;
	var canvas = params.canvas;
	var defaultset = me.getAttribute('defaultset');//params.defaultset;
	var defaultsetparams = me.getAttribute('defaultsetparams');//params.defaultsetparams;
	var evalDsps = me.getAttribute('evaldsps');
	var hasDsps = defaultsetparams != null && defaultsetparams.length > 0; 
	
	var formParams = {
		obj: me,
		module: module, 
		entity: entity,
		openWindow: true
	};
	
	if ( ! defaultset ) {
		// just open a form of the listing entity
		jrapid.form( formParams );
	} else {
		// there is a default set
		formParams.defaultset = defaultset;
		if ( ! hasDsps ) {
			// just open a form of the listing entity, passing it the ds.
			jrapid.form( formParams );
		} else {
			//with ds AND dsp
			if (!evalDsps) {
				// don't evaluate, and open the form.
				formParams.defaultsetparams = defaultsetparams;
				jrapid.form( formParams );
			} else {
				// here we should verify the ID of the opening entity before evaluating
				// if entity was not saved, save it, and open form after .store()
				var formSubmit = me.getContainer().getParent().getElementById('submit');
				var formContainer = formSubmit.getContainer();
				var entityId = jrapid.getFormEntityId( formContainer );
				var isNewEntity = entityId == '0' || entityId == '';
				// TODO could it be "0" or will it always be "" ???
				
				if (!isNewEntity) {
					// eval the dsps and open the form
					formParams.defaultsetparams = jrapid.evalDefaultsetParams( defaultsetparams, me );
					jrapid.form( formParams );
					
				} else if (confirm('It is necessary to save before continuing. Save now?')) {
					jrapid.apply( 
						formSubmit, 
						function( newId ){
							// don't use newId, instead, re-eval all the dsps.
							formParams.defaultsetparams = jrapid.evalDefaultsetParams( defaultsetparams, me );
							
							// and open the FORM
							jrapid.form( formParams );
							
							// fire the triggers
							var xml = formSubmit.getContainer().getElementById('xml');
							if (xml.getAttribute('baseurl')) {
								// TODO: explain the meaning/consequences of having an attribute baseurl
								xml.setUrl(xml.getAttribute('baseurl') + newId);				
								var path = xml.getAttribute('entity');
								path = path == null || path.length == 0 ? path : path.substring(0,1).toLowerCase() + path.substring(1);
								path = '/' + path + '/@id';
			    				if (xml.outerNode.triggers && xml.outerNode.triggers[path]) {
									for (var i=0; i < xml.outerNode.triggers[path].length; i++) {
										xml.outerNode.triggers[path][i].execute(null, formSubmit);
							        }
							    } 
							}
						}, null, null, true
					);
				}
			}
		}
		
	} 
	return false;
};

// (private) returns the @id of the entity associated with this container 
JRapid.prototype.getFormEntityId = function( container ) {
	return container.getElementById('xml').getXmlDocument().selectSingleNode('/*').getAttribute('id');
}

JRapid.prototype.evalDefaultsetParams = function( dspString, me ) {
	return this.evalDefaultsetParams(dspString, me, false);
}

JRapid.prototype.evalDefaultsetParams = function( dspString, me, debug ) {
	var evaluatedDSPs = [];
	var dsps = dspString.split(";");
	for (var i=0, len=dsps.length; i < len; i++) {
		try {
			evaluatedDSPs[i] = jrapid.evaluateIfNotNull( dsps[i], me, '0' );
			if (debug) alert( "dsp ('" + dsps[i] + "') evaluated OK; result = '" + evaluatedDSPs[i] + "'" );
		} catch( e ){
			if (debug) alert(e);
			if (debug) alert( "Could not evaluate defaultsetparam: '" + dsps[i] + "'." );
			// use dsparam un-evaluated
			evaluatedDSPs[i] = dsps[i];
		}
	}
	return evaluatedDSPs;
}



var c; //????

/******************************** VALIDATION **********************************/

JRapid.prototype.timeoutSeconds = 10;
JRapid.prototype.dateRegExp = '\\d\\d/\\d\\d/\\d\\d\\d\\d';
JRapid.prototype.dateTimeRegExp = '\\d\\d/\\d\\d/\\d\\d\\d\\d \\d\\d:\\d\\d';    
JRapid.prototype.timeRegExp = '\\d\\d:\\d\\d';    
JRapid.prototype.timeQuantityRegExp = '^([\\d]+d){0,1}[ ]{0,1}([\\d]+h){0,1}[ ]{0,1}([\\d]+m){0,1}[ ]{0,1}$';
JRapid.prototype.timeRangeRegExp = '\\d\\d:\\d\\d - \\d\\d:\\d\\d'; 

JRapid.prototype.validateElement = function(element) {
    var validation = element.getAttribute('validate');
    var msg = '';
    var hasErrors = false;
    if (validation) {    
        var validations = validation.split(',');
        for (var j = 0; j < validations.length; j++) {
			if (element.value) {
				if (jrapid.validations[validations[j]]) {
					var errorMessage = jrapid.validations[validations[j]](element);
					if (errorMessage) {
						msg += errorMessage + ' - ';
						hasErrors = true;
					}
				}
			}            
        }
        element.style.color = hasErrors ? 'red' : '';
        window.status = msg;
    }    
};


// TODO: define a class for validation errors, to add/remove from the properties
JRapid.prototype.validate = function(form) {

    var elements = form.elements;
    var n = elements.length;
    var msg = '';
    var first = null;

    for (var i=0; i < n; i++) {
    	var e = elements[i];
        var validation = e.getAttribute('validate');
    	if (validation && jrapid.isFormProperty(e) && ! jrapid.isNewOrHidden(e) ) {
            // property has validation, and belong to the form and is not hidden/new
            var validations = validation.split(',');
            var hasErrors = false;
            for (var j=0; j < validations.length; j++) {
            	var validationFunc = validations[j].trim();
                if (jrapid.validations[ validationFunc ]) {
                	var errorMessage = jrapid.validations[ validationFunc ](e);
                    if (errorMessage) {
                        msg += errorMessage + '\n';
                        first = elements[i];
                        hasErrors = true;
                        e.style.color = 'red';
                    }    
                }            
            }
            e.style.color = hasErrors ? 'red' : '';
        }    
    }

    if (msg.length) {
        alert(msg);
        try { first.focus(); } catch (e) {}
        return false;
    }  
	
    return true;
};

var jrapid = new JRapid();
var prd = new JRapid();

jrapid.validations = [];
jrapid.validations['required'] = function(obj) { return obj.value && (obj.tagName.toLowerCase() != 'select' || obj.value != '0') ? null : (obj.title + ' is required'); };
jrapid.validations['date'] = function(obj) { return obj.value == '' || obj.value.match(jrapid.dateRegExp) ? null : (obj.title + ' is a date'); };
jrapid.validations['datetime'] = function(obj) { return obj.value == '' || obj.value.match(jrapid.dateTimeRegExp) ? null : (obj.title + ' is datetime'); };
jrapid.validations['time'] = function(obj) { return obj.value == '' || obj.value.match(jrapid.timeRegExp) ? null : (obj.title + ' is time'); };
jrapid.validations['timequantity'] = function(obj) { return obj.value == '' || obj.value.match(jrapid.timeQuantityRegExp) ? null : (obj.title + ' is timequantity'); };
jrapid.validations['timerange'] = function(obj) { return obj.value == '' || obj.value.match(jrapid.timeRangeRegExp) ? null : (obj.title + ' is timerange'); };
jrapid.validations['email'] = function(obj) { return obj.value == '' || obj.value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) ? null : (obj.title + ' is email');};
jrapid.validations['short'] = function(obj) { return obj.value == '' || obj.value.match(/^\-?[0-9]+$/) ? null : (obj.title + ' is short'); };
jrapid.validations['integer'] = function(obj) { return obj.value == '' || obj.value.match(/^\-?[0-9]+$/) ? null : (obj.title + ' is integer'); };
jrapid.validations['long'] = function(obj) { return obj.value == '' || obj.value.match(/^\-?[0-9]+$/) ? null : (obj.title + ' is long'); };
jrapid.validations['float'] = function(obj) { return obj.value == '' || obj.value.match(/^\-?[0-9]+(\.[0-9]+)?$/) ? null : (obj.title + ' is float'); };
jrapid.validations['double'] = function(obj) { return obj.value == '' || obj.value.match(/^\-?[0-9]+(\.[0-9]+)?$/) ? null : (obj.title + ' is double'); };


/*************************** EXPR EVALUATION **********************************/

function evaluated(path, row) {
try {
	var n=-1;
    var newPath = '';
  	for (var i=0; i < path.length; i++) {
		var c = path.charAt(i);
		if (c == '(' || c == ')' || c == ',' || c == ' ') {
			newPath += evaluatedPart(path.substring(n+1, i), row) + path.charAt(i);
			n = i;
		}
	}
	if (n != path.length-1) {
		newPath += evaluatedPart(path.substring(n), row);
	}
			
			
			} catch (e) {throw e; alert(e.message); }
/*
	// TODO check all separators
    var parts = path.split(new RegExp('(\\(|\\)|\\s+|,)'));
    //var parts = /(\\(|\\)|\\s+|,)/i.exec(path);
    var newPath = '';
    for (var i=0; i < parts.length; i++) {
       newPath = newPath + evaluatedPart(parts[i], row);	
	}	
	alert(newPath);*/
	return newPath;
}

function evaluatedPart(path, row) {
	
    if (row.outerNode) {
        row = row.outerNode;
    }
    //Cross-browser fix
	var partsBracket = path.split(new RegExp('(\\[|\\])'));
	var parts = [];
	for (var i=0, j=0; i < partsBracket.length; i++) {
		if (partsBracket[i]!='[' && partsBracket[i]!=']') {
			parts[j++] = partsBracket[i]
		}
	}
		
    var newPath = '';
    var k = 0;
    
    for (var i=0; i < parts.length; i++) {
        if ((i%2)==0) {
            newPath = newPath + parts[i];
        } else {
            // TODO trim
            if (parts[i] == '*') {
                newPath = newPath + '[(\\d+)]';
            } else {
                var expr = parts[i].replace('ROWNUM', rownum(row, k++));
                newPath = newPath + '[' + eval(expr) + ']';
            }
        }
    }
    return newPath;
}


function rownum(row, k) {
    var ks = [];
    
    while (row && row.getAttribute) {
        if (row.getAttribute('row') == 'row') {
            ks[ks.length] = row.rowIndex;
        }
        row = row.parentNode;
    }
    return ks[ks.length-k-1];
}

function evaluateBoolean(xpath, obj) {
    var xsl = '<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform" xmlns:xslt2="http://www.htmli.com/1999/XSL/Transform"  exclude-result-prefixes="xslt xslt2">';
    xsl += '<xslt:namespace-alias stylesheet-prefix="xslt2" result-prefix="xslt"/>';
    xsl += '<xslt:output method="xml" omit-xml-declaration="yes" /><xslt:template match="/"><out>';
    xsl += '<xslt:choose><xslt:when test="' + xpath + '">1</xslt:when><xslt:otherwise>0</xslt:otherwise></xslt:choose>';
    xsl += '</out></xslt:template></xslt:stylesheet>';
    var xslDocument = XmlDocument.create(xsl);
    var container = application.wrapNode(obj).getContainer();
    var xmlDoc = container.getElementById('xml').getXmlDocument();

   	var str = xmlDoc.transformNode(xslDocument).substring(5);
    return str.substring(0,str.length-6) == '1';
}
 

JRapid.prototype.evaluateXpath = function(xpath, obj) {

    var xslCollection = '<xslt:for-each select="' + xpath + '"><xslt:value-of select="." /><xslt:if test="position()!=last()">,</xslt:if></xslt:for-each>';
    var xslSingle = '<xslt:value-of select="' + xpath + '" />';

    var buildXsl = function(m) {
        var xsl = '<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform" xmlns:xslt2="http://www.htmli.com/1999/XSL/Transform" exclude-result-prefixes="xslt xslt2">';
        xsl += '<xslt:namespace-alias stylesheet-prefix="xslt2" result-prefix="xslt"/>';
        xsl += '<xslt:output method="xml" omit-xml-declaration="yes" /><xslt:template match="/"><out>';
        xsl += m;
        xsl += '</out></xslt:template></xslt:stylesheet>';
        return xsl;
    }
    
    var parseResult = function(str) {
    	str = str.substring(5);
    	str = str.substring(0, str.length-6);
    	return str == 'NaN' ? '' : str;
    };
    
    var xslDocument = XmlDocument.create(buildXsl(xslCollection));
    var container = application.wrapNode(obj).getContainer();
    var xmlDoc = container.getElementById('xml').getXmlDocument();
    try {
    	return parseResult(xmlDoc.transformNode(xslDocument));
    } catch (e) {
        xslDocument = XmlDocument.create(buildXsl(xslSingle));
      	return parseResult(xmlDoc.transformNode(xslDocument));
    }
};

JRapid.prototype.evaluateIfNotNull = function(expr, obj, def) {
	if (expr == null || expr == '0' || !expr) {
		return def;
	}
	var node = application.wrapNode(obj.getContainer().node.parentNode);
	return jrapid.evaluateXpath(expr, node);
};

/******************************** CONSOLE **********************************/

JRapid.prototype.startConsole = function(label, timeout, color) {
	var console = document.getElementById('jrapid_console');
	if (console == null) {
		console = document.createElement('div');
		console.className = 'jrapid_console';
		console.id = 'jrapid_console';
		document.body.appendChild(console);
	}
	
	var div = document.createElement('div');
	div.id = new Date().getTime();
	div.innerHTML = label;
	div.className = 'jrapid_console_message ' + color;	
	//div.style.backgroundColor = color;
	console.appendChild(div);
	
	if (timeout) {
		setTimeout(function() { div.parentNode.removeChild(div); }, 400);
	}	
	return div.id;
};


JRapid.prototype.endConsole = function(id) {
	if (!id) {
		return;
	} 
	var console = document.getElementById('jrapid_console');
	if (console == null) {
		return;
	}
	
	for (var i=0; i < console.childNodes.length; i++) {
		if (console.childNodes[i].id == id) {
			console.removeChild(console.childNodes[i]);	
			return;	
		}
	}	
};

/******************************** TRIGGERS **********************************/

JRapid.prototype.initialTriggers = function(me, repeat) {
	var xml = me.getContainer().getElementById('xml');
	if (xml.outerNode.initial) { return; }
    if (xml.outerNode.triggers && xml.outerNode.triggers['main'] != null) {
    	var c = xml.outerNode.triggers['main'];
    	if (c.length) xml.outerNode.initial = true;
    	setTimeout(function() {
		    for (var i=0; i < c.length; i++) {
		    	c[i].execute(null, xml);
		    }
    	}, 1);
    }
};

JRapid.prototype.trigger = function(fpath, me) {
    setTimeout(function() {
        jrapid.triggerWrapped(fpath, me);
    }, 1);
};

JRapid.prototype.triggerWrapped = function(fpath, me) {
	
    c = new Date().getTime();
    me.sync();
    var spath = fpath;
    while (spath.indexOf('[') != -1) {
        spath = spath.replace(new RegExp('\\[[^\\]]*\\]'), '');
    }
    var evaluatedPath = evaluated(fpath, me.outerNode);
    var xml = me.getContainer().getElementById('xml').outerNode;
    if (xml.triggers && xml.triggers[spath]) {
        for (var i=0; i < xml.triggers[spath].length; i++) {
			xml.triggers[spath][i].execute(evaluatedPath, me);
        }
    }                                
};

JRapid.prototype.registerAbstract = function(container, triggers, handler) {
	var xml = container.getElementById('xml').outerNode;
    if (xml.triggers == null) {
        xml.triggers = new Array();
    }
    var triggerArray = triggers.split(';');
    for (var i=0; i < triggerArray.length; i++) {
        var k = jrapid.replaceAll(triggerArray[i], new RegExp('\\[[^\\]]*\\]'), '');
        if (xml.triggers[k] == null) {
            xml.triggers[k] = new Array();
        }
        handler(xml.triggers[k], xml.triggers[k].length, triggerArray[i]);
    }    
};

JRapid.prototype.registerInitialTrigger = function(container, trigger) {
    var xml = container.getElementById('xml').outerNode;
    
    if (xml.triggers == null) {
        xml.triggers = new Array();
    }
    if (xml.triggers['main'] == null) {
        xml.triggers['main'] = new Array();
    }
   // alert('a' + xml.triggers['main'].length);
    xml.triggers['main'][xml.triggers['main'].length] = trigger;    
};

JRapid.prototype.registerCalculatedProperty = function(container, slaveFpath, slaveId, calculus, triggers, triggerMode) {
	if (triggerMode != 'onload') {
	    jrapid.registerAbstract(
	    	container, 
	    	triggers, 
	    	function(array, index, trigger) {
	    		array[index] = new JRapid_Registration_CalculatedProperty(slaveFpath, slaveId, calculus, trigger, triggerMode);
	    	}
	    );    
	}
    if (!triggerMode || triggerMode == 'onload') {
	    jrapid.registerInitialTrigger(
	    	container, 
	    	new JRapid_Registration_CalculatedProperty(slaveFpath, slaveId, calculus, null, triggerMode)
	    );
	}
};

JRapid.prototype.registerSubsetParams = function(container, slaveFpath, slaveId, params, subset, triggers, whenNotInSubset) {
    jrapid.registerAbstract(container, triggers, function(array, index, trigger) {
        array[index] = new JRapid_Registration_SubsetParams(slaveFpath, slaveId, params, trigger, subset, whenNotInSubset);
    });
    jrapid.registerInitialTrigger(container, new JRapid_Registration_SubsetParams(slaveFpath, slaveId, params, null, subset, whenNotInSubset));
    var xml = container.getElementById('xml').outerNode;
    if (!xml.subsetParams) {
        xml.subsetParams = [];
    }
    xml.subsetParams[slaveId] = params;
};

JRapid.prototype.registerIf = function(container, slaveFpath, slaveId, condition, triggers, func, applyToCanvas, triggerOnApply, isHorizontal) {
	// registerAbstract(container, triggers, handler)
	jrapid.registerAbstract(
		container, 
		triggers, 
		function(array, index, trigger) {
			array[index] = new JRapid_Registration_If(slaveFpath, slaveId, condition, trigger, func, applyToCanvas, isHorizontal);
		}
	);
    if (func != jrapid.checkIf) {
        jrapid.registerInitialTrigger(container, new JRapid_Registration_If(slaveFpath, slaveId, condition, null, func, applyToCanvas, isHorizontal));
    }
    if (triggerOnApply) {
        jrapid.registerAbstract(container, '__onapply', function(array, index, trigger) {
            array[index] = new JRapid_Registration_If(slaveFpath, slaveId, condition, null, func, applyToCanvas, isHorizontal);
        });
    }
};

JRapid.prototype.registerCondition = function(container, slaveFpath, slaveId, params, triggers, func, rpcService, applyToCanvas) {
    jrapid.registerAbstract(container, triggers, function(array, index, trigger) {
        array[index] = new JRapid_Registration_Condition(slaveFpath, slaveId, params, trigger, func, rpcService, applyToCanvas);
    });
    jrapid.registerInitialTrigger(container, new JRapid_Registration_Condition(slaveFpath, slaveId, params, null, func, rpcService, applyToCanvas));
    /* async problems, apply() can be called before this, causing unwanted behaviour 
    if (func == jrapid.checkUnique) {
        jrapid.registerAbstract(prefix, '__onapply', function(array, index, trigger) {
            array[index] = new JRapid_Registration_Condition(slaveFpath, slaveId, params, null, func, rpcService);
        });
    }*/
};

JRapid.prototype.registerDynamicValue = function(container, slaveFpath, slaveId, params, triggers, rpcService, triggerMode) {
	if (triggerMode != 'onload') {
	    jrapid.registerAbstract(container, triggers, function(array, index, trigger) {
	        array[index] = new JRapid_Registration_DynamicValue(slaveFpath, slaveId, params, trigger, rpcService, triggerMode);
	    });
	}
    if (!triggerMode || triggerMode == 'onload') {
	    jrapid.registerInitialTrigger(container, new JRapid_Registration_DynamicValue(slaveFpath, slaveId, params, null, rpcService, triggerMode));
	}
};

JRapid.prototype.registerDynamicForEach = function(prefix, slaveFpath, slaveId, params, triggers, service, fullXpath, triggerMode) {
	// TODO implement other trigger modes
    jrapid.registerAbstract(prefix, triggers, function(array, index, trigger) {
        array[index] = new JRapid_Registration_DynamicForEach(slaveFpath, slaveId, params, trigger, service, fullXpath, triggerMode);
    });
    if (!triggerMode || triggerMode == 'onload') {
		jrapid.registerInitialTrigger(prefix, new JRapid_Registration_DynamicForEach(slaveFpath, slaveId, params, null, service, fullXpath));
	}
};

JRapid.prototype.registerEmbeddedListing = function(container, slaveId, entity, params, triggers, subset, listing, name, containerEntity, module, defaultset, defaultsetparams) {
    jrapid.registerAbstract(container, triggers, function(array, index, trigger) {
        array[index] = new JRapid_Registration_EmbeddedListing(slaveId, params, trigger, entity, subset, listing, name, containerEntity, module, defaultset, defaultsetparams);
    });
    jrapid.registerInitialTrigger(container, new JRapid_Registration_EmbeddedListing(slaveId, params, null, entity, subset, listing, name, containerEntity, module, defaultset, defaultsetparams));
};

JRapid.prototype.registerjQuery = function(container, id, plugin, options) {
    /*jrapid.registerAbstract(prefix, '__onapply', function(array, index, trigger) {
        array[index] = new JRapid_Registration_RichText(id, 'save');
    });*/
    jrapid.registerInitialTrigger(container, new JRapid_Registration_jQuery(id, plugin, options));
};

JRapid.prototype.registerRememberLast = function(container, id) {
	jrapid.registerInitialTrigger(container, new JRapid_Registration_RememberLast(id));
};
        
function JRapid_Registration_CalculatedProperty(slaveFpath, slaveId, calculus, trigger, triggerMode) {
    this.slaveFpath = slaveFpath;
    this.slaveId = slaveId;    
    this.calculus = calculus;
    this.trigger = trigger;
    this.triggerMode = triggerMode;
};

function JRapid_Registration_SubsetParams(slaveFpath, slaveId, params, trigger, subset, whenNotInSubset) {
    this.slaveFpath = slaveFpath;
    this.slaveId = slaveId;    
    this.params = params.length ? params.split(';') : [];
    this.trigger = trigger;
    this.subset = subset;
    this.whenNotInSubset = whenNotInSubset;
};

function JRapid_Registration_If(slaveFpath, slaveId, condition, trigger, func, applyToCanvas, isHorizontal) {
    this.slaveFpath = slaveFpath;
    this.slaveId = slaveId;    
    this.condition = condition;
    this.trigger = trigger;
    this.func = func;
    this.applyToCanvas = applyToCanvas;
    this.isHorizontal = isHorizontal;
};

function JRapid_Registration_Condition(slaveFpath, slaveId, params, trigger, func, rpcService, applyToCanvas) {
    this.slaveFpath = slaveFpath;
    this.slaveId = slaveId;    
    this.params = params.length ? params.split(';') : [];
    this.trigger = trigger;
    this.func = func;
    this.rpcService = rpcService;
    this.applyToCanvas = applyToCanvas;
};

function JRapid_Registration_DynamicValue(slaveFpath, slaveId, params, trigger, rpcService, triggerMode) {
    this.slaveFpath = slaveFpath;
    this.slaveId = slaveId;    
    this.params = params.length ? params.split(';') : [];
    this.trigger = trigger;
    this.rpcService = rpcService;
    this.triggerMode = triggerMode;
};

function JRapid_Registration_DynamicForEach(slaveFpath, slaveId, params, trigger, service, fullXpath) {
    this.slaveFpath = slaveFpath;
    this.slaveId = slaveId;    
    this.params = params.length ? params.split(';') : [];
    this.trigger = trigger;
    this.service = service;
    this.fullXpath = fullXpath;
};

function JRapid_Registration_EmbeddedListing(
		slaveId, subsetparams, trigger, entity, subset, 
		listing, name, containerEntity, module, defaultset, defaultsetparams
) {
    this.name = name;
    this.slaveId = slaveId;
    this.module = module;
    this.entity = entity;
    this.listing = listing;
    
    this.subset = subset;
    this.subsetparams = subsetparams.length ? subsetparams.split(';') : [];
    
    this.defaultset = defaultset;
    // leave them as string, they will be evaluated on-the-fly
    this.defaultsetparams = defaultsetparams;//defaultsetparams.length ? defaultsetparams.split(';') : [];
    
    this.trigger = trigger;
    this.containerEntity = containerEntity;
};

function JRapid_Registration_jQuery(id, plugin, options) {
    this.id = id;
    this.plugin = plugin;
    this.options = options;
};

function JRapid_Registration_RememberLast(id) {
    this.id = id;
};

// TODO: check this when using widget collection aka selectmultiple
JRapid_Registration_SubsetParams.prototype.execute = function(evaluatedPath, me) {
	var container = me.getContainer();
    var xsl = container.getElementById('window_subset_' + this.slaveId);
    var xmlmultiple = xsl.getPreviousElementSibling();
    var xml = xmlmultiple.getFirstElementChild();
    xmlmultiple.getLastElementChild().setXml(container.getElementById('xml').getXmlDocument().xml);
    var ud = this.slaveId;
    var canvas = jrapid.getElementsById('div_subset_' + this.slaveId, container.node);
    for (var i=0; i < canvas.length; i++) {
    	var child = evaluatedPath == null ? null : evaluated(jrapid.replaceAll(this.trigger, '_', '.'), canvas[i]);
        if (child == evaluatedPath) {
            var url = jrapid.getServerPath(container) + this.subset;
            for (var j=0; j < this.params.length; j++) {
                url += '/' + encodeURIComponent(jrapid.evaluateXpath(evaluated(this.params[j], canvas[i]), canvas[i]));
            }
            var whenNotInSubset = this.whenNotInSubset;
			xml.setUrl(url);
            xml.get(function(c) { 
            	xsl.refresh();
                var disabled;
                var option;
                var value;
                
                if (c.children.length) {
                	var obj = c.children[0];
                    disabled = obj.disabled;
                    // TODO get options when using selectmultiple?
	                option = obj.options && obj.selectedIndex >= 0 ? obj.options[obj.selectedIndex] : null;
    	            value = obj.value;
				}
                c.innerHTML = xsl.getInnerHTML(); 
                if (c.children.length) {
                    c.children[0].disabled = disabled;
                    c.children[0].value = value;
                    if (option && value != c.children[0].value && whenNotInSubset != 'donotshow') {
                        if (whenNotInSubset == 'shownotvalid') {
                            option.style.color = 'red';
                        }
                        c.children[0].options[c.children[0].options.length] = option;
                        option.selected = true;
                    }
                }
                //this.setValue();
            }, canvas[i]);            
        }
    }
};

JRapid.prototype.getSubsetParams = function(me, slaveId) {
	var container = me.getContainer();
    var xml = container.getElementById('xml').outerNode;
    if (xml.subsetParams && xml.subsetParams[slaveId]) {
    	return xml.subsetParams[slaveId];
    }       
    return '';
};

JRapid_Registration_CalculatedProperty.prototype.execute = function(evaluatedPath, me) {
	var container = me.getContainer();
    var canvas = jrapid.getElementsById(this.slaveId, container.node);
    for (var i=0; i < canvas.length; i++) {
		if (this.triggerMode == 'onchangenew' && canvas[i].value) {
			continue;
		}
		var child = evaluatedPath == null ? null : evaluated(jrapid.replaceAll(this.trigger, '_', '.'), canvas[i]);
                  
        if (child == evaluatedPath || evaluatedPath.match(child.replace(/\[/g, '\\[').replace(/\]/g, '\\]'))) {
           	if (!jrapid.isNewOrHidden(canvas[i])) {
                var value = jrapid.evaluateXpath(evaluated(this.calculus, canvas[i]), canvas[i]);
                canvas[i].value = value;
                application.dispatch('change', canvas[i], 'HTMLEvents');
			}
		}
    }
};


JRapid_Registration_If.prototype.execute = function(evaluatedPath, me) {
    var container = me.getContainer();
    var prefix = this.applyToCanvas ? (this.isHorizontal ? 'td_' : 'div_') : '';
    var canvas = jrapid.getElementsById(prefix + this.slaveId, container.node);
    
    for (var i=0; i < canvas.length; i++) {
        var child = evaluatedPath == null ? null : evaluated(jrapid.replaceAll(this.trigger, '_', '.'), canvas[i]);
        if (evaluatedPath == child || evaluatedPath.match(child.replace(/\[/g, '\\[').replace(/\]/g, '\\]'))) {
            var value = evaluateBoolean(evaluated(this.condition, canvas[i]), canvas[i]);
            this.func(canvas[i], value, this.isHorizontal);                    
        }
    }
};

JRapid.prototype.displayIf = function(obj, bool, isHorizontal) { 
	if (this.isHorizontal) 
		obj.style.visibility = (bool ? '' : 'hidden'); 
	else 
		obj.style.display = (bool ? '' : 'none'); 
};

JRapid.prototype.visibleIf = function(obj, bool) { 
	obj.style.visibility = (bool ? '' : 'hidden'); 
};
JRapid.prototype.readonlyIf = function(obj, bool) { obj.readOnly = bool; };
JRapid.prototype.disabledIf = function(obj, bool) { obj.disabled = bool; };

JRapid.prototype.checkIf = function(obj, bool, msg) {
    if (!bool) {
        jrapid.hasErrors += (msg?msg:'Invalid value') + '\n';
    }
    obj.style.backgroundColor = bool ? '': 'red';
};

JRapid.prototype.checkUnique = function(obj, isUnique) {
    if (isUnique != null && !isUnique) {
        alert('This field is not unique. ');
        jrapid.hasErrors += 'This field is not unique. ';
    }
    obj.style.backgroundColor = isUnique == null || isUnique ? '': 'red';
};


JRapid_Registration_Condition.prototype.execute = function(evaluatedPath, me) {

    var container = me.getContainer();
    var canvas = jrapid.getElementsById((this.applyToCanvas ? 'div_': '') + this.slaveId, container.node);
    var params = [];
	var x = [];

    for (var i=0; i < canvas.length; i++) {
        var child = evaluatedPath == null ? null : evaluated(jrapid.replaceAll(this.trigger, '_', '.'), canvas[i]);
        if (child == evaluatedPath) {
            var paramsString = '';
            params[i] = [];
            for (var j=0; j < this.params.length; j++) {
                params[i][params[i].length] = jrapid.evaluateXpath(evaluated(this.params[j], canvas[i]), canvas[i]);
                paramsString += ',params[' + i + '][' + j + ']';
            }
            if (this.applyToCanvas && canvas[i].parentNode.getAttribute('labelposition') == 'top') {
                x[i] = canvas[i].parentNode;
                //this.func(canvas[i].parentNode.previousSibling, value);                
            //} else if (this.applyToCanvas && !canvas[i].parentNode.getAttribute('row')) {
           //     x[i] = canvas[i].parentNode;
            } else {
				x[i] = canvas[i];
            }  
            var xmlrpcserver = new JRapid_XmlRpcServer(jrapid.getURL(container) + '/xmlrpc');
            var func = this.func;
            eval('xmlrpcserver.executeAsync(this.rpcService, function(r) { func(x[' + i + '], r); }' + paramsString + ')');    
        }
    }    
};

JRapid_Registration_DynamicValue.prototype.execute = function(evaluatedPath, me) {

    var container = me.getContainer();
	var canvas = jrapid.getElementsById( (this.applyToCanvas ? 'td_': '') + this.slaveId, container.node );
	for (var i=0; i < canvas.length; i++) {
            var child = evaluatedPath == null ? null : evaluated(jrapid.replaceAll(this.trigger, '_', '.'), canvas[i]);
            if (this.triggerMode == 'onchangenew' && canvas[i].value) {
            	// if canvas had value, onchangenew should ignore it
        		continue;
        	}

            if (child == evaluatedPath || evaluatedPath.match(child.replace(/\[/g, '\\[').replace(/\]/g, '\\]'))) {
            	if (!jrapid.isNewOrHidden(canvas[i])) {
            		var params = new Array();
	                var p = '';
	                for (var j=0; j < this.params.length; j++) {
	                	params[params.length] = jrapid.evaluateXpath(evaluated(this.params[j], canvas[i]), canvas[i]);
	                    p += ',params[' + j + ']';
	                }
	                var x = canvas[i];
	                var xmlrpcserver = new JRapid_XmlRpcServer(jrapid.getURL(container) + '/xmlrpc');
	                var setDynamicValue = this.setDynamicValue;
	                eval('xmlrpcserver.executeAsync(this.rpcService, function(r, e) {  if (e) { } else { setDynamicValue(canvas[' + i + '], r);}} ' + p + ')');
            	}
            }
        }
};

JRapid_Registration_DynamicValue.prototype.setDynamicValue = function(x, r) {
    /* if null value show empty string */
	r = r == null ? '' : r;
	if (x.type == 'checkbox') {
        x.checked = r || r == 'true';
    } else {
        x.value = r; 
    }
    
    // sync and cascade
	application.dispatch('change', x, 'HTMLEvents');
};

JRapid_Registration_DynamicForEach.prototype.execute = function(evaluatedPath, me) {

    try {
        var container = me.getContainer();
	    var prefix = container.getPrefix();
        var canvas = jrapid.getElementsById(prefix + 'div_' + this.slaveId);
	    var xslt = container.getElementById('xsl');
	    
	    var xsl = '<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform" xmlns:xslt2="http://www.htmli.com/1999/XSL/Transform">';
	    xsl += '<xslt:namespace-alias stylesheet-prefix="xslt2" result-prefix="xslt"/>';
	    xsl += '<xslt:output method="html" omit-xml-declaration="yes" /><xslt:template match="/">';
	    xsl += xslt.getXslt().selectSingleNode('//*[@id = "' + prefix + 'div_' + this.slaveId + '"]').xml;
	    xsl += '</xslt:template></xslt:stylesheet>';
	    var xslDocument = XmlDocument.create(xsl);
	    
	    var multipleXml = container.getElementById('xmlmultiple').getXmlDocument();
	    
	    // TODO this should be set according to ROWNUM when used in inline environments
	    var fullXpath = this.fullXpath;
	    var xpath = fullXpath.substring(0, fullXpath.lastIndexOf('/'));

        for (var i=0; i < canvas.length; i++) {
            var child = evaluatedPath == null ? null : evaluated(jrapid.replaceAll(this.trigger, '_', '.'), canvas[i]);

            if (child == evaluatedPath || evaluatedPath.match(child.replace(/\[/g, '\\[').replace(/\]/g, '\\]'))) {
                var params = new Array();
                var p = '';
                for (var j=0; j < this.params.length; j++) {
                    params[params.length] = jrapid.evaluateXpath(evaluated(this.params[j], canvas[i]), canvas[i]);
                    p += '/' + encodeURIComponent(params[j]);
                }
                var x = canvas[i];
                
				var xml = XmlDocument.create();
				xml.onreadystatechange = function() {
					if (xml.readyState == 4) {
						if (xml.parseError.errorCode != 0) {
							alert(xml.parseError.reason);
							return;
						}
						
						// append new lines to xml
						var parentNode = multipleXml.selectSingleNode(xpath);
						var childNodes = multipleXml.selectNodes(fullXpath);
						for (var k=childNodes.length-1; k>=0; k--) {
							childNodes[k].parentNode.removeChild(childNodes[k]);
						}
						var newNodes = xml.documentElement.childNodes;
                        var n = newNodes.length;
                        var elementName = fullXpath.substring(fullXpath.lastIndexOf('/')+1);
                        for (var k=0; k < n; k++) {
                            if (!newNodes[k].attributes) {
                                continue;
                            }
                       
                            // TODO importnode for ff3
                            var e = xml.createElement(elementName);
                            for (var l=0; l < newNodes[k].attributes.length; l++) {
                                var name = newNodes[k].attributes[l].name;
                                var value = newNodes[k].attributes[l].value;
                                e.setAttribute(name, value);
                            }
                            while (newNodes[k].hasChildNodes()) {
                                e.appendChild(newNodes[k].childNodes[0]);
                            }
                            parentNode.appendChild(e);
                        }
                       
                        // refresh html
                        container.getElementById('xml').setXml(multipleXml.selectSingleNode(xpath).xml);
                        x.innerHTML = multipleXml.transformNode(xslDocument);					
					}
				};
				xml.load(jrapid.getServerPath(container) + this.service + p);
            }
        }
    } catch (e) {
        throw e;
    }
    
};

JRapid_Registration_EmbeddedListing.prototype.execute = function(evaluatedPath, me) {
    var container = me.getContainer();
    var sources = jrapid.getElementsById(this.slaveId, container.node);
    
    for (var i=0; i < sources.length; i++) {
        var child = evaluatedPath == null ? null : evaluated(jrapid.replaceAll(this.trigger, '_', '.'), sources[i]);
        if (child == evaluatedPath) {
            
        	var subsetparams = '';
            for (var j=0; j < this.subsetparams.length; j++) {
                if (this.subsetparams[j] && this.subsetparams[j].length) {
                	subsetparams += '/' + encodeURIComponent( jrapid.evaluateXpath(evaluated(this.subsetparams[j], sources[i]), sources[i]) );
                }
            }
            
            // we don't evaluate the dsp here, they'll be eval'ed when clicking ADD 
            var dsp = this.defaultsetparams;
			var defaultset = this.defaultset;
			
			// TODO: separate ss from ssparams
            var subset = this.subset + subsetparams; 
            
            if (sources[i].innerHTML == '') {
            	jrapid.listing( { 
            		obj: me,  
            		canvas: sources[i],
            		target: 'replace',  
            		module: this.module, 
            		entity: this.entity,
            		listing: this.listing, 
            		subset: subset, 
            		defaultset: defaultset,
            		defaultsetparams: dsp,
            		evaldsps: true
            	} );
			} else {
				var cont = new Container( sources[i].children[0] );
				var rootUrl = jrapid.getURL( cont );
				jrapid.listingLoad( 
					cont, 
					rootUrl, 
					this.entity, 
					{ subset: subset, defaultset: defaultset, defaultsetparams: dsp, evaldsps: true } 
				);
			}
        }
    }
};

JRapid_Registration_jQuery.prototype.execute = function(evaluatedPath, me) {
	var container = me.getContainer();
	//alert(container.node.outerHTML);
	var elements = jrapid.getElementsById(this.id, container.node);
	var plugin = this.plugin;
	var options = this.options;
	
	//setTimeout(function() {
		for (var i=0; i<elements.length; i++) {
			var a = elements[i];
			var evalPlugin = '$(a).' + plugin + '(' + options + ');'; 
			try { 
				eval( evalPlugin );
			} catch( e ) {
				jrapid.consoleDebug( e );
			}
		};	
	//}, 1000);
};

JRapid_Registration_RememberLast.prototype.execute = function(evaluatedPath, me) {
	var container = me.getContainer();
	if (window.rememberLast && window.rememberLast[this.id]) {
		var objs = jrapid.getElementsById(this.id, container.node);
		var value = window.rememberLast[this.id];
		for (var i=0, n=objs.length; i < n; i++) {
			if (!objs[i].value || objs[i].value == '0') {
				objs[i].value = value;
				jrapid.wrap(objs[i]).sync();
			}
		}
	}
};

JRapid.prototype.rememberLast = function(obj) {
	if (!window.rememberLast) {
		window.rememberLast = [];
	}
	window.rememberLast[obj.id] = obj.value;	
};		



/********************************* SUGGEST *********************************/
// NOTES: 
// public functions (called from the html) receive pure HTML elements
// private functions (called from other js funcs) receive wrapped elems


//public
JRapid.prototype.suggestKeyDown = function(elem, entity, property, ev) {
    if (ev.keyCode == jrapid.KEY_ENTER) {
    	//if suggest closed, or ELEM is textarea, let the event live...
    	if (elem.suggestWindow && elem.nodeName != "TEXTAREA") {
    		application.stopPropagation(ev);
            application.preventDefault(ev);
    	} else {
    		// ENTER will fire the form submission, and BLUR won't be fired
    		jrapid.tooltipOff(elem);
    	}
    } else if (ev.keyCode == jrapid.KEY_TAB) {
    	jrapid.suggestClose( jrapid.wrap(elem) );
    }
};

// public
JRapid.prototype.suggestDblClick = function(elem, entity, property) {
    this.suggestShow( jrapid.wrap(elem), entity, property );
};

//public
JRapid.prototype.suggestBlur = function(me, entity, property) {};

// public
JRapid.prototype.suggestClicked = function(obj) {
    var suggestWindow = jrapid.suggestGetSuggestWindowFromOptionClick( obj );
    var suggest = jrapid.wrap( suggestWindow.opener );
    suggest.setValue( obj.title );
    jrapid.suggestClose( suggest );
    application.dispatch( 'change', suggest.outerNode, 'HTMLEvents' );
};

//public
JRapid.prototype.suggestKeyUp = function(elem, entity, property, ev) {
	var me = jrapid.wrap(elem);
	
    // check if it is a close event/key
    if (jrapid.suggestIsCloseKey(ev, me)) {
    	jrapid.suggestClose(me);
        return;
    }

    // when the suggest is closed, suggestWindow should be null
    var suggestWindow = jrapid.wrap( me.outerNode.suggestWindow );
    
    if (suggestWindow && (ev.keyCode == jrapid.KEY_DOWN || ev.keyCode == jrapid.KEY_UP)) {
    	var outer = suggestWindow.outerNode;
		if (outer.suggestSelectedIndex == null) {
        	outer.suggestSelectedIndex = -1;
        } else if (outer.suggestSelectedIndex >= 0) {
        	// unselect the previous selected item
            jrapid.suggestGetSelectedItem( suggestWindow ).setClassName("");
        }
		if (ev.keyCode == jrapid.KEY_DOWN) {
            if (outer.suggestSelectedIndex >= suggestWindow.getChildren().getLength()-1) {
                return;
            }
            outer.suggestSelectedIndex++;
        } else if (ev.keyCode == jrapid.KEY_UP) {
            if (outer.suggestSelectedIndex <= 0) {
                return;
            }
            outer.suggestSelectedIndex--;        
        }
		var item = jrapid.suggestGetSelectedItem( suggestWindow );
		item.setClassName( "selected" );
		me.setValue( item.getTitle() );
		application.dispatch('change', me.outerNode, 'HTMLEvents');
    } else if (ev.keyCode != jrapid.KEY_SHIFT) {
    	// up or down?
        if (me.getValue().length || ev.keyCode == jrapid.KEY_UP) {
            this.suggestShow(me, entity, property);
        }
    }
};

// private
JRapid.prototype.suggestGetSelectedItem = function(suggestWindow) {
	return suggestWindow.getChildren().item( suggestWindow.outerNode.suggestSelectedIndex );
}

// private, me is wrapped
JRapid.prototype.suggestShow = function(me, entity, property) {
    var container = me.getContainer();
    var suggestWindowTemplate = container.getElementById('suggests');
     
    var suggestWindow;
    if (! me.outerNode.suggestWindow) {
    	suggestWindow = suggestWindowTemplate.cloneNode(true);
        if (me.getNextSibling()) {
        	me.getParentNode().insertBefore( suggestWindow, me.getNextSibling() );
        } else {
        	me.getParentNode().appendChild( suggestWindow );
        }
        me.outerNode.suggestWindow = suggestWindow.outerNode;
    } else {
    	// reuse already existing suggestWindow
    	suggestWindow = jrapid.wrap( me.outerNode.suggestWindow );
    }
    // tell the suggestWindow who is the opener(the input who opened it)
    suggestWindow.outerNode.opener = me.outerNode;
    
    // this could be removed, redundant
    suggestWindow.outerNode.suggestSelectedIndex = null;
    
    var url = jrapid.getServerPath(container) + entity + '/suggest' + property + '/' + encodeURIComponent(me.getValue());
    
    suggestWindow.setUrl( url );
    
    suggestWindow.refresh( 
    	function() {
	        if (suggestWindow.hasChildren()) {
	    		jrapid.suggestPositionWindow( suggestWindow );
	        } else {
	        	jrapid.suggestClose( me );
	        }
	    }
    );
};


//position (verb) the suggest window depending on suggest.parentNode (TD or DIV)
JRapid.prototype.suggestPositionWindow = function (suggestWindow) {
	var opener = suggestWindow.outerNode.opener;
	// if it is a collection, the suggest is rendered inside of a TABLE
	if (opener.parentNode.nodeName != "TD") {
		suggestWindow.getStyle().left = (opener.offsetLeft - 4) + "px";
	}
	suggestWindow.getStyle().display = ''; // show
};

// returns true if the key event is a key to close the suggest
JRapid.prototype.suggestIsCloseKey = function(ev, input) {
	// default close keys
	switch (ev.keyCode) {
		case (jrapid.KEY_TAB) :
		case (jrapid.KEY_ESC) :
		case (jrapid.KEY_ENTER) : {
			return true;
		}
	}
	// if input has no text, and key pressed are not up or down
	// TODO: check also for backspace...
	if (input.getValue().length < 1) {
		if (ev.keyCode != jrapid.KEY_DOWN && ev.keyCode != jrapid.KEY_UP) {
			return true;
		}
	}
	return false;		
};

// receives the suggest input (wrapped)
JRapid.prototype.suggestClose = function(obj) {
	// we store the cloned suggest window in a property of the object (suggestWindow)
	if (obj.outerNode.suggestWindow) {
		obj.outerNode.parentNode.removeChild( obj.outerNode.suggestWindow );
		obj.outerNode.suggestWindow = null;
	}
};

//param: the element that fired the CLICK event on the suggest window.
JRapid.prototype.suggestGetSuggestWindowFromOptionClick = function(clicked) {
	// clicked = DIV
	return clicked.parentNode //DIV inner
		.parentNode;//DIV suggest window
};


/*************************************** TABPANE *******************************/
//glossary: TAB is the content of the tab, TABTAB is the tab of the tab...
//tabs have this DOM structure
//<ul class="jrapid_tabpane">
//	  <li class="active"><a href="#" onclick="[...]">TAB 1</a></li>    [....]
//	  <li><a href="#" onclick="[...]">TAB N</a></li>
//</ul>
//<div id="tab_1" class="jrapid_tab"></div>  [...]
//<div id="tab_n" class="jrapid_tab"></div>

//public (assumes being called from the "<A>" inside the tabtab's <LI>)
JRapid.prototype.showTab = function( tabTabLink ) {
	var i=0;
	var tabTab = jrapid.wrap( tabTabLink.parentNode );
	while (tabTab.getPreviousSibling()) {
		if (tabTab.getPreviousSibling().getNodeType() == 1) {
			i++;// only count elements
		}
		tabTab = tabTab.getPreviousSibling();
	}
	var j = 0;
	var tab = tabTab.getParentNode().getNextElementSibling();
	
	// refresh the classes in each tab of the tab set
	while (tab && (tab.hasClass('jrapid_tab') || tab.getNodeType() != 1 ) ) {
		if (tab.getNodeType() == 1) {
			var myTabTab = tabTab.getParentNode().getChildren().item(j);

			myTabTab.setClassName( j == i ? 'active' : '' );
			
			// be careful, if the tabTab is not visible, neither should be the tab
			var tabTabVisible = myTabTab.getStyle().display != 'none'; 
			tab.getStyle().display = (j == i && tabTabVisible ) ? 'block' : 'none';
			j++;
		}
		tab = tab.getNextElementSibling();
	}
	return false;
};

//public
JRapid.prototype.displayTabIf = function( tabElem, show ) {
    var tab = application.wrapNode(tabElem);
    
	//get a reference to the TABTAB
	var tabIndex = -1;
	var tabsUL = tab;
	var nodeName = tabsUL.getNodeName();
    do {
    	tabIndex ++;
    	tabsUL = tabsUL.getPreviousElementSibling();
    	nodeName = tabsUL.getNodeName();
    } while ( nodeName == "DIV" );
    
    // now, hide or show both the tab and the TABTAB (using the ACTIVE class in the TABTAB)
    var tabTab = tabsUL.getChildren().item( tabIndex );
    var isActiveTab = tabTab.hasClass( "active" );
    
    // if TAB was active, and we are hiding it, pass the activation to another visible TAB
    if (isActiveTab && !show) {
    	var nextActiveTab = jrapid.tabsGetNextActiveTab( tabTab );
    	if (nextActiveTab != null) {
    		// pass the activation
	    	tabTab.removeClass( "active" );
	    	nextActiveTab.addClass( "active" );
	    	jrapid.showTab( nextActiveTab.outerNode.firstChild ); // public (called with the <a>)
    	}
    }

    // change the display of both the TABTAB and the TAB
    tabTab.getStyle().display = show ? "block" : "none";
    if (isActiveTab) {
    	tab.getStyle().display = show ? "block" : "none";
    }
    
    // if we are showing the only visible tab, activate it...
    if (show && !isActiveTab) {
    	var nextActiveTab = jrapid.tabsGetNextActiveTab( tabTab );
    	if (nextActiveTab == null ) {
    		jrapid.showTab( tabTab.outerNode.firstChild ); // public (called with the <a>)
    	}
    }
    return false;
};

JRapid.prototype.tabsGetNextActiveTab = function( tabTab ) {
	// if we have visible tabtabs, return the first one (from 0)(could be changed to the closest)
	// if there are no visible tabtabs, return null
	var tabsUL = tabTab.getParentNode();
	var nextActiveTab = null;
	var candidateTab = null;
	
	for (var i=0; i < tabsUL.getChildren().getLength(); i ++) {
		var candidateTab = tabsUL.getChildren().item( i );
		if (candidateTab.outerNode != tabTab.outerNode && candidateTab.getStyle().display != "none") {
			nextActiveTab = candidateTab;
			break;
		}
	}
	return nextActiveTab;
};

/********************************* MULTILINE *********************************/

JRapid.prototype.multilineRemove = function(obj, fpath) {
	
	var me = jrapid.wrap(obj);
    var container = me.getContainer();
    var row = jrapid.getRowFor(me);
    var xpath = evaluated(fpath, row);
    var xml = container.getElementById('xml');
    xml.remove(xpath);
    row.parentNode.removeChild(row);
    return;    
};

JRapid.prototype.multilineInsert = function(obj, xpath, property) {
	var me = jrapid.wrap(obj);
    return jrapid.multilineAdd(obj, xpath, property, jrapid.getRowFor(me).rowIndex);
};

JRapid.prototype.multilineUp = function(obj, xpath) {
	
	var me = jrapid.wrap(obj);
    var row = jrapid.getRowFor(me);    
    if (row.rowIndex > 1) {
        var container = me.getContainer();    
        var xml = container.getElementById('xml');
        var xmlDoc = xml.getXmlDocument();    
        var node = xmlDoc.selectSingleNode(evaluated(xpath, row));
        node.parentNode.insertBefore(node, jrapid.wrap(node).getPreviousElementSibling().outerNode);
        xml.setXml(xmlDoc.xml);    
    
        row.parentNode.insertBefore(row, jrapid.wrap(row).getPreviousElementSibling().outerNode);
    }
    
};

JRapid.prototype.insertAfterNode = function(node, newNode, refNode) {
		var refNodeWrapped = jrapid.wrap(refNode);
		if (refNodeWrapped.getNextElementSibling()) {
			return node.insertBefore(newNode, refNodeWrapped.getNextElementSibling().outerNode);
		} else {
			return node.appendChild(newNode);
		}
};

JRapid.prototype.multilineDown = function(obj, xpath) {
	
	var me = jrapid.wrap(obj);
    var row = jrapid.getRowFor(me);    
    if (row.rowIndex < row.parentNode.children.length-3) {
        var container = me.getContainer();    
        var xml = container.getElementById('xml');
        var xmlDoc = xml.getXmlDocument();    
        var node = xmlDoc.selectSingleNode(evaluated(xpath, row));
		
		var nodeWrapped = jrapid.wrap(node);
		var rowWrapped = jrapid.wrap(row);  
		if ( nodeWrapped.getNextElementSibling() ) {
			jrapid.insertAfterNode(node.parentNode,node,nodeWrapped.getNextElementSibling().outerNode);			
	        xml.setXml( xmlDoc.xml );
			jrapid.insertAfterNode(row.parentNode,row,rowWrapped.getNextElementSibling().outerNode);				
		}
		
    }    
};

JRapid.prototype.multilineAdd = function(obj, fpath, property, rowNum) {

	var me = jrapid.wrap(obj);
	var tr = jrapid.getRowFor(me);
	
	var tbody = tr.parentNode;
	jrapid.checkIfIsNew(jrapid.wrap(tbody));
	
	var container = me.getContainer();
	var xml = container.getElementById('xml');
	var xmlDoc = xml.getXmlDocument();
	if (rowNum) {
		var node = xmlDoc.selectSingleNode(evaluated(fpath + '/' + property + '[ROWNUM]', tr));
		if (node.nextSibling) {
			node.parentNode.insertBefore(xmlDoc.createElement(property), node.nextSibling);
		}
		else {
			node.parentNode.appendChild(xmlDoc.createElement(property));
		}
	} else {
		var node = xmlDoc.selectSingleNode(evaluated(fpath, tbody));
		node.appendChild(xmlDoc.createElement(property));
	}
	xml.setXml(xmlDoc.xml);
	var newTr = tbody.children[tbody.children.length - 2].cloneNode(true);
	tr.removeAttribute('hidden');
	newTr.style.display = '';
	tr.parentNode.insertBefore(newTr, rowNum ? tbody.children[rowNum] : tbody.children[tbody.children.length - 2]);
	newTr.children[0].style.display = '';
	
	if (rowNum) { 
		for (var i = 0; i < newTr.children.length; i++) {
			newTr.children[i].style.display = '';
		}
	}
    return true;
};

JRapid.prototype.multilineInsertEntity = function(obj, xpath, entity) {
    return jrapid.multilineAddEntity(obj, xpath.substring(0, xpath.lastIndexOf('/')), xpath.substring(xpath.lastIndexOf('/')+1, xpath.lastIndexOf('[')), entity, jrapid.getRowFor(me).rowIndex);
};

JRapid.prototype.multilineAddEntity = function(obj,fpath, property, entity, rowNum, async) {
	var me = jrapid.wrap(obj);
    var tr = jrapid.getRowFor(me);
    
    var tbody = tr.parentNode;    
    var container = me.getContainer();    
    var xml = container.getElementById('xml');
    var xmlDoc = xml.getXmlDocument();
    
    // console
    var tx = jrapid.startConsole('Adding', false, 'green');
    
    var httpRequest = HttpRequest.create();
    
	// TODO this should be async but also allow sync to be called later
	httpRequest.open("GET", jrapid.getServerPath(container) + entity + '/0' /*?' + new Date().getTime()*/, false);
    var command = function() {                    
        if (httpRequest.readyState == 4) {
        
        	// end console
        	jrapid.endConsole(tx);
        	
			// check network error
			if (httpRequest.status != 200) {
				jrapid.startConsole('Network error', true, 'red');
				window.status = 'Network error';
				return false;
			}      
			  
            var newNode = xmlDoc.createElement(property);
            var childDoc = httpRequest.responseXML;
            var children = childDoc.documentElement.childNodes;
            for (var i=0; i < children.length; i++) {
                var n = children[i].cloneNode(true);
                /*if (n.tagName != path.substring(1)) {*/
                    newNode.appendChild(n);
                /*}*/
            }
            newNode.setAttribute('id', 0);
            
            var actualNodesLength = xmlDoc.selectNodes(evaluated(fpath, tbody) + '/' + property).length;
            if (rowNum && rowNum <= actualNodesLength) {
                var n = xmlDoc.selectSingleNode(evaluated(fpath, tbody) + '/' + property + '[' + rowNum + ']');
              	n.parentNode.insertBefore(newNode, n); 
            } else {
                xmlDoc.selectSingleNode(evaluated(fpath, tbody)).appendChild(newNode);
            }
            xml.setXml(xmlDoc.xml);
            
            //create the new TR of the table
			var newTr = tbody.children[tbody.children.length-2].cloneNode(true);
			jrapid.multilineAddEntityPatch( newTr );
			
            tr.style.color = '';                       
            newTr.style.display = '';
            newTr.onkeydown = function() {};  
            if (rowNum) {
            	tr.parentNode.insertBefore(newTr, tbody.children[rowNum]);
            } else {
	            var previous = tbody.children[tbody.children.length-1].previousSibling;
	        	while (previous) {
	        		if (previous.nodeType == 1) {
	        			tr.parentNode.insertBefore(newTr, previous);
	        			break;
	        		}
	        		previous = previous.previousSibling;
	        	}
            }
            
            //display the images if the row is between the last and the first row
            if (rowNum != null) {
            	var length = newTr.children.length;
            	for (var i = length - 1; i > 2 ; i--) {
					newTr.children[i].style.display = ''; //TD containing the image
            	}
            }
            //jrapid.multilineCalculateIndexes(tbody);
            
            return true;
        }
    };
    try {
	    httpRequest.send("");  
	    return command(); 
	} catch (e) {
		jrapid.startConsole('Network error', true, 'red');
		window.status = 'Network error';				
	}
	return false;
};


JRapid.prototype.multilineAddEntityPatch = function( newTr ){
	// this patch is to prevent the repeating of <input type=radio> names
	// in different rows of a multiline.
	var inputs = newTr.getElementsByTagName('input');
	var random = Math.round( Math.random() * 10 ); // one digit
	for( var i=0, len=inputs.length, input; i < len; i++ ){
		input = inputs[i];
		if( input.type == "radio" ){
			input.name += "_" + random;
		}
	}
};


JRapid.prototype.multilineCalculateIndexes = function(tbody) {
    for (var i=0; i < tbody.children.length; i++) {
        tbody.children[i].children[0].children[0].value = i;
    }
};

// public, should receive a plain elem (TODO: receive plain obj)
JRapid.prototype.checkIfIsNew = function( me ) {
    var node = me.outerNode;
    var success = false;

    while (node && node.parentNode && node.parentNode.getAttribute) {
        node = node.parentNode;
        
        if (node.getAttribute("row")) { 
            if (node.parentNode.getAttribute('extendable') == 'extendable') {           
                var current = node.rowIndex;
                var total = node.parentNode.children.length;
                if (current == (total-2)) {
                    
                    if (node.getAttribute('entity')) {
                        // TODO this is async!
                    	success = jrapid.multilineAddEntity(
                    		me, 
                    		node.getAttribute('selectexpr').substring( 0, node.getAttribute('selectexpr').lastIndexOf('/') ), 
                    		node.getAttribute('property'), 
                    		node.getAttribute('entity'), 
                    		null, true
                    	);
                    } else {
                        success = jrapid.multilineAdd(
                        	me, 
                        	node.getAttribute('selectexpr'), 
                        	node.getAttribute('property')
                        );
                    }    
                    
                    if (success) {
	                    for (var i=0; i < node.children.length; i++) {
    	                    node.children[i].style.display = '';
        	            }
					}                    
                }
            }
            break;
        }
    }
    return success;
};


// this function is used to determine if an element is a REAL element/property, 
// instead of an element whose purpose is to be a template to be cloned to make a real form element.
// this is the case in properties with SSP (subsetparams)
// that are held outside the viewable form, next to the button bar
JRapid.prototype.isFormProperty = function(me) {
    var node = me;
    while (node && node.parentNode ) {
        node = node.parentNode;
        // condition to check if an element is a template = xsl holder is display none
        if (node.className == "jrapid_xsl" ) {
        	return node.style.display == ""; // not form props have display=NONE
        	break;
        }
    }  
    return true;
}


// this returns true is the element is part of tha last foo rows of a MULTILINE set.
// private?
JRapid.prototype.isNewOrHidden = function(me) {
    var node = me;
    while (node && node.parentNode && node.parentNode.getAttribute) {
        node = node.parentNode;
        if (node.getAttribute("row")) {
            if (node.parentNode.getAttribute('extendable') == 'extendable') {
                var current = node.rowIndex;
                var total = node.parentNode.children.length;
                return current == (total-2) || current == (total-1);
            }
            break;
        }
    }
    return false;
};


JRapid.prototype.multilineChangedNew = function(me, fpath, property, entity, rowNum) {
//    me.outerNode.onkeydown = function() {};
//    jrapid.multilineAddEntity(me, fpath, property, entity, rowNum);
};

 
JRapid.prototype.multilineDetailAdd = function(obj, selectexpr, name, id, entity) {
	var me = jrapid.wrap(obj);
    var tbody = me.outerNode.previousSibling.previousSibling.lastChild;
    
    // TODO make this method work as with suggest one embedded entity
    
    var newTR = tbody.insertRow(tbody.children.length-1);
    newTR.setAttribute('row', 'row');
    var newCell = newTR.insertCell(-1);
    var div = document.createElement('div');
    div.id = 'row_' + id;
    newCell.appendChild(div);
    
/*    tbody.lastChild.cloneNode(true);
    tbody.appendChild(newTR);
    tbody.childNodes[tbody.childNodes.length-2].style.display = '';
    */
    
    jrapid.suggestEmbeddedEntity(me, application.wrapNode(div), selectexpr, entity, name, null, true);

};

// public. 
// moreCell is the TD of the row of the multiline table
JRapid.prototype.multilineShowMore = function( moreCell, moreId, show ) {
	var moreDiv = jrapid.getElementsById( moreId, moreCell );
	moreDiv[0].style.display = show ? '' : 'none';
}


/********************************* EMBEDDED *********************************/

JRapid.prototype.showHideEmbeddedEntity = function(obj, xpath, entity, property, value, handler) {
	var me = jrapid.wrap(obj);
    var container = me.getContainer();
    var xml = container.getElementById('xml');
    var xmlDoc = xml.getXmlDocument();
    var checked = typeof(value)!='undefined' ? value : me.getChecked();
    var div = me.getParentNode().getNextElementSibling();
    
    var xpath = evaluated(xpath, me);
    var node = xmlDoc.selectSingleNode(xpath + '/' + property);
    if (node) {
        node.setAttribute('id', checked ? 1 : -1);
        xml.setXml(xmlDoc.xml);
        if (handler) {
            handler();
        }
    } else if (checked) {
        jrapid.suggestEmbeddedEntity(me, div, xpath, entity, property, handler);
    }
    var style = div.getStyle();
    style.visibility = checked ? 'visible' : 'hidden';
    style.color = checked ? '' : 'green';
}

JRapid.prototype.suggestEmbeddedEntity = function(me, div, xpath, entity, property, handler, isMultiLine) {
    
    var container = me.getContainer();
    var prefix = container.getPrefix();
    
    var xslt = container.getElementById('xsl');
    var lcFirstEntity = entity.substring(0,1).toLowerCase() + entity.substring(1);
    
    var xsl = '<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform" xmlns:xslt2="http://www.htmli.com/1999/XSL/Transform">';
    xsl += '<xslt:namespace-alias stylesheet-prefix="xslt2" result-prefix="xslt"/>';
    xsl += '<xslt:output method="html" omit-xml-declaration="yes" /><xslt:template match="/">';
    xsl += xslt.getXslt().selectSingleNode('//*[@id = "' + prefix + div.getId() + '"]').xml;
    xsl += '</xslt:template></xslt:stylesheet>';
    var xslDocument = XmlDocument.create(xsl);
    
    var multipleXml = container.getElementById('xmlmultiple').getXmlDocument();
    var oldNode = multipleXml.selectSingleNode('/*/' + xpath + '/' + property);
        
    var ajax = new XMLHttpRequest();
    ajax.open('GET', jrapid.getServerPath(container) + entity + '/0', true);
    // console
    var tx = jrapid.startConsole('Embedding', false, 'green');
    
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4) {
        	
        	// end console
        	jrapid.endConsole(tx);
        	
        	// TODO if (network or service error) return error           
        	var xml = ajax.responseXML;
       
            if (!oldNode || isMultiLine) {
                oldNode = multipleXml.createElement(property);
                var parentNode = multipleXml.selectSingleNode('/*' + xpath);
                parentNode.appendChild(oldNode);
            }
            var n = oldNode.childNodes.length;
            for (var i=0; i < n; i++) {
                oldNode.removeChild(oldNode.childNodes[0]);
            }
            
            var children = xml.documentElement.childNodes;
            for (var i=0; i < children.length; i++) {
                oldNode.appendChild(children[i].cloneNode(true));
            }
           
            oldNode.setAttribute('id', isMultiLine ? 0 : 1);
            container.getElementById('xml').setXml(multipleXml.selectSingleNode('/root' + xpath).xml);
            div.setInnerHTML(multipleXml.transformNode(xslDocument));
            if (handler) {
                handler();
            }
        }
    };        
    // TODO add subset or defaultset
    ajax.send('');
};

/********************************* COLLECTION *********************************/

// public 
JRapid.prototype.textareaCollectionSync = function(obj, expr, name) {
	
	var me = jrapid.wrap(obj);
    var values = me.getValue().split('\n');
    jrapid.checkIfIsNew(me);
    
    var container = me.getContainer();
    var xml = container.getElementById('xml');
    var xmlDoc = xml.getXmlDocument();
    var selectexpr = evaluated(expr + '/' + name, me);
    
    var nodes = xmlDoc.selectNodes(selectexpr);
    for (var i=nodes.length-1; i >= 0; i--) {
        nodes[i].parentNode.removeChild(nodes[i]);
    }
    
    var parentNode = xmlDoc.selectSingleNode(evaluated(expr, me));
    for (var i=0; i < values.length; i++) {
        if (values[i] && values[i].replace(/^\s+|\s+$/g,'').length) {
            var newNode = xmlDoc.createElement(name);
            newNode.appendChild(xmlDoc.createTextNode(values[i].replace(/^\s+|\s+$/g,'')));
            parentNode.appendChild(newNode);
        }
    }
    
    xml.setXml(xmlDoc.xml);    
};

//CONCEPTs / glossary: 
// * entity-collection: the property of type entity and cardinality collection. (html elem=select multiple)
// * window-select: the xsl window holding all the possible values of entities to add to the collection
// * input-filter: the input text used in the window-select to filter the possible entities to add.

//TODO: implement the multiple selection of elements, both to add and delete

// public. called when clicking on the ADD button below the entity-collection
// first time, creates the window; next times: reuses it.
JRapid.prototype.collectionAddEntity = function(elem, id, entity, subset, subsetparams, displayCanvas, unique, firstPage) {

	var addButton = jrapid.wrap( elem );
	var select = jrapid.collectionGetSelectFromAction( addButton );
	var minrows = select.getAttribute( "minrows" );
	var maxrows = select.getAttribute( "maxrows" );

    if (maxrows && select.outerNode.options.length >= maxrows) {
        alert('Max rows: ' + maxrows);
        return false;
    }

    var container = addButton.getContainer();
    var selectxsl = container.getElementById('window_select_xsl' + id);

    if (subset && subset != '') {
        var url = jrapid.getServerPath(container) + entity + '/' + subset;
        if (subsetparams && subsetparams.length) {
	        var params = subsetparams.split(';');
	        for (var j=0; j < params.length; j++) {
	            url += '/' + encodeURIComponent(jrapid.evaluateXpath(evaluated(params[j], addButton), addButton));
	        }
	    }
        selectxsl.setUrl(url + (firstPage ? ';_page=1' : ''));        
    } else {
        selectxsl.setUrl(jrapid.getServerPath(container) + entity + (firstPage ? ';_page=1' : ''));
    }
    selectxsl.setAttribute('baseurl', selectxsl.getUrl());
    
    // console
    var tx = jrapid.startConsole('Add', false, 'green');
    
    selectxsl.refresh(function() {
    	// console
    	jrapid.endConsole(tx);
    	
    	// TODO if (network or service error) return error
        if (unique) {
        	var currentSelect = select.outerNode;
        	var windowSelect = jrapid.collectionGetSelectFromXsl( currentSelect.collectionWindowSelect );
            for (var i=windowSelect.options.length-1; i >= 0; i--) {
                for (var j=0, n=currentSelect.options.length; j < n; j++) {
                    if (windowSelect.options[i].value == currentSelect.options[j].value) {
                        windowSelect.remove(i);
                        break;
                    }
                }
            }    
        }        
    });
    
    // hide or show the INPUT-filter
    selectxsl.getPreviousElementSibling().getStyle().display = firstPage ? '' : 'none';
    
    // set the window-select xsl list to visible (will be embedded in a jrapid-window)
    selectxsl.outerNode.parentNode.style.display = '';
    
    // open a jr_window with the contents of the XSL window
    var win = container.getElementById(selectxsl.outerNode.id + '_window');
    if (win) {
    	win.open();
    } else {
    	var win = application.openWindow('Choose', selectxsl.outerNode.parentNode, null, true, true, true);
    	win.id = selectxsl.outerNode.id + '_window';
    	//jrapid.wrap(win).resizeTo(360, 260, true);
    	//alert(selectxsl.outerNode.parentNode);
    }
    selectxsl.outerNode.slaveSelect = select;
    selectxsl.outerNode.displayCanvas = displayCanvas;
    selectxsl.outerNode.unique = unique;
    
    //keep a reference to the xsl window select (div)
    select.outerNode.collectionWindowSelect = selectxsl.outerNode;
    
    
};

// public (can be called either by doubleclicking on an element of the entity-collection, o by clicking the remove action.
JRapid.prototype.collectionRemoveEntity = function(elem, xpath, property) {
	var me = jrapid.wrap(elem);
	
    var select = null;
    if (me.outerNode.nodeName == "SELECT") {
    	select = me.outerNode; 
    } else if (me.outerNode.nodeName == "A") {
    	select = jrapid.collectionGetSelectFromAction( me ).outerNode;
    }
    if (select.selectedIndex >= 0) {
        // sync (only if not in filter)
        var container = me.getContainer();
        var xml = container.getElementById('xml');
        var isFilter = xml == null;
        if (!isFilter) {
        	var xmlDoc = xml.getXmlDocument();    
            var node = xmlDoc.selectSingleNode( evaluated(xpath, me) + '/' + property + '[' + (select.selectedIndex+1) + ']' );
            node.parentNode.removeChild(node);
            xml.setXml( xmlDoc.xml );
        }        
        
        //backup
        var clonedOption = select.options[ select.selectedIndex ].cloneNode(true);
        
        // display
        select.remove( select.selectedIndex );
        application.dispatch('change', select, 'HTMLEvents');

        if (select.collectionWindowSelect) {
        	// if unique, we should restore this removed elem to the window-select, for it to be able to re-add it
        	var windowSelectXslDiv = select.collectionWindowSelect;
        	if (windowSelectXslDiv.unique) {
        		var windowSelect = jrapid.collectionGetSelectFromXsl( windowSelectXslDiv );
        		// the select-window can be open/visible or not, but it exists in the DOM
        		for (var i=windowSelect.options.length; i > 0; i--) {
        			windowSelect.options[i] = windowSelect.options[i-1].cloneNode(true); 
        		}
        		windowSelect.options[0] = clonedOption;
        	}
        }
    }
};

//public
//called when double clicking on an element of the window select to add it to the property
JRapid.prototype.collectionSelectWindowDblClick = function(elem) {
	var me = jrapid.wrap( elem );
	jrapid.collectionAddEntityToProperty( me );
};

//public
//called when clicking the ADD button from the window select
JRapid.prototype.collectionSelectWindowAddEntity = function(elem) {
	var windowSelectElem = jrapid.collectionGetSelectFromAction( jrapid.wrap(elem) );
	jrapid.collectionAddEntityToProperty( windowSelectElem );
};

// private	
JRapid.prototype.collectionAddEntityToProperty = function( selectWindow ) {	
    if (selectWindow.getSelectedIndex() == -1) {
        return;
    }
    var xsl = selectWindow.getParentNode().getParentNode().outerNode;
    jrapid.checkIfIsNew(xsl.slaveSelect);
    var select = xsl.slaveSelect.outerNode;
    var maxrows = select.getAttribute('maxrows');
    
    if (maxrows && select.options.length >= parseInt(maxrows)) {
        alert('Max rows: ' + maxrows);
        return false;
    }
        
    var selectedOption = selectWindow.outerNode.options[selectWindow.outerNode.selectedIndex];
    
    // add new option to entity-collection; and remove it from window-select
    select.options[select.options.length] = new Option( selectedOption.text, selectedOption.value );    
    if (xsl.unique) {
    	// remove added element from the window select.
    	selectWindow.remove( selectWindow.getSelectedIndex() );
    }
    
    var container = selectWindow.getContainer();
    var target = container.getElementById('xml');
    var isFilter = target == null;
    // TODO: this below should not be done if it is filter.
    if (!isFilter) {
	    var node = select.getAttribute('property');
	                            
	    var xmlDoc = XmlDocument.create();
	    xmlDoc.loadXML('<' + node + ' id=\'' + selectedOption.value + '\' />');
	
	    var targetDoc = target.getXmlDocument();
	    var selectexpr = evaluated(select.getAttribute('selectexpr'), select);
	    targetDoc.selectSingleNode(selectexpr).appendChild(
	    	targetDoc.adoptNode ? targetDoc.adoptNode(xmlDoc.documentElement) : xmlDoc.documentElement
	    );
	    target.setXml(targetDoc.xml);
    }
    application.dispatch('change', select, 'HTMLEvents');
    
    var canvas = xsl.displayCanvas;
    if (canvas) {
        var txt = '';
        for (var i=0; i < select.options.length; i++) {
            txt += (i == 0 ? '' : ', ') + select.options[i].text;
        }
        canvas.innerHTML = txt;
        canvas.title = txt;
    }
};

// public
JRapid.prototype.collectionSelectFilter = function(input, comboproperty) {
	var filterInput = jrapid.wrap( input );
	var value = filterInput.getValue();
	// TODO: this way of getting the xsl element is dependant on the DOM structure
	// perhaps we could link the 2 elems via properties.
    var xsl = filterInput.getNextElementSibling();
    xsl.setUrl(xsl.getAttribute('baseurl') + (value ? (';' + comboproperty + '=' + value) : ''));
    xsl.refresh(
    	// TODO if (network or service error) return error
    );
};

//public
JRapid.prototype.collectionKeyDown = function(select, event, xpath, property) {
    var xml = jrapid.wrap(select).getContainer().getElementById('xml');
    var i = select.selectedIndex;   
    if (event.keyCode == 38 && event.ctrlKey && i > 0) {
        jrapid.collectionSwap(select, -1, 0, xml.getXmlDocument(), xml, i, xpath, property, event);
        select.selectedIndex = i;
    } else if (event.keyCode == 40 && event.ctrlKey && i < (select.options.length-1)) {
       jrapid.collectionSwap(select, 1, 1, xml.getXmlDocument(), xml, i, xpath, property, event);
    }      
};


//private 
//returns the SELECT MULTIPLE; argument = the ADD or REMOVE action-link in the entity-collection 
JRapid.prototype.collectionGetSelectFromAction = function (actionElem) {
	return actionElem.getParentNode().getParentNode().getFirstElementChild();
};

//private 
//returns the window-select select element, given the xsl 
JRapid.prototype.collectionGetSelectFromXsl = function (xslWindow) {
	return xslWindow.children[0].children[0];
};


// private
JRapid.prototype.collectionSwap = function(select, n, j, xmlDoc, xml, i, xpath, property, ev) {
    var aux = select.options[i+n];
    var option = select.options[i];
    select.options[i+n] = new Option(option.text, option.value);
    select.options[i] = aux;
    select.options[i].selected = true;
    var path = evaluated(xpath, select) + '/' + property;        
    var node1 = xmlDoc.selectSingleNode(path + '[' + (i+j) + ']');    
    var node2 = xmlDoc.selectSingleNode(path + '[' + (i+1+j) + ']');    
    node1.parentNode.insertBefore(node2, node1);
    xml.setXml(xmlDoc.xml);
};


/********************************* COMBO *********************************/

// TODO: change this use of jrapid.comboOpened
// or first implement the singleness of combo windows opened at the same time
JRapid.prototype.comboKeyDown = function(me, entity, event) {
    if (event.keyCode == jrapid.KEY_ENTER) {
		jrapid.comboOpened = false;
		application.stopPropagation(event);
		application.preventDefault(event);
		
    } else if (event.keyCode == jrapid.KEY_TAB) {
        jrapid.comboOpened = false;
        var container = me.getContainer();
        jrapid.comboClose(me);
        if (me.getNextElementSibling().getValue() == -1) {
            me.getStyle().color = 'red';
        }
        return;
    }
    return false;
};

JRapid.prototype.comboBlur = function(obj) {
	var me = jrapid.wrap(obj);
	obj.style.color = me.getNextSibling().getValue() == '' ? 'red' : ''; 
	jrapid.tooltipOff(me.outerNode); 
};

// returns true if the key event is a key to close the combo.
JRapid.prototype.comboIsCloseKey = function(ev, input) {
	// default close keys
	switch (ev.keyCode) {
		case (jrapid.KEY_TAB) :
		case (jrapid.KEY_ESC) :
		case (jrapid.KEY_ENTER) : {
			return true;
		}
	}
	// if input has no text, and key pressed are not up or down
	// TODO: check also for backspace...
	if (input.getValue().length < 1) {
		if (ev.keyCode != jrapid.KEY_DOWN && ev.keyCode != jrapid.KEY_UP) {
			return true;
		}
	}
	return false;		
};

JRapid.prototype.comboKeyUp = function(me, entity, ev, subset, subsetparams, comboproperty) {
    var container = me.getContainer();
    var comboWindow = me.outerNode.comboWindow;
    me.getStyle().color = '';
    
    // check if it is a close event/key
    if (jrapid.comboIsCloseKey(ev, me)) {
    	jrapid.comboClose(me);
        return;
    }
    
    if (comboWindow && ev.keyCode == jrapid.KEY_DOWN) {
        var tbody = comboWindow.outerNode.children[0].children[0].children[0];
        this.comboMove(comboWindow, tbody, 1);
        var c = tbody.children[ comboWindow.outerNode.comboSelectedIndex ];
        jrapid.comboSetValue(me, c.title, c.getAttribute('rowid'));
    
    } else if (comboWindow && ev.keyCode == jrapid.KEY_UP) {
    	var tbody = comboWindow.outerNode.children[0].children[0].children[0];
        this.comboMove( comboWindow, tbody, -1 );
        var c = tbody.children[comboWindow.outerNode.comboSelectedIndex];
        jrapid.comboSetValue(me, c.title, c.getAttribute('rowid'));
        
    } else if (ev.keyCode != jrapid.KEY_SHIFT) {
    	var xsl = container.getElementById('window_combo_xsl' + me.getId());
        jrapid.comboShow(me, xsl, entity, ev, subset, subsetparams, comboproperty, true);
    }
};

JRapid.prototype.comboMove = function(xsl, tbody, diff) {
    if (xsl.outerNode.comboSelectedIndex == null) {
        xsl.outerNode.comboSelectedIndex = -1;
    }
    if ((diff > 0 && xsl.outerNode.comboSelectedIndex >= tbody.children.length-1) ||
        diff < 0 && xsl.outerNode.comboSelectedIndex <= 0) {
        return;
    }
    if (xsl.outerNode.comboSelectedIndex >= 0) {
        tbody.children[xsl.outerNode.comboSelectedIndex].className = "";
    }
    xsl.outerNode.comboSelectedIndex += diff;
    tbody.children[xsl.outerNode.comboSelectedIndex].className = "selected";
};

JRapid.prototype.comboSetValue = function(keyInput, key, id) {
    if (key != null) {
        keyInput.setValue(key);
    } 
    var input = keyInput.getNextSibling();
    id = id == null ? '' : id;
    if (id != input.getValue()) {
	    input.setValue(id);
	    application.dispatch('change', input.outerNode, 'HTMLEvents');	
	}
    keyInput.outerNode.style.backgroundColor = '';
    keyInput.outerNode.style.color = '';  
};

// "xsl" is the template comboWindow to clone
JRapid.prototype.comboShow = function(me, xsl, entity, ev, subset, subsetparams, comboproperty, setFirst) {
	var container = me.getContainer();
    var subsetUrl = "";
    if (subset) {
    	subsetUrl = '/' + subset;
        if (subsetparams) {
        	// for each param, get its value (evaluating)
        	var params = subsetparams.split(';');
    	    for (var j=0; j < params.length; j++) {
    	    	var subsetParamValue = evaluated(params[j], me);
    	    	subsetParamValue = jrapid.evaluateXpath(subsetParamValue, me);
    	    	subsetUrl += '/' + encodeURIComponent(subsetParamValue);
	        }
	    }
    }    
    // TODO use getURL instead of getServerPath to make this MULTI-MODULE
    var url = jrapid.getServerPath(container) + entity + subsetUrl + 
		';_page=1' + (me.getValue()? (';' + comboproperty + '=' + me.getValue()) : '');

    var newWindow;
    if (!me.outerNode.comboWindow) {
    	newWindow = xsl.cloneNode(true);
    	// widget combo always has a sibling next to him, that is the real input with the value (invisible)
        // we insert the comboWindow after it.
        if (me.getNextSibling().getNextSibling()) {
        	me.getParentNode().insertBefore( newWindow, me.getNextSibling().getNextSibling() );
        } else {
        	me.getParentNode().appendChild( newWindow );
        }
        me.outerNode.comboWindow = newWindow;
    } else {
    	// reuse already existing combo_window
    	newWindow = me.outerNode.comboWindow; 
    }
    
    newWindow.setUrl(url);
    newWindow.outerNode.comboSelectedIndex = -1;
    newWindow.outerNode.comboSelected = me;
	var comboTime = new Date().getTime();
	jrapid.comboOpened = true;
	
	// TODO if (network or service error) return error
	newWindow.refresh( function() {   
		// check to see if this is the last call    	
    	if (!jrapid.comboOpened || (jrapid.lastComboTime && jrapid.lastComboTime > comboTime)) {
    		return;
    	}
		jrapid.lastComboTime = comboTime;
		
		jrapid.comboPositionWindow( me );
		
        // if has returned results => has children
        if (newWindow.getLastElementChild() && newWindow.getLastElementChild().getFirstElementChild().hasChildren()) {
            var first = newWindow.getLastElementChild().getFirstElementChild().getFirstElementChild().getFirstElementChild();
            newWindow.getStyle().display = '';
            if (setFirst && me.getValue().toLowerCase() == first.getTitle().toLowerCase()) {
                jrapid.comboSetValue( me, first.getTitle(), first.getAttribute('rowid') );
           }
        } else { // close the window
        	jrapid.comboClose( me );
        }
    } );    
    jrapid.comboSetValue(me, null, null);    
};

// position the combo window depending on combo.parentNode (TD or DIV)
JRapid.prototype.comboPositionWindow = function (combo) {
	// if it is a collection, the combo is rendered inside of a TABLE
	if (combo.outerNode.parentNode.nodeName != "TD") {
		var comboWindow = combo.outerNode.comboWindow;
		comboWindow.getStyle().left = (combo.outerNode.offsetLeft - 4) + "px";
	}
};

JRapid.prototype.comboClose = function(obj) {
	// we store the cloned comboWindow in a property of the object (comboWindow)
	if (obj.outerNode.comboWindow) {
		obj.outerNode.parentNode.removeChild( obj.outerNode.comboWindow.outerNode );
		obj.outerNode.comboWindow = null;
	}
};

JRapid.prototype.comboDblClick = function(obj, entity, eventObj, subset, subsetparams, comboproperty) {
	var me = jrapid.wrap(obj);
	var ev = jrapid.wrap(eventObj)
    var container = me.getContainer();
    var xsl = container.getElementById('window_combo_xsl' + me.getId());        
    jrapid.comboShow( me, xsl, entity, ev, subset, subsetparams, comboproperty, false );    
};

// the combo window is clicked
JRapid.prototype.comboClicked = function(obj, id, key, rowid) {
    var comboWindow = jrapid.comboGetComboWindowFromOptionClick( obj );
    var combo = comboWindow.comboSelected;
    jrapid.comboSetValue( combo, key, rowid );
    jrapid.comboClose( combo );    
};

// param: the element that fired the CLICK event on the combo window.
JRapid.prototype.comboGetComboWindowFromOptionClick = function(clicked) {
	// clicked = TR
	return clicked.parentNode //TBODY
		.parentNode //TABLE
		.parentNode //DIV
		.parentNode;//DIV combo window
};


/********************************* CHECKBOX *********************************/

JRapid.prototype.checkboxClicked = function(obj, selectexpr, name, value, isEntity, refreshCanvas) {
	
	var me = jrapid.wrap(obj);
	var id = me.getValue();    
    selectexpr = evaluated(selectexpr, me);
    var target = me.getContainer().getElementById('xml');
    var targetDoc = target.getXmlDocument();
        
    if (me.outerNode.checked) {
    	jrapid.checkIfIsNew(me);
        var xmlDoc;
        if (isEntity) {
            xmlDoc = XmlDocument.create('<' + name + ' id="' + id + '" />');
        } else {
            xmlDoc = XmlDocument.create('<' + name + '>' + value + '</' + name + '>');
        }
        targetDoc.selectSingleNode(selectexpr).appendChild(targetDoc.adoptNode ? targetDoc.adoptNode(xmlDoc.documentElement) : xmlDoc.documentElement);
        target.setXml(targetDoc.xml);                
    } else {
        var expr = isEntity ? (selectexpr + '/' + name + '[@id="' + id + '"]') : (selectexpr + '/' + name + '[. = "' + value + '"]');
        var node = targetDoc.selectSingleNode(expr);
        node.parentNode.removeChild(node);
        target.setXml(targetDoc.xml);
    }    
    
    if (refreshCanvas) {
        var values = targetDoc.selectNodes(selectexpr + '/' + name);
        var txt = '';
        for (var i=0; i < values.length; i++) {
            txt += (i == 0 ? '' : ', ') + values[i].firstChild.nodeValue;
        }
        refreshCanvas.innerHTML = txt;
    }
};

/*
JRapid.prototype.radioClicked = function(me, selectexpr, name, value, isEntity, refreshCanvas) {
	var id = me.getValue();
    selectexpr = evaluated(selectexpr, me);
    var target = me.getContainer().getElementById('xml');
    var targetDoc = target.getXmlDocument();
        
    if (me.outerNode.checked) {
        var xmlDoc = XmlDocument.create();
        if (isEntity) {
            xmlDoc.loadXML('<' + name + ' id="' + id + '" />');
        } else {
            xmlDoc.loadXML('<' + name + '>' + value + '</' + name + '>');
        }
                                            
        targetDoc.selectSingleNode(selectexpr).appendChild(xmlDoc.documentElement);
        target.setXml(targetDoc.xml);                
    } else {
        var expr = isEntity ? (selectexpr + '/' + name + '[@id=' + id + ']') : (selectexpr + '/' + name + '[. = "' + value + '"]');
        var node = targetDoc.selectSingleNode(expr);
        node.parentNode.removeChild(node);
        target.setXml(targetDoc.xml);
    }    
    
    if (refreshCanvas) {
        var values = targetDoc.selectNodes(selectexpr + '/' + name);
        var txt = '';
        for (var i=0; i < values.length; i++) {
            txt += (i == 0 ? '' : ', ') + values[i].firstChild.nodeValue;
        }
        refreshCanvas.innerHTML = txt;
    }
};*/

JRapid.prototype.openHelp = function(me, entity, form, width, height) {	
	var type;
	if (form)
		type = 'form';
	else
		type = 'list';
			
	var div = document.createElement('div');
	div.style.overflow = 'scroll';
	div.innerHTML = "<iframe scrolling='no' frameborder='no' style='width: 400px; height: 500px' name='iframe'" + entity + "'>";
	width = width ? width : '';
	height = height ? height : '';
	// TODO use .getURL()
	div.children[0].src = '../help.Main/' + entity + '_' + type +'.htm';
	document.body.appendChild(div);
	
	var win = application.openWindow(entity + ' Help', div);
    jrapid.uploadinput = me.getPreviousElementSibling().getPreviousElementSibling();
    jrapid.uploaddiv = win;
	jrapid.wrap(win).resizeTo('407','80',true);
};

/***************************** FILE UPLOAD *********************************/

JRapid.prototype.fileChange = function(me, entity, width, height, inputId) {
	// me is the button
	var div = document.createElement('div');
	div.innerHTML = "<iframe scrolling='no' frameborder='no' style='width: 400px; height: 80px' name='iframe'" + entity + "'>";
	width = width ? width : '';
	height = height ? height : '';

	div.children[0].src = jrapid.getURL( me.getContainer() ) + 'jrapid-runtime/upload.jsp?entity=' + entity + '&width=' + width + '&height=' + height;
	document.body.appendChild(div);	
	var win = application.openWindow('Upload file', div);
	
    // to get a reference to the (hidden) input, we find it by id, from the parent
	// DOM: div.jrapid_property/div.jrapid_image/button
	var propertyDiv = me.getParentNode().getParentNode().outerNode; 
	jrapid.uploadinput = jrapid.wrap( jrapid.getElementsById( inputId, propertyDiv )[0] ); 

    jrapid.uploaddiv = win;
	jrapid.wrap(win).resizeTo('407','80',true);
	win.style.zIndex = 9999;
};

JRapid.prototype.onupload = function(file) {
    var input = jrapid.uploadinput;
    var uploadPath = jrapid.getURL( input.getContainer() ) + "upload/";
    input.setValue(file);
    var fileContainer = input.getNextElementSibling().outerNode;
    
    // this code is for images and files
    // TODO: improve this way of choosing img/file
    var isImage = fileContainer.tagName.toLowerCase() == 'div';
    
    if (isImage) {
    	fileContainer.children[0].children[0].src = (uploadPath + file);
    	jrapid.wrap( fileContainer ).removeClass( "jrapid_no_image" );
    } else {
    	fileContainer.href = uploadPath + file;
    	fileContainer.innerHTML = file.substring(file.indexOf('!')+1);
    }
    // fire the onchange + remove the upload window.
    application.dispatch('change', input.outerNode, 'HTMLEvents');
    jrapid.uploaddiv.parentNode.removeChild(jrapid.uploaddiv);
};


// public, this func is called when a property of type image attempts to load a wrong SRC
JRapid.prototype.imageError = function( imgNode ) {
	var imageDiv = jrapid.wrap( imgNode.parentNode.parentNode );
	if (!imageDiv.hasClass('jrapid_no_image') ) {
		imageDiv.addClass('jrapid_no_image');
	}
};


// public. this func is called to show the image of a property of type image
JRapid.prototype.imageShow = function( imgNode ) {
	if ( !jrapid.wrap( imgNode.parentNode.parentNode ).hasClass('jrapid_no_image') ) {
		// if image was loaded correctly
		window.open( imgNode.src );
	}
	return false;
};



/********************************* FILTERS *********************************/

JRapid.prototype.setFilter = function(node, property, value, op) {    
	if (!node.filter) { 
		node.filter = [];
	}
	// what we consider as null, or value not entered
	if (typeof( value ) == "undefined" || value === '') { 
		return node.filter[property] = null; 
	}
    
	// (op < 0) -> remove value from filter array
	// (op > 0) -> add value to filter array
    if (!op) {
    	node.filter[property] = [value];
    } else if ( op < 0 ) {
        for (var c=node.filter[property], i=c.length; i >=0 ; i--) {
            if (c[i] == value) { 
            	c.splice(i,1); 
            }
        }
    } else {
        if (!node.filter[property]) {
        	node.filter[property] = [value];
        } else {
        	node.filter[property].push(value);
        }
    }
};

JRapid.prototype.getFilters = function(node) {
    var url = '';
    for (var property in node.filter) {   
    	// TODO use any encoding for each component to avoid conflicts with ;
    	var c = node.filter[property];
        if (property != 'toXMLRPC' && c && c != "0" && c.length) {
        	url += ';' + (property + '=' + encodeURIComponent(c.join(',')));
        }
    }
    return url;
};

JRapid.prototype.filter = function(property, value, me, op) {
	var container = me.getContainer();
    var node = container.node ? container.node : application;
    this.setFilter(node, property, value, op);
    this.refreshFilter(container);
};

JRapid.prototype.refreshFilter = function(container) {
	var xsl = jrapid.listingGetXsl(container);
	var node = container.node ? container.node : application;
    var filters = this.getFilters(node);
    if (xsl.getAttribute('useparams')) {
        xsl.setUrl(xsl.getAttribute('baseurl') + '/' + container.node.subsetParams + ';_page=1' + filters);
    } else {
	    xsl.setUrl(xsl.getAttribute('baseurl') + ';_page=1' + filters);
	}
    // start console
    var tx = jrapid.startConsole('Filtering', false, 'green');
    
    xsl.refresh(function() {
		// end console
		jrapid.endConsole(tx);
		
		// TODO if (network or service error) return error
    });
};

JRapid.prototype.showHideFilters = function(obj) {    
    var me = jrapid.wrap(obj);
	var next = me.getNextElementSibling();	
	next.outerNode.style.display = (next.outerNode.style.display == 'none' ? '' : 'none');
};


/********************************* LISTING TABS **************************/

// this func is called after the call to jrapid.showTab()
JRapid.prototype.listingTabClick = function(obj, entity) {
	var me = application.wrapNode(obj);
    var container = me.getContainer();
    var index=0;
	obj = obj.parentNode;
	while (obj.previousSibling) {
		if (obj.previousSibling.nodeType == 1) {
			index++;
		}
		obj = obj.previousSibling;
	}
	var pane = obj.parentNode.nextSibling; // TODO ff
	var j = 0;
	var tab;
	while (pane && (pane.nodeType != 1 || pane.className.indexOf('jrapid_tab') >= 0)) {
		if (pane.nodeType == 1) {
			if (j++ == index) {
				tab = application.wrapNode(pane);
				break;
			}
		}
		pane = pane.nextSibling;
	}
    
	var node = container.node ? container.node : application;
    if (tab.getAttribute('restriction')) {
        this.setFilter(node, '_saved', tab.getAttribute('restriction'));
    } else  {
        this.setFilter(node, '_saved', '');
    }
        
    if (tab.getAttribute('view')) {
        container.getElementById('selectview').setSelectedIndex(tab.getAttribute('view'));
    } else {
        container.getElementById('selectview').setSelectedIndex(0);
    }

    //Get all filters
    var filters = this.getFilters(node);            
    /*if (tab.getAttribute('restriction')) {
        filters = (filters.length ? ( filters + ':') : '') + '_saved=' + tab.getAttribute('restriction');
    }*/
    
    var children = tab.getChildren();
    for (var i=0; i < children.getLength(); i++) {
        var child = children.item(i);

/*        window.status = child.getAttribute('baseurl') + (filters.length ? ( '!' + filters) : '');
 */    
       child.setUrl(child.getAttribute('baseurl') + filters);
       
       if (container.getElementById('selectview').getSelectedIndex() == i) {
            /*child.refresh();*/
        	this.refreshFilter(container);
            child.getStyle().display = '';
        } else {
            child.getStyle().display = 'none';                
        }
    }
};


/**************************** SAVED FILTERS *****************************/

JRapid.prototype.appendSavedFilter = function(me, title, restriction) {
    var container = me.getContainer();
    var tabpane = container.getElementById('tabpane');
    if (!tabpane || me.getInnerHTML() == '') {
        return;
    }
    var node = tabpane.getFirstElementChild();
    tabpane.appendTab(node, title);
    tabpane.getLastElementChild().setAttribute('restriction',restriction); 
    var tabs = tabpane.getChildren();
    var id = 'xsl_1_' + tabs.getLength();
    var views = tabpane.getLastElementChild().getChildren();
    for (var i=0; i<views.getLength(); i++) {
        views.item(i).setId('xsl_' + (i+1) + '_' + tabs.getLength());
    }
};

JRapid.prototype.removeSavedFilters = function(me) {
    var container = me.getContainer();
    var tabpane = container.getElementById('tabpane');
    if (!tabpane || me.getInnerHTML() == '') {
        return;
    }
    var nodes = tabpane.getChildren();
    for (var i=nodes.getLength()-1; i>=0; i--) {
        if (nodes.item(i).getAttribute('restriction')) {
            tabpane.removeTab(i);
        }
    }
};

JRapid.prototype.listingSavedFilterRefresh = function(me) {
    var t = me.getInnerHTML().split(';');
    var tabpane = me.getContainer().getElementById('tabpane');
    if (!tabpane) {
        return; 
    }
    var tabs = tabpane.getChildren();
    var j = 0;
    //Get saved filters tabs position
    for (;j<tabs.getLength();j++) {
        if (tabs.item(j).getAttribute('restriction')) {
            break;
        }
    }
    //Compare with existing tabs. If not present, it appends it
    for (var i=0; i < t.length; i++) {
        tabs = tabpane.getChildren();    
        if (!tabs.item(j+i) || !tabs.item(j+i).getAttribute('restriction')) {
            this.appendSavedFilter(me, t[i].split(',')[0], t[i].split(',')[1]);
        }
    }
    if (me.getAttribute('focusLast') == 'true') {
        tabpane.focusChild(j+i-1);    
    }
};

JRapid.prototype.showSaveFilter = function(me) {
    var container = me.getContainer();    
    container.getElementById('saveFilterPanel').getStyle().display='';
    container.getElementById('saveFilterLink').getStyle().display='none';        
    container.getElementById('saveFilterInput').focus();
};

JRapid.prototype.saveFilter = function(me) {
    var container = me.getContainer();
    container.getElementById('saveFilterPanel').getStyle().display='none';    
    container.getElementById('saveFilterLink').getStyle().display='';
    
    var xsl = jrapid.listingGetXsl(container);
    var name = me.getPreviousSibling().getValue();
    var node = container.node ? container.node : application;
    var filters = this.getFilters(node);
    
    /*this.setFilter(container.getPrefix(), '_saved', '');        */
    xsl.setUrl(xsl.getAttribute('baseurl') + ',saveas=' + name + (filters.length ? ('!' + filters) : ''));
    xsl.refresh(function() {
    	// TODO if (network or service error) return error
    
        container.getElementById('othertabs').setAttribute('focusLast','true');
        container.getElementById('othertabs').refresh(
        	// TODO if (network or service error) return error
        );
    });    
};

/*************************** VIEWS ********************/

JRapid.prototype.listingChangeView = function(obj) {
	var me = jrapid.wrap(obj);
    var container = me.getContainer();
    var tabpane = container.getElementById('tabpane');
    var index = 1;
    if (tabpane) {
	    for (index=1, c=tabpane.outerNode.children, n=c.length; index <=n ; index++) {
			if (c[index-1].className == 'active') {
				break;
			}
		}
    }
    // TODO doesn't work properly with tab panes
    if (tabpane) {
    //    tabpane.getChildren().item(tabpane.getSelectedIndex()).setAttribute('view',me.getSelectedIndex());    
    }
    var i = tabpane ? (index) : 1;
    for (var j=0; j < me.outerNode.options.length; j++) {
        var xsl = container.getElementById('xsl_' + (j+1) + '_' + i);
        xsl.getStyle().display = (j == me.getSelectedIndex()) ? '' : 'none';
        if (j == me.getSelectedIndex()) {
            this.refreshFilter(container);
//            xsl.refresh();
        }
    }
};                

JRapid.prototype.listingGetXsl = function(container) {
    var tabpane = container.getElementById('tabpane');
    var i = 1;
    if (tabpane) {
    	for (i=1, c=tabpane.outerNode.children, n=c.length; i <=n ; i++) {
    		if (c[i-1].className == 'active') {
    			break;
    		}
    	}
    }    
    var view = container.getElementById('selectview');
    view = view == null ? 1 : (view.getSelectedIndex()+1);
    return container.getElementById('xsl_' + view + '_' + i);        
};

JRapid.prototype.listingGetTable = function(container) {
    var tabpane = container.getElementById('tabpane');
    var index = 1;
    if (tabpane) {
    	for (var i=0, c=tabpane.outerNode.children, n=c.length; i < n; i++) {
    		if (c[i].getAttribute('active')) {
    			index = i+1;
    			break;
    		}
    	}
    }
    var view = container.getElementById('selectview');
    view = view == null ? 1 : (view.outerNode.selectedIndex+1);
    return container.getElementById('table_' + view + '_' + index);        
};

/**************************** PAGES *******************************/

JRapid.prototype.page = function(obj, page, total) {
	var me = jrapid.wrap(obj);
    if (page <= total && page > 0) {
        var container = me.getContainer();
        var key = container.getPrefix();
        var xsl = jrapid.listingGetXsl(container);
        var node = container.node ? container.node : application;
        var filters = this.getFilters(node);
		var order = xsl.getAttribute('order') ? (';_order=' + xsl.getAttribute('order')) : '';
        xsl.setUrl(xsl.getAttribute('baseurl') + ';_page=' + page + filters + order); 
            
		// console
		var tx = jrapid.startConsole('Paging', false, 'green');
        xsl.refresh(function(param, xmlDoc, status) {
        	// console
        	jrapid.endConsole(tx);
			// check network error
        	if (status != 200) {
        		jrapid.startConsole('Network error', true, 'green');  
        		return;
        	}
        	
        	// check service error
        	if (xmlDoc == null || xmlDoc.documentElement == null || xmlDoc.documentElement.tagName == 'exception') {
        		jrapid.startConsole('Network error', true, 'red'); 
				if (xmlDoc != null && xmlDoc.documentElement && xmlDoc.documentElement.hasChildNodes()) {
					alert(xmlDoc.documentElement.childNodes[0].nodeValue);
				} else {
					alert('Unable to read');
				}
        		return; 
        	}
        });
    }
};

JRapid.prototype.pageList = function(obj, num, size) {
	var me = jrapid.wrap(obj);
    var pages = application.wrapNode(me);
    if (pages.getChildren().getLength() == 1) {
        for (var i=1, cell; i<=size; i++) {
            cell = document.createElement('option');
            cell.value = cell.innerHTML = i;    
            if (num == i) {
                cell.selected = "selected";
            }
            obj.appendChild(cell);
        }
        pages.removeChild(pages.getFirstElementChild());
    }
};

/******************************* ORDER ******************************/

JRapid.prototype.order = function(obj, label, ev) {
	var index = ev.target ? ev.target.cellIndex : ev.srcElement.cellIndex;
	var me = jrapid.wrap(obj);
    var container = me.getContainer();
    var xsl = jrapid.listingGetXsl(container);
    var node = container.node ? container.node : application;
    var filters = this.getFilters(node);
    if (xsl.getAttribute('order') == index) {
    	index += 'd';
    }
    xsl.setUrl(xsl.getAttribute('baseurl') + ';_page=1' + filters + ';_order=' + index);
    xsl.setAttribute('order', index);
     
    // console
    var tx = jrapid.startConsole('Ordering', false, 'green');
    
    xsl.refresh(function(i, xmlDoc, status) {
    	// end console
    	jrapid.endConsole(tx);
    	
    	// check network error
		if (status != 200) {
        	jrapid.startConsole('Network error', true, 'green');  
        	return;
       	}
        	
        // check service error
        if (xmlDoc == null || xmlDoc.documentElement == null || xmlDoc.documentElement.tagName == 'exception') {
        	jrapid.startConsole('Error', true, 'red'); 
			if (xmlDoc != null && xmlDoc.documentElement && xmlDoc.documentElement.hasChildNodes()) {
				alert(xmlDoc.documentElement.childNodes[0].nodeValue);
			} else {
				alert('Unable to read');
			}
        	return; 
        }

        jrapid.resizeTable(xsl);
        
    }, 0);
};


/************************* TOOLTIPS *************************************/

JRapid.prototype.tooltipOn = function(obj) {
	var div = document.createElement('div');
	div.innerHTML = obj.getAttribute('tooltip');
    div.className = 'jrapid_tooltip';
    obj.tooltipElement = div;
    document.body.appendChild(div);
	
	var style = div.style;
	style.display = '';
    var r = obj.getBoundingClientRect();
    if (r.right + 50 < document.body.clientWidth) {
    	style.top = r.top + 'px';    	
	    style.left = (r.right + 5) + 'px';
    } else if (r.top + r.height + 30 < document.body.clientHeight) {
    	style.left = r.left + 'px';
    	style.top = (r.top + r.height + 3) + 'px';
    } else {
   		style.left = r.left + 'px';
   		var h = div.getBoundingClientRect().bottom - div.getBoundingClientRect().top;
   		style.top = (r.top - h - 10) + 'px';
    }  
};

JRapid.prototype.tooltipOff = function(obj) {
	var tooltip = obj.tooltipElement;
	if (tooltip) {
		tooltip.parentNode.removeChild(tooltip);
	}
};

/************************* ACTIONS *******************************/

JRapid.prototype.javascriptFormAction = function(obj, name) {
	var me = jrapid.wrap(obj);
    var container = me.getContainer();
    var id = container.getElementById('xml').getXmlDocument().selectSingleNode('/*').getAttribute('id');
    var ids = [id];
    eval(name + '(obj, ids)');
    return false;
};

JRapid.prototype.javascriptListingAction = function(obj, name) {
	var me = jrapid.wrap(obj);
    var ids = this.getIds(me);
    eval(name + '(obj, ids);');
    return false;
};

JRapid.prototype.reportListingAction = function(obj, report, pdf, ids) {
	var me = jrapid.wrap(obj);
	if (!ids) { ids = this.getIds(me); }
    window.open( '../report/' + report + '?id='+ ids + '&pdf=' + pdf + '&rand=' + new Date().getTime(), '_blank', 'width=1000,height=600,resizable=yes');
    return false;
};

JRapid.prototype.reportFormAction = function(obj, report, pdf) {
	var me = jrapid.wrap(obj);
    var container = me.getContainer();
    var id = container.getElementById('xml').getXmlDocument().selectSingleNode('/*').getAttribute('id');
    var ids = [id];
    window.open( '../report/' + report + '?id='+ ids + '&pdf=' + pdf + '&rand=' + new Date().getTime(), '_blank', 'width=1000,height=600,resizable=yes');
    return false;
};



// called from both property and entity actions (in a jrapid form)
JRapid.prototype.openRelatedForm = function( params ){
	
	// pass params attributes to variables
	var me = jrapid.wrap( params.actionSrc );
	var entity = params.entity;
	var defaultset = params.defaultset;
	var defaultsetparams = params.defaultsetparams;
	var isEntityAction = params.isEntityAction;
	var module = params.module;
	
	var container = me.getContainer();
	var encodedId = isEntityAction ? container.getElementById('xml').getXmlDocument().selectSingleNode('/*').getAttribute('id') : '';
	encodedId = encodeURIComponent( encodedId );
	
	// this must support: 
	// a) new entity, with and without dsparams
	// b) existing entity, with and without dsparams
	// (always considering custom PKs)
    if (defaultset) {
        var params = defaultsetparams ? defaultsetparams.split(';') : [];
        var encodedParamsArray = [];
        if (isEntityAction) {
        	// NOTE: could be transient or not, but not a property action
        	// 1st param is entity ID (implicit)
        	encodedParamsArray.push( encodedId );
        }
        for (var j=0; j < params.length; j++) {
        	// resolve/evaluate each param, and ENCODE IT
        	encodedParamsArray.push( encodeURIComponent( jrapid.evaluateXpath(params[j], me) ) );
        }
    }
    return jrapid.form( {
    	entity: entity, 
    	id: encodedId,
    	defaultset: defaultset, 
    	defaultsetparams: encodedParamsArray,
    	target: 'window',
    	module: module 
    } );
};



// TODO implement this using a JSON params
JRapid.prototype.openRelatedListing = function(obj, entity, listing, subset, subsetparams, defaultset, defaultsetparams, module) {
	var me = jrapid.wrap(obj);
    var id = '';
    if (subsetparams) {
        var params = subsetparams.split(';');
        for (var j=0; j < params.length; j++) {
            id += (j > 0 ? '/' : '') + encodeURIComponent(jrapid.evaluateXpath(params[j], me));
        }
    }
    var p = '';
    if (defaultsetparams) {
        var params = defaultsetparams.split(';');
        for (var j=0; j < params.length; j++) {
            p += (j > 0 ? '/' : '') + encodeURIComponent(jrapid.evaluateXpath(params[j], me));
        }
    }
    
    // TODO: shouldn't we separate the params from the defaultset/subset ?
    return jrapid.listing( {
		obj: me, 
		entity: entity, 
		module: module, 
		listing: listing, 
		subset: subset + (subset && id ? '/' : '') + id,
		defaultset: defaultset +  (defaultset && p ? '/' : '') + p
    } );
};





// TODO: move this function to another part
JRapid.prototype.getPropertyEntityId = function(element) {
	var me = jrapid.wrap(element);
	var xmlDoc = me.getContainer().getElementById('xml').getXmlDocument();
	
	var path = eval(element.getAttribute("selectexpr") + ';');
	var nodes = xmlDoc.selectNodes(path);
	
	var entitiesIds = "";
	for (var i=0;i < nodes.length; i++) {
		entitiesIds += (i>0 ? ", " : "") + nodes[i].value; 
	}
	return entitiesIds;	
};



/************************************ LISTINGS ************************************/

// returns a single id (if first) or a string containing all ids concat'ed by "," 
JRapid.prototype.getIdsAsString = function(me, first) {
	var ids = jrapid.getIds(me);
	if (first && ids && ids.length) {
		return ids[0];
	}
    var s = '';
    for (var i=0; i < ids.length; i++) {
        s += (i > 0 ? ',' : '') + ids[i];
    }
    return s.length ? s : '0';
}

JRapid.prototype.getIds = function(me) {
    var container = me.getContainer();

    var type = container.getElementById('selectview').getValue();
    var table = jrapid.listingGetTable(container);
    var ids = new Array();
    
    // use the correct TAB
    var index = 1;
    var tabpane = container.getElementById('tabpane');
    if (tabpane) {
    	for (var i=0, c=tabpane.outerNode.children, n=c.length; i < n; i++) {
    		// to see if the tab is active, check the className
    		if (jrapid.wrap( c[i] ).hasClass('active')) {
    			index = i+1;
    			break;
    		}
    	}
    }
    var view = container.getElementById('selectview');
    view = view == null ? 1 : (view.getSelectedIndex()+1);
    var items;
    switch(type) {
       	case 'thumbnails': 
        	items = jrapid.getElementsById('thumbnails_' + view + '_' + index, container.node); break;
       	case 'icons': 
            items = jrapid.getElementsById('icons_' + view + '_' + index, container.node); break;
       	case 'table': 
        default:
        	items = jrapid.getElementsById('tableitem_' + view + '_' + index, container.node); break;
    }

    for (var i=0; i<items.length; i++) {
        if (items[i].getAttribute('selected') || items[i].getAttribute('selected')=='true') {
            ids[ids.length] = items[i].getAttribute('rowid');
        }
    }    
    
    return ids;
};


JRapid.prototype.listingMouseOverThumbnail = function(obj) {
	obj.children[0].children[0].children[0].children[1].style.display = 'inline';
};

JRapid.prototype.listingMouseOutThumbnail = function(obj) {
	obj.children[0].children[0].children[0].children[1].style.display = 'none';
};

JRapid.prototype.listingToggleThumbnail = function(me) {
    if (me.getAttribute('selected') == 'true') {
        me.setAttribute('selected','false');
        me.className = 'listing_thumbnails';
    } else {
        me.setAttribute('selected','true');        
        me.className = 'listing_thumbnails listing_highlight';        
    }
};

JRapid.prototype.listingToggleIcon = function(me) {
    if (me.getAttribute('selected') == 'true') {
        me.setAttribute('selected','false');
        me.setClassName('listing_icons');
    } else {
        me.setAttribute('selected','true');        
        me.setClassName('listing_highlight');        
    }
};



//public
//Keys pressed could be: CTRL and SHIFT
JRapid.prototype.listingToggleTable = function( row, odd, ev ) {
	
	var tbody = row.parentNode;
	var current = tbody.currentRows;
	if (!current) {
		current = tbody.currentRows = [];
	}
	
	if (ev.shiftKey) {
		// TODO: we ignore the ctrl here... (leaves all previously selected rows as they were)
		// select the range of rows between "row" and "tbody.lastRowClicked"
		var from = tbody.lastRowClicked ? tbody.lastRowClicked.rowIndex : 1;
		var to = row.rowIndex;
		if (to <= from) {
			to = from;
			from = row.rowIndex;
		}
		for (var i=from; i <= to; i++) {
			var activeRow = tbody.children[ i-1 ]; // row index starts from 1, and children[] from 0.
			this.listingSelectRow( activeRow, true, current );
		}	
	} else if (ev.ctrlKey) {
		// CTRL and ! SHIFT: check if was selected, and toggle
		this.listingSelectRow( row, row.getAttribute("selected") != "true", current );
	} else {
		// ! CTRL & ! SHIFT: deselect the previous selected rows
		for (var n=current.length; n > 0; n--) {
			this.listingSelectRow( current[n-1], false, current );
		}
		current = tbody.currentRows = [];
		this.listingSelectRow( row, true, current );
	}
	// for the SHIFT-click
	tbody.lastRowClicked = row; 
};

// private
JRapid.prototype.listingSelectRow = function( row, selected, array ) {
	if (selected) {
		row.className = "jrapid_table_tr__selected";
		row.setAttribute( "selected", "true" );
		this.jArray.add( array, row );
	} else {
		row.className = "";
		row.removeAttribute('selected');
		this.jArray.remove( array, row );
	}
};


// public
JRapid.prototype.listingClicked = function(me, id) {
	var me = jrapid.wrap(me);
	var node = me.getContainer().node;
    if (node && node.triggers && node.triggers.length) {
	   	for (var i=0, n=node.triggers.length; i < n; i++) {
	   		node.triggers[i](me, id);
	   	}
	}	
};

JRapid.prototype.listingRemove = function(obj, name) {
    if (confirm('Sure to delete these elements?')) {
    	var me = jrapid.wrap(obj);
        var ids = this.getIds(me);
        var container = me.getContainer();                
        
        var xmlrpcserver = new JRapid_XmlRpcServer(jrapid.getURL(container) + '/xmlrpc');
        xmlrpcserver.executeAsync(name + '.remove', function(id, e) {
            if (e) {
                alert('Unable to delete');
            } else {
                jrapid.refreshFilter(container);
            }
        }, ids);
    }
    return false;
};





/************************************ DATE + TIME ************************************/

// NOTE: assuming format is something like: DAY_ELEM + SEPARATOR + MONTH_ELEM + SEPARATOR + YEAR_ELEM
// this includes: dd/mm/yyyy; d/m/y; dd-mm-yyyy; etc
// select date has the following structure:
// <div id="widget_propertyId" >
// 		<select ... day>  (0)
//		<span separator>  (1)
//		<select ... day>  (2)
// 		<span separator>  (3)
//		<select ... day>  (4)
//		<input REAL-DATE> (5)
// </div>

// public
JRapid.prototype.selectDate = function( obj, filterName ) {
	// TODO: make this more generic/configurable
	var dateSeparator = "/";
	var isFilter = filterName && filterName != "";
	
	var me = jrapid.wrap(obj);
	var children = me.getParentNode().getChildren();
	var s1 = children.item(0).outerNode;
	var s2 = children.item(2).outerNode;
	var s3 = children.item(4).outerNode;
	var input = children.item(5);
	
	var fullDateEntered = (s1.selectedIndex && s2.selectedIndex && s3.selectedIndex) > 0;
	
	// sync with the hidden field (real value)
	var fullDate = fullDateEntered ? 
			s1.options[s1.selectedIndex].text + dateSeparator + 
			s2.options[s2.selectedIndex].text + dateSeparator + 
			s3.options[s3.selectedIndex].text
			: ""; 
	input.setValue( fullDate );
	
	// TODO: only do this if horizontal
	jrapid.checkIfIsNew(input);
	
	// widgets can be for properties or filters, with different behaviors
	if (isFilter) {
		jrapid.filter( filterName, fullDate, me );		
	} else {
		input.sync();		
	}
};

// after each widget is rendered, this func is called 
// public
JRapid.prototype.initSelectDate = function( widgetId, ctx ) {
	
	var widgetDiv = this.getSelectWidgetDiv( widgetId, ctx );
	if (widgetDiv == null) {
		// means this widgets is a foo, for multiline replication (the last one) and should not be init'ed
		return ;
	} 
	var divChildren = widgetDiv.getChildren(); 
	 
	var s1 = divChildren.item(0);
	var s2 = divChildren.item(2);
	var s3 = divChildren.item(4);
	
	s1.outerNode.value = s1.getAttribute( "val" );
	s2.outerNode.value = s2.getAttribute( "val" );
	s3.outerNode.value = s3.getAttribute( "val" );
	
	jrapid.selectDate( s3.outerNode );
};

// returns wrapped div (used both by select date and select time widgets)
JRapid.prototype.getSelectWidgetDiv = function( widgetId, ctx ) {
	// if embedded inline, widget_id will be repeated for each row
	// so, each init fo the widget should mark it at init'ed, so that
	// the next iteration won't overwrite it (+ ignore new or hidden rows)
	var context = ctx ? jrapid.wrap( ctx ).getContainer() : window.currentContainer; 
	var wDivs = this.getElementsById( widgetId, context.node );
	var cantDivs = wDivs.length;
	
	if (cantDivs == 1) {   // is a regular form (not emb inline)
		return this.wrap( wDivs[0] );
	}
	// is embedded inline
	for (var i=0; i < cantDivs; i++ ) {
		// take the first one not marked as init'ed, and not new (in a multiline-sense)
		var wDiv  = this.wrap( wDivs[i] );
		if ( ! (wDiv.getAttribute( "selectWidgetInited" ) || this.isNewOrHidden(wDiv.outerNode) ) ) {
			wDiv.setAttribute( "selectWidgetInited", true );
			return wDiv;
		}
	}
	return null; // means it's a foo widget (for replication)
};
	
	
	
//NOTE: assuming format is something like: HOUR_ELEM + SEPARATOR + MINUTE_ELEM
//this includes: hh:mm; hh.mm; hhmm; etc
//select date has the following structure:
//<div id="widget_propertyId" >
//		<select ... hour>  (0)
//		<span separator>  (1)
//		<select ... minute>  (2)
//		<input REAL-TIME> (3)
//</div>

// public
JRapid.prototype.selectTime = function( obj, filterName ) {
	// TODO: make this more generic/configurable
	var timeSeparator = ":";
	var isFilter = filterName && filterName != "";

	var me = jrapid.wrap(obj);
	var children = me.getParentNode().getChildren();
	var s1 = children.item(0).outerNode;
	var s2 = children.item(2).outerNode;
	var input = children.item(3);
	
	var fullTimeEntered = (s1.selectedIndex && s2.selectedIndex) > 0;

	// sync with the hidden field (real value)
	var fullTime = fullTimeEntered ? 
			s1.options[s1.selectedIndex].text + timeSeparator + s2.options[s2.selectedIndex].text 
			: ""; 
	input.setValue( fullTime );
	
	// TODO: only do this if horizontal
	jrapid.checkIfIsNew(input);
	
	// widgets can be for properties or filters, with different behaviors
	if (isFilter) {
		jrapid.filter( filterName, fullTime, me );		
	} else {
		input.sync();		
	}
};

// after each widget is rendered, this func is called 
// public
JRapid.prototype.initSelectTime = function( widgetId, ctx ) {
	
	var widgetDiv = this.getSelectWidgetDiv( widgetId, ctx );
	if (widgetDiv == null) {
		// means this widgets is a foo, for multiline replication (the last one) and should not be init'ed
		return ;
	} 
	var divChildren = widgetDiv.getChildren(); 
	 
	var s1 = divChildren.item(0);
	var s2 = divChildren.item(2);
	
	s1.outerNode.value = s1.getAttribute( "val" );
	s2.outerNode.value = s2.getAttribute( "val" );
	
	jrapid.selectTime( s2.outerNode );
};

/************************************ AUDIT ************************************/

JRapid.prototype.auditHistory = function(obj, entity) {
	var me = jrapid.wrap(obj);
	var id = me.getContainer().getElementById('xml').getXmlDocument().selectSingleNode('/*/@id').nodeValue;
	window.open(
		'../jrapid-runtime/history.jsp?entity=' + entity + '&id=' + id, 
		entity, 
		'resizable=yes,status=no,scrollbars=yes,width=500,height=300'
	);
};

/************************************ NAVIGATOR ************************************/

// TODO: this is public, but takes wrapped elems as params...
JRapid.prototype.navigate = function(me, select, dir, entity, module) {
	var options = select.outerNode.options;
	var newIndex = select.outerNode.selectedIndex + dir;
	if (newIndex >= 0 && newIndex < options.length) {
		options[newIndex].selected = true;
	}
	var container = me.getContainer(); 
	var rootUrl = jrapid.getURL(container);
	jrapid.load( 
		container, 
		rootUrl,  
		entity, {
			module: module, 
			id: select.outerNode.value
		} 
	);
};

/************************************ ASYNC ************************************/

JRapid.prototype.startAsyncConsole = function(container, key, service) {
	// TODO param refresh time and if append or replace text
	var div = document.createElement('div');
	div.className = 'jrapid_asyncconsole';
	document.body.appendChild(div);
	var win = application.openWindow('Executing', div);
	win.id = 'async' + new Date().getTime();
	win.setAttribute('onclosewindow', 'jrapid.close("' + win.id + '");');
	var message = "";
	
	var callServer = function(key) {
		var xmlrpcserver = new JRapid_XmlRpcServer(jrapid.getURL(container) + '/xmlrpc');
		xmlrpcserver.executeAsync(service + '.getMessage', function(result) {
        	div.innerHTML = message = message + result;
			div.scrollTop = div.scrollHeight;
			if (result == null || result.indexOf('%END%') == -1) {
				setTimeout(function() {callServer(key)}, 1000);
			}
		}, parseInt(key));       
	};	
	callServer(key);	
};
    
/************************************ PANEL ************************************/

JRapid.prototype.accordeonOnClickResize = function() {
	var table = application.getElementById('table');
	if (table) {
		jrapid.panelResizeTable(table.outerNode, document.documentElement.clientHeight - 30);
	}
	var panel = document.getElementById('panel');
	if (panel) {
		jrapid.panelResizePanel(panel, document.documentElement.clientHeight - 30);
	}
};

JRapid.prototype.registerPanelListing = function(n, entity, subset, subsetparams, defaultset, module) {
	var me = jrapid.wrap(document.getElementById(n));
	var container = me.getContainer();
	
	var params = subsetparams.split(';');
	for (var i=0; i < params.length; i++) {
		var childContainer = container.getElementById(params[i]).getFirstElementChild().getChildContainer();
		var node = childContainer.node;
		if (node.triggers == null) {
			node.triggers = [];
		}
		node.triggers[node.triggers.length] = function(foo, id) {
			// TODO only xsl (and just the current xsl) should be refreshed
			// TODO it must work with more than one subsetparam
			// TODO it must use the canvas passed by parameter, instead of me.getParentNode()	
			// TODO it must work with all the tabs in the listings
			
			/*var child = me.getChildContainer();
			child.node.subsetParams = id;
			alert(defaultset);
			if (defaultset) {
				var add = child.getElementById('add'); 
				if (add) {
					add.setAttribute('defaultset', defaultset);
					add.setAttribute('defaultsetparams', id);
				}
			}*/
			//jrapid.listing({entity: entity, canvas: n, module: 'Test', target: 'replace', subset: subset + '/' + id, defaultset: defaultset, defaultsetparams: id});
			jrapid.listing({
				entity: entity, 
				canvas: n, 
				module: module, 
				target: 'replace', 
				subset: subset + '/' + id, 
				defaultset: defaultset, 
				defaultsetparams: id
			});
			//jrapid.loadListing(child, entity, subset + '/' + id, false, me.getParentNode());			
		};
	}	
};

JRapid.prototype.registerPanelForm = function( n, entity, defaultsetparams, defaultset, module ) {
	var me = jrapid.wrap( document.getElementById(n) );
	var container = me.getContainer();
	var params = defaultsetparams.split(';');
	
	// referred listing could not exist in this moment (be empty)
	for ( var i=0; i < params.length; i++ ) {
		var listing = container.getElementById( params[i] );
		if (listing.getFirstElementChild().getChildContainer) {
			var childContainer = listing.getFirstElementChild().getChildContainer();
			var node = childContainer.node;
			if (node.triggers == null) {
				node.triggers = [];
			}
			node.triggers[node.triggers.length] = function(foo, id) {
				// TODO only xsl (and just the current xsl) should be refreshed. it must work with more than one param and with defaultset
				jrapid.form({
					obj: me, 
					entity: entity, 
					id: id, 
					defaultset: defaultset, 
					module: module, 
					target: 'replace', 
					canvas: n
				});
			};
		}
	}	
};

/************************ PANEL SIZING ***************************/
 
JRapid.prototype.panelResizePanel = function (panel, height) {
	for (var i=0, c = panel.children, n = c.length; i < n; i++) {
		jrapid.panelResizeColumn(c[i], height);
	}
};

JRapid.prototype.panelResizeColumn = function(div, height) {
	var fixedHeight = 0;
	for (var i=0, c=div.children, n=c.length; i < n; i++) {
		var h = c[i].getAttribute('panelheight');
		if (h && h.indexOf('%') == -1) {
			fixedHeight += parseInt(h);
		}
	}			
	for (var i=0, c=div.children, n=c.length; i < n; i++) {
		jrapid.panelResizeElement(c[i], height-fixedHeight);
	}
};

JRapid.prototype.panelResizeElement = function(element, height) {
	if (element.getAttribute('panelheight')) {
		var elementHeight = element.getAttribute('panelheight');
		var index = elementHeight.indexOf('%');
		var actualHeight = index == -1 ? parseInt(elementHeight) : parseInt(elementHeight)*height/100;
		element.style.height = actualHeight + 'px';
		//element.style.border = '2px solid red';
		/*var fixedHeight = 0;
		for (var i=0, c=td.children[0].children, n=c.length; i < n; i++) {
			var h = c[i].getAttribute('panelheight');
			if (h && h.indexOf('%') == -1) {
				fixedHeight += parseInt(h);
			}
		}*/
		if (element.getAttribute('listing')) {
			var xsl = jrapid.listingGetXsl(jrapid.wrap(element.children[0]).getChildContainer());
			if (xsl) {
				jrapid.resizeTable(xsl);
			}
		} /*else if (item.tagName.toLowerCase() == 'img') {
			if (!item.getAttribute('baseurl')) {
				item.setAttribute('baseurl', item.src);
			}
			item.style.width = '100%';
			item.src = item.getAttribute('baseurl') + '&width=' + item.offsetWidth + '&height=' + parseInt(item.style.height);
		}*/
		
		
		for (var i=0, c=element.children, n=c.length; i < n; i++) {
			var node = c[i];
			if (node.className == 'jrapid_accordeon') {
				jrapid.panelResizeAccordeon(node, actualHeight-fixedHeight);
			} //else {
			//	jrapid.panelResizeItem(node, actualHeight-fixedHeight);
			//}
		} 
	} else if (element.className == 'jrapid_accordeon') {
		jrapid.panelResizeAccordeon(element, height);
	}
	
};


/*** old panel functions **/
JRapid.prototype.panelResizeTable = function (table, height) {
	for (var i=0, c = table.children[0].children, n = c.length; i < n; i++) {
		jrapid.panelResizeTr(c[i], height);
	}
};		
		
JRapid.prototype.panelResizeTr = function(tr, height) {
	var fixedHeight = 0;
	for (var i=0, c=tr.children, n=c.length; i < n; i++) {
		var h = c[i].getAttribute('panelheight');
		if (h && h.indexOf('%') == -1) {
			fixedHeight += parseInt(h);
		}
	}			
	for (var i=0, c=tr.children, n=c.length; i < n; i++) {
		jrapid.panelResizeTd(c[i], height-fixedHeight);
	}
};
		
JRapid.prototype.panelResizeTd = function(td, height) {
	if (td.getAttribute('panelheight')) {
		var tdHeight = td.getAttribute('panelheight');
		var index = tdHeight.indexOf('%');
		var actualHeight = index == -1 ? parseInt(tdHeight) : parseInt(tdHeight)*height/100;
		td.children[0].style.height = actualHeight + 'px';
		var fixedHeight = 0;
		for (var i=0, c=td.children[0].children, n=c.length; i < n; i++) {
			var h = c[i].getAttribute('panelheight');
			if (h && h.indexOf('%') == -1) {
				fixedHeight += parseInt(h);
			}
		}
		for (var i=0, c=td.children[0].children, n=c.length; i < n; i++) {
			var node = c[i];
			if (node.className == 'jrapid_accordeon') {
				jrapid.panelResizeAccordeon(node, actualHeight-fixedHeight);
			} else {
				jrapid.panelResizeItem(node, actualHeight-fixedHeight);
			}
		}
	}
};

JRapid.prototype.panelResizeItem = function(item, height) {
	var h = item.getAttribute('panelheight'); 
	if (h) {
		if (h.indexOf('%') == -1) {
			item.style.height = h;
		} else {
			item.style.height = (height*parseInt(h)/100) + 'px';
		}
		item.style.overflowY = 'auto';
	}

	if (item.getAttribute('listing')) {
		// in the case of panels using the panelLoader, the firstChild could be a <script> Element
		// in that case, don't resize.
		var firstChild = jrapid.wrap( item.children[0] );
		if (firstChild.getChildContainer) {
			var xsl = jrapid.listingGetXsl( firstChild.getChildContainer() );
			if (xsl) {
				jrapid.resizeTable(xsl);
			}
		}
	} else if (item.tagName.toLowerCase() == 'img') {
		if (!item.getAttribute('baseurl')) {
			item.setAttribute('baseurl', item.src);
		}
		item.style.width = '100%';
		item.src = item.getAttribute('baseurl') + '&width=' + item.offsetWidth + '&height=' + parseInt(item.style.height);
	}
};
		
JRapid.prototype.panelResizeAccordeonItem = function(item, height) {
	var fixedHeight = 0;
	var c = item.children[1].children;
	for (var i=0, n=c.length; i < n; i++) {
		var h = c[i].getAttribute('panelheight');
		if (h && h.indexOf('%') == -1) {
			fixedHeight += parseInt(h);
		}
	}
	for (var i=0, n=c.length; i < n; i++) {
		jrapid.panelResizeItem(c[i], height-fixedHeight);				
	}
};
		
JRapid.prototype.panelResizeAccordeon = function(accordeon, height) {
	for (var i=0, c=accordeon.children, n=c.length; i < n; i++) {
		jrapid.panelResizeAccordeonItem(c[i], height - n * jrapid.ACCORDEON_HEIGHT -  jrapid.ACCORDEONBODY_PADDING);				
	}
};



JRapid.prototype.panelLoader = {
	loaded: false,
	onLoadTriggers: new Array(),
	jrapid: this,
	loadAll: 
		function() {
			if (this.loaded) return;
			for (var i=0, cant=this.onLoadTriggers.length; i < cant; i++) {
				try {
					this.onLoadTriggers[i]();
				} catch( e ) {
					this.jrapid.consoleDebug( e );
				}
			}
			this.loaded = true;
		},
	addTrigger: 
		function( trigger ) {
			this.onLoadTriggers.push( trigger );
		}
};

JRapid.prototype.panelOnload = function() {
	// panels have their own loader, that loads the contents of the accordeons, if any
	this.panelLoader.loadAll();
	
	var h = document.location.hash;
    if (h.length) {
    	h = h.substring(1).split(';');
    	for (var i=0; i < h.length; i++) {
            var t = h[i].split('-');
            if (t[0] == 'form') {
            	jrapid.form({entity: t[1], id: t[2], target: 'window'});
            } else if (t[0] == 'listing') {
            	jrapid.listing({entity: t[1], target: 'window'});
            }
    	}
    }	
};
/************************ END OF PANEL SIZING ***************************/




/**************************** USEFUL FUCTIONS/OBJECTS ****************************************/

JRapid.prototype.consoleDebug = function( msg ) {
	try {
		console.debug( e );
	} catch( e ) {
		// nothing
	}
};


//helper functions for handling ARRAYS
JRapid.prototype.jArray = {
	jrapid: this,
	
	// returns FIRST index of elem in array
	indexOf: function (array, elem) {
		if (Array.prototype.indexOf) {
			return array.indexOf( elem );
		} else {
			for (var i=0, cant=array.length; i < cant; i ++ ) {
				if (array[i] === elem ) {
					return i;
				}
			}
			return -1;
		}
	},

	// returns true if elem present, false otherwise 
	contains: function (array, elem) {
		return this.indexOf(array, elem) > -1;
	},
	
	// returns the removed elem, or null if it was not present
	remove: function (array, elem) {
		var indexOfElem = this.indexOf(array, elem);
		if (indexOfElem != -1) {
			return array.splice( indexOfElem, 1 );
		}
		return null;
	},
	
	// adds the element, only if not present before
	add: function (array, elem) {
		if ( this.indexOf(array, elem) == -1 ) {
			array.push( elem );
		}
	}
};

/**************************** END OF USEFUL FUCTIONS/OBJECTS ****************************************/


JRapid.prototype.script = function(url) {
    var script = document.createElement("script");
    script.src = url;
    script.type = 'text/javascript';
    document.body.appendChild(script);
}

JRapid.prototype.stylesheet = function(url) {
    var link = document.createElement("link");
    link.rel = 'stylesheet';
    link.href = url;
    document.body.appendChild(link);
}


 
jrapid.ACCORDEONBODY_PADDING = 0;
jrapid.ACCORDEON_HEIGHT = 29; //21;
jrapid.SERVER_PATH = jrapid.getParam('path', '../xml/');    
jrapid.XMLRPC_PATH = jrapid.getParam('xmlrpcpath', '../xmlrpc/'); 
jrapid.WINDOW_HEIGHT = 30;
jrapid.prefix = '';
jrapid.target = 'window';
JRapid_Source.cache = false; 
JRapid_Input.dontDispatchChangeEvent = true;
JRapid.FILE_EXTENSION = '.html';

window.addEventListener('keydown', function(ev) {
	if (ev.keyCode == 75 && ev.ctrlKey) {
		if (JRapid_Source.cache) {
			JRapid_Source.cache = false;			
			alert('Cache disabled.');
		} else {
			JRapid_Source.cache = true;
			alert('Cache enabled.');
		}
	}   
}, false);


jrapid._onload = function() {
	if (window.isPanel) {
		var table = application.getElementById('table');
		if (table) {
			jrapid.panelResizeTable(table.outerNode, document.documentElement.clientHeight - 30);
		}
		jrapid.panelOnload();
		window.onresize = jrapid._onload;
		var panel = document.getElementById('panel');
		if (panel) {
			jrapid.panelResizePanel(panel, document.documentElement.clientHeight - 30);
		}
	}
};

if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", jrapid._onload, false);
} else if ( document.attachEvent ) {
	document.attachEvent("onreadystatechange", jrapid._onload);
}

}

