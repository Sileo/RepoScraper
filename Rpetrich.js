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
	const detailsStackView = SileoGen.generateStackView();
	detailsStackView.tabname = 'Description'

	const changelogStackView = SileoGen.generateStackView();
	changelogStackView.tabname = 'Changelog'

	const screenshots = SileoGen.generateScreenshots(160, 284, 8);

	// description
	body.getElementsWithTag('fieldset') // <fieldset id='description'>...</fieldset>
        .filter(h => Boolean && h.attr('style'))
		.map(dtxt => dtxt.children().length 
			? detailsStackView.views.push(SileoGen.generateMarkdown(cleanHTML(dtxt.children()[0].html())))
			: null
		);
	
	// changelogs
	body.getElementsWithTag('fieldset') // <fieldset id='description'>...</fieldset>
        .filter(h => Boolean && !h.attr('style'))
		.map(dtxt => dtxt.children().map(c => c.tag() !== 'a' ? changelogStackView.views.push(SileoGen.generateMarkdown(cleanHTML(c.html()))) : null));

	// images
	body.getElementsWithTag('img')
		.filter(i => 
			Boolean && 
			i.attr('src') && i.parent().tag() !== 'a' &&
			(i.parent() !== 'div' && i.parent().attr('class') !== 'header')
		)
		.map(img => screenshots.screenshots.push(SileoGen.generateScreenshot(img.attr('src'), '<3 Khafra')));

	const bannerURL = screenshots.screenshots[Math.floor(Math.random() * screenshots.screenshots.length)]

	if(screenshots.screenshots.length) {
		detailsStackView.views.push(SileoGen.generateSeparator());
		detailsStackView.views.push(screenshots);
	} 
	
	detailsStackView.views.push(SileoGen.generateSeparator());

	// links
	body.getElementsWithTag('a') 
		.map(url => detailsStackView.views.push(SileoGen.generateTableButton(url.text(), url.attr('href'))));
		
	detailsStackView.views.push(SileoGen.generateTableButton('View Original Depiction', '.'));
	detailsStackView.views.push(SileoGen.generateSeparator());
	detailsStackView.views.push(SileoGen.generateMarkdown('This depiction has been automatically generated. - Khafra'));

	const rootView = {
		'class': 'DepictionTabView',
		'minVersion': '0.7',
		'headerImage': absoluteURL(bannerURL && bannerURL.url ? bannerURL.url : ''), // get a random image everytime!
		'tabs': [ 
            detailsStackView, 
            changelogStackView
        ]
    };
    
	return JSON.stringify(rootView);
}()); // function calls itself