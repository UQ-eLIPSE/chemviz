/**
 * @file CanvasGrapher.js Handles graphing onto the CanvasGrapher
 * @author 
 */

// The y-coords of the graph
// By default, use the oct layout
var points = deepCopy(getOrbitalByName("oct").points);
var curPoints = getOrbitalByName("oct").points;

// The upper limit of the range
var upperRange = document.getElementById("slider").max;
// The lower limit of the range
var lowerRange = document.getElementById("slider").min;

/**
 * Updates the molecule static image
 * @param {string} filename of image
 */
function updateImage(filename) {
    var img = document.getElementById("img");
    img.src = filename;
}

/**
 * Deep copies an array
 * @param {array} inArr array to deepcopy
 */
function deepCopy(inArr) {
    return inArr.concat();
}

/**
 * Clears the canvas of all objects
 */
function clearCanvas() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Checks if the ligant energy fields should be plotted
 * @returns {bool} returns true if plotable, false otherwise
 */
function checkIfPlottable() {
    var count = 0;

    for (var x in orbitals) {
        count++;
    }

    // Make it always plottable
    return true;

    if (count >= 1) {
        return true;
    } else {
        return false;
    }
}

/**
 * Plots the points onto the graph
 */
function plotPoints() {
    if (circlesEnabled) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        var interval = canvas.width / points.length;
        var sub = interval / 4;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < points.length; i++) {
            ctx.moveTo(interval * i + sub, canvas.height - points[i]);
            ctx.lineTo(interval * i + 3 * sub, canvas.height - points[i]);
            ctx.stroke();
        }
    } else {
        clearCanvas();
    }
}

/**
 * Handles moving the points when the user uses the slide bar
 * @param {number} offset offset for the ligants
 */
function movePoints(offset) {
    if (moleculeType == "oct") {
        // Apply transformations for octahedral
        points[0] = curPoints[0] - (offset - lowerRange) / (upperRange - lowerRange) * 70;
        points[1] = curPoints[1] - (offset - lowerRange) / (upperRange - lowerRange) * 70;
        points[2] = curPoints[2] - (offset - lowerRange) / (upperRange - lowerRange) * 40;
        points[3] = curPoints[3] - (offset - lowerRange) / (upperRange - lowerRange) * 40;
        points[4] = curPoints[4] - (offset - lowerRange) / (upperRange - lowerRange) * 40;
    } else if (moleculeType == "square") {
        // Apply transformations for square planar
        points[0] = curPoints[0] + (offset - lowerRange) / (upperRange - lowerRange) * 10;
        points[1] = curPoints[1] - (offset - lowerRange) / (upperRange - lowerRange) * 30;
        points[2] = curPoints[2] - (offset - lowerRange) / (upperRange - lowerRange) * 10;
        points[3] = curPoints[3] + (offset - lowerRange) / (upperRange - lowerRange) * 30;
        points[4] = curPoints[4] + (offset - lowerRange) / (upperRange - lowerRange) * 30;
    } else if (moleculeType == "tetra") {
        // Apply transformations for tetrahedral
        points[0] = curPoints[0] - (offset - lowerRange) / (upperRange - lowerRange) * 40;
        points[1] = curPoints[1] - (offset - lowerRange) / (upperRange - lowerRange) * 40;
        points[2] = curPoints[2] - (offset - lowerRange) / (upperRange - lowerRange) * 70;
        points[3] = curPoints[3] - (offset - lowerRange) / (upperRange - lowerRange) * 70;
        points[4] = curPoints[4] - (offset - lowerRange) / (upperRange - lowerRange) * 70;
    }
    plotPoints();
}

/**
 * Updates the points on the graph for the current molecule type
 */
function updatePoints() {
    var lData = getOrbitalByName(moleculeType);
    points = deepCopy(lData.points);
    curPoints = lData.points;
}

/**
 * Updates the position of the point
 * Handles converting the value into a graph friendly number
 * @param {number} val the current energy level
 * @param {number} pos the position in the graph to update
 */
function updatePos(val, pos) {
    var range = upperRange - lowerRange;
    var actRange = range/100;

    points[pos] = (val - lowerRange) / actRange;
}

/**
 * Retrieves an orbital with the given name
 * from the data array
 * @param {string} name the name of the orbital to retrieve
 */
function getOrbitalByName(name) {
    var ligData = null;
    var ligFull = data.ligands;
    for (var i = 0; i < ligFull.length; i++) {
        if (ligFull[i].name == name) {
            ligData = ligFull[i];
        }
    }

    return ligData;
}
