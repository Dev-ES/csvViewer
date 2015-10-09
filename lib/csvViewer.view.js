csvViewer.view = csvViewer.view || (function(){
	'strict';
	var _render = function(){
		_layout();

		_grid();
		_toolbar();
		
		_form_exact_match();
	}
	
	, layout = null
	, _layout = function(){
		var parent = csvViewer, self = csvViewer.view;
		self.layout = new dhtmlXLayoutObject({
			parent:     document.body,
			pattern:    "2U",
			skin:       "dhx_skyblue",
		});
		self.layout.cells('a').hideHeader();
		self.layout.cells('b').setWidth(320);
		self.layout.cells('b').setText('Search');
		self.status_bar = self.layout.attachStatusBar();
	}
	
	
	
	
	, _grid = function(){
		var parent = csvViewer, self = csvViewer.view;
		self.grid = self.layout.cells('a').attachGrid();
		//self.grid.setIconsPath($dhx.ui.crud.simple.View.settings.dhtmlx_codebase_path + "imgs/");
		self.grid.setHeader('Manufacture name,Quantity,UOM,Bar code,CD,Product Description,Creation date,Catalog'); //the headers of columns 
		self.grid.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro'); //the types of columns  
		self.grid.setColSorting('str,str,str,str,str,str,str,str'); //the sorting types 
		self.grid.setColAlign('left,left,left,left,left,left,left,left'); //the alignment of columns		
		self.grid.setInitWidths('250,90,90,110,90,260,90,90'); //the widths of columns 
		self.grid.init(); 
		self.grid.enableDistributedParsing(true);
	}
	
	
	
	, form_exact_match = null
	
	, _form_exact_match = function(){
		var parent = csvViewer, self = csvViewer.view;
		form_exact_match = self.layout.cells('b').attachForm(csvViewer.settings.view.form_exact_match.template);
		form_exact_match.attachEvent("onButtonClick", function(name){
			//console.log(name);
			if( name == 'PROD_DESCN_TXT' )
			{
				var input = form_exact_match.getInput(name + "_from");
				csvViewer.model.searchText( name, input.value );
			}
			else
			{
				var input_from = form_exact_match.getInput(name + "_from");
				var input_to = form_exact_match.getInput(name + "_to");
				csvViewer.model.searchExact( name, input_from.value, input_to.value );	
			}
			
			
			//form_exact_match.lock();
			//
		});
	}
	
	
	
	, toolbar = null
	, _toolbar = function(){
		var parent = csvViewer, self = csvViewer.view;
		toolbar = self.layout.attachToolbar(csvViewer.settings.view.toolbar);
		toolbar.setIconSize(48);
		toolbar.attachEvent("onClick", function(id) {
			if( id == 'getQuota' )
			{

				csvViewer.model.getQuota(  function(  used, remaining ){
					used = ( used / 1024  / 1024  );
					remaining = ( remaining / 1024  / 1024  / 1024 );
					var message = 'used: ' + used.toFixed(2) + 'MB. remaining: '+remaining.toFixed(4) + 'GB';
					dhtmlx.alert('Quota information <br><br>' + message);
					
				}, function( error ){
					console.log( error );
				});	
			}
			else if( id == 'clear' )
			{
				csvViewer.view.grid.clearAll();
			}
			else if( id == 'setup' )
			{
				if( window.confirm('Do you really want to setup again? \n\n It will reload the window and drop all data from database') )
				{
					localStorage.setItem("csvViewer.setup", null);
					document.location.reload();	
				}
			}
		});
	}
	
	
	
	, API = {
		render : _render
		, grid : null
		, layout : null
		, status_bar : null
	};	

	return API;
})();
