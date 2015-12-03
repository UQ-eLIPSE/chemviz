/**
 * @file Molecules.js Stores the data relating to molecules and orbitals
 * @author Roy Portas
 */

/*
 * Stores all data relating to the molecule orbitals and ligants
 */
var data = {
    "orbital": [
        {"name": "z^2",         "x": 0,     "y": 0,     "z": 0,     "isTorus": true},
        {"name": "x^2 - y^2",   "x": 0,     "y": 0,     "z": 0,     "isTorus": false},
        {"name": "xy",          "x": 0,     "y": 0.7853,"z": 0,     "isTorus": false},
        {"name": "yz",          "x": 1.56,  "y": 0.7853,"z": 0,     "isTorus": false},
        {"name": "xz",          "x": 0.7853,"y": 0,     "z": 1.56,  "isTorus": false}
    ],

    "ligands": [
        {"name": "oct",     "points": [70, 70, 50, 50, 50]},
        {"name": "tetra",   "points": [50, 50, 70, 70, 70]},
        {"name": "square",  "points": [40, 80, 60, 20, 20]}
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
