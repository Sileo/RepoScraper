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

    // description
    body.getElementsWithTag('fieldset') // <fieldset id='description'>...</fieldset>
        .filter(h => Boolean && h.attr('id') === 'description')
        .map(dtxt => dtxt.children()[1].html().replace(/\s+/g).length
            ? detailsStackView.views.push(SileoGen.generateMarkdown(cleanHTML(dtxt.children()[1].html().trim())))
            : null
        );

    // changes
    body.getElementsWithTag('fieldset')
        .filter(c => Boolean && c.children().length && c.children()[0].tag() === 'label' && c.children()[0].text() === 'What\'s New')
        .map(c => { 
            changelogStackView.views.push({ 'class' : 'DepictionSubheaderView', 'title' : 'What\'s New', 'useBoldText' : true, 'useBottomMargin' : false });
            changelogStackView.views.push(SileoGen.generateSeparator());
            changelogStackView.views.push(SileoGen.generateMarkdown(cleanHTML(c.children()[1].html()) || 'No reported changes'));
        });
    
    detailsStackView.views.push(SileoGen.generateSeparator());

    const screenshots = SileoGen.generateScreenshots(160, 160, 8);
    body.getElementsWithTag('img') // get all images in the body of the page
        .map(img => screenshots.screenshots.push(SileoGen.generateScreenshot(img.attr('src'), '<3 Khafra')));
    const bannerURL = screenshots.screenshots[Math.floor(Math.random() * screenshots.screenshots.length)]

    // information (price, updated)
    const info = body.getElementsWithTag('table')
        .filter(t => t.className() === 'information')[0]
        
    for(let i = 0; i <= info.getElementsWithClassName('key').length - 1; i++) {
        const key = info.getElementsWithClassName('key')[i].text();
        const detail = info.getElementsWithClassName("detail")[i].text();
        
        detailsStackView.views.push(SileoGen.generateTableText(key, detail));
    }
    
    detailsStackView.views.push(SileoGen.generateSeparator());

    // check if any screenshots are present
    if(screenshots.screenshots.length) {
        detailsStackView.views.push(screenshots);
        detailsStackView.views.push(SileoGen.generateSeparator());
    }

    if(!changelogStackView.views.length) {
        changelogStackView.views.push({ 'class' : 'DepictionSubheaderView', 'title' : 'No reported changes!', 'useBoldText' : true, 'useBottomMargin' : false });
    }

    // get all URLs on the page, determine whether they should be converted to a button or should be displayed in description
    body.getElementsWithTag('a') 
        .filter(tag => tag.className() === 'button' && !tag.text().includes('Developer Packages'))
        .map(url => detailsStackView.views.push(SileoGen.generateTableButton(url.text(), absoluteURL(url.attr('href')))));

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