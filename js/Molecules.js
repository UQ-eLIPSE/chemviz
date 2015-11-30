/**
 * Molecules.js
 * Stores the data relating to molecules and orbitals
 * @author Roy Portas
 */

/*
 * Stores all data relating to the molecules
 */
var data = {
    "orbital": [
        {"name": "z^2",         "x": 0,     "y": 0,     "z": 0,     "isTorus": true,  "enabled": true},
        {"name": "x^2 - y^2",   "x": 0,     "y": 0,     "z": 0,     "isTorus": false, "enabled": true},
        {"name": "xy",          "x": 0,     "y": 0.7853,"z": 0,     "isTorus": false, "enabled": true},
        {"name": "yz",          "x": 1.56,  "y": 0.7853,"z": 0,     "isTorus": false, "enabled": true},
        {"name": "xz",          "x": 0.7853,"y": 0,     "z": 1.56,  "isTorus": false, "enabled": true}
    ],

    "ligands": [
        {"name": "oct",     "points": [30, 70, 30, 70, 30]},
        {"name": "tetra",   "points": [70, 30, 70, 30, 70]},
        {"name": "square",  "points": [30, 70, 50, 20, 20]}
    ]

};

// A set of colours to use when painting orbitals
var colours = [
    "FF69b4",
    "ADD8E6",
    "00FF00",
    "FF0000",
    "A020F0"
];
