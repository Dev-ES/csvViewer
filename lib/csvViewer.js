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
			
			require( function(){
				csvViewer.setup.start.then( function(response){
						resolve('csvViewer started with success');
					}, function(response){
						reject('could not setup');
				} );
			} );
		});
	}
	
	, require = function( onSuccess ){
		var deps = [];
		
		deps.push("//cdn.dhtmlx.com.br/dhx/ui/skins/terrace/dhtmlx.css");
		deps.push("//cdn.dhtmlx.com.br/codebase4.2_std/dhtmlx.js");
		deps.push("thirdparty/papaparse/papaparse.min.js");
		
		
		$dhx.onDemand.load(deps, function () {
			if(onSuccess) onSuccess();
		});
	}
	
	, API = {
		start : _start
		, require : require
	};	

	return API;
})();


csvViewer.model = csvViewer.model || (function(){
	'strict';
	var _start = function (){
		var self = this;
		
		connect().then( function( response ) {
		
			alert(response);
		
		}, function(response) {
		 	
			alert(response)	
		
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
		
		if( ! $dhx.isNumber(dsn.version) ) dsn.version = 1;
		
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
				
				
				var objectStore = db.createObjectStore("clientes", {
					keyPath: "ssn"
				});
				// Cria um índice para buscar clientes pelo nome. Podemos ter nomes
				// duplicados, então não podemos usar como índice único.
				objectStore.createIndex("nome", "nome", {
					unique: false
				});
				// Cria um índice para buscar clientes por email. Queremos ter certeza
				// que não teremos 2 clientes com o mesmo e-mail;
				objectStore.createIndex("email", "email", {
					unique: true
				});
				// Usando transação oncomplete para afirmar que a criação do objectStore 
				// é terminada antes de adicionar algum dado nele.
				objectStore.transaction.oncomplete = function (event) {
					// Armazenando valores no novo objectStore.
					var clientesObjectStore = db.transaction("clientes", "readwrite").objectStore("clientes");
					for (var i in DadosClientes) {
						clientesObjectStore.add(DadosClientes[i]);
					}
				}
				
				
				if( dsn.onUpgrade ) dsn.onUpgrade()
				resolve('created and connected');
			};
		})	
	}
	
	, setDbGenericErrorHandler = function(){
		db.onerror = function(event) {
		  // Função genérica para tratar os erros de todos os requests desse banco!
		  alert("Database error: " + event.target.errorCode);
		};
	}
	
	
	
	, API = {
		start : _start
		, request : request
		, db : db
	};
	
	
	

	return API;
})();



csvViewer.settings = csvViewer.settings || {
	
};

csvViewer.view = csvViewer.view || (function(){
	'strict';
	var _render = function(){
			
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


csvViewer.setup = csvViewer.setup || (function(){
	'strict';
	var _start = new Promise(function(resolve, reject) {
		  
		  resolve('rendered');
		  console.log('csvViewer.view.setup rendered');
		  //reject('Could not render');
	})
	
	, API = {
		start : _start
	};	

	return API;
})();