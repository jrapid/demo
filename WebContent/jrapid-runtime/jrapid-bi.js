function BI() {

}

BI.action = function(obj, url, value) {
	if (value) {
		var data = value.split(',');
		obj.options[0].selected = true;
		url = BI.removeParam(url, 'noheader');
		jrapid.form({
			entity: data[0], 
			id: 'Table/' + encodeURIComponent(url), 
			defaultset: data[1],
			module: 'Main',
			target: 'window'
		});
		
	}
};

BI.openForm = function(id, entity) {
	jrapid.form({entity: entity, id: id, module: 'Main'});
};

BI.include = function(url, canvas) {
	if (!canvas) {
		canvas = document.createElement('div');
		document.body.appendChild(canvas);
	}
	var o = new XMLHttpRequest();	
	o.open('GET', url, true);
	o.onreadystatechange = function() {
		if (o.readyState == 4) { canvas.innerHTML = o.responseText; }
	};
	o.send('');
};

BI.open = function(url, target, params) {
	//window.open(url, target, params);
	var div = document.createElement('div');
	//div.style.padding = '10px';
	document.body.appendChild(div);
	var o = new XMLHttpRequest();	
	o.open('GET', url, true);
	o.onreadystatechange = function() {
		if (o.readyState == 4) { 
			div.id = 'bi' + new Date().getTime();
			div.innerHTML = o.responseText; 
			div.style.position = 'absolute';
			div.style.top = '0px';
			var w = div.offsetWidth;
			var h = div.offsetHeight;
			var win = jrapid.wrap(application.openWindow('Table', div, null, null, null, null, true));
			var size = document.documentElement.clientHeight-div.getBoundingClientRect().top-52;
			if (size < h) { 
				div.parentNode.style.overflowY = 'scroll'; 
				div.parentNode.style.height = size + 'px';
			}
			h = Math.min(h, size);
			win.resizeTo(w, h, true);
			div.style.width = '100%';
			div.style.position = '';			
		}
	};
	o.send('');
};

BI.chartDashboard = function(obj, id) {
	var img = document.getElementById('img' + id);
	var url = BI.removeParam(BI.removeParam(img.src, 'width'), 'height');
	jrapid.form({
        entity: 'Chart',
        defaultset: 'forUrl',
        module: 'Main',
        id: encodeURIComponent(url),
        target: 'window'
	});
};

BI.chartConfigure = function(obj, type, id) {
	var name = type;
	type = type.charAt(0).toUpperCase() + type.substring(1);
    var sourcePrototype = jrapid.createSource();
    sourcePrototype.outerNode.id = 'source' + new Date().getTime();
    document.body.appendChild(sourcePrototype.outerNode);
	sourcePrototype.setUrl('../jrapid-runtime/forms.Chart/' + type +  'Configuration_form.html');
	var container = jrapid.wrap(obj).getContainer();
    sourcePrototype.open(function() {
  	  	application.openWindow(type, container.getElementById('windowcontainer').outerNode);
	    var xml = container.getElementById('xml');
	    xml.setXml(BI.chartsXml[name]);
	    var xsl = container.getElementById('xsl');
	    xsl.refresh();  	
	    var submit = container.getElementById('submit');
	    submit.outerNode.onclick = function() {
	    	var form = container.getElementById('form').outerNode;
	    	var s = '';
	    	for (var i=0, c=form.elements, n = c.length; i<n; i++) {
	    		if (c[i].id.indexOf(name) == 0) {
	    			if (c[i].type == 'checkbox' && c[i].checked) {
	    				s += '&' + c[i].id.substring((name+'configuration').length+1) + '=true';		    			
	    			} else if (c[i].value.length) {
	    				s += '&' + c[i].id.substring((name+'configuration').length+1) + '=' + c[i].value;
	    			}
		    	}
	    	}
	    	var img = document.getElementById('img' + id);
	    	img.basesrc = img.basesrc + s;
	    	img.src = img.basesrc + s + '&width=' + img.width + '&height=' + img.height;
	    	sourcePrototype.outerNode.parentNode.removeChild(sourcePrototype.outerNode);
	    }
    });
};

BI.chartsXml = [];
BI.chartsXml['pie'] = '<pieConfiguration><title>My Pie Chart</title><backgroundColor id="" /><perRow /><lowerLimit /><use3D /></pieConfiguration>';
BI.chartsXml['bar'] = '<barConfiguration><title>My Bar Chart</title><backgroundColor id="" /><perRow /><categoryLabel />' +
						'<valueLabel /><vertical /><stacked /><includeLegend /><includeTooltip /><base /><legendFontSize /></barConfiguration>';
BI.chartsXml['line'] = '<lineConfiguration><title>My Bar Chart</title><backgroundColor id="" /><perRow /><manyCharts /><categoryLabel />' +
						'<valueLabel /><vertical /><stacked /><includeLegend /><includeTooltip /><base /><itemLabelsVisible /><legendFontSize /></lineConfiguration>';



