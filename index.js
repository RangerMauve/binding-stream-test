var domDelegate = require("dom-delegate-stream");
var htmlPatcher = require("html-patcher-stream");
var immutableState = require("immutable-state-stream");
var mustache = require("mustache");
var map = require("through2-map").obj;
var fs = require("fs");
var objectPath = require("object-path");

var template = fs.readFileSync("template.html", "utf8");

var main = document.querySelector("main");

var delegate = domDelegate(main);

var pipeline = map(generate_state_update);

pipeline
	.pipe(immutableState())
	.pipe(map(render))
	.pipe(htmlPatcher(main, render({})));


delegate.on("change", "input, textarea").pipe(pipeline);
delegate.on("keyup", "input, textarea").pipe(pipeline);
delegate.on("paste", "input, textarea").pipe(pipeline);

function generate_state_update(event) {
	var element = event.target;
	var binding = element.dataset.binding;
	var value = element.value;
	console.log(element, binding);
	var data = {};
	objectPath.set(data, binding, value);
	console.log("Generated data", data);
	return data;
}

function render(data) {
	console.log("Rendering", data);
	var html = mustache.render(template, data);
	console.log("Rendered", html);
	return html;
}
