/*
 MacCiti HTML Depiction Scraper
 
 Copyright (c) 2019, CoolStar. All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 3. All advertising materials mentioning features or use of this software must display the following acknowledgement:
    This product includes software developed by the Sileo Team.
 4. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY COOLSTAR "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

 var bannerURL = "";

var parseTag = function(el, changelogStackView){
	let tag = el.tag();
	if (tag == "label"){
		if (el.text().includes("Description")){
			return null;
		}

		let labelText = SileoGen.generateHeader(el.text());
		return labelText;
	} else if (tag == "a" && el.attr("target") == "_new"){
		let href = el.attr("href");
		if (el.text().includes("Screenshots")){
			downloadPage(absoluteURL(href), "screenshotsHead", "screenshotsBody");
			return parseScreenshots();
		} else if (el.text().includes("Changes")){
			downloadPage(absoluteURL(href), "changesHead", "changesBody");
			parseChangelogs(changelogStackView);
			return null;
		}
		let button = SileoGen.generateTableButton(el.text(), href);
		return button;
	} else if (tag == "img"){
		let src = el.attr("src");
		if (bannerURL == "") {
			bannerURL = absoluteURL(src);
			return null;
		}
		let image = SileoGen.generateImage(src, 738, 0);
		return image;
	}
	return null;
};

var parseScreenshots = function(){
	var screenshots = SileoGen.generateScreenshots(160, 284, 8);

	let imgs = screenshotsBody.getElementsWithTag("img");
	imgs.forEach(function(img, idx){
		let src = img.attr("src");

		var screenshot = SileoGen.generateScreenshot(src, "Screenshot");
		screenshots.screenshots.push(screenshot);
	});

	return screenshots;
};

var parseChangelogs = function(changelogStackView){
	var changes = changesBody.getElementsWithTag("div");
	changes.forEach(function(change, idx){
		let label = change.getElementsWithTag("label")[0];
		if (label != null){
			let title = "Version " + label.text().replace(":","");
			let cleanedHTML = cleanHTML(change.html()).substr(label.text().length + 1);

			var subHeaderView = SileoGen.generateSubheader(title);
			subHeaderView.useBoldText = true;
			subHeaderView.useBottomMargin = false;
			changelogStackView.views.push(subHeaderView);

			var markdownView = SileoGen.generateMarkdown(cleanedHTML);
			markdownView.useSpacing = true;
			changelogStackView.views.push(markdownView);
		}
	});
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
			let elements = fieldset.children();
			elements.forEach(function(el, idx){
				if (el.tag() == "div" ) {
					let cleanedHTML = cleanHTML(el.html());
					let markdown = SileoGen.generateMarkdown(cleanedHTML);
					markdown.useRawFormat = true;
					stackView.views.push(markdown);
				} else {
					let item = parseTag(el, changelogStackView);
					if (item != null){
						stackView.views.push(item);
					}
				}
			});
		});

		stackView.views.push(SileoGen.generateSeparator());
	});

	let origButton = SileoGen.generateTableButton("Original Depiction", ".");
	detailsStackView.views.push(origButton);

	let disclaimer = SileoGen.generateMarkdown("<span style='font-size: 12pt;color: #666666;text-align: center;'>This depiction has been automatically generated. It may be missing information.</span>");
	disclaimer.useRawFormat = true;
	detailsStackView.views.push(disclaimer);
	
	changelogStackView.views.push(SileoGen.generateMarkdown("Changelogs are not available for this package."));

	let rootView = {
		"class": "DepictionTabView",
		"minVersion": "0.7",
		"headerImage": bannerURL,
		"tabs": [detailsStackView, changelogStackView]
	};
	return JSON.stringify(rootView);
}
parseMain();
