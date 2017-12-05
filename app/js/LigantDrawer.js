/**
 * @file LigantDrawer.js Manages drawing the ligants and handles the math behind them
 * @author 
 */

// Stores the circles object
var circles = {};

// Stores if the circles have been enabled
var circlesEnabled = false;

/**
 * Removes all circles from the scene
 */
function removeCircles() {
    if (circles) {
        scene.remove(circles);
    }
}

/**
 * Toggles the visibility of the circles
 * Also hides the plotter when the circles are hidden
 */
function toggleCircles() {
    if (circlesEnabled === true) {
        document.getElementById("slider").disabled = 1;
        circlesEnabled = false;
        removeCircles();
        clearCanvas();
    } else {
        document.getElementById("slider").disabled = 0;
        circlesEnabled = true;
        circles = createCircles(document.getElementById("slider").value);
        updateCircles(document.getElementById("slider").value);
        scene.add(circles);
    }
}

/**
 * Updates the position of the circles on the screen
 * This is the higher level function which handles circle drawing
 * @param {number} offset the offset of the circles from the origin
 */
function updateCircles(offset) {

    if (circlesEnabled) {
        //testPlotPoints(offset);

        // Update the canvas
        plotPoints();
        if (moleculeType == "oct") {
            updateOct(offset);
        } else if (moleculeType == "square") {
            updateSquare(offset);
        } else if (moleculeType == "tetra") {
            updateTetra(offset);
        }

        movePoints(offset);
    } else {
        clearCanvas();
    }
}

/**
 * Draws the ligants for a octagonal molecule
 * @param {number} offset the offset of the circles from the origin
 */
function updateOct(offset) {
    circles.getObjectByName("top").position.y = offset;
    circles.getObjectByName("bottom").position.y = -offset;

    circles.getObjectByName("right").position.x = offset;
    circles.getObjectByName("left").position.x = -offset;

    circles.getObjectByName("forward").position.z = offset;
    circles.getObjectByName("back").position.z = -offset;
}

/**
 * Draws the ligants for a square molecule
 * @param {number} offset the offset of the circles from the origin
 */
function updateSquare(offset) {
    circles.getObjectByName("right").position.x = offset;
    circles.getObjectByName("left").position.x = -offset;

    circles.getObjectByName("forward").position.z = offset;
    circles.getObjectByName("back").position.z = -offset;
}

/**
 * Draws the ligants for a tetrahedron molecule
 * @param {number} offset the offset of the circles from the origin
 */
function updateTetra(offset) {
    // Scale it down a little
    offset = offset / 3;

    circles.getObjectByName("top").position.x = offset;
    circles.getObjectByName("top").position.y = offset;
    circles.getObjectByName("top").position.z = offset;

    circles.getObjectByName("s2").position.x = -offset;
    circles.getObjectByName("s2").position.y = -offset;
    circles.getObjectByName("s2").position.z = offset;

    circles.getObjectByName("s3").position.x = -offset;
    circles.getObjectByName("s3").position.y = offset;
    circles.getObjectByName("s3").position.z = -offset;

    circles.getObjectByName("s4").position.x = offset;
    circles.getObjectByName("s4").position.y = -offset;
    circles.getObjectByName("s4").position.z = -offset;

}

/**
 * Creates a single circle
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} z z position
 * @param {number} size size of circle
 * @param {string} name name of circle
 * @returns {THREE.Mesh}
 */
function createSingleCircle(x, y, z, size, name){
    var sphereMat = new THREE.MeshLambertMaterial({color: 0x00FF00});
    var shape = new THREE.Mesh(
        new THREE.SphereGeometry(
            size,
            50,
            50),
        sphereMat
    );

    shape.position.x += x;
    shape.position.y += y;
    shape.position.z += z;
    shape.name = name;

    return shape;
}

/**
 * Creates all the circles along each axis with a given offset from the
 * origin
 * @param {number} offset offset from the origin
 */
function createCircles(offset) {
    if (moleculeType == "oct") {
        return createOct(offset);
    } else if (moleculeType == "square") {
        return createSquare(offset);
    } else if (moleculeType == "tetra") {
        return createTetra(offset);
    }
}

/**
 * Creates the ligants for a octagonal molecule
 * @param {number} offset offset from the origin
 * @returns {THREE.Object3D}
 */
function createOct(offset) {
    var circles = new THREE.Object3D();
    var size = 100;

    // Create the top and bottom circles
    circles.add(createSingleCircle(0, offset, 0, size, "top"));
    circles.add(createSingleCircle(0, -offset, 0, size, "bottom"));

    // Create the left and right circles
    circles.add(createSingleCircle(offset, 0, 0, size, "right"));
    circles.add(createSingleCircle(-offset, 0, 0, size, "left"));

    // Create the remaining two
    circles.add(createSingleCircle(0, 0, offset, size, "forward"));
    circles.add(createSingleCircle(0, 0, -offset, size, "back"));

    return circles;
}

/**
 * Creates the ligants for a square molecule
 * @param {number} offset offset from the origin
 * @returns {THREE.Object3D}
 */
function createSquare(offset) {
    var circles = new THREE.Object3D();
    var size = 100;

    // Create the left and right circles
    circles.add(createSingleCircle(offset, 0, 0, size, "right"));
    circles.add(createSingleCircle(-offset, 0, 0, size, "left"));

    // Create the remaining two
    circles.add(createSingleCircle(0, 0, offset, size, "forward"));
    circles.add(createSingleCircle(0, 0, -offset, size, "back"));

    return circles;
}

/**
 * Creates the ligants for a tetrahedron molecule
 * @param {number} offset offset from the origin
 * @returns {THREE.Object3D}
 */
function createTetra(offset) {
    var circles = new THREE.Object3D();
    var size = 100;

    circles.add(createSingleCircle(offset, offset, offset, size, "top"));
    circles.add(createSingleCircle(-offset, -offset, offset, size, "s2"));
    circles.add(createSingleCircle(-offset, offset, -offset, size, "s3"));
    circles.add(createSingleCircle(offset, -offset, -offset, size, "s4"));

    /* May be needed depending on implementation
    angles = computeAngles(offset);
    var x = angles[0];
    var z = angles[1];
    circles.add(createSingleCircle(0, offset, 0, size, "top"));
    circles.add(createSingleCircle(offset, -offset/2, 0, size, "s2"));
    circles.add(createSingleCircle(-x, -offset/2, z, size, "s3"));
    circles.add(createSingleCircle(-x, -offset/2, -z, size, "s4"));
    */
    return circles;
}

/**
 * Redraws the ligants
 * @param {number} offset offset from the origin
 */
function redrawCircles(offset) {
    if (circlesEnabled) {
        if (circles) {
            scene.remove(circles);
        }
        circles = createCircles(document.getElementById("slider").value);
        updateCircles(document.getElementById("slider").value);
        scene.add(circles);
    }
}

/**
 * Converts degrees to radians
 * @param {number} degs angle in degrees
 * @returns {number} angle in radians
 */
function toRadians(degs) {
    return degs * Math.PI / 180;
}

/**
 * Computes the angles for the tetrahedral ligants
 * Returns a tuple that contains the x and z coord
 * @param {number} x the x coordinate
 */
function computeAngles(x) {
    // Scale the shape down
    x = x / 2;
    var z = Math.tan(toRadians(60)) * x;

    var out = [];

    out.push(Math.abs(x));
    out.push(Math.abs(z));

    return out;
}
