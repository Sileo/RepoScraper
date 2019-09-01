(function(){
	let panels = body.getElementsWithTag("panel");

	let detailsStackView = SileoGen.generateStackView();
	detailsStackView.tabname = "Details"

	let changelogStackView = SileoGen.generateStackView();
	changelogStackView.tabname = "Changelog"

	let holder = [];
	let cHolder = [];

	panels.forEach(function(panel){
		let fieldsets = panel.getElementsWithTag("fieldset");

		fieldsets.forEach(function(fieldset, ind){
			let elements = fieldset.children();

			elements.forEach(function(el, i) {
				if(el.tag() === 'div' && el.children().length && el.children()[0].tag() === 'p') {
					if(fieldset.attr('style')) {
						holder.push(el.children()[0].text());
					} else {
						cHolder.push(el.text());
					}
				} else if(el.tag() === 'a') {
					let href = el.attr('href'); // thx CS
					detailsStackView.views.push(SileoGen.generateTableButton(el.text(), absoluteURL(href)))
				}
			});
		});
	});

	/*
	https://stackoverflow.com/a/14438954
	In newer syntax I would just use [...new Set(arr)], but a filter will work!
	*/
	holder.filter(function(value, index, self) { 
		return self.indexOf(value) === index;
	}).forEach(function(i) {
		detailsStackView.views.push(SileoGen.generateMarkdown(i));
	});

	cHolder.filter(function(value, index, self) { 
		return self.indexOf(value) === index;
	}).forEach(function(i) {
		changelogStackView.views.push(SileoGen.generateMarkdown(i));
	});

	let disclaimer = SileoGen.generateMarkdown("<span>This depiction has been automatically generated. It may be missing information.</span>");
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