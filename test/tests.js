QUnit.config.autostart = false;

$(document).ready(function() {
    console.log("Starting tests in 2 seconds...");
    setTimeout(function(){
        QUnit.start();
    }, 2000);
});

QUnit.test("Molecule Selection Test", function(assert) {
    assert.ok(moleculeType == "oct", "Correct starting molecule");
    
    // Update molecule type
    updateMolecule("tetra");
    assert.ok(moleculeType == "tetra", "Correct selection of tetra");

    updateMolecule("square");
    assert.ok(moleculeType == "square", "Correct selection of square");

    updateMolecule("oct");
    assert.ok(moleculeType == "oct", "Correct selection of oct");

});

QUnit.test("Ligant Drawer Test", function(assert) {
    assert.ok(circlesEnabled == false, "Circles are defaultly disabled");
    assert.ok(document.getElementById("slider").disabled == 1, "Slider is defaultly disabled");

    toggleCircles();
    assert.ok(circlesEnabled == true, "Circles should be enabled");
    assert.ok(document.getElementById("slider").disabled == 0, "Slider is enabled");

    toggleCircles();
    assert.ok(circlesEnabled == false, "Circles should be disabled");
    assert.ok(document.getElementById("slider").disabled == 1, "Slider is disabled");

    // Test radians to degrees function
    assert.ok(toRadians(120) == (120 * Math.PI / 180), "Radians conversion correct");

    // Test the offsets of the oct arrangement

    moleculeType = "oct";
    circles = createCircles(1000);
    assert.ok(circles.getObjectByName("top").position.y == 1000, "OCT: Top orbital position is ok");
    assert.ok(circles.getObjectByName("bottom").position.y == -1000, "OCT: Bottom orbital position is ok");
    assert.ok(circles.getObjectByName("right").position.x == 1000, "OCT: Right orbital position is ok");
    assert.ok(circles.getObjectByName("left").position.x == -1000, "OCT: Left orbital position is ok");
    assert.ok(circles.getObjectByName("forward").position.z == 1000, "OCT: Forward orbital position is ok");
    assert.ok(circles.getObjectByName("back").position.z == -1000, "OCT: Back orbital position is ok");

    moleculeType = "square";
    circles = createCircles(1000);
    assert.ok(circles.getObjectByName("right").position.x == 1000, "SQUARE: Right orbital position is ok");
    assert.ok(circles.getObjectByName("left").position.x == -1000, "SQUARE: Left orbital position is ok");
    assert.ok(circles.getObjectByName("forward").position.z == 1000, "SQUARE: Forward orbital position is ok");
    assert.ok(circles.getObjectByName("back").position.z == -1000, "SQUARE: Back orbital position is ok");

    var offset = 1000;
    moleculeType = "tetra";
    circles = createCircles(1000);
    assert.ok(circles.getObjectByName("top").position.x == offset, "TETRA: (x) Top orbital position is ok");
    assert.ok(circles.getObjectByName("top").position.y == offset, "TETRA: (y) Top orbital position is ok");
    assert.ok(circles.getObjectByName("top").position.z == offset, "TETRA: (z) Top orbital position is ok");
    assert.ok(circles.getObjectByName("s2").position.x == -offset, "TETRA: (x) s2 orbital position is ok");
    assert.ok(circles.getObjectByName("s2").position.y == -offset, "TETRA: (y) s2 orbital position is ok");
    assert.ok(circles.getObjectByName("s2").position.z == offset, "TETRA: (z) s2 orbital position is ok");
    assert.ok(circles.getObjectByName("s3").position.x == -offset, "TETRA: (x) s3 orbital position is ok");
    assert.ok(circles.getObjectByName("s3").position.y == offset, "TETRA: (y) s3 orbital position is ok");
    assert.ok(circles.getObjectByName("s3").position.z == -offset, "TETRA: (z) s3 orbital position is ok");
    assert.ok(circles.getObjectByName("s4").position.x == offset, "TETRA: (x) s4 orbital position is ok");
    assert.ok(circles.getObjectByName("s4").position.y == -offset, "TETRA: (y) s4 orbital position is ok");
    assert.ok(circles.getObjectByName("s4").position.z == -offset, "TETRA: (z) s4 orbital position is ok");


});
