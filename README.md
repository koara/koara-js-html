[![Koara](http://www.koara.io/logo.png)](http://www.koara.io)

[![Build Status](https://img.shields.io/travis/koara/koara-js-html.svg)](https://travis-ci.org/koara/koara-js-html)
[![Coverage Status](https://img.shields.io/coveralls/koara/koara-js-html.svg)](https://coveralls.io/github/koara/koara-js-html?branch=master)
[![Latest Version](https://img.shields.io/npm/v/koara-html.svg)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/koara/koara-java-html/blob/master/LICENSE)

# koara-js-html
[Koara](http://www.koara.io) is a modular lightweight markup language. This project is for parsing Koara to Html.

## Getting Started
- Via Npm:

  ```bash
  npm install koara-html --save-dev
  ```
  

## Usage

Node:

```javascript
var koara = require('koara');
var koaraHtml = require('koara-html');

var parser = new koara.Parser();

//Enable which modules to parse (all are parsed by default)
parser.modules = ['paragraphs', 'headings', 'lists', 'links', 'images', 'formatting', 'blockquotes', 'code'];

//Parse string or file and generate AST
var document = parser.parse('Hello World!'); 

//Render as Html
var renderer = new koaraHtml.Html5Renderer();
document.accept(renderer);

console.log(renderer.getOutput());
```

Browser:

```javascript
<html>
  <body>
    <script src="koara.js"></script>
    <script src="koara-html.js"></script>     
    <script>
        var parser = new koara.Parser();
        
        //Enable which modules to parse (all are parsed by default)
        parser.modules = ['paragraphs', 'headings', 'lists', 'links', 'images', 'formatting', 'blockquotes', 'code'];

        //Parse string or file and generate AST
        var doc = parser.parse('Hello World!');
        
        //Render as Html
        var renderer = new koaraHtml.Html5Renderer();
        doc.accept(renderer);  
        
        console.log(renderer.getOutput());
     </script>
  </body>
</html>
```