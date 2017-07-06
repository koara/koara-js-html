var fs = require('fs');
var path = require('path');
var koara = require('@koara/koara');
var koaraHtml = require('../lib/koara-html');
var modules = fs.readdirSync('testsuite/input');
var tests = [];

for(i in modules) {
	if(modules.hasOwnProperty(i) && path.basename(modules[i]) !== 'end2end.kd') {
		testcases = fs.readdirSync('testsuite/input/' + modules[i]);
		for(j in testcases) {
			if(path.extname(testcases[j]) === ".kd") {
				tests.push({module: modules[i], name: testcases[j].substr(0, testcases[j].length-3)})
			}
		}
	}
}

describe("Koara Compliancy Tests", function() {
	tests.forEach(function (test) {
		it(test.name + ' to HTML', function () {
			var kd = fs.readFileSync('testsuite/input/' + test.module + '/' + test.name + ".kd");
			var html = fs.readFileSync('testsuite/output/html5/' + test.module + '/' + test.name + ".htm");
            var parser = new koara.Parser();
            var document = parser.parse(kd);                    
            var renderer = new koaraHtml.Html5Renderer();
            document.accept(renderer);
            expect(renderer.getOutput()).toEqual(html.toString());
        });
	});
});