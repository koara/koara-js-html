[![Koara](http://www.koara.io/logo.png)](http://www.koara.io)

[![Build Status](https://img.shields.io/travis/koara/koara-js-html.svg)](https://travis-ci.org/koara/koara-js-html)
[![Coverage Status](https://img.shields.io/coveralls/koara/koara-js-html.svg)](https://coveralls.io/github/koara/koara-js-html?branch=master)
[![Latest Version](https://img.shields.io/npm/v/koara-html.svg)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/koara/koara-js-html/blob/master/LICENSE)

# Koara-js-html
[Koara](http://www.koara.io) is a modular lightweight markup language. This project can render the koara AST to Html in Javascript.  
The AST is created by the [core koara parser](https://github.com/koara/koara-js).

## Getting started
- Download [ZIP file]()
- Npm

  ```bash
  npm install koara-html --save-dev
  ```
  
- Bower

  ```xml
  bower install koara-html
  ```

## Usage
- Node

  ```js
  var koara = require('koara');
  var koaraHtml = require('koara-html');

  var parser = new koara.Parser();
  var result = parser.parse("Hello World!");
  var renderer = new koaraHtml.Html5Renderer();
  result.accept(renderer);
  console.log(renderer.getOutput());
  ```
  
- Browser
  
  ```js
  <!doctype html>
  <html>
    <body>
      <script type="text/javascript" src="koara.min.js"></script>
      <script type="text/javascript" src="koara-html.min.js"></script>
      <script type="text/javascript">
        var parser = new koara.Parser();
        var result = parser.parse("Hello World!");
        var renderer = new koaraHtml.Html5Renderer();
        result.accept(renderer);
        document.write(renderer.getOutput());
      </script>
    </body>
  </html>
  ```

## Configuration
You can configure the Renderer:

-  **renderer.partial**  
   Default:	`true`
   
   When false, the output will be wrapped with a `<html>` and `<body>` tag to make a complete Html document.