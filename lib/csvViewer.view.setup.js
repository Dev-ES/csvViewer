csvViewer.view.setup = csvViewer.view.setup || (function(){
	'strict';
	var _render =  function(){
		//_layout();
		_window();
		_form();
		//alert('setup.view rendered');
	}
	
	, layout = null
	, _layout = function(){
		layout = new dhtmlXLayoutObject({
			parent:     document.body,
			pattern:    "1C",
			skin:       "dhx_skyblue",
		});
	}
	
	, _status_bar = null
	
	, _window = function(){
		var parent = csvViewer, self = csvViewer.view.setup;
		if(parent.window_manager === null)
			parent._window_manager(  );
		
		if(parent.window_manager.isWindow( "setup_window" ))
		{
			self.window.show();
			self.window.bringToTop();
			self.window.center();
			return;
		}
		
		
		
		self.window = parent.window_manager.createWindow( csvViewer.settings.view.setup.window );
		
		
		self.window.setText( 'Setup' );
		
		
		self.window.attachEvent("onClose", function(win){
			win.hide();
		});
		
		self.status_bar = self.window.attachStatusBar();
	}
	
	, form = null
	
	, _form = function(){
		var parent = csvViewer, self = csvViewer.view.setup;
		form = self.window.attachForm(csvViewer.settings.view.setup.form.template);
		form.attachEvent("onButtonClick", function(name){
			form.lock();
			_parseCsv();
		});
		csvViewer.view.setup.container = form.getContainer('log');
		csvViewer.view.setup.container.style.overflow = 'auto';
	}
	
	
	, _newRecordObject = function( headers, data ){
		var row = {};
		for( x = 0; x < data.length; x++)
		{
			var column_value = data[x];
			var column_header = headers[x];
			row[column_header] = column_value
		}
		return row;
	}
	
	, _parseCsv = function (){
		
		var file_control = form.getInput('csv');
		file_control.setAttribute('id','filesxxx');
		//console.log(file_control);
		var files = file_control.files;
		//console.log(files);
		
		if (files.length > 0)
		{
			var config = {
				delimiter: "", // auto-detect
				newline: "", // auto-detect
				header: false
				, dynamicTyping: false
				, preview: 0
				, encoding: ""
				, worker: true
				, comments: false
				, step: undefined
				, complete: function(){
					var result = arguments[0];
					//result.data
					//result.errors
					//result.meta
					var file = arguments[1];
					var headers = result.data[0];
					
					csvViewer.view.setup.container.innerHTML = "<br>csv file is parsed<br>" + csvViewer.view.setup.container.innerHTML;
					csvViewer.view.setup.container.innerHTML = "<br>Headers: " +  headers.join(', ') + "<br>" + csvViewer.view.setup.container.innerHTML;
					csvViewer.view.setup.container.innerHTML = "<br>Total records: " + result.data.length + "<br>" + csvViewer.view.setup.container.innerHTML;
	
					console.log("csv file is parsed.");
					
					var records = result.data.map(function(arr) {
					  return _newRecordObject(headers, arr);
					});
					
					
					csvViewer.model.addRecords({
						records : records
						, onSuccess : function(){}
						, onFail : function(){}
					})
				}
				, error: undefined
				, download: false
				, skipEmptyLines: false
				, chunk: undefined
				, fastMode: undefined
				, beforeFirstChunk: undefined
				, withCredentials: undefined
			}
			
			$('#filesxxx').parse({
				config: config,
				before: function(file, inputElem)
				{
					csvViewer.view.setup.container.innerHTML = "<br>Parsing file: " +  file.name + "<br>" + csvViewer.view.setup.container.innerHTML;
					console.log("Parsing file: " +  file.name, file);
				},
				complete: function()
				{
					console.log(arguments);
					
				}
			});
		}
		else
		{
			form.unlock();
		}
	}
	
	, API = {
		render : _render
		, container : null
		, window : null
		, status_bar : _status_bar
	};	

	return API;
})();