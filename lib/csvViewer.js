/*
 *
 *   Copyright 2015 by BIG Inventory, Inc. All Rights Reserved.
 *
 */
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
			
			csvViewer.model.start({
				onSuccess: function () {
					csvViewer.setup.start.then(function (response) {
						if (response == 'setup ok')
						{
							csvViewer.view.render();
							resolve('starting csvViewer view');
						}
						else if (response == 'installing')
						{
							csvViewer.view.setup.render();
							resolve('starting csvViewer setup view');
						}
					}, function (response) {
						reject('could not setup');
					});
				}
				, onFail: function () {
					reject('could not start model');
				}
			})
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
	
	, API = {
		start : _start
		, _window_manager : _window_manager
		, window_manager : window_manager
		, window_manager_is_ready : window_manager_is_ready
	};	

	return API;
})();











