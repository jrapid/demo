
/*
 * JRapid Tags is a lightweight library for handling Browser Side XSLT.
 * The main classes are Xml, Xsl, XmlMultiple and XmlRpcServer. 
 * For form synchronization it uses Input, Select and Textarea.
 * 
 * Additionally, this library handles windows and containers.
 * The main classes are Source and Window.
 */

/******************************************************************************************/

function _h1(node) { return application.wrapNode(node); }
function _h3(depth, node) { while (depth-- > 0) { node = node.parentNode; } return application.wrapNode(node); }

function Application() {
	this.data = new Array();
};

Application.prototype.openWindow = function(caption, node, icon, nohelp, nomin, nomax, overflow) {
	var id = 'win' + new Date().getTime(); // TODO random
	
	var div = document.createElement('div');
//	div.onclick = 'var me=_h1(this),var current=_h3(1, this); ev.preventDefault();';
	div.style.display = 'none';
	div.setAttribute('jclass', 'JRapid_Window');
	div.className = 'jrapid_window';
	div.setAttribute('helpbutton', 'true');
	
	var dndAttributes = 'onmousedown="var current=_h3(5, this);current.onTitleDown(this, event); '+
						'application.preventDefault(event); return false;" ' + 
						'onmouseup="" ';
		
	var w = '<div style="display: none;" class="jrapid_window__dashed" ' + 
				'onmousedown="var me=_h1(this);var current=_h3(1, this); current.top(event); current.onTitleDown(this, event); application.stopPropagation(event);" ' + 
				'onselectstart="return false;"></div>';
	w += '	<div style="display: none;" class="jrapid_window__faded" onclick="return false;" onmousedown="return false;"></div>';				 
	w += '  <div>';
	w += '	<table class="jrapid_window__table" border="0" ' + 
				'onclick="var me=_h1(this); var current=_h3(2, this); current.top(event); application.stopPropagation(event);">';
	w += '		<tbody>';
	w += '			<tr>';
	w += '				<td class="jrapid_window__topleft"></td>';
	w += '				<td ' + dndAttributes + ' onselectstart="return false;" class="jrapid_window__title" ' + 
							'ondblclick="var current=_h3(5, this); current.onTitleDblClick(this, event);">'+
							'<span></span>'+
							'<div class="jrapid_window__caption">' + caption + '</div>'+
						'</td>';
	w += '				<td ' + dndAttributes + ' nowrap="nowrap" class="jrapid_window__title" style="width: 100px;">';
	w += '					<div class="jrapid_window__images">';
	w += '					    <a onclick="var me=_h1(this);var current=_h3(7, this);current.close(); application.stopPropagation(event); return false;" ' + 
									'class="jrapid_window__closebutton" href="#"></a>'+
								'<a onclick="var me=_h1(this);var current=_h3(7, this);current.onHelpClick(this, event); application.stopPropagation(event); return false;" ' + 
									'class="jrapid_window__helpbutton" href="#"' + (nohelp?' style="display:none"':'') + '></a>';
	w += '					</div>';
	w += '				</td><td onmousedown="var me=_h1(this); var current=_h3(5, this);current.startResize(true, false); return false;" '+
							'class="jrapid_window__topright"></td>';
	w += '			</tr>';		
	w += '			<tr>';
	w += '				<td class="jrapid_window__left"></td>';
	w += '				<td class="jrapid_window__inner" colspan="2">' +
							'<div id="' + id + '" style="position: relative; ' + (overflow ? 'overflow: auto;' : '') + '" htmliinner="6"></div>'+
						'</td>';
	w += '				<td onselectstart="var me=_h1(this); var current=_h3(5, this);return false;" ' +
							'onmousedown="var me=_h1(this);var current=_h3(5, this);current.startResize(true, false); return false;" ' + 
							'class="jrapid_window__right"></td>';
	w += '			</tr>';
	w += '			<tr>';
	w += '				<td class="jrapid_window__bottoml"></td>';
	w += '				<td onmousedown="var me=_h1(this);var current=_h3(5, this);current.startResize(false, true); return false;" class="jrapid_window__bottom" colspan="2"></td>';
	w += '				<td onmousedown="var me=_h1(this);var current=_h3(5, this);current.startResize(true, true); return false;" class="jrapid_window__bottomr"></td>';
	w += '			</tr>';
	w += '			</tbody>';
	w += '	</table>';
	w += '</div>';			
	
	div.innerHTML = w;
	node.parentNode.replaceChild(div, node);
	document.getElementById(id).appendChild(node);
	application.wrapNode(div).open();
	return div;
}


Application.prototype.getElementById = function(id) {
	return application.wrapNode(document.getElementById(this.getPrefix() + id));
};

Application.prototype.mappings = [];
Application.prototype.mappings['jrapid_xml'] = 'JRapid_Xml';
Application.prototype.mappings['jrapid_xmlmultiple'] = 'JRapid_XmlMultiple';
Application.prototype.mappings['jrapid_xsl'] = 'JRapid_Xsl';
Application.prototype.mappings['jrapid_input'] = 'JRapid_Input';
Application.prototype.mappings['jrapid_textarea'] = 'JRapid_Textarea';
Application.prototype.mappings['jrapid_select'] = 'JRapid_Select';
Application.prototype.mappings['jrapid_accordeon'] = 'JRapid_Accordeon';
Application.prototype.mappings['jrapid_accordeonitem'] = 'JRapid_AccordeonItem';

Application.prototype.wrapNode = function(node) {
	if (!node || node.outerNode) { return node;	}
	if (node.nodeType == 3) { return new TextWrapper(node);	}	
	if (node.location) { return this.wrapHTMLNode(document.documentElement.lastChild);	}
	
	try {
		var jclass = node.getAttribute('jclass');
		if (jclass) {
			var a;
			eval("a = new " + jclass + "(node);");
			return a;
		} else if (node.className) {
			var classes = node.className.split(' ');
			for (var i=0; i<classes.length; i++) {
				if (this.mappings[classes[i]]) {
					var a;
					eval("a = new " + this.mappings[classes[i]] + "(node);");
					return a;
				}
			}
			return this.wrapHTMLNode(node);
		} else {
			return this.wrapHTMLNode(node);
		}
	} catch (e) { return null; }
};

Application.prototype.wrapHTMLNode = function(node) {

	if (node.constructor && node.constructor.toString() == '[Window]') {
		return new HTMLBodyElementWrapper(document.documentElement.lastChild);
	} else if (node == document.documentElement.lastChild) {
		return new HTMLBodyElementWrapper(node);
	} else if (!node.tagName) {
		return;
	} else if (HTMLElementWrapper.classes[node.tagName.toLowerCase()]) {
		return new HTMLElementWrapper.classes[node.tagName.toLowerCase()](node);	
	} else {
		return new HTMLElementWrapper(node);
	}	
};

Application.prototype.wrapInnerNode = function(node) {
	if (node == null || !node.getAttribute) {
		return null;
	}

	if (node.getAttribute('htmliinner') == null) {
		return this.wrapNode(node);
	}
	
	var height = parseInt(node.getAttribute('htmliinner'));
	while (height-- > 0) {
		node = node.parentNode;
	}
	
	return this.wrapNode(node);
};

Application.prototype.getContainerFor = function(node) {
	var parentNode = node.parentNode;
	while (parentNode != null) {	
		if (parentNode.className == 'container__') {
			return new Container(parentNode);
		}
		if (parentNode == node.ownerDocument.documentElement) {
			return this;
		}
		if (parentNode.parentNode == null) {
			//alert(parentNode.outerHTML.substring(0, 100));
		}
		parentNode = parentNode.parentNode;
	}	
	return null;
};

Application.prototype.getPrefix = function() {
	var p = document.body.getAttribute('htmliprefix');
	return p == null ? '' : p;	
}

/* add window.addEventListener to IE */
if (!window.addEventListener) {
    window.addEventListener = function(type, listener, useCapture) {
    	document.attachEvent('on' + type, function() { listener(event) });
    };
}

Application.prototype.dispatch = function(event, obj, eventType) {
	if (eventType == null) {
		if (obj.getAttribute('on' + event)) {
			eval('obj.aux = function(ev) {'  + obj.getAttribute('on' + event) + '};');
			obj.aux();
		}
	} else if (obj.dispatchEvent) {
		var ev = document.createEvent(eventType);
		ev.initEvent(event, true, false);
		return obj.dispatchEvent(ev);
    } else if (obj.fireEvent) {
    	return obj.fireEvent('on' + event, document.createEventObject(eventType));
    } 
};

Application.prototype.stopPropagation = function(ev) {
	if (ev.stopPropagation) {
		ev.stopPropagation();
	} else {
		ev.cancelBubble = true;
	}
};

Application.prototype.preventDefault = function(ev) {
	if (ev.preventDefault) {
		ev.preventDefault();
	} else {
		ev.returnValue = false;
	}
};

Application.prototype.getParent = function() { return null; };
Application.prototype.getDocumentElement = function() { return application.wrapNode(document.documentElement); };

Application.prototype.getScrollTop = function() {
	if (self.pageYOffset) {
	  return self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) {
	  return document.documentElement.scrollTop;
	} else if (document.body) {
	  return document.body.scrollTop;
	}
}

Application.prototype.getScrollLeft = function() {
	if (self.pageXOffset) {
	  return self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) {
	  return document.documentElement.scrollLeft;
	} else if (document.body) {
	  return document.body.scrollLeft;
	}
}

Application.prototype.logError = function(code, message, detail) {
	return new Error(message + '\n\nError code: ' + code + '\n\nDetail: ' + detail);
};

var application = new Application();
application.nextZIndex = 1;
application.errorMessage = "";

/***************************************** CONTAINER **************************************/

function Container(node) { this.node = node; }

Container.prototype.open = function(url, handler) {
	var httpRequest = HttpRequest.create();
	var container = this;
	var node = this.node;
	httpRequest.open("GET", url, true);
	httpRequest.onreadystatechange = function() {			
		if (httpRequest.readyState == 4) {
			var text = httpRequest.responseText;
			node.innerHTML = text;
			node.setAttribute('name', '');
			window.currentContainer = container;
			application.evalScripts(text, node, handler);
			//if (handler) {
			//	handler();
			//}		
		}
	};
	httpRequest.send("");	
};


Container.prototype.close = function() { this.node.innerHTML = ''; }
Container.prototype.getPrefix = function() { return this.node.getAttribute('name'); }
Container.prototype.getElementById = function(id) {
	if (this.node.querySelectorAll) {
		var elements = this.node.querySelectorAll('#' + id);
		return elements.length > 0 ? application.wrapNode(elements[0]) : null;
	}

	
	var n = document.all[id];
	if (n == null || n.length == null || n.length == 0 || n.tagName) {
		return application.wrapNode(n);
	}
	
	var isChildOf = function(obj, p) {
		while (obj) {
			if (obj == p) return true;
			obj = obj.parentNode;
		}
		return false;
	};

	for (var i=0; i < n.length; i++) {
		if (isChildOf(n[i], this.node)) {
			return application.wrapNode(n[i]);
		}
	}
	return null;
}

Container.prototype.getParent = function() {
	var parentNode = this.node.parentNode;		
	while (parentNode = parentNode.parentNode) {	
		if (parentNode.className == 'container__') {
			return new Container(parentNode);
		}
	}		
	return application;
}

/************************************** NODE LIST WRAPPER *********************************/

function NodeListWrapper(nodeList) { this.nodeList = nodeList; }
NodeListWrapper.prototype.getLength = function() { return this.nodeList.length; }
NodeListWrapper.prototype.item = function(n) { return application.wrapNode(this.nodeList[n]); }

/************************************** HTML COLLECTION WRAPPER ***************************/

function HTMLCollectionWrapper(collection) { this.collection = collection; }
HTMLCollectionWrapper.prototype.getLength = function() { return this.collection.length; }
HTMLCollectionWrapper.prototype.item = function(n) { return application.wrapNode(this.collection[n]); }
HTMLCollectionWrapper.prototype.namedItem = function(str) {	return application.wrapNode(this.namedItem(str)); }

/********************************************** NODE WRAPPER ********************************************/

function NodeWrapper() { };
NodeWrapper.prototype.getNodeName = function() { return this.outerNode.nodeName; };
NodeWrapper.prototype.getNodeValue = function() { return this.innerNode.nodeValue; };
NodeWrapper.prototype.setNodeValue = function(value) { this.innerNode.nodeValue = value; };
NodeWrapper.prototype.getNodeType = function() { return this.outerNode.nodeType; };
NodeWrapper.prototype.getParentNode = function() { return application.wrapInnerNode(this.outerNode.parentNode); };
NodeWrapper.prototype.getChildNodes = function() { return new NodeListWrapper(this.innerNode.childNodes); };
NodeWrapper.prototype.getChildren = function() { return new NodeListWrapper(this.innerNode.children); };
NodeWrapper.prototype.getFirstChild = function() { return application.wrapNode(this.innerNode.firstChild); };
NodeWrapper.prototype.getLastChild = function() { return application.wrapNode(this.innerNode.lastChild); };
NodeWrapper.prototype.getFirstElementChild = function() { return application.wrapNode(this.innerNode.children[0]); };
NodeWrapper.prototype.getLastElementChild = function() { return application.wrapNode(this.innerNode.children[this.innerNode.children.length-1]); };
NodeWrapper.prototype.hasChildren = function() { return this.innerNode.children && this.innerNode.children.length > 0; };
NodeWrapper.prototype.getPreviousSibling = function() { return application.wrapNode(this.outerNode.previousSibling); };
NodeWrapper.prototype.getPreviousElementSibling = function() {
	var previous = this.outerNode.previousSibling;
	while (previous) {
		if (previous.nodeType == 1) {
			return application.wrapNode(previous);
		}
		previous = previous.previousSibling;
	}
	return null;
};
NodeWrapper.prototype.getNextSibling = function() { return application.wrapNode(this.outerNode.nextSibling); };
NodeWrapper.prototype.getNextElementSibling = function() {
	var next = this.outerNode.nextSibling;
	while (next) {
		if (next.nodeType == 1) {
			return application.wrapNode(next);
		}
		next = next.nextSibling;
	}
	return null;
};

NodeWrapper.prototype.insertBefore = function(newChild, refChild) {
	if (refChild) {
		return application.wrapNode(this.innerNode.insertBefore(newChild.outerNode, refChild.outerNode));
	}
	return application.wrapNode(this.innerNode.insertBefore(newChild.outerNode, null));	
};

NodeWrapper.prototype.replaceChild = function(newChild, oldChild) { 
	return application.wrapNode(this.innerNode.replaceChild(newChild.outerNode, oldChild.outerNode));
};

NodeWrapper.prototype.removeChild = function(oldChild) { return application.wrapNode(this.innerNode.removeChild(oldChild.outerNode)); };
NodeWrapper.prototype.appendChild = function(newChild) { return application.wrapNode(this.innerNode.appendChild(newChild.outerNode)); };
NodeWrapper.prototype.hasChildNodes = function() { return this.innerNode.hasChildNodes(); };
NodeWrapper.prototype.cloneNode = function(deep) { return application.wrapNode(this.outerNode.cloneNode(deep)); };





//here we should keep our regexps together
//TODO: perhaps, this should go in a more general object
NodeWrapper.prototype.REGEXP = { 
	spaces:    /\s+/,
	classes:   /[\n\t]/g,   /* enters and tabs */
	trimLeft:  /^\s+/,
	trimRight: /\s+$/,
	trim:      /^\s+|\s+$/g	
};

// TODO: make this work both for wrapped and not wrapped elems...
// for not wrapped elems, should be called: xxx.addClass( elem, newClass )


NodeWrapper.prototype.addClass = function( newClass ) {
	var elem = this.outerNode;
	if ( elem.nodeType != 1 ) 	
		return this; // only add classes to ELEMENT nodes
	if ( ! newClass || typeof newClass != "string" ) 
		return this; // classes should be not empty strings
		
	var classNames = (newClass || "").split( this.REGEXP.spaces );
	if ( !elem.className ) {
		elem.className = newClass;
	} else {
		var className = " " + elem.className + " "; 
		var setClass = elem.className;
		for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
			if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
				setClass += " " + classNames[c];
			}
		}
		elem.className = setClass.trim();
	}
	return this;
};

NodeWrapper.prototype.hasClass = function( selector ) {
	var elem = this.outerNode;
	var className = " " + selector + " ";
	var auxClassName = (" " + elem.className + " ").replace( this.REGEXP.classes, " " ); 
	return auxClassName.indexOf( className ) > -1 ;
};

//NOTE: in jQuery, if you pass it no class to remove, it removes every class from the elem (we don't)
NodeWrapper.prototype.removeClass = function( classToRem ) {
	var elem = this.outerNode;
	if ( elem.nodeType != 1 ) 	
		return this; // only add classes to ELEMENT nodes
	if ( ! classToRem || typeof classToRem != "string" ) 
		return this; // classes should be not empty strings
		
	var classNames = (classToRem || "").split( this.REGEXP.spaces );
	if (elem.className) {
		var className = (" " + elem.className + " ").replace( this.REGEXP.classes, " ");
		for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
			className = className.replace( new RegExp( " " + classNames[c], "g"), " " );
		}
		elem.className = className.trim();
	}
	return this;
};

// NOTE: in jQuery, if the class to toggle is undefined of boolean, it toggles the whole className
// we don't. 
NodeWrapper.prototype.toggleClass = function( classToToggle ) {
	var elem = this.outerNode;
	if ( elem.nodeType != 1 ) 	
		return this; // only add classes to ELEMENT nodes
	if ( ! classToToggle || typeof classToToggle != "string" ) 
		return this; // classes should be not empty strings
	
	var classNames = (classToToggle || "").split( this.REGEXP.spaces );
	for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
		if (this.hasClass( classNames[c] )) {
			this.removeClass( classNames[c] );
		} else {
			this.addClass( classNames[c] );
		}
	}	
	return this;
};


function TextWrapper(text) { this.outerNode = this.innerNode = text; }
TextWrapper.prototype = new NodeWrapper();

/******************************************************************************************/
 
function HTMLiElement(outerNode) {
	this.outerNode = outerNode;
	if (outerNode && outerNode.id) {
		var inner = document.getElementById(outerNode.id + '__inner');
		this.innerNode = inner ? inner : outerNode;		
	} else {
		this.innerNode = outerNode;
	}
}

HTMLiElement.prototype = new NodeWrapper();

HTMLiElement.prototype.init = function(node, className, tagName) {
	this.outerNode = node;
	this.className = className;
	this.tagName = tagName;
	this.innerNode = node;
}

