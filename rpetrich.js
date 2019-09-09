/*
Copyright 2019 Khafra

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
	const detailsStackView = { 'class': 'DepictionStackView', 'views': [], 'tabname': 'Description' }
	const changelogStackView = { 'class': 'DepictionStackView', 'views': [], 'tabname': 'Changelog' }

	const screenshots = { "class": "DepictionScreenshotsView", "itemCornerRadius": 8, "itemSize": '{160, 284}', "screenshots": [] }

	// description
	body.getElementsWithTag('fieldset') // <fieldset id='description'>...</fieldset>
        .filter(h => h.attr('style') && h.children().length)
		.map(dtxt => {
			detailsStackView.views.push({ "class": "DepictionMarkdownView", "markdown": cleanHTML(dtxt.children()[0].html()), 'useRawFormat': true });
			detailsStackView.views.push({ "class": "DepictionSeparatorView" });
		});
	
	// changelogs
	body.getElementsWithTag('fieldset') // <fieldset id='description'>...</fieldset>
		.filter(f => !f.attr('style') && f.children()[0].tag() === 'div' && f.children()[0].children().length)
		.map(_ => {
			changelogStackView.views.push({ "class": "DepictionMarkdownView", "markdown": _.html(), 'useRawFormat': true });
			changelogStackView.views.push({ "class": "DepictionSeparatorView" });
		});

	if(changelogStackView.views.length === 0) {
		changelogStackView.views.push({ 'class': 'DepictionHeaderView', 'title': '0.0' });
		changelogStackView.views.push({ "class": "DepictionMarkdownView", "markdown": 'No reported changes!' });
	}

	// images
	body.getElementsWithTag('img')
		.filter(i => 
			i.attr('src') && i.parent().tag() !== 'a' &&
			(i.parent() !== 'div' && i.parent().className() !== 'header')
		)
		.map(img => screenshots.screenshots.push({ "url": absoluteURL(img.attr('src')), "accessibilityText": '<3 Khafra' }));

	if(screenshots.screenshots.length) {
		detailsStackView.views.push({ "class": "DepictionSeparatorView" });
		detailsStackView.views.push(screenshots);
		detailsStackView.views.push({ "class": "DepictionSeparatorView" });
	} 

	// links
	body.getElementsWithTag('a') 
		.map(url => detailsStackView.views.push({ "class": "DepictionTableButtonView", "title": url.text(), "action": absoluteURL(url.attr('href')) }));
		
	detailsStackView.views.push({ "class": "DepictionTableButtonView", "title": 'View Original Depiction', "action": absoluteURL('.') });
	detailsStackView.views.push({ "class": "DepictionSeparatorView" });
	detailsStackView.views.push({ "class": "DepictionMarkdownView", "markdown": 'This depiction has been automatically generated. - Khafra' });

	const rootView = {
		'class': 'DepictionTabView',
		'minVersion': '0.7',
		'tintColor': '#006400',
		'tabs': [ 
            detailsStackView, 
            changelogStackView
        ]
    };
	
	if(screenshots.screenshots.length) {
		rootView['headerImage'] = absoluteURL(screenshots.screenshots[Math.floor(Math.random() * screenshots.screenshots.length)].url);
	}

	return JSON.stringify(rootView);
}()); // function calls itself