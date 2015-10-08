csvViewer.model = csvViewer.model || (function(){
	'strict';
	var _start = function ( c ){
		var self = this;
		
		connect().then( function( response ) {
		
			if( c.onSuccess ) c.onSuccess(response);
			//alert(response);
		
		}, function(response) {
		 	if( c.onFail ) c.onFail(response);
			//alert(response)	
		
		} );
			
	
	}
	
	, defaultDatabase = 'BigInventory'
	, db = null
	, request = null
	, schema = {}
	
	/**
	* Connects to a database.
	* @method
	* @param {object} dsn - Connection payload
	* var dsn = {
	*	database : 'myDBName'
	* 	onConnect : function(){}
	* 	onUpgrade : function(){}
	* 	onConnectionError : function(){}
	* 	onDbError : function(){}
	* }
	*/
	, connect = function( dsn ){
		dsn = dsn || {};
		if( ! $dhx.isObject(dsn) ) dsn = {};
		if( dsn.database )
		{
			defaultDatabase = dsn.database;	
		}
		
		//if( ! $dhx.isNumber(dsn.version) ) dsn.version = 16;
		
		
		var nversion = new Date().getTime();
		
		
		if( ! localStorage.getItem("csvViewer.setup") )
		{
			localStorage.setItem("csvViewer.setup.db.version", nversion);
		}
		
		if( localStorage.getItem("csvViewer.setup.db.version") )
		{
			dsn.version = localStorage.getItem("csvViewer.setup.db.version");
		}
		else
		{
			dsn.version = nversion;
			localStorage.setItem("csvViewer.setup.db.version", nversion);
		}
		
		
		
		return new Promise( function( resolve, reject ) {
			request = indexedDB.open( defaultDatabase, dsn.version );
			
			request.onerror = function(event) {
			 // alert("Você não habilitou minha web app para usar IndexedDB?!");
			  reject("Você não habilitou minha web app para usar IndexedDB?!");
			};
			
			request.onsuccess = function(event) {
				db = request.result;
				console.log('onsuccess');
				setDbGenericErrorHandler();
				
				resolve('connected');
			};
			
			request.onupgradeneeded = function(event) { 
				db = event.target.result;
				console.log('onupgradeneeded');
				setDbGenericErrorHandler();		
				
				_createTables({
					db : event.target.result
				 	, onSuccess : function(){
						if( dsn.onUpgrade ) dsn.onUpgrade();
					}
				 	, onFail : function(){
						//reject("Couldn't create table !");
					}
					, resolve : resolve
					, reject : reject
				})
			};
		})	
	}
	
	, _addRecords = function(c){
		
		//console.log( csvViewer.view.setup );
		
		try
		{
			var items = c.records;
			var i = 0, ii =0;
			//console.log( items );
			//csvViewer.view.setup.window.progressOn();
			csvViewer.view.setup.status_bar.setText('Importing csv records');
			csvViewer.view.setup.container.innerHTML = "<br>Importing csv records ... please wait<br>" + csvViewer.view.setup.container.innerHTML;
			
			var transaction = db.transaction('inventory', "readwrite");
			var objectStore = transaction.objectStore("inventory");
			
			transaction.oncomplete = function (event) {
				localStorage.setItem("csvViewer.setup", 'done');
				
				csvViewer.view.setup.container.innerHTML = "<br>populate complete! <br><br>Total records: " + ii + "<br>" + csvViewer.view.setup.container.innerHTML;
				console.log('populate complete! Total records: ' + ii);
				if( c.onSuccess ) c.onSuccess();
				
				csvViewer.view.setup.status_bar.setText('Done!');
				csvViewer.view.setup.container.innerHTML = "<br>Setup done!<br>" + csvViewer.view.setup.container.innerHTML;
				
				//csvViewer.view.setup.window.progressOff();
				console.log('add ok: ' + ii);
			}
			
			transaction.onerror = function(event) {
				console.log('>>>>> add error: ', event);
				csvViewer.view.setup.status_bar.setText("Couldn't import csv records !");
			};
			
			
			console.log( items[0] );
			
			
			items.shift();
			
			console.log( items[0] );
			
			putNext();
	
			function putNext() {
				
				if (i<items.length) {
					//console.log(items[i]);
					
					
					var request = objectStore.add(items[i]);
					request.onsuccess = function(event) {
						
						++ii;
						csvViewer.view.setup.status_bar.setText('importing record: ' + ii);
						putNext();
					};
					request.onerror = function(event) {
						console.log( event );
					};
					
					
					//objectStore.add(items[i]).onsuccess = putNext;
					++i;
				}
				else
				{
					csvViewer.view.setup.status_bar.setText('finishing db transaction');
					csvViewer.view.setup.container.innerHTML += '<br>finishing db transaction<br>';	
				}
			}		
		}catch(e)
		{
			console.log( e.stack );
			csvViewer.view.setup.status_bar.setText(e.message);
		}
	}
	
	/**
	* Creates the table used to store the csv data.
	* @method
	* @param {object} c - Connection payload
	* var c = {
	*	db : event.target.result
	* 	onSuccess : function(){}
	* 	onFail : function(){}
	* 	resolve : resolve
	* 	reject : reject
	* }
	*/
	, _createTables = function( c ){
		
		try
		{
			var db = c.db;
			
			//csvViewer.view.setup.status_bar.setText('Creating inventory table');
			
			dhtmlx.message('Creating inventory table');
			
			
			try{
				db.deleteObjectStore("inventory");	
			}catch(e)
			{
				console.log('could not delete table');
			}
			
			
			var objectStore = db.createObjectStore("inventory", {
				keyPath: "inventory_id", autoIncrement:true
			});
			
			/*
			
			
			BARCODE_GTIN, PROD_CD, and CATALOG fields are to be searchable as exact matches to the entire field and as matches to either the beginning or end of the field. Returning all matching results.

			PROD_DESCN_TXT field is to be full-text searchable; returning the top 20 results.
			
			Other fields are for display only.
			
			
			*/
	
			// GS1_MANUFACTURE_NAME,QUANTITY,UOM,BARCODE_GTIN,PROD_CD,PROD_DESCN_TXT,GTIN_CREATION_DATE,CATALOG
			
			// BARCODE_GTIN
			
			objectStore.createIndex("BARCODE_GTIN", "BARCODE_GTIN", {
				unique: false
			});
			objectStore.createIndex("PROD_CD", "PROD_CD", {
				unique: false
			});
			objectStore.createIndex("CATALOG", "CATALOG", {
				unique: false
			});
			objectStore.createIndex("PROD_DESCN_TXT", "PROD_DESCN_TXT", {
				unique: false
			});
			
			
			
			objectStore.transaction.oncomplete = function (event) {
				
				
				//csvViewer.view.setup.status_bar.setText('inventory table created');
				dhtmlx.message('inventory table created');
				c.resolve('created and connected');	
				
				if( c.onSuccess ) c.onSuccess();
				
			}
			objectStore.transaction.onerror = function (event) {
				//event.srcElement.error.name
				//event.srcElement.error.message
				if( c.onFail ) c.onFail(event.srcElement.error.message);
				//csvViewer.view.setup.status_bar.setText("Couldn't create table !");
				c.reject("Couldn't create table !");
				dhtmlx.message("Couldn't create table !");
			};
			objectStore.transaction.onabort = function (event) {
				if( c.onFail ) c.onFail(event.srcElement.error.message);
				c.reject("Couldn't create table !");
				dhtmlx.message("Couldn't create table !");
				//csvViewer.view.setup.status_bar.setText("Couldn't create table !");
			};	
		}
		catch(e)
		{
			console.log( e.stack );
			if( c.onFail ) c.onFail(e.message);
			c.reject("Couldn't create table !");
			dhtmlx.message("Couldn't create table !");
			//csvViewer.view.setup.status_bar.setText("Couldn't create table !");
		}
	}
	
	, setDbGenericErrorHandler = function(){
		db.onerror = function(event) {
		  // Função genérica para tratar os erros de todos os requests desse banco!
		  console.log("Database error: ");
		  console.log(event);
		};
	}
	
	
	
	, API = {
		start : _start
		, request : request
		, db : db
		, addRecords : _addRecords
	};
	
	
	

	return API;
})();