/*
 Sileo Depiction Generator Utilities
 
 Copyright (c) 2019, CoolStar. All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 3. All advertising materials mentioning features or use of this software must display the following acknowledgement:
    This product includes software developed by the Sileo Team.
 4. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY COOLSTAR "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var SileoGen = new Object();

SileoGen.version = "1.0";

SileoGen.screenshotSizes = [
	{width: 320, height: 480, cornerRadius: 16}, //iPhone 4/4S
	{width: 320, height: 568, cornerRadius: 16}, //iPhone 5/5S/SE
	{width: 375, height: 667, cornerRadius: 16}, //iPhone 6/6S/7/8
	{width: 414, height: 736, cornerRadius: 16}, //iPhone 6+/6S+/7+/8+
	{width: 375, height: 812, cornerRadius: 25}, //iPhone X/XS
	{width: 414, height: 896, cornerRadius: 25} //iPhone XR/XS Max
];

SileoGen.mostCommonSize = {
	width: 414,
	height: 736,
	cornerRadius: 16
};

SileoGen.generateHeader = function(text){
	return {
		"class": "DepictionHeaderView",
		"title": text
	};
};

SileoGen.generateSubheader = function(text){
	return {
		"class": "DepictionSubheaderView",
		"title": text
	};
};

SileoGen.generateLabel = function(text, fontSize, fontWeight, textColor){
	return {
		"class": "DepictionLabelView",
		"text": text,
		"fontSize": fontSize,
		"fontWeight": fontWeight,
		"textColor": textColor
	};
}

SileoGen.generateSeparator = function(){
	return {
		"class": "DepictionSeparatorView"
	};
};

SileoGen.trimSeparator = function(array){
	if (array[array.length - 1].class == "DepictionSeparatorView"){
		array.pop();
	}
};

SileoGen.generateTableText = function(title, text){
	return {
		"class": "DepictionTableTextView",
		"text": text,
		"title": title
	};
};

SileoGen.generateTableButton = function(title, action){
	return {
		"class": "DepictionTableButtonView",
		"title": title,
		"action": absoluteURL(action)
	};
};

SileoGen.generateStackView = function(){
	return {
		"class": "DepictionStackView",
		"views": Array()
	};
};

SileoGen.generateAutostackView = function(horizontalSpacing){
	return {
		"class": "DepictionAutoStackView",
		"horizontalSpacing": horizontalSpacing,
		"views": Array()
	};
}

SileoGen.generateMarkdown = function(html){
	return {
		"class": "DepictionMarkdownView",
		"markdown": html
	};
};

SileoGen.generateImage = function(URL, width, height){
	return {
		"class": "DepictionImageView",
		"URL": absoluteURL(URL),
		"width": width,
		"height": height,
		"cornerRadius": 5
	};
};

SileoGen.generateScreenshot = function(url, accessibilityText){
	return {
		"url": absoluteURL(url),
		"accessibilityText": accessibilityText
	};
};

SileoGen.generateScreenshots = function(width, height, cornerRadius){
	return {
		"class": "DepictionScreenshotsView",
		"itemCornerRadius": cornerRadius,
		"itemSize": "{" + width + ", " + height + "}",
		"screenshots": Array()
	};
};
