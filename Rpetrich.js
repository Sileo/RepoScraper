(function(){
	let panels = body.getElementsWithTag("panel");

	let detailsStackView = SileoGen.generateStackView();
	detailsStackView.tabname = "Details"

	let changelogStackView = SileoGen.generateStackView();
	changelogStackView.tabname = "Changelog"

	panels.forEach(function(panel){
		let stackView = detailsStackView;

		let fieldsets = panel.getElementsWithTag("fieldset");
		fieldsets.forEach(function(fieldset){
			//let tables = fieldset.getElementsWithTag("table");
			let elements = fieldset.children();
			elements.forEach(function(el, i) {
				detailsStackView.views.push('KHAFRA!!!')
			});
		});

		stackView.views.push(SileoGen.generateSeparator());
	});

	if(changelogStackView.views.length === 0) {
		changelogStackView.views.push(SileoGen.generateMarkdown('No changelogs are available for this package!')); 
	}

	let origButton = SileoGen.generateTableButton("View Original Depiction", ".");
	detailsStackView.views.push(origButton);

	let disclaimer = SileoGen.generateMarkdown("<span>This depiction has been automatically generated. It may be missing information.</span>");
	disclaimer.useRawFormat = true;
	detailsStackView.views.push(disclaimer);

	let rootView = {
		"class": "DepictionTabView",
		"minVersion": "0.7",
		"tabs": [ 
            detailsStackView, 
            changelogStackView
        ]
    };
    
	return JSON.stringify(rootView);
}());