
		QUnit.test( "csvViewer is defined", function( assert ) {
		  assert.ok( typeof csvViewer !== 'undefined', "Passed! " + typeof csvViewer );
		});
		
		QUnit.test( "csvViewer is Javascript object", function( assert ) {
			assert.ok( $dhx.isObject(csvViewer), "Passed!" );
		});
		
		QUnit.test( "csvViewer.view is defined", function( assert ) {
			assert.ok( typeof csvViewer.view !== 'undefined', "Passed! " + typeof csvViewer.view );
		});
			
			
		QUnit.test( "csvViewer.view is Javascript object", function( assert ) {
			assert.ok( $dhx.isObject(csvViewer.view), "Passed!" );
		});
			
		QUnit.test( "csvViewer.model is defined", function( assert ) {
			assert.ok( typeof csvViewer.model !== 'undefined', "Passed! " + typeof csvViewer.model );
		});
			
			
		QUnit.test( "csvViewer.model is Javascript object", function( assert ) {
			assert.ok( $dhx.isObject(csvViewer.model), "Passed!" );
		});
		
		
		var call_config = {};
		
		csvViewer.start(call_config).then(function(response) {
			
		
			
			QUnit.test( "csvViewer.view.setup is rendering", function( assert ) {
			  assert.expect( 0 );
			  return csvViewer.view.setup;
			});
			
			
			csvViewer.view.layout.unload();
			
		}, function(Error) {
			
			QUnit.test( "window.indexedDB is supported", function( assert ) {
			  assert.ok( window.indexedDB !== false, "Passed! " );
			});
			
			QUnit.test( "window.IDBTransaction is supported", function( assert ) {
			  assert.ok( window.IDBTransaction !== false, "Passed! " );
			});
			
			QUnit.test( "window.IDBKeyRange is supported", function( assert ) {
			  assert.ok( window.IDBKeyRange !== false, "Passed! " );
			});
			
			alert(Error + "  -  tests will not continue");
		});