HTMLiElement.prototype.getTagName = function() { return this.tagName; }
HTMLiElement.prototype.getAttribute = function(name) { return this.outerNode.getAttribute(name); }
HTMLiElement.prototype.setAttribute = function(name, value) { this.outerNode.setAttribute(name, value); }
HTMLiElement.prototype.removeAttribute = function(name) { this.outerNode.removeAttribute(name); }
HTMLiElement.prototype.getElementsByTagName = function(name) { return new NodeListWrapper(this.innerNode.getElementsByTagName(name)); }
HTMLiElement.prototype.getId = function() {	return this.outerNode.id; }
HTMLiElement.prototype.setId = function(id) { this.outerNode.id = id; }
HTMLiElement.prototype.getTitle = function() { return this.outerNode.title; }
HTMLiElement.prototype.setTitle = function(title) {	this.outerNode.title = title; }
HTMLiElement.prototype.getLang = function() { return this.outerNode.lang; }
HTMLiElement.prototype.setLang = function(lang) { this.outerNode.lang = lang; }
HTMLiElement.prototype.getDir = function() { return this.outerNode.dir; }
HTMLiElement.prototype.setDir = function(dir) {	this.outerNode.dir = dir; }
HTMLiElement.prototype.getClassName = function() { return this.outerNode.className; }
HTMLiElement.prototype.setClassName = function(className) {	this.outerNode.className = className; }
HTMLiElement.prototype.getStyle = function() { return this.outerNode.style; }
HTMLiElement.prototype.getClass = function() { return this.className; }

HTMLiElement.prototype.getContainer = function() {
	return application.getContainerFor(this.outerNode);
}

HTMLiElement.prototype.getInnerHTML = function() { return this.innerNode.innerHTML; }
HTMLiElement.prototype.setInnerHTML = function(value) {	this.innerNode.innerHTML = value; }

HTMLiElement.prototype.getContainingBlock = function() {
	var node = this.outerNode.parentNode;
	
	if (document.defaultView) {
		var view = document.defaultView;
		while (node != null && node != document) {
			var position = view.getComputedStyle(node, '').getPropertyValue("position");
			if (position == 'absolute' || position == 'relative') {
				return application.wrapNode(node);
			}		
			node = node.parentNode;
		}	
	} else {
		while (node != null && node != document) {
			var position = node.currentStyle.position;
			if (position == 'absolute' || position == 'relative') {
				return application.wrapNode(node);
			}		
			node = node.parentNode;
		}	
	}
	
	return application.wrapNode(document.documentElement);
}

HTMLiElement.prototype.getRelativeX = function() { return this.getX() - this.getContainingBlock().getX(); }

HTMLiElement.prototype.getX = function() {
	if (document.getBoxObjectFor) {
		return document.getBoxObjectFor(this.outerNode).x;
	} else if (this.outerNode.getBoundingClientRect) {
		return this.outerNode.offsetLeft + (this.outerNode.offsetParent ? application.wrapNode(this.outerNode.offsetParent).getX() : 0);
	}
}


HTMLiElement.prototype.getRelativeY = function() { return this.getY() - this.getContainingBlock().getY() - this.getScrollTop(); }

HTMLiElement.prototype.getY = function() {
	if (document.getBoxObjectFor) {
		return document.getBoxObjectFor(this.outerNode).y;
	} else if (this.outerNode.getBoundingClientRect) {
		return this.outerNode.offsetTop + (this.outerNode.offsetParent ? application.wrapNode(this.outerNode.offsetParent).getY() : 0);
	}
}

HTMLiElement.prototype.getScrollTop = function() {
	if (document.getBoxObjectFor) {
		/*TODO: Implement firefox scrolltop*/
		return 0;
	} else if (this.outerNode.getBoundingClientRect) {
		return this.outerNode.scrollTop + (this.outerNode.offsetParent ? application.wrapNode(this.outerNode.offsetParent).getScrollTop() : 0);
	}
}
HTMLiElement.prototype.getWidth = function() {
	if (document.getBoxObjectFor) {
		return document.getBoxObjectFor(this.outerNode).width;
	} else if (this.outerNode.getBoundingClientRect) {
		return this.outerNode.getBoundingClientRect().right - this.outerNode.getBoundingClientRect().left;
	}
}

HTMLiElement.prototype.getHeight = function() {
	if (document.getBoxObjectFor) {
		return document.getBoxObjectFor(this.outerNode).height;
	} else if (this.outerNode.getBoundingClientRect) {
		return this.outerNode.getBoundingClientRect().bottom - this.outerNode.getBoundingClientRect().top;
	}
}

HTMLiElement.prototype.center = function() {	
	var style = this.outerNode.style;
	var htmlElement = application.getDocumentElement();
	style.top = (document.documentElement.clientHeight / 2 - this.getHeight() / 2 + application.getScrollTop())  + 'px';
	style.left = (document.documentElement.clientWidth / 2 - this.getWidth() / 2 + application.getScrollLeft()) + 'px';
};

/******************************************************************************************/

function HTMLElementWrapper(node) {
	this.innerNode = node;
	this.outerNode = node;
}

HTMLElementWrapper.prototype = new HTMLiElement();
HTMLElementWrapper.classes = new Array();

/******************************************************************************************/

function HttpRequest() {
	
}

HttpRequest.create = function() {
	try {
		var o = new XMLHttpRequest();
		return o;
	} catch (e) {		
	}
	
	
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	for (var i=0; i < prefixes.length; i++) {
		try {
			var o = new ActiveXObject(prefixes[i] + ".XmlHttp");
			return o;
		} catch (e) {		
		}	
	} 	
}

/******************************************************************************************/

function XmlDocument() {

}

XmlDocument.create = function(xml) {
	if (document.implementation && document.implementation.createDocument) {
		if (xml) {
			return (new DOMParser()).parseFromString(xml, "text/xml");
		}
		var doc = document.implementation.createDocument("", "", null);
		if (doc.readyState == null) {
			doc.readyState = 1;
			doc.addEventListener("load", function () {
				doc.readyState = 4;
			if (typeof doc.onreadystatechange == "function")
					doc.onreadystatechange();
			}, false);
		}
		return doc;
	} else { 
		try {
			var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
			for (var i = 0; i < prefixes.length; i++) {
				try {
					var o = new ActiveXObject(prefixes[i] + ".DomDocument");
					o.setProperty("SelectionLanguage", "XPath");				
					if (xml) {
						o.loadXML(xml);
					}
					return o;					
				} catch (ex) {}
			}
		} catch (e) {} 
	}
}


if (window.DOMParser &&	window.XMLSerializer &&	window.Node && Node.prototype && Node.prototype.__defineGetter__) {
	XMLDocument.prototype.loadXML = Document.prototype.loadXML = function (s) {
		var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
		while (this.hasChildNodes())
			this.removeChild(this.lastChild);
		for (var i = 0; i < doc2.childNodes.length; i++) {
			var u = this.importNode(doc2.childNodes[i], true);
			this.appendChild(u);
		}

	};	

	XMLDocument.prototype.selectSingleNode = Document.prototype.selectSingleNode = function(xpath) {
		var result = this.evaluate(xpath, this, null, XPathResult.SINGLE_NODE_TYPE, null);
		if (item = result.iterateNext()) {
			return item;
		}
		return null;
	};


	XMLDocument.prototype.selectNodes = Document.prototype.selectNodes = function(xpath) {

		var nodes = new Array();
		var result = this.evaluate(xpath, this, null, XPathResult.ANY_TYPE, null);
		var i = 0;

		while(item = result.iterateNext()) {
			nodes[i++] = item;
		}
		return nodes;
	};

	// this func is only useful for transformations that take no params.
	XMLDocument.prototype.transformNode = Element.prototype.transformNode = function(xslt) {
		var processor = new XSLTProcessor();
		processor.importStylesheet(xslt);
		var result = processor.transformToDocument(this);
		if (!result.documentElement) {
			return '';
		} else if (result.documentElement.tagName == 'transformiix:result') {
			var doc = document.createElement('div');
			if (result.documentElement) {
				var root = result.documentElement;
				var m = root.childNodes.length;
				for (var i=0; i < m; i++) {
					doc.appendChild(root.childNodes[0]);
				}
				return doc.innerHTML;
			}  else {
				return '';
			}
		} else {
			var doc = document.createElement('div');
			if (result.documentElement) {
				try {
					doc.appendChild(result.documentElement);
				} catch (e) {
					doc.appendChild(document.adoptNode(result.documentElement));
				}
			}
			return doc.innerHTML;		
		}
	};

	XMLDocument.prototype.__defineGetter__("xml", function () {
		return (new XMLSerializer()).serializeToString(this);
	});
	
	HTMLDocument.prototype.__defineGetter__("xml", function () {
		return (new XMLSerializer()).serializeToString(this);
	});
	
	Element.prototype.__defineGetter__("xml", function () {
		return (new XMLSerializer()).serializeToString(this);
	});
	
	HTMLElement.prototype.__defineGetter__("outerHTML", function () {
		var attrs = this.attributes;
 		var str = "<" + this.tagName;
		for (var i = 0; i < attrs.length; i++) {
			str += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
		}
		return str + ">" + this.innerHTML + "</" + this.tagName + ">";
	});	
	
	/*HTMLElement.prototype.__defineGetter__("children", function() { 
		var r = [];
		
		var n = this.childNodes.length;
		for (var i=0; i < n; i++) {
			if (this.childNodes[i].nodeType== 1) {
				r[r.length] = this.childNodes[i];
			}
		}
		return r; 
	});*/

	/*TODO: runtimeStyle uses getPropertyValue() instead of accessing properties like top,left,etc.*/	
	HTMLElement.prototype.__defineGetter__("runtimeStyle", function() {
		return document.defaultView.getComputedStyle(this, null);
	});	
}


function HTMLAnchorElementWrapper(node) { this.init(node, 'HTMLAnchorElementWrapper', node.tagName); }; 
HTMLAnchorElementWrapper.prototype = new HTMLElementWrapper(); 
HTMLElementWrapper.classes['a'] = HTMLAnchorElementWrapper; 
HTMLAnchorElementWrapper.prototype.getAccessKey = function() { return this.outerNode.accessKey; }; 
HTMLAnchorElementWrapper.prototype.setAccessKey = function(value) { this.outerNode.accessKey = value; }; 
HTMLAnchorElementWrapper.prototype.getCharset = function() { return this.outerNode.charset; }; 
HTMLAnchorElementWrapper.prototype.setCharset = function(value) { this.outerNode.charset = value; }; 
HTMLAnchorElementWrapper.prototype.getCoords = function() { return this.outerNode.coords; }; 
HTMLAnchorElementWrapper.prototype.setCoords = function(value) { this.outerNode.coords = value; }; 
HTMLAnchorElementWrapper.prototype.getHref = function() { return this.outerNode.href; }; 
HTMLAnchorElementWrapper.prototype.setHref = function(value) { this.outerNode.href = value; }; 
HTMLAnchorElementWrapper.prototype.getHrefLang = function() { return this.outerNode.hrefLang; }; 
HTMLAnchorElementWrapper.prototype.setHrefLang = function(value) { this.outerNode.hrefLang = value; }; 
HTMLAnchorElementWrapper.prototype.getName = function() { return this.outerNode.name; }; 
HTMLAnchorElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; 
HTMLAnchorElementWrapper.prototype.getRel = function() { return this.outerNode.rel; }; 
HTMLAnchorElementWrapper.prototype.setRel = function(value) { this.outerNode.rel = value; }; 
HTMLAnchorElementWrapper.prototype.getRev = function() { return this.outerNode.rev; }; 
HTMLAnchorElementWrapper.prototype.setRev = function(value) { this.outerNode.rev = value; }; 
HTMLAnchorElementWrapper.prototype.getShape = function() { return this.outerNode.shape; }; 
HTMLAnchorElementWrapper.prototype.setShape = function(value) { this.outerNode.shape = value; }; 
HTMLAnchorElementWrapper.prototype.getTabIndex = function() { return this.outerNode.tabIndex; }; 
HTMLAnchorElementWrapper.prototype.setTabIndex = function(value) { this.outerNode.tabIndex = value; }; 
HTMLAnchorElementWrapper.prototype.getTarget = function() { return this.outerNode.target; }; 
HTMLAnchorElementWrapper.prototype.setTarget = function(value) { this.outerNode.target = value; }; 
HTMLAnchorElementWrapper.prototype.getType = function() { return this.outerNode.type; }; 
HTMLAnchorElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; 
HTMLAnchorElementWrapper.prototype.blur = function() { return this.outerNode.blur(); }; 
HTMLAnchorElementWrapper.prototype.focus = function() { return this.outerNode.focus(); }; 

