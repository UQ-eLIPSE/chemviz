QUnit.config.autostart = false;

$(document).ready(function() {
    console.log("Starting tests in 2 seconds...");
    setTimeout(function(){
        QUnit.start();
    }, 2000);
});

// Some small helper functions to aid with testing
function calcArraySize(array) {
    var count = 0;
    for (var element in array) {
        count++;
    }
    return count;
}

function getTagText() {
    return document.getElementById("tag").innerHTML;
}

function lookupLigantData(ligName) {
    var lData = data.ligands;
    for (var i = 0; i < lData.length; i++) {
        if (lData[i].name == ligName) {
            return lData[i];
        }
    }
    return null;
}

QUnit.test("Molecule Selection Test", function(assert) {
    assert.ok(moleculeType == "oct", "Correct starting molecule");


    // Update molecule type
    updateMolecule("tetra");
    assert.ok(moleculeType == "tetra", "Correct selection of tetra");
    assert.ok(calcArraySize(orbitals) == 0, "Correct size of orbital array")
    assert.ok(getTagText() == lookupLigantData("tetra").text, "Tetra text updated correctly")

    updateMolecule("square");
    assert.ok(moleculeType == "square", "Correct selection of square");
    assert.ok(calcArraySize(orbitals) == 0, "Correct size of orbital array")
    assert.ok(getTagText() == lookupLigantData("square").text, "Square text updated correctly")

    updateMolecule("oct");
    assert.ok(moleculeType == "oct", "Correct selection of oct");
    assert.ok(calcArraySize(orbitals) == 0, "Correct size of orbital array")
    assert.ok(getTagText() == lookupLigantData("oct").text, "Oct text updated correctly")

    // Test sphere creation
    var x = createSphere(0xffffff, 1, 50);
    assert.ok("ffffff" == x.material.color.getHexString(), "Sphere colouring is correct");

    // Test object scaling
    var n = scaleShape(x, 5, 6, 7);
    assert.ok(5 == n.scale.x, "x scaling is working");
    assert.ok(6 == n.scale.y, "y scaling is working");
    assert.ok(7 == n.scale.z, "z scaling is working");

    // Test default position of shapes
    assert.ok(x.position.x == 0, "Default x coord is correct");
    assert.ok(x.position.y == 0, "Default y coord is correct");
    assert.ok(x.position.z == 0, "Default z coord is correct");

    // Test relative move function
    var newShape = moveShapeRel(x, 10, 11, 12);
    assert.ok(newShape.position.x == 10, "newShape x coord is correct");
    assert.ok(newShape.position.y == 11, "newShape y coord is correct");
    assert.ok(newShape.position.z == 12, "newShape z coord is correct");

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

QUnit.test("Canvas Grapher Test", function(assert) {
    assert.ok(upperRange == document.getElementById("slider").max, "upperRange is correct");
    assert.ok(lowerRange == document.getElementById("slider").min, "lowerRange is correct");

    var arr1 = [1, 2, 3];
    var arr2 = deepCopy(arr1);
    arr2[0] = 5;
    assert.ok(arr1[0] != arr2[0], "deepCopy function working correctly")

    // By default not orbitals should be drawn
    assert.ok(checkIfPlottable() == true, "checkIfPlottable is working for default case");

    var ligTestData = data["ligands"][0]["points"];
    var ligTestName = data["ligands"][0]["name"];
    var ligTestFull = data["ligands"][0];

    moleculeType = ligTestName;
    updatePoints();
    assert.ok(ligTestData.toString() == points.toString(), "Points are loaded correctly");
    assert.ok(ligTestData.toString() == curPoints.toString(), "Current Points are loaded correctly");

    assert.ok(getOrbitalByName(ligTestName).toString() == ligTestFull.toString(), "getOrbitalByName correct");

    updatePos(1000, 0);
    var expected = (1000 - lowerRange) / ((upperRange - lowerRange) / 100);
    assert.ok(points[0] == expected, "updatePos working correctly");

});
