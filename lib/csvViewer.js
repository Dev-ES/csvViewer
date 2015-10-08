// JavaScript Document
var csvViewer = (function(){
	'strict';
	var _start = function ( c ){		
		return new Promise(function(resolve, reject) {
			// indexedDB compatibility
			$dhx.environment = 'production';
			
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
			
			require( function(){
				csvViewer.model.start({
					onSuccess : function(){
						csvViewer.setup.start.then( function(response){
								if( response == 'setup ok' )
								{
									csvViewer.view.render();
									resolve('starting csvViewer view');	
								}
								else if( response == 'installing' )
								{
									csvViewer.view.setup.render();
									resolve('starting csvViewer setup view');	
								}
							}, function(response){
								reject('could not setup');
						} );
					}
					, onFail : function(){
						reject('could not start model');	
					}	
				})
				
				
			} );
		});
	}
	
	, window_manager = null
	, window_manager_is_ready = false
	, _window_manager = function (skin) {
		'use strict';
		var self = this;
		if (!self.window_manager_is_ready) {
			self.window_manager = new dhtmlXWindows({
				skin: self.skin
			});
			//self.window_manager.setSkin(self.skin);
			self.window_manager_is_ready = true;
		}
	}
	
	, require = function( onSuccess ){
		var deps = [];
		
		deps.push("http://" + window.location.host + "/csvViewer/thirdparty/codebase4.4_std/dhtmlx.css");
		deps.push("http://" + window.location.host + "/csvViewer/thirdparty/codebase4.4_std/dhtmlx.js");
		deps.push("http://" + window.location.host + "/csvViewer/lib/csvViewer.view.js");
		deps.push("http://" + window.location.host + "/csvViewer/lib/csvViewer.view.setup.js");
		deps.push("http://" + window.location.host + "/csvViewer/lib/csvViewer.setup.js");
		deps.push("http://" + window.location.host + "/csvViewer/lib/csvViewer.settings.js");
		deps.push("http://" + window.location.host + "/csvViewer/lib/csvViewer.model.js");
		
		
		$dhx.onDemand.load(deps, function () {
			if(onSuccess) onSuccess();
		});
	}
	
	, API = {
		start : _start
		, require : require
		, _window_manager : _window_manager
		, window_manager : window_manager
		, window_manager_is_ready : window_manager_is_ready
	};	

	return API;
})();











