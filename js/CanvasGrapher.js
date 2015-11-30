/**
 * CanvasGrapher.js
 * Handles graphing onto the CanvasGrapher
 * Used to show the energy fields
 * @author Roy Portas
 */

// The y-coords of the graph
var points = [30, 70, 30, 70, 30];
// The upper limit of the range
var upperRange = 1500;
// The lower limit of the range
var lowerRange = 500;

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
    points = lData["points"];
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
