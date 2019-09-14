(function() {

    // Depiction Tabs
    const detailsStackView = { 'class': 'DepictionStackView', 'views': [], 'tabname': 'Details'};
    const changelogStackView = { 'class': 'DepictionStackView', 'views': [], 'tabname': 'Changelog'};

    // Description
	body.getElementsWithTag('p')
		.filter(p => p.parent().tag() === 'block')
		.map(d => detailsStackView.views.push(SileoGen.generateMarkdown(d.html())))

    detailsStackView.views.push(SileoGen.generateSeparator());
    changelogStackView.views.push(SileoGen.generateMarkdown('**Changelogs are not natively supported yet**'));

    // Links
    body.getElementsWithTag('label')
    .filter(a => a.parent().parent().tag() === 'a' && !a.text().includes('View in Cydia') && !a.text().includes('Changelog'))
    .map(b => detailsStackView.views.push(SileoGen.generateTableButton(b.text(), b.attr('href'))))

    detailsStackView.views.push(SileoGen.generateSeparator());

    detailsStackView.views.push({ 'class': 'DepictionSeperatorView' });    
    detailsStackView.views.push(SileoGen.generateMarkdown('This Depiction has been automatically generated. It may be missing information. **-Flexstar**'));
    detailsStackView.views.push({ 'class': 'DepictionSeperatorView' });
    detailsStackView.views.push({ 'class': 'DepictionTableButtonView', 'title': 'View Original Depiction', 'action': absoluteURL('.') });

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