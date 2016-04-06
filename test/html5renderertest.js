'use strict';

var koara = require('koara');
var koaraHtml = require('../lib/koara-html');

describe("Html5RendererTest", function() {
	var renderer;
	var document;

	beforeEach(function() {
		var parser = new koara.Parser();
		this.document = parser.parse("Test");
		this.renderer = new koaraHtml.Html5Renderer();
	});

	it("Test Basic", function() {
		this.document.accept(this.renderer);
		expect(this.renderer.getOutput()).toEqual("<p>Test</p>");
	});
	
	it("Test No Partial Result", function() {
		var expected = "<!DOCTYPE html>\n";
		expected += "<html>\n";
		expected += "  <body>\n";
		expected += "    <p>Test</p>\n";
		expected += "  </body>\n";
		expected += "</html>\n";
		
		this.renderer.partial = false;
		this.document.accept(this.renderer);
		expect(this.renderer.getOutput()).toEqual(expected);
	});
	
});