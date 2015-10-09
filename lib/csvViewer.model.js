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
		
		if( dsn.database )
		{
			defaultDatabase = dsn.database;	
		}
		
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
				//console.log('onsuccess');
				setDbGenericErrorHandler();
				
				resolve('connected');
			};
			
			request.onupgradeneeded = function(event) { 
				db = event.target.result;
				//console.log('onupgradeneeded');
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
		try
		{
			var items = c.records,
			i = 0, 
			ii =0,
			putNext = function() {
				if (i<items.length) {
					var request = objectStore.add(items[i]);
					request.onsuccess = function(event) {
						++i;
						++ii;
						csvViewer.view.setup.status_bar.setText('importing record: ' + ii);
						putNext();
					};
					request.onerror = function(event) {
						console.log( event );
					};
				}
				else
				{
					csvViewer.view.setup.status_bar.setText('finishing db transaction');
					csvViewer.view.setup.container.innerHTML += '<br>finishing db transaction<br>';	
				}
			},
			transaction = db.transaction('inventory', "readwrite"),
			objectStore = transaction.objectStore("inventory");
						
			transaction.oncomplete = function (event) {
				
				localStorage.setItem("csvViewer.setup", 'done');			
				csvViewer.view.setup.container.innerHTML = "<br>populate complete! <br><br>Total records: " 
						+ ii + "<br>" + csvViewer.view.setup.container.innerHTML;
						
				csvViewer.view.setup.status_bar.setText('Done!');
				csvViewer.view.setup.container.innerHTML = "<br>Setup done!<br>" + csvViewer.view.setup.container.innerHTML;
				
				if( c.onSuccess ) c.onSuccess();
	
				dhtmlx.alert('Setup is done! <br> Starting application in 2 seconds, please wait ... ');
				
				window.setTimeout(function(){
					csvViewer.view.setup.window.close();
					csvViewer.view.render();
				}, 5000);
			}
			
			transaction.onerror = function(event) {
				console.log('>>>>> add error: ', event);
				csvViewer.view.setup.status_bar.setText("Couldn't import csv records !");
			};
			
			items.shift();
			
			csvViewer.view.setup.status_bar.setText('Importing csv records');
			csvViewer.view.setup.container.innerHTML = "<br>Importing csv records ... please wait<br>" 
					+ csvViewer.view.setup.container.innerHTML;
					
			putNext();		
		}catch(e)
		{
			console.log( e.stack );
			csvViewer.view.setup.status_bar.setText(e.message);
		}
	}
	
	, _formatRecordForGrid = function( record ){
		var a = [];
		for(var i in record)
		{
			if( record.hasOwnProperty(i) )
			{
				if( i != 'inventory_id' )
					a.push(record[i]);	
			}
		}
		return a;
	}
	
	, _searchExact = function( index_name, first, last ){
		try
		{
			csvViewer.view.grid.clearAll();
			csvViewer.view.status_bar.setText('Searching, please wait ... ');
			console.time('searching performance for 5 itens ...');
			
			var transaction = db.transaction('inventory', "readonly"),
			table = transaction.objectStore("inventory"),
			index = table.index(index_name),
			range,
			search,
			total_found = 0;
			try
			{
				
				var f = first;
				var l = last;
				
				var test1 = parseInt(first);
				var test2 = parseInt(last);
				
				
				
				if( test1 >test2 )
				{
					first = l;
					last = f;
				}
			}
			catch(e)
			{
				console.log(e.stack);
			}
			
			if(first == "" && last == "") 
			{
				dhtmlx.alert('Please provide a value to search');
				return;
			}
			
			//console.log(first, ">"+last+"<");
			if( first != "" ) 
				if( last == '' )
					last = first;
			//console.log(parseInt(first) < parseInt(last));
			
			
			if(first != "" && last != "") 
			{
				range = IDBKeyRange.bound(first, last);
			} else if(first == "") {
				range = IDBKeyRange.upperBound(last);
			} else {
				console.log( 'lowerBound(first)' );
				range = IDBKeyRange.lowerBound(first);
			}
			
			
			
			search = index.openCursor(range);
			
			search.addEventListener('success', function (event) {
				var cursor = event.target.result;
				if(cursor) {
					//console.log( cursor.key, _formatRecordForGrid( cursor.value ) );
					
					++total_found;
					
					if( total_found == 5 )
					{
						console.log('5 itens returned');
						console.timeEnd('searching performance for 5 itens ...');
						console.log('search continues, please wait ... ');
					}
					
					csvViewer.view.grid.addRow( cursor.key, _formatRecordForGrid( cursor.value ) );
					
					cursor.continue();
				}
				else
				{
					console.log('search is done. Total returned records: ' + total_found);
					csvViewer.view.status_bar.setText('search is done. Total returned records: ' + total_found);
					if( total_found < 5 )
					{
						console.timeEnd('searching performance for 5 itens ...');
					}	
				}
			});
			search.addEventListener('error', function (event) {
				
			});	
	
		}catch(e)
		{
			console.log( e.stack );
			//csvViewer.view.setup.status_bar.setText(e.message);
		}
	}
	
	
	, _searchText = function( index_name, value ){
		try
		{
			if(value == "") 
			{
				dhtmlx.alert('Please provide a value to search');
				return;
			}
			
			
			csvViewer.view.grid.clearAll();
			csvViewer.view.status_bar.setText('Searching, please wait ... ');
			
			
			var transaction = db.transaction('inventory', "readonly"),
			table = transaction.objectStore("inventory"),
			search = table.openCursor(),
			total_found = 0,
			r = Math.random(); // 
			search.addEventListener('success', function (event) {
				console.time('searching text performance for 5 itens ...' + r);
				var cursor = event.target.result;
				if (cursor) {
					// PROD_DESCN_TXT text to be searched
					//console.log( cursor.key, cursor.value );
					
					if( typeof cursor.value[index_name] == 'undefined' )
					{
						cursor.value[index_name] = "";	
					}
					
					var search_value = value.toLowerCase();
					var column_value = cursor.value[index_name].toLowerCase();
					
					//var search_value = value;
					//var column_value = cursor.value[index_name];
					var re = new RegExp(search_value);
					if (re.test(column_value)) {
						++total_found;
					
						if( total_found == 5 )
						{
							console.log('5 itens returned');
							console.timeEnd('searching text performance for 5 itens ...' + r);
							console.log('search continues, please wait ... ');
						}
						
						csvViewer.view.grid.addRow( cursor.key, _formatRecordForGrid( cursor.value ) );
						
					}
					
					cursor.continue();
				}
				else {
					console.log('search is done. Total returned records: ' + total_found);
					csvViewer.view.status_bar.setText('search is done. Total returned records: ' + total_found);
					if( total_found < 5 )
					{
						console.timeEnd('searching text performance for 5 itens ...' + r);
					}	
				}
			});
			search.addEventListener('error', function (event) {
				
			});		
				
		}catch(e)
		{
			console.log( e.stack );
			//csvViewer.view.setup.status_bar.setText(e.message);
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
			
			objectStore.createIndex("GS1_MANUFACTURE_NAME", "GS1_MANUFACTURE_NAME", {
				unique: false
			});
			
			
			
			objectStore.transaction.oncomplete = function (event) {
				dhtmlx.message('inventory table created');
				c.resolve('created and connected');	
				if( c.onSuccess ) c.onSuccess();
			}
			objectStore.transaction.onerror = function (event) {
				//event.srcElement.error.name
				//event.srcElement.error.message
				if( c.onFail ) c.onFail(event.srcElement.error.message);
				c.reject("Couldn't create table !");
				dhtmlx.message("Couldn't create table !");
			};
			objectStore.transaction.onabort = function (event) {
				if( c.onFail ) c.onFail(event.srcElement.error.message);
				c.reject("Couldn't create table !");
				dhtmlx.message("Couldn't create table !");
			};	
		}
		catch(e)
		{
			console.log( e.stack );
			if( c.onFail ) c.onFail(e.message);
			c.reject("Couldn't create table !");
			dhtmlx.message("Couldn't create table !");
		}
	}
	
	_getQuota = function (onSuccess, onFail) {
		try{
			var webkitStorageInfo = window.webkitStorageInfo || navigator.webkitTemporaryStorage || navigator.webkitPersistentStorage;
			webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.TEMPORARY, function (used, remaining) {
				if (onSuccess) onSuccess(used, remaining);
			}, function (e) {
				if (onFail) onFail(e);
			});	
		}
		catch(e)
		{
			var err = "This browser does not provide quota management.";
			dhtmlx.alert('Quota information', err, 'icons/db.png');
		}
	}
	
	, setDbGenericErrorHandler = function(){
		db.onerror = function(event) {
		  console.log("Database error: ");
		  console.log(event);
		};
	}
	
	, API = {
		start : _start
		, request : request
		, db : db
		, addRecords : _addRecords
		, searchExact : _searchExact
		, searchText : _searchText
		, getQuota : _getQuota
	};
	
	return API;
})();