BI.openImage = function(url, target, type) {
	//window.open(url, target, params);
	var id = new Date().getTime();
	var div = document.createElement('div');
	var img = document.createElement('img');
	var conf = document.createElement('div');
	conf.innerHTML = 
		'<a href="#" onclick="BI.chartConfigure(this, \'' + type + '\', ' + id + ');">Configure</a>' +
		'<a href="#" onclick="BI.chartDashboard(this, ' + id + ');">To dashboard</a>';
	img.basesrc = img.src = url;
	img.id = 'img' + id;
	div.appendChild(conf);
	div.appendChild(img);
	document.body.appendChild(div);
	var win = application.openWindow('Chart', div);	
	win.id = 'win' + id;
	win.setAttribute('onresizewindow', 'BI.resizeChart("' + id + '")');
};

BI.resizeChart = function(id) {
	var img = document.getElementById('img' + id);
	img.style.display = 'none';
	var rect = document.getElementById('win' + id).getBoundingClientRect();
	img.src = img.basesrc + '&width=' + rect.width + '&height=' + rect.height;
	img.style.display = '';
	img.width = rect.width;
	img.height = rect.height;
};

BI.exclude = function(obj, event, dimension) {
	var url = obj.parentNode.parentNode.parentNode.parentNode.getAttribute('url');
	BI.refresh(obj, url.replace(new RegExp('(,?)' + dimension), ''));
}

BI.order = function(obj, event, dimension, id) {
	var url = obj.parentNode.parentNode.parentNode.parentNode.getAttribute('url');
	BI.refresh(obj, BI.addParam(url, 'order', dimension + ':' + id));
}

BI.swap = function(obj, event, dimension) {
	var url = obj.parentNode.parentNode.parentNode.parentNode.getAttribute('url');
	if (!BI.swapOne(obj, dimension, url, 'rows')) {
		BI.swapOne(obj, dimension, url, 'columns');	
	}
}		
	
BI.swapOne = function(obj, dimension, url, type) {
	var v = BI.paramValues(url, type);
	for (var i=0; i < v.length; i++) {
		if (v[i] == dimension) {
			var aux = v[i-1];
			v[i-1] = v[i];
			v[i] = aux;
			url = BI.addParam(url, type, v.join(','));
			BI.refresh(obj, url);
			return true;
		}
	}
	return false;
}

BI.rotate = function(obj, event, dimension) {
	var url = obj.parentNode.parentNode.parentNode.parentNode.getAttribute('url');
	var rows = BI.paramValues(url, 'rows');
	var columns = BI.paramValues(url, 'columns');
	for (var i=0; i < rows.length; i++) {
		if (rows[i] == dimension) {
			rows.splice(i, 1);
			columns[columns.length] = dimension;
			url = BI.addParam(url, 'rows', rows.join(','));
			url = BI.addParam(url, 'columns', columns.join(','));
			BI.refresh(obj, url);
			return;
		}
	}
	for (var i=0; i < columns.length; i++) {
		if (columns[i] == dimension) {
			columns.splice(i, 1);
			rows[rows.length] = dimension;
			url = BI.addParam(url, 'rows', rows.join(','));
			url = BI.addParam(url, 'columns', columns.join(','));
			BI.refresh(obj, url);
			return;
		}
	}
}

BI.getUrl = function(obj) {
	var c = obj.parentNode.parentNode.parentNode.parentNode;
	c = c.children[c.children.length-1];
	if (c.children && c.children.length && c.children[c.children.length-1].tagName.toLowerCase() == 'div') {
		return c.children[c.children.length-1].children[0].getAttribute('url');	
	}
	return c.getAttribute('url');	
};

BI.table = function(obj, event, columnCount, rowCount) {

	var thead = obj.parentNode.parentNode.parentNode.parentNode.children[1];
	var url = thead.parentNode.getAttribute('url');
	var n = thead.children[columnCount-1].children[obj.parentNode.cellIndex];
	var names = n.getAttribute('keyname').split('#');
	var keys = n.getAttribute('key').split('#');
	for (var i=0; i < names.length; i++) {
		url = BI.addParam(url, names[i], keys[i]);
	}
	
	for (var i=0; i < rowCount; i++) {
		var n = obj.parentNode.parentNode.children[i];
		url = BI.addParam(url, n.getAttribute('keyname'), n.getAttribute('key'));
	}
	BI.open(BI.addParam(BI.removeParam(url, 'noheader'), 'table', 'true'), '_blank', 'width=700');
};