function HTMLAppletElementWrapper(node) { this.init(node, 'HTMLAppletElementWrapper', node.tagName); }; 
HTMLAppletElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['applet'] = HTMLAppletElementWrapper; 
HTMLAppletElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; 
HTMLAppletElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; 
HTMLAppletElementWrapper.prototype.getAlt = function() { return this.outerNode.alt; }; 
HTMLAppletElementWrapper.prototype.setAlt = function(value) { this.outerNode.alt = value; }; 
HTMLAppletElementWrapper.prototype.getArchive = function() { return this.outerNode.archive; }; 
HTMLAppletElementWrapper.prototype.setArchive = function(value) { this.outerNode.archive = value; }; 
HTMLAppletElementWrapper.prototype.getCode = function() { return this.outerNode.code; }; 
HTMLAppletElementWrapper.prototype.setCode = function(value) { this.outerNode.code = value; }; 
HTMLAppletElementWrapper.prototype.getCodeBase = function() { return this.outerNode.codeBase; }; 
HTMLAppletElementWrapper.prototype.setCodeBase = function(value) { this.outerNode.codeBase = value; }; 
HTMLAppletElementWrapper.prototype.getHeight = function() { return this.outerNode.height; }; 
HTMLAppletElementWrapper.prototype.setHeight = function(value) { this.outerNode.height = value; }; 
HTMLAppletElementWrapper.prototype.getHspace = function() { return this.outerNode.hspace; }; 
HTMLAppletElementWrapper.prototype.setHspace = function(value) { this.outerNode.hspace = value; }; 
HTMLAppletElementWrapper.prototype.getName = function() { return this.outerNode.name; }; 
HTMLAppletElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; };
HTMLAppletElementWrapper.prototype.getObject = function() { return this.outerNode.object; }; 
HTMLAppletElementWrapper.prototype.setObject = function(value) { this.outerNode.object = value; }; 
HTMLAppletElementWrapper.prototype.getVspace = function() { return this.outerNode.vspace; }; HTMLAppletElementWrapper.prototype.setVspace = function(value) { this.outerNode.vspace = value; }; HTMLAppletElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; HTMLAppletElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; 
function HTMLAreaElementWrapper(node) { this.init(node, 'HTMLAreaElementWrapper', node.tagName); }; 
HTMLAreaElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['area'] = HTMLAreaElementWrapper; HTMLAreaElementWrapper.prototype.getAccessKey = function() { return this.outerNode.accessKey; }; 
HTMLAreaElementWrapper.prototype.setAccessKey = function(value) { this.outerNode.accessKey = value; }; HTMLAreaElementWrapper.prototype.getAlt = function() { return this.outerNode.alt; }; HTMLAreaElementWrapper.prototype.setAlt = function(value) { this.outerNode.alt = value; }; HTMLAreaElementWrapper.prototype.getCoords = function() { return this.outerNode.coords; }; 
HTMLAreaElementWrapper.prototype.setCoords = function(value) { this.outerNode.coords = value; }; HTMLAreaElementWrapper.prototype.getHref = function() { return this.outerNode.href; }; HTMLAreaElementWrapper.prototype.setHref = function(value) { this.outerNode.href = value; }; HTMLAreaElementWrapper.prototype.getNoHref = function() { return this.outerNode.noHref; }; HTMLAreaElementWrapper.prototype.setNoHref = function(value) { this.outerNode.noHref = value; }; 
HTMLAreaElementWrapper.prototype.getShape = function() { return this.outerNode.shape; }; HTMLAreaElementWrapper.prototype.setShape = function(value) { this.outerNode.shape = value; }; HTMLAreaElementWrapper.prototype.getTabIndex = function() { return this.outerNode.tabIndex; }; HTMLAreaElementWrapper.prototype.setTabIndex = function(value) { this.outerNode.tabIndex = value; }; 
HTMLAreaElementWrapper.prototype.getTarget = function() { return this.outerNode.target; }; HTMLAreaElementWrapper.prototype.setTarget = function(value) { this.outerNode.target = value; }; function HTMLBaseElementWrapper(node) { this.init(node, 'HTMLBaseElementWrapper', node.tagName); }; HTMLBaseElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['base'] = HTMLBaseElementWrapper; HTMLBaseElementWrapper.prototype.getHref = function() { return this.outerNode.href; }; HTMLBaseElementWrapper.prototype.setHref = function(value) { this.outerNode.href = value; }; 
HTMLBaseElementWrapper.prototype.getTarget = function() { return this.outerNode.target; }; HTMLBaseElementWrapper.prototype.setTarget = function(value) { this.outerNode.target = value; }; function HTMLBaseFontElementWrapper(node) { this.init(node, 'HTMLBaseFontElementWrapper', node.tagName); }; HTMLBaseFontElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['basefont'] = HTMLBaseFontElementWrapper; HTMLBaseFontElementWrapper.prototype.getColor = function() { return this.outerNode.color; }; HTMLBaseFontElementWrapper.prototype.setColor = function(value) { this.outerNode.color = value; }; HTMLBaseFontElementWrapper.prototype.getFace = function() { return this.outerNode.face; }; HTMLBaseFontElementWrapper.prototype.setFace = function(value) { this.outerNode.face = value; }; HTMLBaseFontElementWrapper.prototype.getSize = function() { return this.outerNode.size; }; 
HTMLBaseFontElementWrapper.prototype.setSize = function(value) { this.outerNode.size = value; }; function HTMLBodyElementWrapper(node) { this.init(node, 'HTMLBodyElementWrapper', node.tagName); }; 
HTMLBodyElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['body'] = HTMLBodyElementWrapper; HTMLBodyElementWrapper.prototype.getALink = function() { return this.outerNode.aLink; }; HTMLBodyElementWrapper.prototype.setALink = function(value) { this.outerNode.aLink = value; }; HTMLBodyElementWrapper.prototype.getBackground = function() { return this.outerNode.background; }; HTMLBodyElementWrapper.prototype.setBackground = function(value) { this.outerNode.background = value; }; HTMLBodyElementWrapper.prototype.getBgColor = function() { return this.outerNode.bgColor; }; HTMLBodyElementWrapper.prototype.setBgColor = function(value) { this.outerNode.bgColor = value; }; HTMLBodyElementWrapper.prototype.getLink = function() { return this.outerNode.link; }; HTMLBodyElementWrapper.prototype.setLink = function(value) { this.outerNode.link = value; }; HTMLBodyElementWrapper.prototype.getText = function() { return this.outerNode.text; }; HTMLBodyElementWrapper.prototype.setText = function(value) { this.outerNode.text = value; }; HTMLBodyElementWrapper.prototype.getVLink = function() { return this.outerNode.vLink; }; HTMLBodyElementWrapper.prototype.setVLink = function(value) { this.outerNode.vLink = value; }; function HTMLBrElementWrapper(node) { this.init(node, 'HTMLBrElementWrapper', node.tagName); }; 
HTMLBrElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['br'] = HTMLBrElementWrapper; HTMLBrElementWrapper.prototype.getClear = function() { return this.outerNode.clear; }; HTMLBrElementWrapper.prototype.setClear = function(value) { this.outerNode.clear = value; }; function HTMLButtonElementWrapper(node) { this.init(node, 'HTMLButtonElementWrapper', node.tagName); }; HTMLButtonElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['button'] = HTMLButtonElementWrapper; HTMLButtonElementWrapper.prototype.getAccessKey = function() { return this.outerNode.accessKey; }; 
HTMLButtonElementWrapper.prototype.setAccessKey = function(value) { this.outerNode.accessKey = value; }; HTMLButtonElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; HTMLButtonElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLButtonElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; HTMLButtonElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLButtonElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLButtonElementWrapper.prototype.getTabIndex = function() { return this.outerNode.tabIndex; }; HTMLButtonElementWrapper.prototype.setTabIndex = function(value) { this.outerNode.tabIndex = value; }; HTMLButtonElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLButtonElementWrapper.prototype.getValue = function() { return this.outerNode.value; }; HTMLButtonElementWrapper.prototype.setValue = function(value) { this.outerNode.value = value; }; function HTMLDirectoryElementWrapper(node) { this.init(node, 'HTMLDirectoryElementWrapper', node.tagName); }; HTMLDirectoryElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['directory'] = HTMLDirectoryElementWrapper; HTMLDirectoryElementWrapper.prototype.getCompact = function() { return this.outerNode.compact; }; HTMLDirectoryElementWrapper.prototype.setCompact = function(value) { this.outerNode.compact = value; }; function HTMLDivElementWrapper(node) { this.init(node, 'HTMLDivElementWrapper', node.tagName); }; 
HTMLDivElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['div'] = HTMLDivElementWrapper; HTMLDivElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLDivElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; function HTMLDListElementWrapper(node) { this.init(node, 'HTMLDListElementWrapper', node.tagName); }; 
HTMLDListElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['dlist'] = HTMLDListElementWrapper; HTMLDListElementWrapper.prototype.getCompact = function() { return this.outerNode.compact; }; HTMLDListElementWrapper.prototype.setCompact = function(value) { this.outerNode.compact = value; }; function HTMLFieldSetElementWrapper(node) { this.init(node, 'HTMLFieldSetElementWrapper', node.tagName); }; HTMLFieldSetElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['fieldset'] = HTMLFieldSetElementWrapper; HTMLFieldSetElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; function HTMLFontElementWrapper(node) { this.init(node, 'HTMLFontElementWrapper', node.tagName); }; 
HTMLFontElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['font'] = HTMLFontElementWrapper; HTMLFontElementWrapper.prototype.getColor = function() { return this.outerNode.color; }; HTMLFontElementWrapper.prototype.setColor = function(value) { this.outerNode.color = value; }; HTMLFontElementWrapper.prototype.getFace = function() { return this.outerNode.face; }; HTMLFontElementWrapper.prototype.setFace = function(value) { this.outerNode.face = value; }; HTMLFontElementWrapper.prototype.getSize = function() { return this.outerNode.size; }; HTMLFontElementWrapper.prototype.setSize = function(value) { this.outerNode.size = value; }; function HTMLFormElementWrapper(node) { this.init(node, 'HTMLFormElementWrapper', node.tagName); }; HTMLFormElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['form'] = HTMLFormElementWrapper; HTMLFormElementWrapper.prototype.getAcceptCharset = function() { return this.outerNode.acceptCharset; }; HTMLFormElementWrapper.prototype.setAcceptCharset = function(value) { this.outerNode.acceptCharset = value; }; HTMLFormElementWrapper.prototype.getAction = function() { return this.outerNode.action; }; HTMLFormElementWrapper.prototype.setAction = function(value) { this.outerNode.action = value; }; HTMLFormElementWrapper.prototype.getElements = function() { return new HTMLCollectionWrapper(this.outerNode.elements); }; HTMLFormElementWrapper.prototype.getEnctype = function() { return this.outerNode.enctype; }; HTMLFormElementWrapper.prototype.setEnctype = function(value) { this.outerNode.enctype = value; }; HTMLFormElementWrapper.prototype.getLength = function() { return this.outerNode.length; }; HTMLFormElementWrapper.prototype.getMethod = function() { return this.outerNode.method; }; HTMLFormElementWrapper.prototype.setMethod = function(value) { this.outerNode.method = value; }; HTMLFormElementWrapper.prototype.getName = function() { return this.outerNode.name; }; 
HTMLFormElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLFormElementWrapper.prototype.getTarget = function() { return this.outerNode.target; }; HTMLFormElementWrapper.prototype.setTarget = function(value) { this.outerNode.target = value; }; HTMLFormElementWrapper.prototype.reset = function() { return this.outerNode.reset(); }; 
HTMLFormElementWrapper.prototype.submit = function() { return this.outerNode.submit(); }; function HTMLFrameElementWrapper(node) { this.init(node, 'HTMLFrameElementWrapper', node.tagName); }; HTMLFrameElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['frame'] = HTMLFrameElementWrapper; HTMLFrameElementWrapper.prototype.getContentDocument = function() { return this.outerNode.contentDocument; }; HTMLFrameElementWrapper.prototype.getFrameBorder = function() { return this.outerNode.frameBorder; }; HTMLFrameElementWrapper.prototype.setFrameBorder = function(value) { this.outerNode.frameBorder = value; }; 
HTMLFrameElementWrapper.prototype.getLongDesc = function() { return this.outerNode.longDesc; }; HTMLFrameElementWrapper.prototype.setLongDesc = function(value) { this.outerNode.longDesc = value; }; HTMLFrameElementWrapper.prototype.getMarginHeight = function() { return this.outerNode.marginHeight; }; HTMLFrameElementWrapper.prototype.setMarginHeight = function(value) { this.outerNode.marginHeight = value; }; HTMLFrameElementWrapper.prototype.getMarginWidth = function() { return this.outerNode.marginWidth; }; HTMLFrameElementWrapper.prototype.setMarginWidth = function(value) { this.outerNode.marginWidth = value; }; HTMLFrameElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLFrameElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLFrameElementWrapper.prototype.getNoResize = function() { return this.outerNode.noResize; }; HTMLFrameElementWrapper.prototype.setNoResize = function(value) { this.outerNode.noResize = value; }; HTMLFrameElementWrapper.prototype.getScrolling = function() { return this.outerNode.scrolling; }; 
HTMLFrameElementWrapper.prototype.setScrolling = function(value) { this.outerNode.scrolling = value; }; HTMLFrameElementWrapper.prototype.getSrc = function() { return this.outerNode.src; }; HTMLFrameElementWrapper.prototype.setSrc = function(value) { this.outerNode.src = value; }; function HTMLFrameSetElementWrapper(node) { this.init(node, 'HTMLFrameSetElementWrapper', node.tagName); }; HTMLFrameSetElementWrapper.prototype = new HTMLElementWrapper(); 
HTMLElementWrapper.classes['frameset'] = HTMLFrameSetElementWrapper; HTMLFrameSetElementWrapper.prototype.getCols = function() { return this.outerNode.cols; }; HTMLFrameSetElementWrapper.prototype.setCols = function(value) { this.outerNode.cols = value; }; HTMLFrameSetElementWrapper.prototype.getRows = function() { return this.outerNode.rows; }; HTMLFrameSetElementWrapper.prototype.setRows = function(value) { this.outerNode.rows = value; }; function HTMLHeadElementWrapper(node) { this.init(node, 'HTMLHeadElementWrapper', node.tagName); }; HTMLHeadElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['head'] = HTMLHeadElementWrapper; HTMLHeadElementWrapper.prototype.getProfile = function() { return this.outerNode.profile; }; 
HTMLHeadElementWrapper.prototype.setProfile = function(value) { this.outerNode.profile = value; }; function HTMLHeadingElementWrapper(node) { this.init(node, 'HTMLHeadingElementWrapper', node.tagName); }; 
HTMLHeadingElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['h1'] = HTMLHeadingElementWrapper; HTMLElementWrapper.classes['h2'] = HTMLHeadingElementWrapper; HTMLElementWrapper.classes['h3'] = HTMLHeadingElementWrapper; HTMLElementWrapper.classes['h4'] = HTMLHeadingElementWrapper; HTMLElementWrapper.classes['h5'] = HTMLHeadingElementWrapper; HTMLElementWrapper.classes['h6'] = HTMLHeadingElementWrapper; HTMLHeadingElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLHeadingElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; function HTMLHrElementWrapper(node) { this.init(node, 'HTMLHrElementWrapper', node.tagName); }; HTMLHrElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['hr'] = HTMLHrElementWrapper; HTMLHrElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLHrElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLHrElementWrapper.prototype.getNoShade = function() { return this.outerNode.noShade; }; HTMLHrElementWrapper.prototype.setNoShade = function(value) { this.outerNode.noShade = value; }; HTMLHrElementWrapper.prototype.getSize = function() { return this.outerNode.size; }; HTMLHrElementWrapper.prototype.setSize = function(value) { this.outerNode.size = value; }; HTMLHrElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; 
HTMLHrElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; function HTMLHtmlElementWrapper(node) { this.init(node, 'HTMLHtmlElementWrapper', node.tagName); }; HTMLHtmlElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['html'] = HTMLHtmlElementWrapper; HTMLHtmlElementWrapper.prototype.getVersion = function() { return this.outerNode.version; }; HTMLHtmlElementWrapper.prototype.setVersion = function(value) { this.outerNode.version = value; }; function HTMLIFrameElementWrapper(node) { this.init(node, 'HTMLIFrameElementWrapper', node.tagName); }; HTMLIFrameElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['iframe'] = HTMLIFrameElementWrapper; HTMLIFrameElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; 
HTMLIFrameElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLIFrameElementWrapper.prototype.getContentDocument = function() { return this.outerNode.contentDocument; }; HTMLIFrameElementWrapper.prototype.getFrameBorder = function() { return this.outerNode.frameBorder; }; HTMLIFrameElementWrapper.prototype.setFrameBorder = function(value) { this.outerNode.frameBorder = value; }; HTMLIFrameElementWrapper.prototype.getHeight = function() { return this.outerNode.height; }; HTMLIFrameElementWrapper.prototype.setHeight = function(value) { this.outerNode.height = value; }; HTMLIFrameElementWrapper.prototype.getLongDesc = function() { return this.outerNode.longDesc; }; HTMLIFrameElementWrapper.prototype.setLongDesc = function(value) { this.outerNode.longDesc = value; }; HTMLIFrameElementWrapper.prototype.getMarginHeight = function() { return this.outerNode.marginHeight; }; HTMLIFrameElementWrapper.prototype.setMarginHeight = function(value) { this.outerNode.marginHeight = value; }; HTMLIFrameElementWrapper.prototype.getMarginWidth = function() { return this.outerNode.marginWidth; }; HTMLIFrameElementWrapper.prototype.setMarginWidth = function(value) { this.outerNode.marginWidth = value; }; HTMLIFrameElementWrapper.prototype.getName = function() { return this.outerNode.name; }; 
HTMLIFrameElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; 
HTMLIFrameElementWrapper.prototype.getScrolling = function() { return this.outerNode.scrolling; }; HTMLIFrameElementWrapper.prototype.setScrolling = function(value) { this.outerNode.scrolling = value; }; HTMLIFrameElementWrapper.prototype.getSrc = function() { return this.outerNode.src; }; HTMLIFrameElementWrapper.prototype.setSrc = function(value) { this.outerNode.src = value; }; HTMLIFrameElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; HTMLIFrameElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; function HTMLImageElementWrapper(node) { this.init(node, 'HTMLImageElementWrapper', node.tagName); }; HTMLImageElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['img'] = HTMLImageElementWrapper; HTMLImageElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; 
HTMLImageElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLImageElementWrapper.prototype.getAlt = function() { return this.outerNode.alt; }; HTMLImageElementWrapper.prototype.setAlt = function(value) { this.outerNode.alt = value; }; HTMLImageElementWrapper.prototype.getBorder = function() { return this.outerNode.border; }; HTMLImageElementWrapper.prototype.setBorder = function(value) { this.outerNode.border = value; }; HTMLImageElementWrapper.prototype.getHeight = function() { return this.outerNode.height; }; HTMLImageElementWrapper.prototype.setHeight = function(value) { this.outerNode.height = value; }; HTMLImageElementWrapper.prototype.getHspace = function() { return this.outerNode.hspace; }; HTMLImageElementWrapper.prototype.setHspace = function(value) { this.outerNode.hspace = value; }; HTMLImageElementWrapper.prototype.getIsMap = function() { return this.outerNode.isMap; }; HTMLImageElementWrapper.prototype.setIsMap = function(value) { this.outerNode.isMap = value; }; HTMLImageElementWrapper.prototype.getLongDesc = function() { return this.outerNode.longDesc; }; 
HTMLImageElementWrapper.prototype.setLongDesc = function(value) { this.outerNode.longDesc = value; }; HTMLImageElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLImageElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLImageElementWrapper.prototype.getSrc = function() { return this.outerNode.src; }; HTMLImageElementWrapper.prototype.setSrc = function(value) { this.outerNode.src = value; }; HTMLImageElementWrapper.prototype.getUseMap = function() { return this.outerNode.useMap; }; HTMLImageElementWrapper.prototype.setUseMap = function(value) { this.outerNode.useMap = value; }; HTMLImageElementWrapper.prototype.getVspace = function() { return this.outerNode.vspace; }; HTMLImageElementWrapper.prototype.setVspace = function(value) { this.outerNode.vspace = value; }; HTMLImageElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; HTMLImageElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; function HTMLInputElementWrapper(node) { this.init(node, 'HTMLInputElementWrapper', node.tagName); }; HTMLInputElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['input'] = HTMLInputElementWrapper; HTMLInputElementWrapper.prototype.getDefaultValue = function() { return this.outerNode.defaultValue; }; HTMLInputElementWrapper.prototype.setDefaultValue = function(value) { this.outerNode.defaultValue = value; }; HTMLInputElementWrapper.prototype.getDefaultChecked = function() { return this.outerNode.defaultChecked; }; 
HTMLInputElementWrapper.prototype.setDefaultChecked = function(value) { this.outerNode.defaultChecked = value; }; HTMLInputElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; HTMLInputElementWrapper.prototype.getAccept = function() { return this.outerNode.accept; }; HTMLInputElementWrapper.prototype.setAccept = function(value) { this.outerNode.accept = value; }; HTMLInputElementWrapper.prototype.getAccessKey = function() { return this.outerNode.accessKey; }; HTMLInputElementWrapper.prototype.setAccessKey = function(value) { this.outerNode.accessKey = value; }; HTMLInputElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; 
HTMLInputElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLInputElementWrapper.prototype.getAlt = function() { return this.outerNode.alt; }; HTMLInputElementWrapper.prototype.setAlt = function(value) { this.outerNode.alt = value; }; HTMLInputElementWrapper.prototype.getChecked = function() { return this.outerNode.checked; }; HTMLInputElementWrapper.prototype.setChecked = function(value) { this.outerNode.checked = value; }; HTMLInputElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; HTMLInputElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLInputElementWrapper.prototype.getMaxLength = function() { return this.outerNode.maxLength; }; HTMLInputElementWrapper.prototype.setMaxLength = function(value) { this.outerNode.maxLength = value; }; HTMLInputElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLInputElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLInputElementWrapper.prototype.getReadOnly = function() { return this.outerNode.readOnly; }; HTMLInputElementWrapper.prototype.setReadOnly = function(value) { this.outerNode.readOnly = value; }; HTMLInputElementWrapper.prototype.getSize = function() { return this.outerNode.size; }; HTMLInputElementWrapper.prototype.setSize = function(value) { this.outerNode.size = value; }; HTMLInputElementWrapper.prototype.getSrc = function() { return this.outerNode.src; }; HTMLInputElementWrapper.prototype.setSrc = function(value) { this.outerNode.src = value; }; HTMLInputElementWrapper.prototype.getTabIndex = function() { return this.outerNode.tabIndex; }; HTMLInputElementWrapper.prototype.setTabIndex = function(value) { this.outerNode.tabIndex = value; }; 
HTMLInputElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLInputElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; HTMLInputElementWrapper.prototype.getUseMap = function() { return this.outerNode.useMap; }; HTMLInputElementWrapper.prototype.setUseMap = function(value) { this.outerNode.useMap = value; }; HTMLInputElementWrapper.prototype.getValue = function() { return this.outerNode.value; }; HTMLInputElementWrapper.prototype.setValue = function(value) { this.outerNode.value = value; }; 
HTMLInputElementWrapper.prototype.blur = function() { return this.outerNode.blur(); }; HTMLInputElementWrapper.prototype.focus = function() { return this.outerNode.focus(); }; HTMLInputElementWrapper.prototype.select = function() { return this.outerNode.select(); }; HTMLInputElementWrapper.prototype.click = function() { return this.outerNode.click(); }; function HTMLIsIndexElementWrapper(node) { this.init(node, 'HTMLIsIndexElementWrapper', node.tagName); }; HTMLIsIndexElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['isindex'] = HTMLIsIndexElementWrapper; HTMLIsIndexElementWrapper.prototype.getForm = function() { return this.outerNode.form; }; HTMLIsIndexElementWrapper.prototype.getPrompt = function() { return this.outerNode.prompt; }; HTMLIsIndexElementWrapper.prototype.setPrompt = function(value) { this.outerNode.prompt = value; }; function HTMLLabelElementWrapper(node) { this.init(node, 'HTMLLabelElementWrapper', node.tagName); }; HTMLLabelElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['label'] = HTMLLabelElementWrapper; 
HTMLLabelElementWrapper.prototype.getAccessKey = function() { return this.outerNode.accessKey; }; HTMLLabelElementWrapper.prototype.setAccessKey = function(value) { this.outerNode.accessKey = value; }; HTMLLabelElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; HTMLLabelElementWrapper.prototype.getHtmlFor = function() { return this.outerNode.htmlFor; }; HTMLLabelElementWrapper.prototype.setHtmlFor = function(value) { this.outerNode.htmlFor = value; }; function HTMLLegendElementWrapper(node) { this.init(node, 'HTMLLegendElementWrapper', node.tagName); }; HTMLLegendElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['legend'] = HTMLLegendElementWrapper; HTMLLegendElementWrapper.prototype.getAccessKey = function() { return this.outerNode.accessKey; }; HTMLLegendElementWrapper.prototype.setAccessKey = function(value) { this.outerNode.accessKey = value; }; HTMLLegendElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; HTMLLegendElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLLegendElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; 
function HTMLLIElementWrapper(node) { this.init(node, 'HTMLLIElementWrapper', node.tagName); }; HTMLLIElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['li'] = HTMLLIElementWrapper; HTMLLIElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLLIElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; 
HTMLLIElementWrapper.prototype.getValue = function() { return this.outerNode.value; }; HTMLLIElementWrapper.prototype.setValue = function(value) { this.outerNode.value = value; }; function HTMLLinkElementWrapper(node) { this.init(node, 'HTMLLinkElementWrapper', node.tagName); }; HTMLLinkElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['link'] = HTMLLinkElementWrapper; HTMLLinkElementWrapper.prototype.getCharset = function() { return this.outerNode.charset; }; HTMLLinkElementWrapper.prototype.setCharset = function(value) { this.outerNode.charset = value; }; HTMLLinkElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; HTMLLinkElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLLinkElementWrapper.prototype.getHref = function() { return this.outerNode.href; }; HTMLLinkElementWrapper.prototype.setHref = function(value) { this.outerNode.href = value; }; HTMLLinkElementWrapper.prototype.getHreflang = function() { return this.outerNode.hreflang; }; HTMLLinkElementWrapper.prototype.setHreflang = function(value) { this.outerNode.hreflang = value; }; HTMLLinkElementWrapper.prototype.getMedia = function() { return this.outerNode.media; }; HTMLLinkElementWrapper.prototype.setMedia = function(value) { this.outerNode.media = value; }; HTMLLinkElementWrapper.prototype.getRel = function() { return this.outerNode.rel; }; HTMLLinkElementWrapper.prototype.setRel = function(value) { this.outerNode.rel = value; }; HTMLLinkElementWrapper.prototype.getRev = function() { return this.outerNode.rev; }; HTMLLinkElementWrapper.prototype.setRev = function(value) { this.outerNode.rev = value; }; 
HTMLLinkElementWrapper.prototype.getTarget = function() { return this.outerNode.target; }; 
HTMLLinkElementWrapper.prototype.setTarget = function(value) { this.outerNode.target = value; }; HTMLLinkElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLLinkElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; function HTMLMapElementWrapper(node) { this.init(node, 'HTMLMapElementWrapper', node.tagName); }; HTMLMapElementWrapper.prototype = new HTMLElementWrapper(); 
HTMLElementWrapper.classes['map'] = HTMLMapElementWrapper; HTMLMapElementWrapper.prototype.getAreas = function() { return new HTMLCollectionWrapper(this.outerNode.areas); }; HTMLMapElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLMapElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; function HTMLMenuElementWrapper(node) { this.init(node, 'HTMLMenuElementWrapper', node.tagName); }; 
HTMLMenuElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['menu'] = HTMLMenuElementWrapper; HTMLMenuElementWrapper.prototype.getCompact = function() { return this.outerNode.compact; }; HTMLMenuElementWrapper.prototype.setCompact = function(value) { this.outerNode.compact = value; }; function HTMLMetaElementWrapper(node) { this.init(node, 'HTMLMetaElementWrapper', node.tagName); }; HTMLMetaElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['meta'] = HTMLMetaElementWrapper; HTMLMetaElementWrapper.prototype.getContent = function() { return this.outerNode.content; }; HTMLMetaElementWrapper.prototype.setContent = function(value) { this.outerNode.content = value; }; HTMLMetaElementWrapper.prototype.getHttpEquiv = function() { return this.outerNode.httpEquiv; }; HTMLMetaElementWrapper.prototype.setHttpEquiv = function(value) { this.outerNode.httpEquiv = value; }; HTMLMetaElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLMetaElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLMetaElementWrapper.prototype.getScheme = function() { return this.outerNode.scheme; }; HTMLMetaElementWrapper.prototype.setScheme = function(value) { this.outerNode.scheme = value; }; function HTMLModElementWrapper(node) { this.init(node, 'HTMLModElementWrapper', node.tagName); }; HTMLModElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['ins'] = HTMLModElementWrapper; 
HTMLElementWrapper.classes['del'] = HTMLModElementWrapper; HTMLModElementWrapper.prototype.getCite = function() { return this.outerNode.cite; }; HTMLModElementWrapper.prototype.setCite = function(value) { this.outerNode.cite = value; }; HTMLModElementWrapper.prototype.getDateTime = function() { return this.outerNode.dateTime; }; HTMLModElementWrapper.prototype.setDateTime = function(value) { this.outerNode.dateTime = value; }; function HTMLObjectElementWrapper(node) { this.init(node, 'HTMLObjectElementWrapper', node.tagName); }; HTMLObjectElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['object'] = HTMLObjectElementWrapper; HTMLObjectElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; 
HTMLObjectElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; 
HTMLObjectElementWrapper.prototype.getArchive = function() { return this.outerNode.archive; }; HTMLObjectElementWrapper.prototype.setArchive = function(value) { this.outerNode.archive = value; }; 
HTMLObjectElementWrapper.prototype.getBorder = function() { return this.outerNode.border; }; HTMLObjectElementWrapper.prototype.setBorder = function(value) { this.outerNode.border = value; }; 
HTMLObjectElementWrapper.prototype.getCode = function() { return this.outerNode.code; }; HTMLObjectElementWrapper.prototype.setCode = function(value) { this.outerNode.code = value; }; HTMLObjectElementWrapper.prototype.getCodeBase = function() { return this.outerNode.codeBase; }; HTMLObjectElementWrapper.prototype.setCodeBase = function(value) { this.outerNode.codeBase = value; }; HTMLObjectElementWrapper.prototype.getCodeType = function() { return this.outerNode.codeType; }; HTMLObjectElementWrapper.prototype.setCodeType = function(value) { this.outerNode.codeType = value; }; HTMLObjectElementWrapper.prototype.getContentDocument = function() { return this.outerNode.contentDocument; }; 
HTMLObjectElementWrapper.prototype.getData = function() { return this.outerNode.data; }; HTMLObjectElementWrapper.prototype.setData = function(value) { this.outerNode.data = value; }; HTMLObjectElementWrapper.prototype.getDeclare = function() { return this.outerNode.declare; }; HTMLObjectElementWrapper.prototype.setDeclare = function(value) { this.outerNode.declare = value; }; HTMLObjectElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; HTMLObjectElementWrapper.prototype.setForm = function(value) { this.outerNode.form = value; }; HTMLObjectElementWrapper.prototype.getHeight = function() { return this.outerNode.height; }; HTMLObjectElementWrapper.prototype.setHeight = function(value) { this.outerNode.height = value; }; HTMLObjectElementWrapper.prototype.getHspace = function() { return this.outerNode.hspace; }; HTMLObjectElementWrapper.prototype.setHspace = function(value) { this.outerNode.hspace = value; }; 
HTMLObjectElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLObjectElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLObjectElementWrapper.prototype.getStandBy = function() { return this.outerNode.standBy; }; HTMLObjectElementWrapper.prototype.setStandBy = function(value) { this.outerNode.standBy = value; }; HTMLObjectElementWrapper.prototype.getTabIndex = function() { return this.outerNode.tabIndex; }; HTMLObjectElementWrapper.prototype.setTabIndex = function(value) { this.outerNode.tabIndex = value; }; HTMLObjectElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLObjectElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; HTMLObjectElementWrapper.prototype.getUseMap = function() { return this.outerNode.useMap; }; HTMLObjectElementWrapper.prototype.setUseMap = function(value) { this.outerNode.useMap = value; }; HTMLObjectElementWrapper.prototype.getVspace = function() { return this.outerNode.vspace; }; HTMLObjectElementWrapper.prototype.setVspace = function(value) { this.outerNode.vspace = value; }; HTMLObjectElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; 
HTMLObjectElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; function HTMLOListElementWrapper(node) { this.init(node, 'HTMLOListElementWrapper', node.tagName); }; HTMLOListElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['olist'] = HTMLOListElementWrapper; HTMLOListElementWrapper.prototype.getCompact = function() { return this.outerNode.compact; }; HTMLOListElementWrapper.prototype.setCompact = function(value) { this.outerNode.compact = value; }; HTMLOListElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLOListElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; HTMLOListElementWrapper.prototype.getStart = function() { return this.outerNode.start; }; HTMLOListElementWrapper.prototype.setStart = function(value) { this.outerNode.start = value; }; function HTMLOptGroupElementWrapper(node) { this.init(node, 'HTMLOptGroupElementWrapper', node.tagName); }; HTMLOptGroupElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['optgroup'] = HTMLOptGroupElementWrapper; HTMLOptGroupElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; 
HTMLOptGroupElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLOptGroupElementWrapper.prototype.getLabel = function() { return this.outerNode.label; }; HTMLOptGroupElementWrapper.prototype.setLabel = function(value) { this.outerNode.label = value; }; 
function HTMLOptionElementWrapper(node) { this.init(node, 'HTMLOptionElementWrapper', node.tagName); }; HTMLOptionElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['option'] = HTMLOptionElementWrapper; HTMLOptionElementWrapper.prototype.getDefaultSelected = function() { return this.outerNode.defaultSelected; }; HTMLOptionElementWrapper.prototype.setDefaultSelected = function(value) { this.outerNode.defaultSelected = value; }; HTMLOptionElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; HTMLOptionElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLOptionElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; HTMLOptionElementWrapper.prototype.getIndex = function() { return this.outerNode.index; }; 
HTMLOptionElementWrapper.prototype.getLabel = function() { return this.outerNode.label; }; HTMLOptionElementWrapper.prototype.setLabel = function(value) { this.outerNode.label = value; }; HTMLOptionElementWrapper.prototype.getSelected = function() { return this.outerNode.selected; }; 
HTMLOptionElementWrapper.prototype.setSelected = function(value) { this.outerNode.selected = value; }; HTMLOptionElementWrapper.prototype.getText = function() { return this.outerNode.text; }; HTMLOptionElementWrapper.prototype.getValue = function() { return this.outerNode.value; }; HTMLOptionElementWrapper.prototype.setValue = function(value) { this.outerNode.value = value; }; function HTMLOptionsCollectionWrapper(node) { this.init(node, 'HTMLOptionsCollectionWrapper', node.tagName); }; HTMLOptionsCollectionWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes[''] = HTMLOptionsCollectionWrapper; HTMLOptionsCollectionWrapper.prototype.getLength = function() { return this.outerNode.length; }; HTMLOptionsCollectionWrapper.prototype.setLength = function(value) { this.outerNode.length = value; }; HTMLOptionsCollectionWrapper.prototype.item = function(index) { return application.wrapHTMLNode(this.outerNode.item(index)); }; HTMLOptionsCollectionWrapper.prototype.namedItem = function(name) { return application.wrapHTMLNode(this.outerNode.namedItem(name)); }; function HTMLParagraphElementWrapper(node) { this.init(node, 'HTMLParagraphElementWrapper', node.tagName); }; HTMLParagraphElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['p'] = HTMLParagraphElementWrapper; HTMLParagraphElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLParagraphElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; function HTMLParamElementWrapper(node) { this.init(node, 'HTMLParamElementWrapper', node.tagName); }; 
HTMLParamElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['param'] = HTMLParamElementWrapper; HTMLParamElementWrapper.prototype.getName = function() { return this.outerNode.name; }; 
HTMLParamElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLParamElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLParamElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; HTMLParamElementWrapper.prototype.getValue = function() { return this.outerNode.value; }; HTMLParamElementWrapper.prototype.setValue = function(value) { this.outerNode.value = value; }; HTMLParamElementWrapper.prototype.getValueType = function() { return this.outerNode.valueType; }; HTMLParamElementWrapper.prototype.setValueType = function(value) { this.outerNode.valueType = value; }; function HTMLPreElementWrapper(node) { this.init(node, 'HTMLPreElementWrapper', node.tagName); }; HTMLPreElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['pre'] = HTMLPreElementWrapper; HTMLPreElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; HTMLPreElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; function HTMLQuoteElementWrapper(node) { this.init(node, 'HTMLQuoteElementWrapper', node.tagName); }; HTMLQuoteElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['q'] = HTMLQuoteElementWrapper; HTMLElementWrapper.classes['blockquote'] = HTMLQuoteElementWrapper; HTMLQuoteElementWrapper.prototype.getCite = function() { return this.outerNode.cite; }; 
HTMLQuoteElementWrapper.prototype.setCite = function(value) { this.outerNode.cite = value; }; function HTMLScriptElementWrapper(node) { this.init(node, 'HTMLScriptElementWrapper', node.tagName); }; HTMLScriptElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['script'] = HTMLScriptElementWrapper; HTMLScriptElementWrapper.prototype.getCharset = function() { return this.outerNode.charset; }; HTMLScriptElementWrapper.prototype.setCharset = function(value) { this.outerNode.charset = value; }; HTMLScriptElementWrapper.prototype.getDefer = function() { return this.outerNode.defer; }; HTMLScriptElementWrapper.prototype.setDefer = function(value) { this.outerNode.defer = value; }; HTMLScriptElementWrapper.prototype.getEvent = function() { return this.outerNode.event; }; HTMLScriptElementWrapper.prototype.setEvent = function(value) { this.outerNode.event = value; }; HTMLScriptElementWrapper.prototype.getHtmlFor = function() { return this.outerNode.htmlFor; }; HTMLScriptElementWrapper.prototype.setHtmlFor = function(value) { this.outerNode.htmlFor = value; }; 
HTMLScriptElementWrapper.prototype.getSrc = function() { return this.outerNode.src; }; HTMLScriptElementWrapper.prototype.setSrc = function(value) { this.outerNode.src = value; }; HTMLScriptElementWrapper.prototype.getText = function() { return this.outerNode.text; }; HTMLScriptElementWrapper.prototype.setText = function(value) { this.outerNode.text = value; }; HTMLScriptElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLScriptElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; function HTMLSelectElementWrapper(node) { this.init(node, 'HTMLSelectElementWrapper', node.tagName); }; HTMLSelectElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['select'] = HTMLSelectElementWrapper; HTMLSelectElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLSelectElementWrapper.prototype.getSelectedIndex = function() { return this.outerNode.selectedIndex; }; HTMLSelectElementWrapper.prototype.setSelectedIndex = function(value) { this.outerNode.selectedIndex = value; }; HTMLSelectElementWrapper.prototype.getValue = function() { return this.outerNode.value; }; HTMLSelectElementWrapper.prototype.setValue = function(value) { this.outerNode.value = value; }; HTMLSelectElementWrapper.prototype.getLength = function() { return this.outerNode.length; }; HTMLSelectElementWrapper.prototype.setLength = function(value) { this.outerNode.length = value; }; 
HTMLSelectElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; HTMLSelectElementWrapper.prototype.getOptions = function() { return new HTMLOptionsCollectionWrapper(this.outerNode.options); }; HTMLSelectElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; 
HTMLSelectElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLSelectElementWrapper.prototype.getMultiple = function() { return this.outerNode.multiple; }; 
HTMLSelectElementWrapper.prototype.setMultiple = function(value) { this.outerNode.multiple = value; }; HTMLSelectElementWrapper.prototype.getName = function() { return this.outerNode.name; }; 
HTMLSelectElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLSelectElementWrapper.prototype.getSize = function() { return this.outerNode.size; }; HTMLSelectElementWrapper.prototype.setSize = function(value) { this.outerNode.size = value; }; HTMLSelectElementWrapper.prototype.getTabIndex = function() { return this.outerNode.tabIndex; }; HTMLSelectElementWrapper.prototype.setTabIndex = function(value) { this.outerNode.tabIndex = value; }; HTMLSelectElementWrapper.prototype.add = function(element,before) { return this.outerNode.add(element,before); }; HTMLSelectElementWrapper.prototype.remove = function(index) { return this.outerNode.remove(index); }; HTMLSelectElementWrapper.prototype.blur = function() { return this.outerNode.blur(); }; HTMLSelectElementWrapper.prototype.focus = function() { return this.outerNode.focus(); }; function HTMLStyleElementWrapper(node) { this.init(node, 'HTMLStyleElementWrapper', node.tagName); }; 
HTMLStyleElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['style'] = HTMLStyleElementWrapper; HTMLStyleElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; HTMLStyleElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLStyleElementWrapper.prototype.getMedia = function() { return this.outerNode.media; }; HTMLStyleElementWrapper.prototype.setMedia = function(value) { this.outerNode.media = value; }; HTMLStyleElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLStyleElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; function HTMLTableCaptionElementWrapper(node) { this.init(node, 'HTMLTableCaptionElementWrapper', node.tagName); }; HTMLTableCaptionElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['caption'] = HTMLTableCaptionElementWrapper; HTMLTableCaptionElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLTableCaptionElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; function HTMLTableCellElementWrapper(node) { this.init(node, 'HTMLTableCellElementWrapper', node.tagName); }; HTMLTableCellElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['td'] = HTMLTableCellElementWrapper; HTMLElementWrapper.classes['th'] = HTMLTableCellElementWrapper; HTMLTableCellElementWrapper.prototype.getAbbr = function() { return this.outerNode.abbr; }; 
HTMLTableCellElementWrapper.prototype.setAbbr = function(value) { this.outerNode.abbr = value; }; HTMLTableCellElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLTableCellElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLTableCellElementWrapper.prototype.getAxis = function() { return this.outerNode.axis; }; HTMLTableCellElementWrapper.prototype.setAxis = function(value) { this.outerNode.axis = value; }; HTMLTableCellElementWrapper.prototype.getBgColor = function() { return this.outerNode.bgColor; }; HTMLTableCellElementWrapper.prototype.setBgColor = function(value) { this.outerNode.bgColor = value; }; HTMLTableCellElementWrapper.prototype.getCellIndex = function() { return this.outerNode.cellIndex; }; HTMLTableCellElementWrapper.prototype.getCh = function() { return this.outerNode.ch; }; HTMLTableCellElementWrapper.prototype.setCh = function(value) { this.outerNode.ch = value; }; 
HTMLTableCellElementWrapper.prototype.getChOff = function() { return this.outerNode.chOff; }; HTMLTableCellElementWrapper.prototype.setChOff = function(value) { this.outerNode.chOff = value; }; HTMLTableCellElementWrapper.prototype.getColSpan = function() { return this.outerNode.colSpan; }; HTMLTableCellElementWrapper.prototype.setColSpan = function(value) { this.outerNode.colSpan = value; }; HTMLTableCellElementWrapper.prototype.getHeaders = function() { return this.outerNode.headers; }; HTMLTableCellElementWrapper.prototype.setHeaders = function(value) { this.outerNode.headers = value; }; HTMLTableCellElementWrapper.prototype.getHeight = function() { return this.outerNode.height; }; HTMLTableCellElementWrapper.prototype.setHeight = function(value) { this.outerNode.height = value; }; HTMLTableCellElementWrapper.prototype.getNoWrap = function() { return this.outerNode.noWrap; }; HTMLTableCellElementWrapper.prototype.setNoWrap = function(value) { this.outerNode.noWrap = value; }; 
HTMLTableCellElementWrapper.prototype.getRowSpan = function() { return this.outerNode.rowSpan; }; HTMLTableCellElementWrapper.prototype.setRowSpan = function(value) { this.outerNode.rowSpan = value; }; HTMLTableCellElementWrapper.prototype.getScope = function() { return this.outerNode.scope; }; HTMLTableCellElementWrapper.prototype.setScope = function(value) { this.outerNode.scope = value; }; HTMLTableCellElementWrapper.prototype.getValign = function() { return this.outerNode.valign; }; HTMLTableCellElementWrapper.prototype.setValign = function(value) { this.outerNode.valign = value; }; HTMLTableCellElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; HTMLTableCellElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; function HTMLTableColElementWrapper(node) { this.init(node, 'HTMLTableColElementWrapper', node.tagName); }; HTMLTableColElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['col'] = HTMLTableColElementWrapper; HTMLTableColElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; 
HTMLTableColElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLTableColElementWrapper.prototype.getCh = function() { return this.outerNode.ch; }; HTMLTableColElementWrapper.prototype.setCh = function(value) { this.outerNode.ch = value; }; HTMLTableColElementWrapper.prototype.getChOff = function() { return this.outerNode.chOff; }; HTMLTableColElementWrapper.prototype.setChOff = function(value) { this.outerNode.chOff = value; }; HTMLTableColElementWrapper.prototype.getSpan = function() { return this.outerNode.span; }; HTMLTableColElementWrapper.prototype.setSpan = function(value) { this.outerNode.span = value; }; HTMLTableColElementWrapper.prototype.getVAlign = function() { return this.outerNode.vAlign; }; HTMLTableColElementWrapper.prototype.setVAlign = function(value) { this.outerNode.vAlign = value; }; HTMLTableColElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; HTMLTableColElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; function HTMLTableElementWrapper(node) { this.init(node, 'HTMLTableElementWrapper', node.tagName); }; HTMLTableElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['table'] = HTMLTableElementWrapper; HTMLTableElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLTableElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; 
HTMLTableElementWrapper.prototype.getBgColor = function() { return this.outerNode.bgColor; }; HTMLTableElementWrapper.prototype.setBgColor = function(value) { this.outerNode.bgColor = value; }; HTMLTableElementWrapper.prototype.getBorder = function() { return this.outerNode.border; }; HTMLTableElementWrapper.prototype.setBorder = function(value) { this.outerNode.border = value; }; HTMLTableElementWrapper.prototype.getCaption = function() { return application.wrapHTMLNode(this.outerNode.caption); }; HTMLTableElementWrapper.prototype.setCaption = function(value) { this.outerNode.caption = value; }; HTMLTableElementWrapper.prototype.getCellPadding = function() { return this.outerNode.cellPadding; }; HTMLTableElementWrapper.prototype.setCellPadding = function(value) { this.outerNode.cellPadding = value; }; HTMLTableElementWrapper.prototype.getCellSpacing = function() { return this.outerNode.cellSpacing; }; HTMLTableElementWrapper.prototype.setCellSpacing = function(value) { this.outerNode.cellSpacing = value; }; HTMLTableElementWrapper.prototype.getFrame = function() { return this.outerNode.frame; }; HTMLTableElementWrapper.prototype.setFrame = function(value) { this.outerNode.frame = value; }; HTMLTableElementWrapper.prototype.getRows = function() { return new HTMLCollectionWrapper(this.outerNode.rows); }; HTMLTableElementWrapper.prototype.getRules = function() { return this.outerNode.rules; }; HTMLTableElementWrapper.prototype.setRules = function(value) { this.outerNode.rules = value; }; 
HTMLTableElementWrapper.prototype.getSummary = function() { return this.outerNode.summary; }; HTMLTableElementWrapper.prototype.setSummary = function(value) { this.outerNode.summary = value; }; HTMLTableElementWrapper.prototype.getTBodies = function() { return new HTMLCollectionWrapper(this.outerNode.tBodies); }; HTMLTableElementWrapper.prototype.getTFoot = function() { return application.wrapHTMLNode(this.outerNode.tFoot); }; HTMLTableElementWrapper.prototype.setTFoot = function(value) { this.outerNode.tFoot = value; }; HTMLTableElementWrapper.prototype.getTHead = function() { return application.wrapHTMLNode(this.outerNode.tHead); }; HTMLTableElementWrapper.prototype.setTHead = function(value) { this.outerNode.tHead = value; }; HTMLTableElementWrapper.prototype.getWidth = function() { return this.outerNode.width; }; HTMLTableElementWrapper.prototype.setWidth = function(value) { this.outerNode.width = value; }; 
HTMLTableElementWrapper.prototype.createCaption = function() { return application.wrapHTMLNode(this.outerNode.createCaption()); }; HTMLTableElementWrapper.prototype.createTFoot = function() { return application.wrapHTMLNode(this.outerNode.createTFoot()); }; HTMLTableElementWrapper.prototype.createTHead = function() { return application.wrapHTMLNode(this.outerNode.createTHead()); }; HTMLTableElementWrapper.prototype.deleteCaption = function() { return this.outerNode.deleteCaption(); }; HTMLTableElementWrapper.prototype.deleteRow = function(index) { return this.outerNode.deleteRow(index); }; HTMLTableElementWrapper.prototype.deleteTFoot = function() { return this.outerNode.deleteTFoot(); }; HTMLTableElementWrapper.prototype.deleteTHead = function() { return this.outerNode.deleteTHead(); }; HTMLTableElementWrapper.prototype.insertRow = function(index) { return application.wrapHTMLNode(this.outerNode.insertRow(index)); }; function HTMLTableRowElementWrapper(node) { this.init(node, 'HTMLTableRowElementWrapper', node.tagName); }; HTMLTableRowElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['tr'] = HTMLTableRowElementWrapper; HTMLTableRowElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLTableRowElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLTableRowElementWrapper.prototype.getBgColor = function() { return this.outerNode.bgColor; }; 
HTMLTableRowElementWrapper.prototype.setBgColor = function(value) { this.outerNode.bgColor = value; }; HTMLTableRowElementWrapper.prototype.getCells = function() { return new HTMLCollectionWrapper(this.outerNode.cells); }; HTMLTableRowElementWrapper.prototype.getCh = function() { return this.outerNode.ch; }; HTMLTableRowElementWrapper.prototype.setCh = function(value) { this.outerNode.ch = value; }; HTMLTableRowElementWrapper.prototype.getChOff = function() { return this.outerNode.chOff; }; HTMLTableRowElementWrapper.prototype.setChOff = function(value) { this.outerNode.chOff = value; }; HTMLTableRowElementWrapper.prototype.getRowIndex = function() { return this.outerNode.rowIndex; }; HTMLTableRowElementWrapper.prototype.getSectionRowIndex = function() { return this.outerNode.sectionRowIndex; }; HTMLTableRowElementWrapper.prototype.getVAlign = function() { return this.outerNode.vAlign; }; HTMLTableRowElementWrapper.prototype.setVAlign = function(value) { this.outerNode.vAlign = value; }; HTMLTableRowElementWrapper.prototype.deleteCell = function(index) { return this.outerNode.deleteCell(index); }; HTMLTableRowElementWrapper.prototype.insertCell = function(index) { return application.wrapHTMLNode(this.outerNode.insertCell(index)); }; function HTMLTableSectionElementWrapper(node) { this.init(node, 'HTMLTableSectionElementWrapper', node.tagName); }; 
HTMLTableSectionElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['thead'] = HTMLTableSectionElementWrapper; HTMLElementWrapper.classes['tfoot'] = HTMLTableSectionElementWrapper; HTMLElementWrapper.classes['tbody'] = HTMLTableSectionElementWrapper; HTMLTableSectionElementWrapper.prototype.getAlign = function() { return this.outerNode.align; }; HTMLTableSectionElementWrapper.prototype.setAlign = function(value) { this.outerNode.align = value; }; HTMLTableSectionElementWrapper.prototype.getCh = function() { return this.outerNode.ch; }; HTMLTableSectionElementWrapper.prototype.setCh = function(value) { this.outerNode.ch = value; }; HTMLTableSectionElementWrapper.prototype.getChOff = function() { return this.outerNode.chOff; }; HTMLTableSectionElementWrapper.prototype.setChOff = function(value) { this.outerNode.chOff = value; }; HTMLTableSectionElementWrapper.prototype.getRows = function() { return new HTMLCollectionWrapper(this.outerNode.rows); }; HTMLTableSectionElementWrapper.prototype.getVAlign = function() { return this.outerNode.vAlign; }; HTMLTableSectionElementWrapper.prototype.setVAlign = function(value) { this.outerNode.vAlign = value; }; HTMLTableSectionElementWrapper.prototype.deleteRow = function(index) { return this.outerNode.deleteRow(index); }; HTMLTableSectionElementWrapper.prototype.insertRow = function(index) { return application.wrapHTMLNode(this.outerNode.insertRow(index)); }; function HTMLTextAreaElementWrapper(node) { this.init(node, 'HTMLTextAreaElementWrapper', node.tagName); }; HTMLTextAreaElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['textarea'] = HTMLTextAreaElementWrapper; HTMLTextAreaElementWrapper.prototype.getDefaultValue = function() { return this.outerNode.defaultValue; }; HTMLTextAreaElementWrapper.prototype.setDefaultValue = function(value) { this.outerNode.defaultValue = value; }; HTMLTextAreaElementWrapper.prototype.getForm = function() { return application.wrapHTMLNode(this.outerNode.form); }; 
HTMLTextAreaElementWrapper.prototype.getAccessKey = function() { return this.outerNode.accessKey; }; HTMLTextAreaElementWrapper.prototype.setAccessKey = function(value) { this.outerNode.accessKey = value; }; HTMLTextAreaElementWrapper.prototype.getCols = function() { return this.outerNode.cols; }; HTMLTextAreaElementWrapper.prototype.setCols = function(value) { this.outerNode.cols = value; }; HTMLTextAreaElementWrapper.prototype.getDisabled = function() { return this.outerNode.disabled; }; HTMLTextAreaElementWrapper.prototype.setDisabled = function(value) { this.outerNode.disabled = value; }; HTMLTextAreaElementWrapper.prototype.getName = function() { return this.outerNode.name; }; HTMLTextAreaElementWrapper.prototype.setName = function(value) { this.outerNode.name = value; }; HTMLTextAreaElementWrapper.prototype.getReadOnly = function() { return this.outerNode.readOnly; }; HTMLTextAreaElementWrapper.prototype.setReadOnly = function(value) { this.outerNode.readOnly = value; }; HTMLTextAreaElementWrapper.prototype.getRows = function() { return this.outerNode.rows; }; 
HTMLTextAreaElementWrapper.prototype.setRows = function(value) { this.outerNode.rows = value; }; HTMLTextAreaElementWrapper.prototype.getTabIndex = function() { return this.outerNode.tabIndex; }; HTMLTextAreaElementWrapper.prototype.setTabIndex = function(value) { this.outerNode.tabIndex = value; }; HTMLTextAreaElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLTextAreaElementWrapper.prototype.getValue = function() { return this.outerNode.value; }; HTMLTextAreaElementWrapper.prototype.setValue = function(value) { this.outerNode.value = value; }; HTMLTextAreaElementWrapper.prototype.blur = function() { return this.outerNode.blur(); }; HTMLTextAreaElementWrapper.prototype.focus = function() { return this.outerNode.focus(); }; HTMLTextAreaElementWrapper.prototype.select = function() { return this.outerNode.select(); }; function HTMLTitleElementWrapper(node) { this.init(node, 'HTMLTitleElementWrapper', node.tagName); }; HTMLTitleElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['title'] = HTMLTitleElementWrapper; HTMLTitleElementWrapper.prototype.getText = function() { return this.outerNode.text; }; HTMLTitleElementWrapper.prototype.setText = function(value) { this.outerNode.text = value; }; function HTMLUListElementWrapper(node) { this.init(node, 'HTMLUListElementWrapper', node.tagName); }; HTMLUListElementWrapper.prototype = new HTMLElementWrapper(); HTMLElementWrapper.classes['ulist'] = HTMLUListElementWrapper; HTMLUListElementWrapper.prototype.getCompact = function() { return this.outerNode.compact; }; HTMLUListElementWrapper.prototype.setCompact = function(value) { this.outerNode.compact = value; }; HTMLUListElementWrapper.prototype.getType = function() { return this.outerNode.type; }; HTMLUListElementWrapper.prototype.setType = function(value) { this.outerNode.type = value; }; 



