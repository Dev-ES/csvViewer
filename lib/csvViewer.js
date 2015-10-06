// JavaScript Document

var csvViewer = (function(){
	'strict';
	var _start = function ( c ){		
		return new Promise(function(resolve, reject) {
			// indexedDB compatibility
			try
			{
				window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || false;
				window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || false;
				window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange || false;
			}
			catch(e)
			{
				reject('Browser does not provide support to indexedDB. Error message: ' + e.message);
			}
			
			
			
			console.log('Promise resolving ... ');
		  	resolve('csvViewer with success');
		});
	}
	
	, _loadDeps = function(){
		var deps = ['thirdparty/papaparse/papaparse.js'];
		$dhx.onDemand.load(deps, function () {
		
		});
	}
	
	, API = {
		start : _start
	};	

	return API;
})();


csvViewer.model = csvViewer.model || (function(){
	'strict';
	var _start = function (){
		
	}
	
	, API = {
		start : _start
	};

	return API;
})();



csvViewer.settings = csvViewer.settings || {};

csvViewer.view = csvViewer.view || (function(){
	'strict';
	var _render = function(){
			
	}
	
	, API = {
		render : _render
	};	

	return API;
})();


csvViewer.view.setup = csvViewer.view.setup || (function(){
	'strict';
	var _render = new Promise(function(resolve, reject) {
		  
		  resolve('rendered');
		  console.log('csvViewer.view.setup rendered');
		  //reject('Could not render');
	})
	
	, API = {
		render : _render
	};	

	return API;
})();