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
    const descriptionStackView = { 'class': 'DepictionStackView', 'views': [], 'tabname': 'Description' };
    const changelogStackView = { 'class': 'DepictionStackView', 'views': [], 'tabname': 'Changes' };
    const rootView = { 'class': 'DepictionTabView', 'minVersion': '0.7', 'tabs': [ descriptionStackView, changelogStackView ] };
    const images = { 'class': 'DepictionScreenshotsView', 'screenshots': [], 'itemCornerRadius': 8, 'itemSize': '{160, 284}' };

    // description
    body.getElementsWithTag('div')
        .filter(div => div.parent().tag() === 'fieldset')[0]
        .children()
        .map(p => descriptionStackView.views.push({ 'class': 'DepictionMarkdownView', 'markdown': p.html() }))
        
    // banner
    const banner = body.getElementsWithTag('img')
        .filter(i_uf => i_uf.className() !== 'icon') // so logos, etc. get filtered
        .map(i_f => absoluteURL(i_f.attr('src')));

    // images
    const SCURL = body.getElementsWithTag('a').filter(a => a.text().includes('Screenshots'));

    if(SCURL && SCURL.length) {
        downloadPage(absoluteURL(SCURL[0].attr('href')), 'SCHead', 'SCBody'); // download page html, get images
        SCBody.getElementsWithTag('img')
            .map(img => images.screenshots.push({ 'url': absoluteURL(img.attr('src')), 'accessibilityText': '<3 Khafra' }))
    }

    if(images.screenshots.length) {
        descriptionStackView.views.push({ 'class': 'DepictionSeparatorView' });
        descriptionStackView.views.push(images);
        descriptionStackView.views.push({ 'class': 'DepictionSeparatorView' });
        rootView['headerImage'] = banner.length ? banner[0] : images.screenshots[Math.floor(Math.random() * images.screenshots.length)].url
    }

    // changelog
    const CLURL = body.getElementsWithTag('a').filter(a => a.text().includes('Recent Changes'));

    if(CLURL && CLURL.length) {
        downloadPage(absoluteURL(CLURL[0].attr('href')), 'CLHead', 'CLBody');
        CLBody.getElementsWithTag('div')
            .map(d => {
                const [version, ...desc] = d.text().split(':');
                changelogStackView.views.push({ 'class': 'DepictionHeaderView', 'title': version, 'useBoldText': true  });
                changelogStackView.views.push({ 'class': 'DepictionSeparatorView' });
                changelogStackView.views.push({ 'class': 'DepictionMarkdownView', 'markdown': desc.join() });
            });
    }

    // href
    body.getElementsWithTag('a')
        .filter(a => a.parent().tag() !== 'p' && !a.text().match(/Recent Changes|Screenshots/g))
        .map(u => descriptionStackView.views.push({ 'class': 'DepictionTableButtonView', 'title': u.text(), 'action': absoluteURL(u.attr('href')) }));

    // footer + static stuff
    descriptionStackView.views.push({ 'class': 'DepictionTableButtonView', 'title': 'View Original Depiction', 'action': absoluteURL('.') });
    descriptionStackView.views.push({ 'class': 'DepictionSeparatorView' });
    descriptionStackView.views.push({ 'class': 'DepictionMarkdownView', 'markdown': 'This depiction has been automatically generated. - Khafra (MacCiti)' });

    return JSON.stringify(rootView);
}());