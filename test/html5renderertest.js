'use strict';

var koara = require('koara');
var koaraHtml = require('../lib/koara-html');

describe("Html5RendererTest", function() {

	beforeEach(function() {
		this.parser = new koara.Parser();
		this.renderer = new koaraHtml.Html5Renderer();
	});

	it("testRender", function() {
        this.document = this.parser.parse("Test");
		this.document.accept(this.renderer);
		expect(this.renderer.getOutput()).toEqual("<p>Test</p>");
	});

    it("testRenderHardwrapTrue", function() {
        this.renderer.hardWrap = true;
        this.document = this.parser.parse("a\nb");
        this.document.accept(this.renderer);
        expect(this.renderer.getOutput()).toEqual("<p>a<br>\nb</p>");
    });
	
	it("testRenderPartialFalse", function() {
		var expected = "<!DOCTYPE html>\n";
		expected += "<html>\n";
		expected += "  <body>\n";
		expected += "    <p>Test</p>\n";
		expected += "  </body>\n";
		expected += "</html>\n";
		
		this.renderer.partial = false;
        this.document = this.parser.parse("Test");
		this.document.accept(this.renderer);
		expect(this.renderer.getOutput()).toEqual(expected);
	});

    it("testHeadingIdsTrue", function() {
        this.renderer.headingIds = true;
        this.document = this.parser.parse("= A");
        this.document.accept(this.renderer);
        expect(this.renderer.getOutput()).toEqual("<h1 id=\"a\">A</h1>");
    });

    it("testHeadingIdsTrueMultipleWords", function() {
        this.renderer.headingIds = true;
        this.document = this.parser.parse("= This is a test");
        this.document.accept(this.renderer);
        expect(this.renderer.getOutput()).toEqual("<h1 id=\"this_is_a_test\">This is a test</h1>");

    });
	
});