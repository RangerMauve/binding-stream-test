var domDelegate = require("dom-delegate-stream");
var htmlPatcher = require("html-patcher-stream");
var objectMerge = require("object-merge-stream");
var mustache = require("mustache");
var map = require("through2-map").obj;
var fs = require("fs");
var streamCombiner = require("stream-combiner2");
var makeProp = require("make-prop");

var template = fs.readFileSync("template.html", "utf8");

var main = document.querySelector("main");

var delegate = domDelegate(main);

var pipeline = streamCombiner(
	map(generate_state_update),
	objectMerge(),
	map(render)
);

pipeline.pipe(htmlPatcher(main, render({})));

delegate.on("change", "input, textarea, select").pipe(pipeline);
delegate.on("keyup", "input, textarea, select").pipe(pipeline);
delegate.on("paste", "input, textarea, select").pipe(pipeline);

function generate_state_update(event) {
	var element = event.target;
	var binding = element.dataset.binding;
	var value;

	if (element.type !== "radio")
		value = element.value;
	else if (element.checked)
		value = element.value;

	if (element.type === "checkbox")
		value = element.checked;

	return data = makeProp(binding)(value);
}

function render(data) {
	return mustache.render(template, data);
}