/************************************** INPUT *******************************/

function JRapid_Input(outerNode) {
	this.init(outerNode, 'com.htmli.forms.Input', 'Input');
}

JRapid_Input.prototype = new HTMLiElement();

JRapid_Input.prototype.getSrc = function() { return this.getAttribute('src'); };
JRapid_Input.prototype.setSrc = function(src) { this.setAttribute('src', src);	};		
JRapid_Input.prototype.getSelect = function() { return this.getAttribute('select');};
JRapid_Input.prototype.setSelect = function(select) { this.setAttribute('select', select);	};		
JRapid_Input.prototype.getSelectFunc = function() { return this.getAttribute('selectfunc'); };
JRapid_Input.prototype.setSelectFunc = function(selectFunc) { this.setAttribute('selectfunc', selectFunc);	};		
JRapid_Input.prototype.getSelectExpr = function() { return this.getAttribute('selectexpr'); };
JRapid_Input.prototype.setSelectExpr = function(selectExpr) { this.setAttribute('selectexpr', selectExpr);	};		
JRapid_Input.prototype.getType = function() { return this.getAttribute('type'); };
JRapid_Input.prototype.getDisabled = function() { return this.outerNode.disabled; };
JRapid_Input.prototype.setDisabled = function(disabled) { this.outerNode.disabled = disabled; };		
JRapid_Input.prototype.getChecked = function() { return this.outerNode.checked; };
JRapid_Input.prototype.setChecked = function(checked) { me.outerNode.checked = checked; };		
JRapid_Input.prototype.getValue = function() { return this.outerNode.value; };
JRapid_Input.prototype.setValue = function(value) { this.outerNode.value = value; };		
JRapid_Input.prototype.getReadonly = function() { return this.getAttribute('readonly'); };
JRapid_Input.prototype.sync = function(select) {
		var me = this;
		
		var xml = me.getContainer().getElementById(me.getSrc());
		if (!xml) {
			return;
		}
		var xmlDoc = xml.getXmlDocument();
		var node;
		var info;
		var path;
		
		/* select node to sync */
		if (select) {
			info = path = select;
		} else if (me.getSelectFunc()) {
			try {
				path = eval(me.getSelectFunc());
			} catch (e) { 
				throw application.logError(302, 'Cannot set value.', '"selectfunc" expression failed to evaluate: ' + me.getSelectFunc() + '.'); 
			}
			info = path + ';' + me.getSelectFunc();
		} else if (me.getSelectExpr()) {
			try {
				path = eval(me.getSelectExpr() + ';');
			} catch (e) {
				throw application.logError(303, 'Cannot set value.', '"selectexpr" expression failed to evaluate: ' + me.getSelectExpr() + '.');
			}
			info = path + ';' + me.getSelectExpr();
		} else {
			info = path = me.getSelect();
		}
		node = xmlDoc.selectSingleNode(path);
			
		/* if node is null, check if it's an attribute and create it */
		if (node == null && path.indexOf('/@') != -1) {
			var parent = path.substring(0, path.lastIndexOf('/@'));
			node = xmlDoc.selectSingleNode(parent);
			if (node == null) {
				throw application.logError(304, 'Cannot set value.', 'Invalid attribute xpath: ' + info + '. Parent node (' + parent + ') is null.');
			}
			node.setAttribute(path.substring(path.lastIndexOf('/@')+2),0);
			node = xmlDoc.selectSingleNode(path);
		}
		
		/* if node doesn't exists, throw error */
		if (!node) {
			throw application.logError(301, 'Cannot set value', 'Invalid xpath: ' + info + '.');
		}
		
		/* get new value */
		var value = me.outerNode.type == 'checkbox' ? (me.outerNode.checked ? 'true':'false') : me.getValue();
		
		/* set new value */
		try {
			if (node.childNodes.length > 0) {
				node.replaceChild(xmlDoc.createTextNode(value), node.childNodes[0]);
			} else {
				node.appendChild(xmlDoc.createTextNode(value));
			}
		} catch(e) {				
			/* set as attr if it fails (needed in firefox) */
			if (path.indexOf('/@') != -1) {
				var parent = path.substring(0, path.lastIndexOf('/@'));
				node = xmlDoc.selectSingleNode(parent);
				var attrName = path.substring(path.lastIndexOf('/@')+2);
				node.setAttribute(attrName, value);
			}
		}
		/* save xml */
		xml.setXml(xmlDoc.xml);
	};				
