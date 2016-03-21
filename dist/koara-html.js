(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/koara-html');

},{"./lib/koara-html":2}],2:[function(require,module,exports){
"use strict";

var used = [],
    exports = module.exports = {};

exports.Html5Renderer = require("./koara/html/html5renderer");

},{"./koara/html/html5renderer":3}],3:[function(require,module,exports){
"use strict";

function Html5Renderer() {
	this.out = "";
}

Html5Renderer.prototype = {
	constructor: Html5Renderer,

	visitDocument: function(node) {
		this.out = "";
		this.level = 0;
		this.listSequence = [];
		node.childrenAccept(this);
	},

	visitHeading: function(node) {
		this.out += this.indent() + "<h" + 	node.value + ">";
		node.childrenAccept(this);
		this.out += "</h" + node.value + ">\n";
		if (!node.isNested()) {
            this.out += "\n";
        }
	},

	visitBlockQuote: function(node) {
		this.out += this.indent() + "<blockquote>";
		if (node.children && node.children.length > 0) {
            this.out += "\n";
		}
        this.level++;
        node.childrenAccept(this);
        this.level--;
        this.out += this.indent() + "</blockquote>\n";
        if (!node.isNested()) {
           this.out += "\n";
        }
	},

	visitListBlock: function(node) {
		this.listSequence.push(0);
		var tag = node.ordered ? "ol" : "ul";

		this.out += this.indent() + "<" + tag + ">\n";
		this.level++;
		node.childrenAccept(this);
		this.level--;
		this.out += this.indent() + "</" + tag + ">\n";
		if (!node.isNested()) {
            this.out += "\n";
		}
		this.listSequence.pop();
	},

	visitListItem: function(node) {
		var seq = Number(this.listSequence[this.listSequence.length - 1]) + 1;

		this.listSequence[this.listSequence.length - 1] = seq;

        this.out += this.indent() + "<li";
		if (node.number && (seq !== Number(node.number))) {
			this.out += " value=\"" + node.number + "\"";
			this.listSequence.push(node.number);
		}
		this.out += ">";
		if (node.children && node.children.length > 0) {
			var block = (node.children[0].constructor.name === "Paragraph" || node.children[0].constructor.name === "BlockElement");

			if (node.children.length > 1 || !block) {
                this.out += "\n";
            }
			this.level++;
			node.childrenAccept(this);
			this.level--;
			if (node.children.length > 1 || !block) {
				this.out += this.indent();
			}
		}
		this.out += "</li>\n";
	},

	visitCodeBlock: function(node) {
		this.out += this.indent() + "<pre><code";
		if (node.language) {
			this.out += " class=\"language-" + this.escape(node.language) + "\"";
		}
		this.out += ">";
		this.out += this.escape(node.value) + "</code></pre>\n";
		if (!node.isNested()) {
            this.out += "\n";
        }
	},

	visitParagraph: function(node) {
		if (node.isNested() && (node.parent.constructor.name === "ListItem") && node.isSingleChild()) {
			node.childrenAccept(this);
		} else {
			this.out += this.indent() + "<p>";
			node.childrenAccept(this);
			this.out += "</p>\n";

			if (!node.isNested()) {
				this.out += "\n";
			}
		}
	},

	visitBlockElement: function(node) {
		if (node.isNested() && (node.parent.constructor.name === "ListItem") && node.isSingleChild()) {
			node.childrenAccept(this);
		} else {
			this.out += this.indent();
			node.childrenAccept(this);
			if (!node.isNested()) {
				this.out += "\n";
			}
		}
	},

	visitImage: function(node) {
		this.out += "<img src=\"" + this.escapeUrl(node.value) + "\" alt=\"";
		node.childrenAccept(this);
		this.out += "\" />";
	},

	visitLink: function(node) {
		this.out += "<a href=\"" + this.escapeUrl(node.value.toString()) + "\">";
		node.childrenAccept(this);
		this.out += "</a>";
	},

	visitStrong: function(node) {
		this.out += "<strong>";
		node.childrenAccept(this);
		this.out += "</strong>";
	},

	visitEm: function(node) {
		this.out += "<em>";
		node.childrenAccept(this);
		this.out += "</em>";
	},

	visitCode: function(node) {
		this.out += "<code>";
		node.childrenAccept(this);
		this.out += "</code>";
	},

	visitText: function(node) {
		this.out += this.escape(node.value);
	},

	visitLineBreak: function(node) {
		this.out += "<br>\n" + this.indent();
		node.childrenAccept(this);
	},

	escapeUrl: function(text) {
        return text.replace(/ /gm, "%20").
            replace(/\"/gm, "%22").
            replace(/`/gm, "%60").
            replace(/</gm, "%3C").
            replace(/>/gm, "%3E").
            replace(/\[/gm, "%5B").
            replace(/\]/gm, "%5D").
            replace(/\\/gm, "%5C");
	},

	indent: function() {
		var repeat = this.level * 2;
        var ind = "";

		for (var i = repeat - 1; i >= 0; i--) {
			ind += " ";
		}
		return ind;
	},

	escape: function(text) {
		return text.replace(/&/gm, "&amp;").
            replace(/</gm, "&lt;").
            replace(/>/gm, "&gt;").
            replace(/\"/gm, "&quot;");
	},

	getOutput: function() {
        return this.out.trim();
	}

};

module.exports = Html5Renderer;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5keS9naXQva29hcmEva29hcmEtanMtaHRtbC9pbmRleC5qcyIsIi9Vc2Vycy9hbmR5L2dpdC9rb2FyYS9rb2FyYS1qcy1odG1sL2xpYi9rb2FyYS1odG1sLmpzIiwiL1VzZXJzL2FuZHkvZ2l0L2tvYXJhL2tvYXJhLWpzLWh0bWwvbGliL2tvYXJhL2h0bWwvaHRtbDVyZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDOzs7QUNBNUMsWUFBWSxDQUFDOztBQUViLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDYixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbEMsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQzs7O0FDTDlELFlBQVksQ0FBQzs7QUFFYixTQUFTLGFBQWEsR0FBRztDQUN4QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNmLENBQUM7O0FBRUQsYUFBYSxDQUFDLFNBQVMsR0FBRztBQUMxQixDQUFDLFdBQVcsRUFBRSxhQUFhOztDQUUxQixhQUFhLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7RUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztFQUNmLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0VBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsRUFBRTs7Q0FFRCxZQUFZLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcs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RCxNQUFNLEVBQUUsU0FBUyxJQUFJLEVBQUU7RUFDdEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7WUFDekIsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0QyxFQUFFOztDQUVELFNBQVMsRUFBRSxXQUFXO1FBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLEVBQUU7O0FBRUYsQ0FBQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDO0FBQy9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIva29hcmEtaHRtbCcpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdXNlZCA9IFtdLFxuICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5leHBvcnRzLkh0bWw1UmVuZGVyZXIgPSByZXF1aXJlKFwiLi9rb2FyYS9odG1sL2h0bWw1cmVuZGVyZXJcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gSHRtbDVSZW5kZXJlcigpIHtcblx0dGhpcy5vdXQgPSBcIlwiO1xufVxuXG5IdG1sNVJlbmRlcmVyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IEh0bWw1UmVuZGVyZXIsXG5cblx0dmlzaXREb2N1bWVudDogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ID0gXCJcIjtcblx0XHR0aGlzLmxldmVsID0gMDtcblx0XHR0aGlzLmxpc3RTZXF1ZW5jZSA9IFtdO1xuXHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdH0sXG5cblx0dmlzaXRIZWFkaW5nOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5pbmRlbnQoKSArIFwiPGhcIiArIFx0bm9kZS52YWx1ZSArIFwiPlwiO1xuXHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0dGhpcy5vdXQgKz0gXCI8L2hcIiArIG5vZGUudmFsdWUgKyBcIj5cXG5cIjtcblx0XHRpZiAoIW5vZGUuaXNOZXN0ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5vdXQgKz0gXCJcXG5cIjtcbiAgICAgICAgfVxuXHR9LFxuXG5cdHZpc2l0QmxvY2tRdW90ZTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxibG9ja3F1b3RlPlwiO1xuXHRcdGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5vdXQgKz0gXCJcXG5cIjtcblx0XHR9XG4gICAgICAgIHRoaXMubGV2ZWwrKztcbiAgICAgICAgbm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcbiAgICAgICAgdGhpcy5sZXZlbC0tO1xuICAgICAgICB0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8L2Jsb2NrcXVvdGU+XFxuXCI7XG4gICAgICAgIGlmICghbm9kZS5pc05lc3RlZCgpKSB7XG4gICAgICAgICAgIHRoaXMub3V0ICs9IFwiXFxuXCI7XG4gICAgICAgIH1cblx0fSxcblxuXHR2aXNpdExpc3RCbG9jazogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMubGlzdFNlcXVlbmNlLnB1c2goMCk7XG5cdFx0dmFyIHRhZyA9IG5vZGUub3JkZXJlZCA/IFwib2xcIiA6IFwidWxcIjtcblxuXHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxcIiArIHRhZyArIFwiPlxcblwiO1xuXHRcdHRoaXMubGV2ZWwrKztcblx0XHRub2RlLmNoaWxkcmVuQWNjZXB0KHRoaXMpO1xuXHRcdHRoaXMubGV2ZWwtLTtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8L1wiICsgdGFnICsgXCI+XFxuXCI7XG5cdFx0aWYgKCFub2RlLmlzTmVzdGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMub3V0ICs9IFwiXFxuXCI7XG5cdFx0fVxuXHRcdHRoaXMubGlzdFNlcXVlbmNlLnBvcCgpO1xuXHR9LFxuXG5cdHZpc2l0TGlzdEl0ZW06IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR2YXIgc2VxID0gTnVtYmVyKHRoaXMubGlzdFNlcXVlbmNlW3RoaXMubGlzdFNlcXVlbmNlLmxlbmd0aCAtIDFdKSArIDE7XG5cblx0XHR0aGlzLmxpc3RTZXF1ZW5jZVt0aGlzLmxpc3RTZXF1ZW5jZS5sZW5ndGggLSAxXSA9IHNlcTtcblxuICAgICAgICB0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8bGlcIjtcblx0XHRpZiAobm9kZS5udW1iZXIgJiYgKHNlcSAhPT0gTnVtYmVyKG5vZGUubnVtYmVyKSkpIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiIHZhbHVlPVxcXCJcIiArIG5vZGUubnVtYmVyICsgXCJcXFwiXCI7XG5cdFx0XHR0aGlzLmxpc3RTZXF1ZW5jZS5wdXNoKG5vZGUubnVtYmVyKTtcblx0XHR9XG5cdFx0dGhpcy5vdXQgKz0gXCI+XCI7XG5cdFx0aWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgYmxvY2sgPSAobm9kZS5jaGlsZHJlblswXS5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIlBhcmFncmFwaFwiIHx8IG5vZGUuY2hpbGRyZW5bMF0uY29uc3RydWN0b3IubmFtZSA9PT0gXCJCbG9ja0VsZW1lbnRcIik7XG5cblx0XHRcdGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDEgfHwgIWJsb2NrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdXQgKz0gXCJcXG5cIjtcbiAgICAgICAgICAgIH1cblx0XHRcdHRoaXMubGV2ZWwrKztcblx0XHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0XHR0aGlzLmxldmVsLS07XG5cdFx0XHRpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggPiAxIHx8ICFibG9jaykge1xuXHRcdFx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLm91dCArPSBcIjwvbGk+XFxuXCI7XG5cdH0sXG5cblx0dmlzaXRDb2RlQmxvY2s6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSB0aGlzLmluZGVudCgpICsgXCI8cHJlPjxjb2RlXCI7XG5cdFx0aWYgKG5vZGUubGFuZ3VhZ2UpIHtcblx0XHRcdHRoaXMub3V0ICs9IFwiIGNsYXNzPVxcXCJsYW5ndWFnZS1cIiArIHRoaXMuZXNjYXBlKG5vZGUubGFuZ3VhZ2UpICsgXCJcXFwiXCI7XG5cdFx0fVxuXHRcdHRoaXMub3V0ICs9IFwiPlwiO1xuXHRcdHRoaXMub3V0ICs9IHRoaXMuZXNjYXBlKG5vZGUudmFsdWUpICsgXCI8L2NvZGU+PC9wcmU+XFxuXCI7XG5cdFx0aWYgKCFub2RlLmlzTmVzdGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMub3V0ICs9IFwiXFxuXCI7XG4gICAgICAgIH1cblx0fSxcblxuXHR2aXNpdFBhcmFncmFwaDogZnVuY3Rpb24obm9kZSkge1xuXHRcdGlmIChub2RlLmlzTmVzdGVkKCkgJiYgKG5vZGUucGFyZW50LmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiTGlzdEl0ZW1cIikgJiYgbm9kZS5pc1NpbmdsZUNoaWxkKCkpIHtcblx0XHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCkgKyBcIjxwPlwiO1xuXHRcdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHRcdHRoaXMub3V0ICs9IFwiPC9wPlxcblwiO1xuXG5cdFx0XHRpZiAoIW5vZGUuaXNOZXN0ZWQoKSkge1xuXHRcdFx0XHR0aGlzLm91dCArPSBcIlxcblwiO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHR2aXNpdEJsb2NrRWxlbWVudDogZnVuY3Rpb24obm9kZSkge1xuXHRcdGlmIChub2RlLmlzTmVzdGVkKCkgJiYgKG5vZGUucGFyZW50LmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiTGlzdEl0ZW1cIikgJiYgbm9kZS5pc1NpbmdsZUNoaWxkKCkpIHtcblx0XHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3V0ICs9IHRoaXMuaW5kZW50KCk7XG5cdFx0XHRub2RlLmNoaWxkcmVuQWNjZXB0KHRoaXMpO1xuXHRcdFx0aWYgKCFub2RlLmlzTmVzdGVkKCkpIHtcblx0XHRcdFx0dGhpcy5vdXQgKz0gXCJcXG5cIjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0dmlzaXRJbWFnZTogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ICs9IFwiPGltZyBzcmM9XFxcIlwiICsgdGhpcy5lc2NhcGVVcmwobm9kZS52YWx1ZSkgKyBcIlxcXCIgYWx0PVxcXCJcIjtcblx0XHRub2RlLmNoaWxkcmVuQWNjZXB0KHRoaXMpO1xuXHRcdHRoaXMub3V0ICs9IFwiXFxcIiAvPlwiO1xuXHR9LFxuXG5cdHZpc2l0TGluazogZnVuY3Rpb24obm9kZSkge1xuXHRcdHRoaXMub3V0ICs9IFwiPGEgaHJlZj1cXFwiXCIgKyB0aGlzLmVzY2FwZVVybChub2RlLnZhbHVlLnRvU3RyaW5nKCkpICsgXCJcXFwiPlwiO1xuXHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0dGhpcy5vdXQgKz0gXCI8L2E+XCI7XG5cdH0sXG5cblx0dmlzaXRTdHJvbmc6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSBcIjxzdHJvbmc+XCI7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0XHR0aGlzLm91dCArPSBcIjwvc3Ryb25nPlwiO1xuXHR9LFxuXG5cdHZpc2l0RW06IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSBcIjxlbT5cIjtcblx0XHRub2RlLmNoaWxkcmVuQWNjZXB0KHRoaXMpO1xuXHRcdHRoaXMub3V0ICs9IFwiPC9lbT5cIjtcblx0fSxcblxuXHR2aXNpdENvZGU6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSBcIjxjb2RlPlwiO1xuXHRcdG5vZGUuY2hpbGRyZW5BY2NlcHQodGhpcyk7XG5cdFx0dGhpcy5vdXQgKz0gXCI8L2NvZGU+XCI7XG5cdH0sXG5cblx0dmlzaXRUZXh0OiBmdW5jdGlvbihub2RlKSB7XG5cdFx0dGhpcy5vdXQgKz0gdGhpcy5lc2NhcGUobm9kZS52YWx1ZSk7XG5cdH0sXG5cblx0dmlzaXRMaW5lQnJlYWs6IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR0aGlzLm91dCArPSBcIjxicj5cXG5cIiArIHRoaXMuaW5kZW50KCk7XG5cdFx0bm9kZS5jaGlsZHJlbkFjY2VwdCh0aGlzKTtcblx0fSxcblxuXHRlc2NhcGVVcmw6IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvIC9nbSwgXCIlMjBcIikuXG4gICAgICAgICAgICByZXBsYWNlKC9cXFwiL2dtLCBcIiUyMlwiKS5cbiAgICAgICAgICAgIHJlcGxhY2UoL2AvZ20sIFwiJTYwXCIpLlxuICAgICAgICAgICAgcmVwbGFjZSgvPC9nbSwgXCIlM0NcIikuXG4gICAgICAgICAgICByZXBsYWNlKC8+L2dtLCBcIiUzRVwiKS5cbiAgICAgICAgICAgIHJlcGxhY2UoL1xcWy9nbSwgXCIlNUJcIikuXG4gICAgICAgICAgICByZXBsYWNlKC9cXF0vZ20sIFwiJTVEXCIpLlxuICAgICAgICAgICAgcmVwbGFjZSgvXFxcXC9nbSwgXCIlNUNcIik7XG5cdH0sXG5cblx0aW5kZW50OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgcmVwZWF0ID0gdGhpcy5sZXZlbCAqIDI7XG4gICAgICAgIHZhciBpbmQgPSBcIlwiO1xuXG5cdFx0Zm9yICh2YXIgaSA9IHJlcGVhdCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRpbmQgKz0gXCIgXCI7XG5cdFx0fVxuXHRcdHJldHVybiBpbmQ7XG5cdH0sXG5cblx0ZXNjYXBlOiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0cmV0dXJuIHRleHQucmVwbGFjZSgvJi9nbSwgXCImYW1wO1wiKS5cbiAgICAgICAgICAgIHJlcGxhY2UoLzwvZ20sIFwiJmx0O1wiKS5cbiAgICAgICAgICAgIHJlcGxhY2UoLz4vZ20sIFwiJmd0O1wiKS5cbiAgICAgICAgICAgIHJlcGxhY2UoL1xcXCIvZ20sIFwiJnF1b3Q7XCIpO1xuXHR9LFxuXG5cdGdldE91dHB1dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm91dC50cmltKCk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIdG1sNVJlbmRlcmVyO1xuXG5cbiJdfQ==
