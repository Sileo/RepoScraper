/*
 BigBoss HTML Depiction Scraper
 
 Copyright (c) 2019, CoolStar. All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 3. All advertising materials mentioning features or use of this software must display the following acknowledgement:
    This product includes software developed by the Sileo Team.
 4. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY COOLSTAR "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var parseTag = function(el) {
	let tag = el.tag();
	if (tag === "label"){
		if (el.text().includes("Description")){
			return null;
		}

		let labelText = SileoGen.generateHeader(el.text());
		return labelText;
	} else if (tag === "table"){
		let stackView = SileoGen.generateStackView();

		let rows = el.getElementsWithTag("tr");
		rows.forEach(function(row, idx){
			let key = row.getElementsWithClassName("key")[0];
			let detail = row.getElementsWithClassName("detail")[0];

			if (key == null || detail == null){
				return;
			}

			if (key.tag() != "td" || detail.tag() != "td"){
				return;
			}

			let tableCell = SileoGen.generateTableText(key.text(), detail.text());
			stackView.views.push(tableCell);
		});
		return stackView;
	} else if (tag == "a" && el.className() == "button"){
		let href = el.attr("href");
		let button = SileoGen.generateTableButton(el.text(), href);
		return button;
	}
	return null;
};

var parseMain = function(){
	let panels = body.getElementsWithTag("panel");

	let detailsStackView = SileoGen.generateStackView();
	detailsStackView.tabname = "Details"

	let changelogStackView = SileoGen.generateStackView();
	changelogStackView.tabname = "Changelog"

	panels.forEach(function(panel, idx){
		let stackView = detailsStackView;

		let fieldsets = panel.getElementsWithTag("fieldset");
		fieldsets.forEach(function(fieldset, idx){
			let tables = fieldset.getElementsWithTag("table");
			let elements = fieldset.children();
			elements.forEach(function(el, i) {
				// Changelogs
				if(el.tag() === 'label' && el.text() === 'What\'s New') {
					let list = cleanHTML(elements[i+1].html()).replace(/\n\n/g, '');

					changelogStackView.views.push(SileoGen.generateMarkdown(list));
 				} else if (el.tag() == "div" && tables.length == 0) {
					let isLabelForChangeLog = elements[i-1].tag() === 'label' && elements[i-1].text() === 'What\'s New';
					if(isLabelForChangeLog) {
						return null;
					}
					
					let autoStackView = SileoGen.generateAutostackView(10);
					let screenshotsArr = new Array();
					let lastSize = {width: NaN, height: NaN, cornerRadius: 0};

					let images = el.getElementsWithTag("img");
					images.forEach(function(img, idx){
						let width = parseFloat(img.attr("width"));
						let height = parseFloat(img.attr("height"));
						let src = img.attr("src");
						let alt = img.attr("alt");

						let aspectRatio = height / width;
						var isScreenshot = false;

						SileoGen.screenshotSizes.forEach(function(size, idx){
							if (isNaN(height) || isNaN(width)){
								isScreenshot = true;
							}
							let screenshotAspectRatio = size.height / size.width;
							if (aspectRatio > screenshotAspectRatio - 0.01 && aspectRatio < screenshotAspectRatio + 0.01){
								isScreenshot = true;
							}
						});

						if (isScreenshot){
							let screenshot = SileoGen.generateScreenshot(src, alt);
							screenshotsArr.push(screenshot);
							if (!(isNaN(width) && !isNaN(height))){
								lastSize.width = width;
								lastSize.height = height;
							}
							if (isNaN(lastSize.width)){
								lastSize.width = width;
							}
							if (isNaN(lastSize.height)){
								lastSize.height = height;
							}
						} else {
							let image = SileoGen.generateImage(src, width, height);
							image.preferredWidth = width;
							autoStackView.views.push(image);
						}
					});

					if (autoStackView.views.length > 0) {
						stackView.views.push(autoStackView);
					}

					let cleanedHTML = cleanHTML(el.html());
					let markdown = SileoGen.generateMarkdown(cleanedHTML);
					markdown.useRawFormat = true;
					stackView.views.push(markdown);

					let commonSize = SileoGen.mostCommonSize;
					if (isNaN(lastSize.width) && !isNaN(lastSize.height)){
						lastSize.width = lastSize.height * (commonSize.width/commonSize.height);
					} else if (isNaN(lastSize.height) && !isNaN(lastSize.width)){
						lastSize.height = lastSize.width * (commonSize.height/commonSize.width);
					}

					if (screenshotsArr.length > 0){
						stackView.views.push(SileoGen.generateSeparator());
						let screenshots = SileoGen.generateScreenshots(lastSize.width, lastSize.height, 8);
						screenshots.screenshots = screenshotsArr;
						stackView.views.push(screenshots);
					}
				} else if (el.tag() == "div"){
					let divElements = el.children();
					divElements.forEach(function(el, idx){
						let item = parseTag(el);
						if (item != null){
							stackView.views.push(item);
						}
					});
				} else {
					let item = parseTag(el);
					if (item != null){
						stackView.views.push(item);
					}
				}
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
}
parseMain();