JRapid_Input.prototype.focus = function() { this.outerNode.focus(); };

/************************************** SELECT *******************************/

function JRapid_Select(outerNode) {
	this.init(outerNode, 'com.htmli.forms.Select', 'Select');
}

JRapid_Select.prototype = new HTMLiElement();

JRapid_Select.prototype.getSrc = function() { return this.getAttribute('src');};
JRapid_Select.prototype.setSrc = function(src) {this.setAttribute('src', src);	};		
JRapid_Select.prototype.getSelect = function() { return this.getAttribute('select'); };
JRapid_Select.prototype.setSelect = function(select) { this.setAttribute('select', select); };		
JRapid_Select.prototype.getSelectExpr = function() { return this.getAttribute('selectexpr'); };
JRapid_Select.prototype.setSelectExpr = function(selectExpr) { this.setAttribute('selectexpr', selectExpr); };		
JRapid_Select.prototype.getValue = function() { return this.outerNode.value; };
JRapid_Select.prototype.setValue = function(value) { this.outerNode.value = value; };		
JRapid_Select.prototype.getDisabled = function() { return this.outerNode.disabled; };
JRapid_Select.prototype.setDisabled = function(disabled) { this.outerNode.disabled = disabled };
JRapid_Select.prototype.getSelectedIndex = function() { return this.outerNode.selectedIndex; };
JRapid_Select.prototype.setSelectedIndex = function(selectedIndex) { this.outerNode.selectedIndex = selectedIndex; };		
JRapid_Select.prototype.getOptions = function() { return new NodeListWrapper(this.outerNode.options); };

