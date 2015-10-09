console.log(window.location.href);
csvViewer.settings = csvViewer.settings || {
	view : {
		
		toolbar : {
			icon_path: window.location.href  + "icons/"
			, items: [
			{
				type: "button"
				, id: "clear"
				, img: "empty.png"
				, text : 'Clear results'
			}
			
			, {
				type: "button"
				, id: "setup"
				, img: "setup.png"
				, text : 'Application setup'
			}
			
			, {
				type: "button"
				, id: "getQuota"
				, img: "dbinfo.png"
				, text : 'Get quota info'
			}
			
			, {
				type: "text"
				, id: "info"
				, text: "Big Inventory - Proof of concept"
			}]
		}
		, form_exact_match: {
			template: [
				{
					type: "settings"
					, position: "label-left"
					, labelWidth: 100
					, inputWidth: 140
				}
				
				, {
					type: "fieldset"
					, label: "BARCODE_GTIN"
					, inputWidth: 290
					
					, list :[
						, {
							type: "input"
							, name: "BARCODE_GTIN_from"
							, label: "from"
							, value : '10705037048649'
							
						}
						, {
							type: "input"
							, name: "BARCODE_GTIN_to"
							, label: "to"
							, value : '10705037044818'
							
						}
						, {
							type: "button"
							, value: "search"
							, name : 'BARCODE_GTIN'
						}
					]
				}
				
				, {
					type: "fieldset"
					, label: "PROD_CD"
					, inputWidth: 290
					, list :[
						, {
							type: "input"
							, name: "PROD_CD_from"
							, label: "from"
							, value : '0845302'
						}
						, {
							type: "input"
							, name: "PROD_CD_to"
							, label: "to"
							, value : '0850302'
						}
						, {
							type: "button"
							, value: "search"
							, name : 'PROD_CD'
						}
					]
				}
				
				, {
					type: "fieldset"
					, label: "CATALOG"
					, inputWidth: 290
					, list :[
						, {
							type: "input"
							, name: "CATALOG_from"
							, label: "from"
							, value : 'EP8701H'
						}
						, {
							type: "input"
							, name: "CATALOG_to"
							, label: "to"
							, value : 'EPM8754'
						}
						, {
							type: "button"
							, value: "search"
							, name : 'CATALOG'
						}
					]
				}
				
				, {
					type: "fieldset"
					, label: "PROD_DESCN_TXT"
					, inputWidth: 290
					, list :[
						, {
							type: "input"
							, name: "PROD_DESCN_TXT_from"
							, label: "Text"
							
							, rows : 4
						}
						, {
							type: "button"
							, value: "search"
							, name : 'PROD_DESCN_TXT'
						}
					]
				}
			]
		}
		
		
		
		
		, setup : {
			window : {
				id: "setup_window"
				, left: 50
				, top: 50
				, width: 400
				, height: 400
				, // XXXXXXXXXXXX bug DHTMLX ... need to report XXXXXXXXX
				//center:true,
				onClose: function () {
					alert('closing');
					return true;
				}
			}	
			, form : {
				template : [
					{
						type: "settings"
						, position: "label-left"
						, labelWidth: 130
						, inputWidth: 120
					}
					, {
						type: "fieldset"
						, label: "Welcome"
						, inputWidth: 380
						, list: [
	
							{type: "file", name: "csv", label: "Select the csv file", position:"label-top", required : true, info : true, note : { text : 'Please select a valid csv file.<br><br> This field is mandatory.' }}
						
							, {
								type: "button"
								, value: "Proceed"
							}
						
						]
					}
					, {
						type: "fieldset"
						, label: "Installation log"
						, inputWidth: 380
						, list: [
							{
								type:"container", 
								name:"log", 
								//label:"", 
								inputWidth:300, 
								inputHeight:100
							}
						]
					}
				]	
			}
		}	
	}
};

