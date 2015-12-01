/**
 * CanvasGrapher.js
 * Handles graphing onto the CanvasGrapher
 * Used to show the energy fields
 * @author Roy Portas
 */

// The y-coords of the graph
// By default, use the oct layout
var points = deepCopy(data["ligands"][0]["points"]);
var curPoints = data["ligands"][0]["points"];

// The upper limit of the range
var upperRange = 4000;
// The lower limit of the range
var lowerRange = 1000;

/**
 * Updates the molecule static image
 */
function updateImage(filename) {
    var img = document.getElementById("img");
    img.src = filename;
}

/**
 * Deep copies an array
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
        for (i = 0; i < points.length; i++) {
            ctx.moveTo(interval * i + sub, canvas.height - points[i]);
            ctx.lineTo(interval * i + 3 * sub, canvas.height - points[i]);
            ctx.stroke();
        }
    }
}

/**
 * Handles moving the points when the user uses the slide bar
 */
function movePoints(offset) {
    if (moleculeType == "oct") {
        // Apply transformations for octahedral
        points[0] = curPoints[0] - (offset - lowerRange) / (upperRange - lowerRange) * 60;
        points[1] = curPoints[1] - (offset - lowerRange) / (upperRange - lowerRange) * 60;
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
        points[2] = curPoints[2] - (offset - lowerRange) / (upperRange - lowerRange) * 60;
        points[3] = curPoints[3] - (offset - lowerRange) / (upperRange - lowerRange) * 60;
        points[4] = curPoints[4] - (offset - lowerRange) / (upperRange - lowerRange) * 60;
    }
    plotPoints();
}

/**
 * Updates the points on the graph for the current molecule type
 */
function updatePoints() {
    var lData = null;
    var ligFull = data["ligands"];
    for (i = 0; i < ligFull.length; i++) {
        // Find the corrent molecule (oct, tetra..)
        if (ligFull[i]["name"] == moleculeType) {
            lData = ligFull[i];
        }
    }
    points = deepCopy(lData["points"]);
    curPoints = lData["points"];
}

/**
 * Updates the position of the point
 * Handles converting the value into a graph friendly number
 */
function updatePos(val, pos) {
    var range = upperRange - lowerRange;
    var actRange = range/100;

    points[pos] = (val - lowerRange) / actRange;
}