JRapid_Select.prototype.sync = function(select,value) {
		var me = this;		
	
		var xml = me.getContainer().getElementById(me.getSrc());
		if (!xml) {
			return;
		}
		var xmlDoc = xml.getXmlDocument();
		var info;
		var sel;

		/* select node to sync */
		if (select) {
			info = sel = select.split(';');
		} else if (me.getSelectExpr()) {
			try {
				sel = eval(me.getSelectExpr()).split(';');
			} catch (e) {
				throw application.logError(305, 'Cannot set value', '"selectexpr" expression failed to evaluate: ' + me.getSelectExpr() + '.'); 
			}
			info = sel + ';' + me.getSelectExpr();				
		} else {
			sel = me.getSelect().split(';');					
			info = sel + ';' + me.getSelectExpr();
		}
		var node = xmlDoc.selectSingleNode(sel[0]);				
		
		/* if node doesn't exists, throw error */
		if (!node) {
			throw application.logError(306, 'Cannot set value', 'Invalid xpath: ' + info + '.');
		}
		
		/* get and set new value */
		if (value) {
			if (node.childNodes.length > 0) {
				node.childNodes[0].nodeValue = value;
			} else {
				node.appendChild(xmlDoc.createTextNode(value));
			}
		} else {
			if (node.nodeType == 2) {
				node.value = me.getValue();
			} else {
				if (node.childNodes.length > 0) {
					for (var i=node.childNodes.length-1; i >= 0; i--) {
						node.removeChild(node.childNodes[i]);
					}	
				} 
				node.appendChild(xmlDoc.createTextNode(me.getValue()));
			}
		}
		
		/* if display node must be updated too */
		if (sel.length >= 2) {
			try {
				node = xmlDoc.selectSingleNode(sel[1]);	
				if (node.childNodes.length > 0) {
					node.childNodes[0].nodeValue = me.outerNode.options[me.outerNode.selectedIndex].text;
				} else {
					node.appendChild(xmlDoc.createTextNode(me.outerNode.options[me.outerNode.selectedIndex].text));
				}
			} catch (e) {
				/* we assume it is not a fatal error */
			}
		}
		/* save updated xml */
		xml.setXml(xmlDoc.xml);
	};				

/************************************** TEXTAREA *******************************/
	
function JRapid_Textarea(outerNode) {
	this.init(outerNode, 'com.htmli.forms.Textarea', 'Textarea');
}

JRapid_Textarea.prototype = new HTMLiElement();
JRapid_Textarea.prototype.getSrc = function() { return this.getAttribute('src'); };
JRapid_Textarea.prototype.setSrc = function(src) { this.setAttribute('src', src); };		
JRapid_Textarea.prototype.getSelect = function() { return this.getAttribute('select'); };
JRapid_Textarea.prototype.setSelect = function(select) { this.setAttribute('select', select);};		
JRapid_Textarea.prototype.getSelectExpr = function() { return this.getAttribute('selectexpr'); };
JRapid_Textarea.prototype.setSelectExpr = function(selectExpr) { this.setAttribute('selectexpr', selectExpr); };		
JRapid_Textarea.prototype.getValue = function() { return this.outerNode.value; };
JRapid_Textarea.prototype.setValue = function(value) { this.outerNode.value = value; };		
JRapid_Textarea.prototype.getMaxLength = function() { return this.getAttribute('maxlength') == null ? 0 : this.getAttribute('maxlength'); };
JRapid_Textarea.prototype.setMaxLength = function(maxLength) { this.setAttribute('maxlength', maxLength); };		
JRapid_Textarea.prototype.sync = function(select) {
	var me = this;
	var xml = me.getContainer().getElementById(me.getSrc());
	if (!xml) {
		return;
	}
	var xmlDoc = xml.getXmlDocument();
	var node;
	var info;
	var path;
	
	/* select node to sync */
	if (select) {
		path = info = select;
	} else if (me.getSelectExpr()) {
		try {
			path = eval(me.getSelectExpr());
			info = path + ";" + me.getSelectExpr();
		} catch (e) {
			throw application.logError(307, 'Cannot set value', '"selectexpr" expression failed to evaluate: ' + me.getSelectExpr() + '.'); 
		}
	} else {
		path = info = me.getSelect();
	}
	node = xmlDoc.selectSingleNode(path);
	
	/* if node doesn't exists, throw error */
	if (!node) {
		throw application.logError(308, 'Cannot set value', 'Invalid xpath: ' + info + '.');
	}
	
	/* get and set new value */
	var value = me.getValue();
	while(node.childNodes.length > 0) {
		node.childNodes[0].parentNode.removeChild(node.childNodes[0]);
	}
	node.appendChild(xmlDoc.createTextNode(value));
	
	/* save updated xml */
	xml.setXml(xmlDoc.xml);
};				

JRapid_Textarea.checkMaxLength = function(current, max) {
	if (current.value.length > max) {
		current.value = current.value.substr(0,max); 
		return false;
	}	
	return true;
}

/************************************** ACCORDEON *******************************/

Application.prototype.showAccordeon = function(button) {
	var accordeon = button.parentNode.parentNode;
	for (var i=0, c = accordeon.children, n = c.length; i<n; i++) {
		///c[i].children[1].style.display = 'none';
		c[i].children[1].className = 'jrapid_accordeonitem_body_hidden';
	}	
	button.parentNode.children[1].className = 'jrapid_accordeonitem_body';
};

/************************************** SOURCE *******************************/

function JRapid_Source(outerNode) { this.init(outerNode, 'com.htmli.ui.Source', 'Source'); }
JRapid_Source.prototype = new HTMLiElement();
JRapid_Source.prototype.getUrl = function() {	return this.getAttribute('url'); };
JRapid_Source.prototype.setUrl = function(url) { this.setAttribute('url', url); };		
JRapid_Source.prototype.getAuto = function() { return this.getAttribute('auto');	};
JRapid_Source.prototype.setAuto = function(auto) { this.setAttribute('auto', auto); };		
JRapid_Source.prototype.isOpened = function() { return this.outerNode.innerHTML != ''; };				
JRapid_Source.prototype.open = function(handler) {
	var me = this;
	me.outerNode.style.display = '';
	me.container = new Container(me.outerNode);
	var connector = me.getUrl().indexOf('?') >= 0 ? '&' : '?';
	me.container.open(me.getUrl() + (JRapid_Source.cache ? '' : (connector + new Date().getTime())), 
		function() {
			application.dispatch('open', me);
			if (handler) handler();
		});				
};				
JRapid_Source.prototype.close = function() {
	this.outerNode.style.display = 'none';
	this.outerNode.innerHTML = '';
};				
JRapid_Source.prototype.getChildContainer = function() { return new Container(this.outerNode); };
JRapid_Source.cache = false;

/*************************************** WINDOW *******************************/

function JRapid_Window(outerNode) {
	this.init(outerNode, 'com.htmli.ui.Window', 'Window');
	
	try {
		var aux = outerNode.children[2].children[0].children[0].children[1].children[1].children[0];
		if (aux.getAttribute('htmliinner') != null) {
			this.innerNode = aux;
			return;
		}
	} catch (e) {}
	
	
	try {
		var aux = outerNode.children[2].children[0].children[0].children[1].children[1].children[0];
		if (aux.getAttribute('htmliinner') != null) {
			this.innerNode = aux;
			return;
		}
	} catch (e) {}	
	
}

JRapid_Window.prototype = new HTMLiElement();

JRapid_Window.prototype.getUrl = function() { return this.getAttribute('url'); };
JRapid_Window.prototype.setUrl = function(url) { this.setAttribute('url', url); };		
JRapid_Window.prototype.getIcon = function() { return this.getAttribute('icon'); };
JRapid_Window.prototype.setIcon = function(icon) { 
	var me = this;
	var __value = icon;
	me.outerNode.children[2].children[0].children[0].children[0].children[1].children[0].src = icon;
	this.setAttribute('icon', __value);	
};
JRapid_Window.prototype.getCaption = function() { return this.getAttribute('caption'); };
JRapid_Window.prototype.setCaption = function(caption) {
	var me = this;
	var __value = caption;
	me.outerNode.children[2].children[0].children[0].children[0].children[1].children[1].innerHTML = caption;
	this.setAttribute('caption', __value);	
};		

JRapid_Window.prototype.getResizeMode = function() { return this.getAttribute('resizemode'); };
JRapid_Window.prototype.setResizeMode = function(resizeMode) { this.setAttribute('resizemode', resizeMode); };		
JRapid_Window.prototype.getDndMode = function() { return this.getAttribute('dndmode'); };
JRapid_Window.prototype.setDndMode = function(dndMode) { this.setAttribute('dndmode', dndMode); };		
JRapid_Window.prototype.getState = function() {
	var me = this;
	var __value = this.getAttribute('state');
	var state = __value;
	if (__value == null) { __value = 'normal'; }
	return __value;
};
JRapid_Window.prototype.setState = function(state) { this.setAttribute('state', state); };		;
JRapid_Window.prototype.getHelpButton = function() { return this.getAttribute('helpbutton'); };
JRapid_Window.prototype.getNotResizable = function() {
	var value = this.getAttribute('notresizable');
	return (value == 'false' || value == 'no' || value == null || !value) ? false : true;
};
	
JRapid_Window.prototype.setNotResizable = function(notResizable) { this.setAttribute('notresizable', notResizable ? 'true' : 'false'); };		
JRapid_Window.prototype.getNotDraggable = function() {
	var value = this.getAttribute('notdraggable');
	return (value == 'false' || value == 'no' || value == null || !value) ? false : true;
};
JRapid_Window.prototype.setNotDraggable = function(notDraggable) { this.setAttribute('notdraggable', notDraggable ? 'true' : 'false'); };		
JRapid_Window.prototype.getRememberSize = function() {
	var value = this.getAttribute('remembersize');
	return (value == 'false' || value == 'no' || value == null || !value) ? false : true;
};
JRapid_Window.prototype.setRememberSize = function(rememberSize) { this.setAttribute('remembersize', rememberSize ? 'true' : 'false'); };		
JRapid_Window.prototype.getContentHeight = function() {
	var me = this;
	var __value = this.getAttribute('');
	var contentHeight = __value;
	var table = application.wrapNode(me.outerNode.children[2].children[0]); return table.getHeight();
	return __value;
};
JRapid_Window.prototype.getContentWidth = function() {
	var me = this;
	var __value = this.getAttribute('');
	var contentWidth = __value;
	var table = application.wrapNode(me.outerNode.children[2].children[0]); return table.getWidth();
	return __value;
};
	
JRapid_Window.prototype.getPreviousWidth = function() {
	return parseInt(this.outerNode.previousWidth);
};
	
JRapid_Window.prototype.getPreviousHeight = function() {
	return parseInt(this.outerNode.previousHeight);
};
	
JRapid_Window.hideAll = function() {
	for (var i=0, length = JRapid_Window.active.length; i<length; i++) {
		JRapid_Window.active[i].outerNode.style.display = 'none';
	}
};			
	
JRapid_Window.showAll = function() {
	var length = JRapid_Window.active.length;
	for (var i=0; i<length; i++) {
		JRapid_Window.active[i].outerNode.style.display = 'block';
	}
};		

JRapid_Window.prototype.moveTo = function(top,left) {
	var style = this.outerNode.style;
	style.top = top + 'px';
	style.left = left + 'px';			
};				
JRapid_Window.prototype.isOpened = function() { return this.outerNode.style.display == 'block'; };				
JRapid_Window.prototype.open = function(handler) {
		var me = this;
		
	
		if (me.isOpened()) {
			me.top();
			return;
		}
		me.outerNode.style.display = 'block';
		
		me.getCookies();					
		var table = application.wrapNode(me.outerNode.children[2].children[0]);
		//If cookies set width and height, use them. Otherwise, use user's style. Otherwise, use contents size. Otherwise, use minimized size.
		var width = me.outerNode.width? me.outerNode.width : me.outerNode.style.width? me.outerNode.style.width: table.getWidth()? table.getWidth()+ 'px' :  JRapid_Window.MINIMIZED_WIDTH;
		var height = me.outerNode.height? me.outerNode.height : me.outerNode.style.height? me.outerNode.style.height : table.getHeight()? table.getHeight() + 'px' : JRapid_Window.MINIMIZED_HEIGHT;
		
		
		var buttons = me.outerNode.children[2].children[0].children[0].children[0].children[2].children[0];
		me.outerNode.closeButton = buttons.children[0];
		//me.outerNode.maxButton = buttons.children[1];
		//me.outerNode.restoreButton = buttons.children[2];
		//me.outerNode.minButton = buttons.children[3];
		me.outerNode.helpButton = buttons.children[1];				
		
		me.push();
		me.top();				
		
		if (me.getUrl()) {
			var childContainer = new Container(me.innerNode);
			childContainer.open(me.getUrl() + '?' + new Date().getTime(), handler);
		}
		
		if (!me.outerNode.style.top && !me.outerNode.style.left) {
			me.outerNode.style.top = JRapid_Window.getNextTop(height) - me.getContainingBlock().getRelativeY() + "px";
			me.outerNode.style.left = JRapid_Window.getNextLeft(width) - me.getContainingBlock().getRelativeX()  + "px";					
		}
		
		if (JRapid_Window.alwaysCentered) {				
			me.center();
		}
		if (JRapid_Window.alwaysExclusive) {
			me.showOverlay();				
			me.setNotDraggable(true);
		}
		
		me.setState('normal');
	
	
	};				
JRapid_Window.prototype.openExclusive = function(handler) { this.open(); this.center(); this.showOverlay(); this.setNotDraggable(true); };				
JRapid_Window.prototype.openCentered = function(handler) { this.center(); this.open(handler);	};				
JRapid_Window.prototype.close = function() {
		var me = this;
		
		me.outerNode.style.display = 'none';
		JRapid_Window.remove(me);
		JRapid_Window.refreshActive(true);
		application.dispatch('closewindow', me, null);
		if (me.getUrl()) {
			me.outerNode.parentNode.removeChild(me.outerNode);
		}
		//me.dispatchClose();
		JRapid_Window.nextTop = 30;
		JRapid_Window.nextLeft = 30;
};				
JRapid_Window.prototype.getChildContainer = function() { return new Container(this.innerNode); };				
JRapid_Window.prototype.top = function(ev) {
		var me = this;
	
		//if (!ev /*|| !ev.isDefaultPrevented()*/) {
		
			me.outerNode.style.zIndex = application.nextZIndex++;
			JRapid_Window.remove(me);
			JRapid_Window.active.push(me);
			JRapid_Window.refreshActive();
		//}
};	

JRapid_Window.resizingTable = null;
JRapid_Window.resizingAxis = null;
JRapid_Window.resizingBase = null;

JRapid_Window.dndTarget = null;
JRapid_Window.dndCoords = null;

JRapid_Window.minimized = null;
JRapid_Window.maximized = null;

JRapid_Window.nextTop = 30;
JRapid_Window.nextLeft = 30;	
JRapid_Window.xAdd = true;
JRapid_Window.yAdd = true;		

JRapid_Window.active = new Array();		
JRapid_Window.MINIMIZED_HEIGHT = '34px';
JRapid_Window.MINIMIZED_WIDTH = '200px';		

JRapid_Window.prototype.click = function(obj, ev) {		
	this.showMenu(ev);
	ev.stopPropagation();
};

JRapid_Window.prototype.searchFirstBlank = function() {
	var length=JRapid_Window.minimized.length;
	for (var i = 0; i<length; i++) {
		if (JRapid_Window.minimized[i]==null) {
			return i;
		}
	}
	return -1;
};



/**
 * Private function called when drag and drop begins
 */
JRapid_Window.prototype.startDnd = function(x, y) {		
	if (this.getState().indexOf('maximized') < 0  && this.getState().indexOf('minimized') < 0 && (!this.getNotDraggable())) {
		JRapid_Window.dndTarget = this;
		JRapid_Window.dndCoords = [x, y];		

		var style =  JRapid_Window.dndTarget.outerNode.style;
		if (!style.top && !style.left) {
			style.top =  JRapid_Window.dndTarget.getRelativeY() + "px";
			style.left =  JRapid_Window.dndTarget.getRelativeX() + "px";					
		}

		if (!this.getDndMode() || this.getDndMode().indexOf('outline')>=0) {
			style =  JRapid_Window.dndTarget.outerNode.children[1].style;
			if (!style.top && !style.left) {
				style.top =  "0px";
				style.left =  "0px";					
			}
		}
	}
};

/**
 * Private function called when resize begins
 */
JRapid_Window.prototype.startResize = function(horizontal, vertical) {		
	if (this.getState().indexOf('maximized') < 0  && this.getState().indexOf('minimized') < 0 
		&& (this.getNotResizable()!=null && !this.getNotResizable()) ) {
		JRapid_Window.resizingTable = this;
/*				JRapid_Window.resizingBase = [this.getRelativeX(), this.getRelativeY()];*/
		JRapid_Window.resizingBase = [this.getX(), this.getY()];
		JRapid_Window.resizingAxis = [horizontal, vertical];
	}
};


