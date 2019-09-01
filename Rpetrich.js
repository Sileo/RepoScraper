/*
Copyright 2019 Khafra

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
	let panels = body.getElementsWithTag("panel");

	let detailsStackView = SileoGen.generateStackView();
	detailsStackView.tabname = "Description"

	let changelogStackView = SileoGen.generateStackView();
	changelogStackView.tabname = "Changelog"

	// in *most*/all of the packages, the first fieldset is styled, "others" (changelogs, etc.) are not.
	let desc = panels.map(panel =>
		panel.getElementsWithTag("fieldset").map(h =>
			h.attr('style') ? h.html() : null
		).filter(Boolean).join('\n')
	);

	// in *most*/all of the packages, the first fieldset is styled, "others" (changelogs, etc.) are not.
	let changes = panels.map(panel =>
		panel.getElementsWithTag("fieldset").map(h => {
			if(h.attr('style')) return;
			return h.children().map(c => c.tag() !== 'a' ? c.html() : null);
		}).filter(Boolean).join(' ').split(/\n|,/g).join('\n')
	);

	detailsStackView.views.push(SileoGen.generateMarkdown(desc[0]));
	// check if changes has a length, if not, displays that no changes are found. 
	// removes whitespace (\s+) as it counts as part of a string's length, original string not affected
	changelogStackView.views.push(SileoGen.generateMarkdown(changes[0].replace(/\s+/g, '').length ? changes[0] : 'No changes for this package have been reported!'));

	detailsStackView.views.push(SileoGen.generateMarkdown("<span>This depiction has been automatically generated. It may be missing information.</span>"));

	let rootView = {
		"class": "DepictionTabView",
		"minVersion": "0.7",
		"tabs": [ 
            detailsStackView, 
            changelogStackView
        ]
    };
    
	return JSON.stringify(rootView);
}()); // function calls itself
