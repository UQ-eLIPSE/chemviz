var webdriverio = require("webdriverio");
var assert = require("assert");

describe("ChemVis tests", function() {
    this.timeout(9999);
    var client = {};

    before(function(done) {
        client = webdriverio.remote();
        client.init(done);
    });

    it("Title test and Canvas creation", function(done) {
        client
            .url("http://localhost:8000")
            .getTitle(function(err, title) {
                assert(title === "ChemVis");
            })
            .call(done);
    });

    it("Toggle button test", function(done) {
        client
            .url("http://localhost:8000")
            .click("#toggleField")
            .isEnabled("#slider").then(function(isEnabled) {
                assert(isEnabled == true);
            })
            .click("#toggleField")
            .isEnabled("#slider").then(function(isEnabled) {
                assert(isEnabled == false);
            })
            .call(done);
    });

    it("Orbital selection test", function(done) {
        client
            .url("http://localhost:8000")
            .selectByValue("#selectionBox", "oct")
            .getValue("#selectionBox").then(function(value) {
                assert(value == "oct");
            })
            .getText("#tag").then(function(text) {
                assert(text == "Octahedral complex\nenergy diagram")
            })
            .getHTML("#img").then(function(html) {
                //console.log(html);
                assert(html.indexOf("oct.png") > -1);
            })
            .selectByValue("#selectionBox", "square")
            .getValue("#selectionBox").then(function(value) {
                assert(value == "square");
            })
            .getText("#tag").then(function(text) {
                assert(text == "Square planar\ncomplex diagram");
            })
            .getHTML("#img").then(function(html) {
                assert(html.indexOf("square.png") > -1);
            })
            .selectByValue("#selectionBox", "tetra")
            .getValue("#selectionBox").then(function(value) {
                assert(value == "tetra");
            })
            .getText("#tag").then(function(text) {
                //console.log(text);
                assert(text == "Tetrahedral complex\nenergy diagram");
            })
            .getHTML("#img").then(function(html) {
                assert(html.indexOf("tetra.png") > -1);
            })
            .call(done);
    });

    after(function(done) {
        client.end(done);
    });
});