//Called when mouseup occurs
JRapid_Window.prototype.resizeTo = function( width, height, changeDashed, ignoreRememberSize, ignoreDispatch ) {
	
	// DOM structure of the JRapid Window:	 
	//  			   /div.jr_window /div        /table      
	var jrWindowTable = this.outerNode.children[2].children[0];
	
	//                 /table        /tbody      /TR[1]      /td.jr_win_inner
	var jrWindowInner = jrWindowTable.children[0].children[1].children[1];
	
	// parseInt( "80px" ) => 80   (to avoid problems when calling .resizeTo( "700px", "80px" );
	jrWindowInner.style.height = parseInt( height ) + 'px';
	
	// the jrWindowInner TD has a DIV inside of it (holding a div holding the IFRAME)
	var s = jrWindowInner.children[0].style;
	if (s.overflowY == 'scroll' || s.overflowY == 'auto') { 
		s.height = parseInt( height ) + 'px';
	}
	
	return;
	
	// TODO: the code below is never executed; re-implement it or delete it.
	/*
	var last = this.outerNode.children[this.outerNode.children.length-1];
	last.style.display = 'none';
	
	this.resizeToW(width, changeDashed);
	this.resizeToH(height, changeDashed);

	if (!ignoreRememberSize && this.getRememberSize()) {
		var id = this.outerNode.id;
		var date = new Date();
		date.setTime(new Date().getTime()+(365*24*60*60*1000));
	    var expires = 'expires=' + date.toGMTString() + ';';
	    document.cookie = id + '_SZ='+ width + '*' + height +'; '+ expires;	
	}
	last.style.display = '';
	*/						
};


JRapid_Window.prototype.getCookies = function() {		
	if (this.getRememberSize()) {
		var cookies = document.cookie.split(';');
		var id = this.outerNode.id;
		var width, height;
		for (var i=0; i < cookies.length; i++) {
			var c = cookies[i];
			while (c.charAt(0)==' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(id + '_SZ=') == 0) {
				width = c.substring(id.length+4, c.indexOf('px'));
				height= c.substring(c.indexOf('px')+3, c.length-2);						
			}
		}
		this.outerNode.width = parseInt(width);
		this.outerNode.height = parseInt(height);
	}
};

JRapid_Window.prototype.resizeToW = function(width, changeDashed) {	
	var w = parseInt(width) + (2*15);
	if (parseInt(width) < (this.getButtonBarWidth()+ 10)) {
		width = (this.getButtonBarWidth() + 10) + "px";
		this.outerNode.children[1].style.width = width; /* Also correct the drawing div*/
	}
	this.outerNode.previousWidth = this.getWidth();
	this.outerNode.style.width = w + 'px';	/* outer div */
	this.outerNode.children[2].style.width = w + 'px'; /* source container */
	this.outerNode.children[2].children[0].style.width = w + 'px'; /* source container */

	if (changeDashed) {
		this.outerNode.children[0].style.width = (w - 12) + 'px';
		this.outerNode.children[0].style.margin = '10px';
	}
	var style = this.innerNode.style;
	style.width = (w - 30) + 'px';	
};

JRapid_Window.prototype.resizeToH = function(height, changeDashed) {	
	var h = parseInt(height);
	this.outerNode.previousHeight = this.getHeight();

	if (parseInt(height) < 35) { height = "35px"; }
	
	//this.outerNode.style.height = height; /* outerNode */
	///this.outerNode.children[2].style.height = height; /* Div that contains and restricts the size of the table */
	this.outerNode.children[2].children[0].children[0].children[1].children[1].style.height = (h) + 'px';
	var s = this.outerNode.children[2].children[0].children[0].children[1].children[1].children[0].style;
	if (s.overflowY == 'scroll' || s.overflowY == 'auto') { 
		s.height = h + 'px';
	}

	if (changeDashed) {
		this.outerNode.children[0].style.height = (h + 52) + 'px'; /* Dashed div used to resize and dnd */
	}
};

JRapid_Window.prototype.onTitleDown = function(obj, ev) {
	var target = ev.explicitOriginalTarget ? 
			ev.explicitOriginalTarget: 
			ev.srcElement; //this should work on IE
	
	// if dnd event was originated by an element with class *button*, ignore it
	if (!target.className || target.className.indexOf( "button" ) < 0) {
		if (this.getState().indexOf('minimized') < 0) {
			this.startDnd(ev.clientX, ev.clientY); 
		}
	}
		 
	return false;			
};



JRapid_Window.prototype.onHelpClick = function(obj, ev) {
	application.dispatch('helpclick', obj);
	return false;
};

JRapid_Window.prototype.getButtonBarWidth = function() {
	var closeWidth = (this.getNoCloseButton())? 0: 23;
	var maxWidth = (this.getNoMaxButton())? 0: 23;
	var minWidth = (this.getNoMinButton())? 0: 23;
	var helpWidth = (this.getHelpButton())? 23: 0;	
	return (closeWidth + maxWidth + minWidth + helpWidth + 5);
};


JRapid_Window.remove = function(obj) {
	if (JRapid_Window.active.length>0) {
		var active = JRapid_Window.active;
		var length = active.length;
		for (var i=length-1; i>=0; i--) {
			var window = active[i];
			if (window.outerNode.id == obj.outerNode.id) {
				active.splice(i,1);
				return window;
			}
		}
	}
	return null;
};

JRapid_Window.prototype.push = function() {
	var active = JRapid_Window.active;
	var length = active.length;
	for (var i=length-1; i>=0; i--) {
		var window = active[i];
		if (!window.getContainer()) {
			active.splice(i,1);
		}
		if (window.outerNode.id  == this.outerNode.id ) {
			return;
		}
	}
	JRapid_Window.active.push(this);
};


JRapid_Window.shiftTop = function() {
	if (JRapid_Window.active.length>0) {
		var top = JRapid_Window.active.pop();
		JRapid_Window.active.splice(0,0,top);
	}
};

JRapid_Window.shiftBottom = function() {
	if (JRapid_Window.active.length>0) {
		var last = JRapid_Window.active[0];
		JRapid_Window.active.splice(0,1);
		JRapid_Window.active.splice(JRapid_Window.active.length,JRapid_Window.active.length,last);
	}
};

JRapid_Window.top = function() {
	if (JRapid_Window.active.length>0) {
		var top = JRapid_Window.active.pop();
		JRapid_Window.active.push(top);
		return top;
	}
};

JRapid_Window.bottom = function() {
	if (JRapid_Window.active.length>0) {
		var last = JRapid_Window.active[0];
		return last;
	}
};

JRapid_Window.refreshActive = function(onlyActivate) {
	if (JRapid_Window.active.length>0) {
		var act = JRapid_Window.active.pop();
		if (!onlyActivate && JRapid_Window.active.length>0) {
			var deact = JRapid_Window.active.pop();
			if (deact) {
				deact.deactivate();	
				JRapid_Window.active.push(deact);
			}
		}
		
		if (act) {
			act.activate();
			JRapid_Window.active.push(act);
		}
	}
};

JRapid_Window.prototype.deactivate = function() {
	if (this.getState().indexOf('minimized') < 0 ) {
		if (this.outerNode.children[0]) {
			this.outerNode.children[0].style.display = '';
			this.outerNode.children[0].style.height = '30px';
			this.outerNode.children[0].className = 'jrapid_window__faded';
		}
	}
	
};

JRapid_Window.prototype.activate = function() {
	if (this.outerNode.children[0]) {
		this.outerNode.children[0].style.height = this.outerNode.style.height;					
		this.outerNode.children[0].style.display = 'none';
		this.outerNode.children[0].className = 'jrapid_window__dashed';
	}
};

JRapid_Window.getMaxHeight = function() {
	if (document.all) {
		return application.getDocumentElement().getHeight()-4;
	} else {
		return application.getDocumentElement().getHeight();
	}
	
};

JRapid_Window.getMaxWidth = function() {
	if (document.all) {
		return application.getDocumentElement().getWidth()-22;
	} else {
		return application.getDocumentElement().getWidth();
	}
};


JRapid_Window.getNextTop = function(windowHeight) {

	var maxHeight = JRapid_Window.getMaxHeight();
	
	if (JRapid_Window.yAdd) {
		JRapid_Window.nextTop+=30;
	} else {
		JRapid_Window.nextTop-=30;
	}
	
	if (JRapid_Window.yAdd && JRapid_Window.nextTop+parseInt(windowHeight) >= maxHeight) {
		JRapid_Window.yAdd = false;
		JRapid_Window.nextTop -= 60;
		/*if still out of bounds*/
		if (JRapid_Window.nextTop+parseInt(windowHeight) >= maxHeight) {
			JRapid_Window.nextTop = 30;					
		}

	} else if (JRapid_Window.nextTop<30) {
		JRapid_Window.nextTop = 60;
		JRapid_Window.yAdd = true;				
	} 
	return JRapid_Window.nextTop;
};

JRapid_Window.getNextLeft = function(windowWidth) {
	var maxWidth = JRapid_Window.getMaxWidth();
	
	if (JRapid_Window.xAdd) {
		JRapid_Window.nextLeft+=30;
	} else {		
		JRapid_Window.nextLeft-=30;
	}
	if (JRapid_Window.xAdd && JRapid_Window.nextLeft+parseInt(windowWidth) >= maxWidth) {
		JRapid_Window.xAdd = false;
		JRapid_Window.nextLeft -= 60;
		/*if still out of bounds*/
		if (JRapid_Window.nextLeft+parseInt(windowWidth) >= maxWidth) {
			JRapid_Window.nextLeft = 30;					
		}
	} else if (JRapid_Window.nextLeft<30) {
		JRapid_Window.nextLeft = 60;
		JRapid_Window.xAdd = true;
	}
	return JRapid_Window.nextLeft;
};

/**
 * Called when mousemove occurs
 */
window.addEventListener('mousemove', function(ev) {

	if (JRapid_Window.resizingTable != null) {
		var obj = JRapid_Window.resizingTable;
		var div = obj.outerNode.children[0];
		var axis = JRapid_Window.resizingAxis;
		var base = JRapid_Window.resizingBase;
		
		var x = ev.clientX - 10;
		var y = ev.clientY - 10;
		
		if (!obj.getResizeMode() || obj.getResizeMode().indexOf('outline')>=0) {
			div.style.display = '';
		}
		
		if (axis[0] && (x - base[0]) > 0) {
			var newWidth = (x - base[0]) + "px";
			div.style.width = newWidth;
			if (obj.getResizeMode() && obj.getResizeMode().indexOf('real')>=0) {
				obj.resizeToW(newWidth);
			}
		}
		if (axis[1] && (y - base[1]) > 0) {
			var newHeight = (y - base[1]) + "px";
			div.style.height = newHeight;
			if (obj.getResizeMode() && obj.getResizeMode().indexOf('real')>=0) {
				obj.resizeToH(newHeight);
			}
		
		}
	} else if (JRapid_Window.dndTarget != null) {
	
		var obj = JRapid_Window.dndTarget;
		var div = obj.outerNode.children[0];

		var x = ev.clientX;
		var y = ev.clientY;
		
		var diff = [x - JRapid_Window.dndCoords[0], y - JRapid_Window.dndCoords[1]];

		if (!obj.getDndMode() || obj.getDndMode().indexOf('outline')>=0) {
			div.style.display = '';
			var style =  div.style;
			style.top = (isNaN(parseInt(style.top)) ? 0 : parseInt(style.top) + diff[1]) + "px";						
			style.left = (isNaN(parseInt(style.left)) ? 0 : parseInt(style.left) + diff[0]) + "px";	
			style.width = obj.getWidth() + 'px';
			style.height = obj.getHeight() + 'px';
		} else {
			var style = obj.outerNode.style;
			if ( (parseInt(style.top) + diff[1]) < 0) {
				style.top = "0px";
			} else {
				style.top = (parseInt(style.top) + diff[1]) + "px";						
			}
			if ( (parseInt(style.left) + diff[0]) < 0) {
				style.left = "0px";			
			} else {
				style.left = (parseInt(style.left) + diff[0]) + "px";			
			}							
		}

		JRapid_Window.dndCoords = [x, y];
	}
}, false);

JRapid_Window.prototype.showOverlay = function() {
	var me = this;			
	var height;
	if (navigator.userAgent.toLowerCase().indexOf('msie') > -1) {
		height = document.body.clientHeight;
	} else {
		height = JRapid_Window.getMaxHeight() + "px";
	}
	
	var width = JRapid_Window.getMaxWidth() + "px";
	var top = me.getY();
	var left = me.getX();				
	var style = me.outerNode.children[1].style;
	style.height = height;				
	style.width = width;
	style.display = '';
	style.top = (-top) + "px";
	style.left = (-left) + "px";				

}
	
window.addEventListener('mouseup', function() {
		if (JRapid_Window.resizingTable != null) {
			var drawingDiv = JRapid_Window.resizingTable.outerNode.children[0];
			var width = drawingDiv.style.width;
			if (JRapid_Window.resizingAxis[1]) {
				var height = drawingDiv.style.height;
				JRapid_Window.resizingTable.resizeTo(0, parseInt(height)-52-20);
			}
			if (JRapid_Window.resizingAxis[0]) {
				var w = parseInt(width)-15;
				JRapid_Window.resizingTable.outerNode.style.width = w + 'px';	/* outer div */
				JRapid_Window.resizingTable.outerNode.children[2].style.width = w + 'px'; /* source container */
				JRapid_Window.resizingTable.outerNode.children[2].children[0].style.width = w + 'px'; /* source container */
			}
			drawingDiv.style.display='none'; 
			application.dispatch('resizewindow', JRapid_Window.resizingTable);	
			
		}	
		else if (JRapid_Window.dndTarget != null) {
			var obj = JRapid_Window.dndTarget;
			
			if (!obj.getDndMode() || obj.getDndMode().indexOf('outline')>=0) {
				var drawingDiv = obj.outerNode.children[0];
				var diff = [parseInt(drawingDiv.style.left), parseInt(drawingDiv.style.top)];					
				var style = obj.outerNode.style;
				if ( (parseInt(style.top) + diff[1]) < 0) {
					style.top = "0px";
				} else {
					style.top = (parseInt(style.top) + diff[1]) + "px";						
				}
				if ( (parseInt(style.left) + diff[0]) < 0) {
					style.left = "0px";			
				} else {
					style.left = (parseInt(style.left) + diff[0]) + "px";			
				}
				drawingDiv.style.top = "0px";				
				drawingDiv.style.left = "0px";										
				drawingDiv.style.display='none'; 
			} 
		}
		
		JRapid_Window.resizingTable = null;	
		JRapid_Window.dndTarget = null;			
	}, false);
	
window.addEventListener('keyup', function(ev) {	

	if (ev.keyCode==37 && ev.ctrlKey && ev.altKey) {
		/*Activates the previous window*/
		JRapid_Window.shiftTop();
		if (JRapid_Window.bottom()) {
			JRapid_Window.bottom().deactivate();
		}
		JRapid_Window.refreshActive(true);
		if (JRapid_Window.top()) {
			JRapid_Window.top().top();
		}
	} else if (ev.keyCode==39 && ev.ctrlKey && ev.altKey) {
		/*Activates the next window*/
		JRapid_Window.shiftBottom();
		JRapid_Window.refreshActive();
		if (JRapid_Window.top()) {
			JRapid_Window.top().top();
		}
	} else if (ev.keyCode==68 && ev.ctrlKey && ev.altKey) {
		/*Hides all windows*/
		JRapid_Window.hideAll();
	} else if (ev.keyCode==87 && ev.ctrlKey && ev.altKey) {
		/*Show all windows*/
		JRapid_Window.showAll();
	}
	
	application.stopPropagation(ev);
	application.preventDefault(ev);	
}, false);
	
/***************************************** XML ********************************/

function JRapid_Xml(outerNode) { this.init(outerNode, 'com.htmli.xml.Xml', 'Xml'); }

JRapid_Xml.prototype = new HTMLiElement();
JRapid_Xml.prototype.getUrl = function() { return this.getAttribute('url');	};
JRapid_Xml.prototype.setUrl = function(url) { this.setAttribute('url', url);	};		
JRapid_Xml.prototype.getCache = function() {
	var value = this.getAttribute('cache');
	return (value == 'false' || value == 'no' || value == null || !value) ? false : true;
};	
JRapid_Xml.prototype.setCache = function(cache) { this.setAttribute('cache', cache ? 'true' : 'false'); };		
JRapid_Xml.prototype.getXmlDocument = function() {
	return XmlDocument.create(this.outerNode.value);	
};				
JRapid_Xml.prototype.post = function(handler) {
	var me = this;
	var httpRequest = HttpRequest.create();
	me.outerNode.httpRequest = httpRequest;
	httpRequest.open("POST", me.getUrl(), true);
	httpRequest.onreadystatechange = function() {			
		if (httpRequest.readyState == 4) {
			if (handler) {
				///var x = XmlDocument.create();
				//x.loadXML(httpRequest.responseText);
				handler(httpRequest.responseXML, httpRequest.status);
			}				
		}
	};
	var xmlDoc = XmlDocument.create(me.outerNode.value.replace('<?xml version="1.0"?>', '<?xml version="1.0" encoding="utf-8" ?>'));
	httpRequest.setRequestHeader("Content-Type", "application/xml;charset=UTF-8");
	httpRequest.send(xmlDoc);					
};				
JRapid_Xml.prototype.get = function(handler,param) {
	var me = this;
	var httpRequest = HttpRequest.create();
	var url = me.getCache() ? (me.getUrl() + '?' + JRapid_Xml.cacheHash) : (me.getUrl() + '?' + new Date().getTime());
	httpRequest.open("GET", url, true);
	httpRequest.onreadystatechange = function() {			
		if (httpRequest.readyState == 4) {
			me.outerNode.value = httpRequest.responseText;	
			if (handler) {
				handler(param, httpRequest.responseXML, httpRequest.status);
			}	
			//me.dispatchChange();
			application.dispatch('change', me, 'HTMLEvents');		
		}
	};
	httpRequest.send("");	
};	

JRapid_Xml.prototype.abort = function() {
	if (this.outerNode.httpRequest) {
		this.outerNode.httpRequest.onreadystatechange = function() {};
		this.outerNode.httpRequest.abort();
	}
};				
JRapid_Xml.prototype.setXml = function(xml) { this.outerNode.value = xml; application.dispatch('change', this, 'HTMLEvents'); };				
JRapid_Xml.prototype.append = function(node,xmlChild) {
	var me = this;
	var xml = me.getXmlDocument();
	xml.selectSingleNode(node).appendChild(xmlChild.getXmlDocument().documentElement);	
	me.setXml(xml.xml);
	application.dispatch('change', me, 'HTMLEvents');
};				
JRapid_Xml.prototype.replace = function(node,xmlChild) {
	var me = this;
	var xml = me.getXmlDocument();
	var node = xml.selectSingleNode(node);
	node.parentNode.appendChild(xmlChild.getXmlDocument().documentElement);	
	node.parentNode.removeChild(node);
	me.setXml(xml.xml);
	application.dispatch('change', me, 'HTMLEvents');				
};				
JRapid_Xml.prototype.remove = function(node) {
	var me = this;
	var xml = me.getXmlDocument();
	var node = xml.selectSingleNode(node);
	node.parentNode.removeChild(node);
	me.setXml(xml.xml);
	application.dispatch('change', me, 'HTMLEvents');
};				

