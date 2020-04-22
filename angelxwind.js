/*
Copyright (c) 2020, TylerD3V. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
	const detailsStackView = SileoGen.generateStackView();
	detailsStackView.tabname = 'Description'
	const changelogStackView = SileoGen.generateStackView();
	changelogStackView.tabname = 'Changelog'
    
    // description
	body.getElementsWithTag('p')
		.filter(h => h.parent().tag() === 'block')
		.map(dtxt => dtxt.html().replace(/\s+/g).length
			? detailsStackView.views.push(SileoGen.generateMarkdown(cleanHTML(dtxt.html().trim())))
			: null
		);

    // changes
    const changelogURL = body.getElementsWithTag('a')
		.filter(a => a.text().includes('Changelog'))[0];
    
	if(changelogURL && changelogURL.attr('href')) {
		downloadPage(absoluteURL(changelogURL.attr('href')), 'CLHead', 'CLBody');

        CLBody.getElementsWithTag('panel')[1]
			.children()
			.map(c => {
				if(c.tag() === 'label') {
					changelogStackView.views.push({ 'class': 'DepictionLabelView', 'text': c.text() });
				} else {
					c.children().filter(c => c.tag() === 'div').map(p => changelogStackView.views.push(SileoGen.generateMarkdown('• ' + p.children()[0].html())))
					changelogStackView.views.push(SileoGen.generateSeparator());
				}
			});
	} else {
		changelogStackView.views.push({ 'class': 'DepictionHeaderView', 'title': '0.0' });
		changelogStackView.views.push(SileoGen.generateMarkdown('No reported changes!'));
    }

    // links
    detailsStackView.views.push(SileoGen.generateSeparator());
    body.getElementsWithTag('label')
    .filter(a => a.parent().parent().tag() === 'a' && !a.text().includes('Karen\'s Repo') && !a.text().includes('View in Cydia') && !a.text().includes('Changelog'))
    .map(b => detailsStackView.views.push(SileoGen.generateTableButton(b.text(), b.attr('href'))))
    detailsStackView.views.push({ 'class': 'DepictionTableButtonView', 'title': 'View Original Depiction', 'action': absoluteURL('.') });
    detailsStackView.views.push(SileoGen.generateSeparator());
    detailsStackView.views.push(SileoGen.generateMarkdown('This depiction has been automatically generated.'));

    const rootView = {

        'class': 'DepictionTabView',
        'minVersion': '0.7',
        'tintColor': '#006565',
        'tabs': [

            detailsStackView,
            changelogStackView
        ]
	};
	
    return JSON.stringify(rootView);
}());