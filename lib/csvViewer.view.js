csvViewer.view = csvViewer.view || (function(){
	'strict';
	var _render = function(){
		_layout();
	}
	
	, layout = null
	, _layout = function(){
		layout = new dhtmlXLayoutObject({
 
			parent:     document.body,
			pattern:    "1C",
			skin:       "dhx_skyblue",
		 
			
		});
	}
	
	, API = {
		render : _render
	};	

	return API;
})();
