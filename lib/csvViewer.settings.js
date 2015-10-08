csvViewer.settings = csvViewer.settings || {
	view : {
		
		setup : {
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