BI.refresh = function(obj, url) {
	var div; 	
	while (obj) {
		if (obj.id == 'canvas') {
			div = obj;
			break;
		}
		if (obj.id == 'container') {
			var canvas = obj.children[obj.children.length-1];
			div = canvas;
			break;
		}
		obj = obj.parentNode;
	}
	var o = new XMLHttpRequest();	
	o.open('GET', BI.addParam(url, 'noheader', ''), true);
	o.onreadystatechange = function() {
		if (o.readyState == 4) {
			div.innerHTML = o.responseText;
		}
	};
	o.send('');
};

BI.addParam = function(url, param, value) {
	var url = BI.removeParam(url, param);
	return url + (url.indexOf('?') == -1 ? '?' : '&') + param + '=' + value;
};

BI.paramValues = function(url, param) {
	var parts = url.split('?');
	if (parts.length == 1) {
		return [];
	}
	var params = parts[1].split('&');
	for (var i=0; i < params.length; i++) {
		var keyValue = params[i].split('=');
		if (keyValue[0] == param) {
			return keyValue.length == 0 ? [] : keyValue[1].split(',');
		}
	}		
	return url;
};

BI.removeParam = function(url, param) {
	var parts = url.split('?');
	if (parts.length == 1) {
		return url;
	}
	url = parts[0] + '?';
	var params = parts[1].split('&');
	for (var i=0; i < params.length; i++) {
		var keyValue = params[i].split('=');
		if (keyValue[0] != param) {
			url += '&' + params[i];
		}
	}		
	return url;
};

BI.chart = function(obj, foo, type) {
	if (type) {
		var url = obj.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('table')[0].getAttribute('url');		
		obj.options[0].selected = true;
		BI.openImage(BI.addParam(url, 'chart', type), null, type);
	}
};

BI.showFilters = function(button) {
	button.parentNode.nextSibling.style.display = button.parentNode.nextSibling.style.display == '' ? 'none' : '';
};

BI.showFilter = function(obj, index) {
	var divs = obj.parentNode.nextSibling.childNodes;
	for (var i=0; i < divs.length; i++) {
		divs[i].style.display = i == index ? '' : 'none';
	}	
};

BI.measure = function(obj, url) {
	BI.refresh(obj, BI.addParam(BI.removeParam(BI.removeParam(url, 'measure'), 'conf'), 'measure', obj.value));	
};

BI.refreshFilters = function(button, url, field) {
	var select = button.parentNode.parentNode.childNodes[0].firstChild; 
	var ids = "-1";
	for (var i=0; i < select.options.length; i++) { 
		ids += "," + select.options[i].value; 
	}
	url = BI.removeParam(url, 'conf');
	url = BI.removeParam(url, 'filter' + field);	
	if (select.options.length == 0) {
		BI.refresh(button, url);
	} else {
		BI.refresh(button, BI.addParam(url, 'filter' + field, ids));
	}
};

BI.refreshDimensions = function(button, url) {

	var select = button.parentNode.parentNode.childNodes[1].firstChild;
	var rows = "";
	for (var i=0; i < select.options.length; i++) { 
		rows += (i == 0 ? "" : ",") + select.options[i].value; 
	}
	select = button.parentNode.parentNode.childNodes[4].firstChild;
	var columns = "";
	for (var i=0; i < select.options.length; i++) { 
		columns += (i == 0 ? "" : ",") + select.options[i].value; 
	}
	
	url = BI.addParam(url, 'rows', rows);
	url = BI.addParam(url, 'columns', columns);
	url = BI.removeParam(url, 'conf');
	
	BI.refresh(button, url);
};

BI.reportAction = function(obj, id, url) {
	var c = document.getElementById('reportCanvas');
	c.style.padding = '10px';
	BI.include(BI.removeParam(url, 'conf'), c);
};


BI.resizeDashboard = function(obj) {
	var i = obj.children[0].selectedIndex + 1;
	var height = obj.getBoundingClientRect().bottom - obj.getBoundingClientRect().top;
	var h = (height - 20) / 2;
	obj.style.overflow = 'hidden';
	var tbody = obj.children[i].children[0];
	BI.resizeDashboardImg(tbody, 0, 0, h);
	BI.resizeDashboardImg(tbody, 0, 1, h);
	BI.resizeDashboardImg(tbody, 1, 0, h);
	BI.resizeDashboardImg(tbody, 1, 1, h);
};

BI.resizeDashboardImg = function(tbody, x, y, h) {
	var img = tbody.children[x].children[y].children[0];
	if (!parseInt(img.offsetWidth)) return;
	if (!img.basesrc) { img.basesrc = BI.removeParam(BI.removeParam(img.src, 'width'), 'height'); }
	img.src = img.basesrc + '&width=' + parseInt(img.offsetWidth) + '&height=' + parseInt(h);
	img.style.height = h + 'px';
};

BI.selectDashboard = function(obj) {
	for (var i=1, c=obj.parentNode.children, n=c.length; i < n; i++) {
		c[i].style.display = obj.selectedIndex == (i-1) ? '' : 'none';
	}
	BI.resizeDashboard(obj.parentNode);
};