JRapid_Xml.cacheHash = new Date().getTime();

window.addEventListener('keyup', function(ev) {
	if (ev.keyCode == 123) {
		JRapid_Xml.cacheHash = new Date().getTime();
		alert('Cache cleaned.');
	}				
}, true);


/********************************* XML MULTIPLE *******************************/

function JRapid_XmlMultiple(outerNode) { this.init(outerNode, 'com.htmli.xml.XmlMultiple', 'XmlMultiple'); }

JRapid_XmlMultiple.prototype = new HTMLiElement();
JRapid_XmlMultiple.prototype.getRoot = function() { return this.getAttribute('root'); };
JRapid_XmlMultiple.prototype.setRoot = function(root) { this.setAttribute('root', root);	};	

JRapid_XmlMultiple.prototype.getXmlDocument = function() {
	var me = this;
	var xmlDocument = XmlDocument.create();
	xmlDocument.loadXML('<' + me.getRoot() + '/>');
	var children = me.getChildren();
	for (var i=0; i < children.getLength(); i++) {
		var n = document.all ? children.item(i).getXmlDocument().documentElement : 
			xmlDocument.adoptNode(children.item(i).getXmlDocument().documentElement);
		xmlDocument.documentElement.appendChild(n);
	}
	return xmlDocument;
};

JRapid_XmlMultiple.prototype.get = function(handler,param) {
	var me = this;
	var children = me.getChildren();
	var count = children.getLength();
	var aux = count;
	var status = 200;	
	for (var i=0; i < count; i++) {	
		children.item(i).get(function(foo, xmlDoc, currentStatus) {
			status = currentStatus == 200 ? status : currentStatus;
			if(--aux <= 0) {
				if (handler) {
					handler(param, me.getXmlDocument(), status);
				}
			}
		});
	}				
};

/********************************* XML RPC SERVER *****************************/

function JRapid_XmlRpcServer(url) { 
	this.url = url;	
}

JRapid_XmlRpcServer.prototype.execute = function(service) {
	var args = '';
	for (var i=1; i < arguments.length ;i++) {
		args += ',arguments[' + i + ']';
	}
	var handler = function() {};
	eval('this.call(handler, this.url, false, service ' + args + ')');	
};		

JRapid_XmlRpcServer.prototype.executeAsync = function(service,handler) {
	var args = '';
	for (var i=2; i < arguments.length ;i++) {
		args += ',arguments[' + i + ']';
	}
	eval('this.call(handler, this.url, true, service ' + args + ')');	
};				

JRapid_XmlRpcServer.prototype.objectToXMLRPC = function(obj) {
	var wo = obj.valueOf();
	retstr = "<struct>";
	for (prop in obj) {
		if(typeof wo[prop] != "function") {
			retstr += "<member><name>" + prop + "</name><value>" + this.getXML(wo[prop]) + "</value></member>";
		}
	}
	retstr += "</struct>";
	return retstr;
};

JRapid_XmlRpcServer.prototype.stringToXMLRPC = function(obj) { return "<string><![CDATA[" + obj.replace(/\]\]/g, "]" + " ]") + "]" + "]></string>"; };
JRapid_XmlRpcServer.prototype.numberToXMLRPC = function(obj) {
	if (obj == parseInt(obj)) {
		return "<int>" + obj + "</int>";
	} else if (obj == parseFloat(obj)) {
		return "<double>" + obj + "</double>";
	} else {
		return this.booleanToXMLRPC(false);
	}
};

JRapid_XmlRpcServer.prototype.booleanToXMLRPC = function(obj) { return "<boolean>" + (obj ? "1" : "0") + "</boolean>"; };
JRapid_XmlRpcServer.prototype.dateToXMLRPC = function(obj) {
	return "<dateTime.iso8601>" + doYear(obj.getUTCFullYear()) + doZero(obj.getMonth()) + doZero(obj.getUTCDate()) + "T" + doZero(obj.getHours()) + ":" + doZero(obj.getMinutes()) + ":" + doZero(obj.getSeconds()) + "</dateTime.iso8601>";

function doZero(nr) {
nr = String("0" + nr);
return nr.substr(nr.length-2, 2);
}

function doYear(year) {
if (year > 9999 || year < 0) { 
	throw new Error("Unsupported year: " + year);			
} 
year = String("0000" + year)
return year.substr(year.length-4, 4);
}
};

JRapid_XmlRpcServer.prototype.arrayToXMLRPC = function(obj) {
var retstr = "<array><data>";
for (var i=0; i<obj.length; i++) {
retstr += "<value>" + this.getXML(obj[i]) + "</value>";
}
return retstr + "</data></array>";
};

JRapid_XmlRpcServer.prototype.getXML = function(obj) {
switch (typeof(obj)) {
case "string":
	return this.stringToXMLRPC(obj);
case "number":
	return this.numberToXMLRPC(obj);
case "boolean":
	return this.booleanToXMLRPC(obj);
}

if (obj.getUTCFullYear) {
return this.dateToXMLRPC(obj);
} else if (obj.constructor.toString().match(/array/i)) {
return this.arrayToXMLRPC(obj);
}  else {
return this.objectToXMLRPC(obj);
}

};

JRapid_XmlRpcServer.prototype.parseResponse = function(xmlDoc) {
var rpcErr = xmlDoc.getElementsByTagName("fault");
if (rpcErr.length > 0) {
rpcErr = JRapid_XmlRpcServer.prototype.toObject(rpcErr[0].firstChild.firstChild);
if (document.all) {
	throw new Error(rpcErr.faultCode, rpcErr.faultString);
} else {
	throw new Error(rpcErr.faultString, rpcErr.faultCode);
}
}

var main = xmlDoc.getElementsByTagName("param");
if (main.length == 0) {
throw new Error("Malformed XMLRPC Message");
}
return JRapid_XmlRpcServer.prototype.toObject(main[0].firstChild);
};

JRapid_XmlRpcServer.prototype.toObject = function(data) {
if (!data) {
return data;
}
if (!data.tagName) {
return data.nodeValue;
}

switch (data.tagName) {
case "string":
	return (data.firstChild) ? new String(data.firstChild.nodeValue) : "";
case "value":		
	return this.toObject(data.firstChild);
case "int":
case "i4":
case "double":
	return (data.firstChild) ? new Number(data.firstChild.nodeValue) : 0;
case "dateTime.iso8601":
	var sn = (document.all) ? "-" : "/";
	if (/^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})/.test(data.firstChild.nodeValue)) {;//data.text)) {
  		return new Date(RegExp.$2 + sn + RegExp.$3 + sn + RegExp.$1 + " " + RegExp.$4 + ":" + RegExp.$5 + ":" + RegExp.$6);
  	} else{
		return new Date();
	}
case "array":
	var ret = [];
	for (var i=0; i < data.firstChild.childNodes.length; i++) {
		ret[ret.length] = this.toObject(data.firstChild.childNodes[i]);
	}			
case "struct":
	var ret = {};
	for (var i=0; i < data.childNodes.length; i++) {
		ret[data.childNodes[i].firstChild.firstChild.nodeValue] = this.toObject(data.childNodes[i].lastChild);
	}
	return ret;
case "boolean":
	return Boolean(isNaN(parseInt(data.firstChild.nodeValue)) ? (data.firstChild.nodeValue == "true") : parseInt(data.firstChild.nodeValue))
case "base64":
	return this.decodeBase64(data.firstChild.nodeValue);
default:
	throw new Error("Malformed XMLRPC Message: " + data.tagName);
}
};

JRapid_XmlRpcServer.prototype.call = function(handler, url, async, service, params)	{

/* build message */
var message = '<?xml version="1.0" ?><methodCall><methodName>' + service + '</methodName><params>';
for (i=4; i<arguments.length; i++) {
	message += '<param><value>' + this.getXML(arguments[i]) + '</value></param>';
}
message += '</params></methodCall>';
var xmlDoc = XmlDocument.create(message);

/* do call */
var httpRequest = HttpRequest.create();
httpRequest.open('POST', url, async);
httpRequest.setRequestHeader("Content-type", "text/xml");	
var parseResponse = this.parseResponse;
if (async) {
httpRequest.onreadystatechange = function() {
	if (httpRequest.readyState == 4) {
		try {
			var r = parseResponse(httpRequest.responseXML);
		} catch (e) {
			handler(null, e);
			return;
		}
		handler(r);
	}
}
}	
httpRequest.send(xmlDoc);
if (!async) {
handler(this.parseResponse(httpRequest.responseXML));
}
};

JRapid_XmlRpcServer.prototype.decodeBase64 = function(sEncoded) {
// Input must be dividable with 4.
if(!sEncoded || (sEncoded.length % 4) > 0)
  return sEncoded;

/* Use NN's built-in base64 decoder if available.
   This procedure is horribly slow running under NN4,
   so the NN built-in equivalent comes in very handy. :) */

else if(typeof(atob) != 'undefined')
  return atob(sEncoded);

	var nBits, i, sDecoded = '';
	var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
sEncoded = sEncoded.replace(/\W|=/g, '');

for (i=0; i < sEncoded.length; i += 4) {
	nBits =
		(base64.indexOf(sEncoded.charAt(i))   & 0xff) << 18 |
		(base64.indexOf(sEncoded.charAt(i+1)) & 0xff) << 12 |
		(base64.indexOf(sEncoded.charAt(i+2)) & 0xff) <<  6 |
		base64.indexOf(sEncoded.charAt(i+3)) & 0xff;
	sDecoded += String.fromCharCode(
		(nBits & 0xff0000) >> 16, (nBits & 0xff00) >> 8, nBits & 0xff);
}

// not sure if the following statement behaves as supposed under
// all circumstances, but tests up til now says it does.

return sDecoded.substring(0, sDecoded.length -
 ((sEncoded.charCodeAt(i - 2) == 61) ? 2 :
  (sEncoded.charCodeAt(i - 1) == 61 ? 1 : 0)));
};

/******************************************* XSL *********************************/

function JRapid_Xsl(outerNode) {
	this.init(outerNode, 'com.htmli.xml.Xsl', 'Xsl');
	this.innerNode = outerNode.children[0];
}

JRapid_Xsl.prototype = new HTMLiElement();
JRapid_Xsl.prototype.getUrl = function() { return this.getAttribute('url'); };
JRapid_Xsl.prototype.setUrl = function(url) { this.setAttribute('url', url);	};		
JRapid_Xsl.prototype.getSrc = function() { return this.getAttribute('src'); };
JRapid_Xsl.prototype.setSrc = function(src) { this.setAttribute('src', src);	};		
JRapid_Xsl.prototype.getStatus = function() { var me = this; 
	return me.getUrl() ? me.outerNode.status : me.getContainer().getElementById(me.getSrc()).getStatus();
};				

JRapid_Xsl.prototype.refresh = function(handler,refreshXml,param) {
	var me = this;
	var url;
	var xmlDocument;
		
	var xslDocument = this.getXslt();
	if (me.getUrl()) {
		// this is the case when the xml to transform is pulled from an URL
		var httpRequest = HttpRequest.create();
		var createTime = new Date().getTime();
		me.outerNode.lastRequest = createTime;
		httpRequest.open("GET", me.getUrl() + '?rand=' + new Date().getTime(), true);
		httpRequest.onreadystatechange = function() {		
			if (httpRequest.readyState == 4) {
				if (createTime == me.outerNode.lastRequest) {
					// TODO check responseXML is valid
					var xmlDocument = httpRequest.responseXML;
					if (me && me.outerNode && me.outerNode.children[0]) {
						//var txt = xmlDocument.transformNode(xslDocument);
						var txt = me.doXslTransformation( xmlDocument, xslDocument );
						me.outerNode.children[0].innerHTML = txt;
						me.evalScripts(txt);						
					}
				}
				if (handler) {
					handler(param, xmlDocument, httpRequest.status);
				}

				application.dispatch('refresh', me);
			}
		};
		httpRequest.send('');					
	} else {
		// this is the case when the xml to transform is in the document
		var xml = me.getContainer().getElementById(me.getSrc());
		
		var onrefresh = function(p, xmlDocument, status) {
			if (!xml) {
				throw new Error("Source " +  me.getSrc() + " for XSL " + me.getId() + " doesn't exist");
			}	

			var e;
			try {
				//var txt = xmlDocument.transformNode(xslDocument);
				var txt = me.doXslTransformation( xmlDocument, xslDocument );
				me.outerNode.children[0].innerHTML = txt;
				me.evalScripts(txt);
				application.dispatch('refresh', me);
			} catch (e1) {
				alert(e1.message);
				e = e1;
			}
			if (handler) {
				handler(p, xmlDocument, status, e);
			}
		};
		
		if (refreshXml) {
			xml.get(onrefresh);
		} else {
			onrefresh(param, xml.getXmlDocument());
		}	
	}
};

// alternative to transformNode()
JRapid_Xsl.prototype.doXslTransformation = function (xmlDoc, xslDoc) {
	var jrapidUrl = jrapid.getURL( this.getContainer() );
	//alert( "jrapid_url: '" + jrapidUrl + "'" );
	
	var result;
	if (typeof(XSLTProcessor) != 'undefined') {
		// Chrome or FF
		var processor = new XSLTProcessor();
		processor.importStylesheet(xslDoc);
		
		processor.setParameter( null, "jrapid_url", jrapidUrl );
		
		try {
			var transformation = processor.transformToDocument(xmlDoc);
			if (!transformation.documentElement) {
				result = '';
			} else if (transformation.documentElement.tagName == 'transformiix:result') {
				var doc = document.createElement('div');
				var root = transformation.documentElement;
				var m = root.childNodes.length;
				for (var i=0; i < m; i++) {
					doc.appendChild(root.childNodes[0]);
				}
				result = doc.innerHTML;
			} else {
				var doc = document.createElement('div');
				try {
					doc.appendChild(transformation.documentElement);
				} catch (e) {
					doc.appendChild(document.adoptNode(transformation.documentElement));
				}
				result = doc.innerHTML;		
			}
		} catch( e ) {
			alert( e );
			result = "";
		}
	} else {
		// IE
		var xslt = new ActiveXObject("Msxml2.XSLTemplate");
		xslt.stylesheet = xslDoc;
		var processor = xslt.createProcessor();
		processor.input = xmlDoc;

		processor.addParameter( "jrapid_url", jrapidUrl );
		
		try {
			processor.transform();
			result = processor.output;
		} catch( e ) {
			alert( e );
			result = "";
		}
	}
	return result;
}

JRapid_Xsl.prototype.getXslt = function() {
		var me = this;
		var xsl = '<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform" ';
		xsl += 'xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  xmlns:xslt2="http://www.htmli.com/1999/XSL/Transform">';
		xsl += '<xslt:namespace-alias stylesheet-prefix="xslt2" result-prefix="xslt"/>';
		
		if (me.outerNode.getAttribute('params')) {
			// if the root xsl node has the 'params' attribute, declare each of them
			for (var i=0, c=me.outerNode.getAttribute('params').split(','), n=c.length; i<n; i++) {
				xsl += '<xslt:param name="' + c[i] + '" />'; 
			}
		}
		
		xsl += '<xslt:output method="html" omit-xml-declaration="yes" /><xslt:template match="/">';
		xsl += me.outerNode.children[1].value;
		xsl += '</xslt:template></xslt:stylesheet>';
		var xslDocument;
		if (document.all) {
			xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument")
			xslDoc.async = false;
			xslDoc.loadXML(xsl);
		} else {
			xslDoc = XmlDocument.create(xsl);	
		}
		return xslDoc;
};				

JRapid_Xsl.prototype.populate = function(xmlDocument) { 
	this.outerNode.children[0].innerHTML = this.getXslt().transformNode(xslDocument);
};

JRapid_Xsl.prototype.evalScripts = function(txt) {
	var d = document.createElement('div');
	d.innerHTML = '<br>' + txt;
	var scripts = d.getElementsByTagName('script');
	var n = scripts.length;
	for (var i=0; i < n; i++) {
		eval(scripts[i].text);
	}		
};




Application.prototype.evalScripts = function(txt, node, handler) {
	
	document.write = function(line) {
		
	};
	
	var allScripts = document.getElementsByTagName('script');
		
	var scripts = node.getElementsByTagName('script');
	var n = scripts.length;
	
	var isIncluded = function(x, s) {
		for (var i=0; i < s.length; i++) {
			if (s[i] != x && s[i].src == x.src) return true;
		}
		return false;
	};
	if (!scripts) {
		if (handler) handler();
		return;
	}
	
	var loadScript = function(scripts, i) {
		var script = document.createElement('script');
		if (scripts[i].src && isIncluded(scripts[i], allScripts)) {
			i++;
			if (i < scripts.length) { loadScript(scripts, i); } else if (handler) handler();
			return;
		}

		script.type = scripts[i].type;
		script.text = scripts[i].text;
		if (scripts[i].src) {
			script.src = scripts[i].src;
			if (script.addEventListener) {
				script.addEventListener('load', function() { 
					i++;
					if (i < scripts.length) { loadScript(scripts, i); } else if (handler) handler();
				}, true);
				script.addEventListener('error', function() { 
					i++;
					if (i < scripts.length) { loadScript(scripts, i); } else if (handler) handler();
				}, true);
			} else {
				script.onreadystatechange = function() {
					if (script.readyState=='complete' || script.readyState=='loaded') {
						i++;
						if (i < scripts.length) { loadScript(scripts, i); } else if (handler) handler();
					}
				};
			}
		}
		document.body.appendChild(script);
		if (!scripts[i].src) {
			i++;
			if (i < scripts.length) { loadScript(scripts, i); } else if (handler) handler();
		}
	};
	if (scripts.length > 0) {
		loadScript(scripts, 0);
	}
	
	if (document.all) {
		var links = node.getElementsByTagName('link');
		var n = links.length;
		var head = document.getElementsByTagName('head')[0];
		for (var i=0; i < n; i++) {
			var link = document.createElement('link');
			link.type = links[i].type;
			link.href = links[i].href;
			link.rel = links[i].rel;
			head.appendChild(link);
		}
	}
};


// for browsers that don't have the trim function
if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(NodeWrapper.prototype.REGEXP.trim, ''); 
	}
}