var domDelegate = require("dom-delegate-stream");
var htmlPatcher = require("html-patcher-stream");
var immutableState = require("immutable-state-stream");
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
	immutableState(),
	map(render)
);

pipeline.pipe(htmlPatcher(main, render({})));

delegate.on("change", "input, textarea").pipe(pipeline);
delegate.on("keyup", "input, textarea").pipe(pipeline);
delegate.on("paste", "input, textarea").pipe(pipeline);

function generate_state_update(event) {
	var element = event.target;
	var binding = element.dataset.binding;
	var value;

	if (element.type !== "radio")
		value = element.value;
	else if (element.checked)
		value = element.value;

	if (element.type === "checked")
		value = element.checked;
	var data = makeProp(binding)(value);
	console.log("Update:", data.inputs);
	return data;
}

function render(data) {
	console.log("Rendering:", data.inputs);
	var html = mustache.render(template, data);
	return html;
}
