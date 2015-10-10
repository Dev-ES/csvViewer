/*
 *
 *   Copyright 2015 by BIG Inventory, Inc. All Rights Reserved.
 *
 */
csvViewer.setup = csvViewer.setup || (function(){
	'strict';
	var _start = new Promise(function(resolve, reject) {
		  
		if( localStorage.getItem("csvViewer.setup") )
		{
			if( localStorage.getItem("csvViewer.setup") == 'done' )
			{
				resolve('setup ok');
			}
			else
			{
				resolve('installing');
			}
		}
		else
		{
			resolve('installing');
		}
		  
		  
		//localStorage.setItem("csvViewer.setup", "done");
		  
		//resolve('setup ok');
		//reject('Could not render');
	})
	
	, install = function(){
		
		
	}
	
	, API = {
		start : _start
	};	

	return API;
})();