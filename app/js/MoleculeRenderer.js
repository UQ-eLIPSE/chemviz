/**
 * @file MoleculeRenderer.js Manages the rendering of the molecules and orbitals onto the screen
 * @author 
 */

var scene, camera, renderer, model, axes;

// Set to 1 to enable testing
// Testing disable displaying the threejs canvas on the screen
var testing = testing || 0;

// Store the text meshs here
var textMeshs = [];

// The type of the currently selected molecule
var moleculeType = "oct";

// Stores a list of orbitals currently in the scene
var orbitals = [];

/**
 * Sets the colours of the button
 * Buttons must have id's counting up (0, 1, 2, ...) up to but not including
 * 'upper'
 * @param {number} upper the number of orbitals for the atom
 */
function setButtonColours(upper) {
    for(i = 0; i < upper; i++) {
        document.getElementById(String(i)).style.background = '#' + colours[i];
    }
}

/**
 * Updates which orbitals are enabled
 * @param {string} value the value to set the orbital to ("oct", "tetra", "square")
 */
function updateMolecule(value) {

    if (value == "oct") {
        updateImage("img/oct.png");
    } else if (value == "tetra") {
        updateImage("img/tetra.png");
    } else if (value == "square") {
        updateImage("img/square.png");
    }

    var description = document.getElementById("tag");
    var ligData = data.ligands;
    for (var l = 0; l < ligData.length; l++) {
        if (ligData[l].name == value) {
            description.innerHTML = ligData[l].text;
        }
    }

    moleculeType = value;
    updatePoints();
    plotPoints();
    redrawCircles(100);

    // remove all existing orbitals
    for (var key in orbitals) {
        scene.remove(orbitals[key]);
    }
    orbitals = {};
}

/**
 * Handles initializing the threejs canvas
 */
function init() {
    scene = new THREE.Scene();

    var WIDTH = window.innerWidth - 40;
    // The height also has a offset because of the interface
    // above the threejs canvas
    var HEIGHT = window.innerHeight - 200;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0, 1);
    if (testing === 0) {
        // Only add it to the document if we are not testing
        document.body.appendChild(renderer.domElement);
    }

    camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000);
    camera.position.set(2000, 2000, -2000);
    scene.add(camera);

    setButtonColours(5);

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth;
        var HEIGHT = window.innerHeight - 200;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH/HEIGHT;
        camera.updateProjectionMatrix();
    });

    // Set the background colour
    renderer.setClearColor( 0xFFFFFF, 1);
    create_light(-1000, 1000, 1000);
    create_light(1000, -1000, -1000);
    create_light(1000, 1000, 1000);

    // Draw some axes
    axes = buildAxes(5000);
    scene.add(axes);

    var middle = createSphere(0xFF0000, 0.75, 50);
    scene.add(middle);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

/**
 * Handles animating the threejs canvas
 */
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    updateText();
}

/**
 * Creates a light at a given point
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @param {number} z the z coordinate
 */
function create_light(x, y, z) {
    var light = new THREE.PointLight(0xffffff);
    light.position.set(x, y, z);
    scene.add(light);
}

/**
 * Creates a set of axes
 * @param {number} length length of the axes
 * @returns {THREE.Object3D} the axes object
 */
function buildAxes(length) {
    var axes = new THREE.Object3D();
    var origin = new THREE.Vector3(0, 0, 0);

    createAxisLabel(1000, 40, 0, "Y", 0xFF0000);
    createAxisLabel(40, 1000, 40, "Z", 0x00FF00);
    createAxisLabel(0, 40, -1000, "X", 0x0000FF);

    axes.add( drawLine( origin, new THREE.Vector3( length, 0, 0 ), 0xFF0000) );
    axes.add( drawLine( origin, new THREE.Vector3( -length, 0, 0 ), 0xFF0000) );
    axes.add( drawLine( origin, new THREE.Vector3( 0, length, 0 ), 0x00FF00 ) );
    axes.add( drawLine( origin, new THREE.Vector3( 0, -length, 0 ), 0x00FF00 ) );
    axes.add( drawLine( origin, new THREE.Vector3( 0, 0, length ), 0x0000FF ) );
    axes.add( drawLine( origin, new THREE.Vector3( 0, 0, -length ), 0x0000FF ) );

    return axes;
}

/**
 * Draws a line between the points 'src' and 'dest' with the given
 * colorHex
 * @param {THREE.Vector3} src the starting point vector
 * @param {THREE.Vector3} dest the finishing point vector
 * @param {number} colorHex a value representing the color
 * @returns {THREE.Object3D} returns the axis as a Object3D object
 */
function drawLine(src, dest, colorHex) {
    var geom = new THREE.Geometry(), mat;
    mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
    geom.vertices.push(src.clone());
    geom.vertices.push(dest.clone());

    geom.computeLineDistances();

    var axis = new THREE.Line(geom, mat);
    return axis;
}

/**
 * Scales a shape
 * Returns the shape with the transformation applied
 * @param {THREE.Object3D} shape the shape to scale
 * @param {number} x the x scale
 * @param {number} y the y scale
 * @param {number} z the z scale
 * @returns {THREE.Object3D}
 */
function scaleShape(shape, x, y, z) {
    shape.scale.x = x;
    shape.scale.y = y;
    shape.scale.z = z;
    return shape;
}

/**
 * Moves the shape relative to a position
 * @param {THREE.Object3D} shape the shape to move
 * @param {number} x the x movement
 * @param {number} y the y movement
 * @param {number} z the z movement
 * @returns {THREE.Object3D}
 */
function moveShapeRel(shape, x, y, z) {
    shape.position.x += x;
    shape.position.y += y;
    shape.position.z += z;
    return shape;
}

/*
 * Creates a sphere with the given color and opacity
 * @param {number} color the hex colour to use
 * @param {number} opacity the opacity between 0 and 1
 * @param {number} size the size of the sphere
 * @returns {THREE.Object3D} the sphere object
 */
function createSphere(color, opacity, size) {
    var sphereMaterial;
    size = size || 200;
    if (opacity == 1) {
        sphereMaterial = new THREE.MeshLambertMaterial({color: color});
    } else {
        sphereMaterial = new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: opacity});

    }
    var shape = new THREE.Mesh(
        new THREE.SphereGeometry(
            size,
            50,
            50),
        sphereMaterial
    );

    return shape;
}

/*
 * Uses the Molecule.js file to look and load a orbital model
 * @param {string} id the id of the object
 * @param {string} name the name of the orbital to look up
 */
function lookupAndCreate(id, name) {
    var obj = null;
    var dArr = data.orbital;
    for (i = 0; i < dArr.length; i++) {
        // Check if the names match
        if (dArr[i].name == name) {
            obj = dArr[i];
        }
    }

    if (obj !== null) {
        var x = obj.x;
        var y = obj.y;
        var z = obj.z;
        if (obj.isTorus === true) {
            createOrbitalAndTorus(name, x, y, z, "0x" + colours[id]);
        } else {
            toggleOrbital(x, y, z, name, "0x" + colours[id]);
        }
    } else {
        console.log("Could not retrieve orbital");
    }

    movePoints(Number(document.getElementById("slider").value));

    var but = document.getElementById("toggleField");
    if (checkIfPlottable()) {
        but.disabled = false;
    } else {
        but.disabled = true;
        if (circlesEnabled) {
            toggleCircles();
        }
    }
}

/*
 * Draws any given orbital
 * This function will toggle a orbital on and off
 * @param {number} x the x location
 * @param {number} y the y location
 * @param {number} z the z location
 * @param {string} key the unique key of the orbital
 * @param {number} hex the colour of the orbital
 */
function toggleOrbital(x, y, z, key, hex) {
    if (key in orbitals) {
        scene.remove(orbitals[key]);
        delete orbitals[key];
        return false;
    } else {
        orbitals[key] = rotateOrbital(x, y, z, hex);
        scene.add(orbitals[key]);
        return true;
    }
}

/*
 * Creates orbitals and the torus
 * @param {string} key the key of the orbital
 * @param {number} x the x position
 * @param {number} y the y position
 * @param {number} z the z position
 * @param {number} hex the hex position
 */
function createOrbitalAndTorus(key, x, y, z, hex) {
    if (key in orbitals) {
        scene.remove(orbitals[key]);
        delete orbitals[key];
        return false;
    } else {
        var obj = new THREE.Object3D();
        var colour = Number(hex);

        var mOffset = 350;

        // The orbitals
        var end = createSphere(colour, 1);
        moveShapeRel(end, 0, -mOffset, 0);
        scaleShape(end, 1, 1.5, 1);
        obj.add(end);

        end = createSphere(colour, 1);
        moveShapeRel(end, 0, mOffset, 0);
        scaleShape(end, 1, 1.5, 1);
        obj.add(end);

        // The torus
        var torusGeom = new THREE.TorusGeometry(300, 100, 16, 100);
        var material = new THREE.MeshBasicMaterial({color: colour});
        var torus = new THREE.Mesh(torusGeom, material);
        // This is so the torus is in the initial position we want
        torus.rotation.x += 1.56;
        obj.add(torus);

        obj.rotation.x += x;
        obj.rotation.y += y;
        obj.rotation.z += z;

        orbitals[key] = obj;
        scene.add(orbitals[key]);
        return true;
    }
}

/*
 * Creates an orbital and rotates it by (x, y, z) radians
 * @param {number} x the value in radians to rotate on the x axis
 * @param {number} y the value in radians to rotate on the y axis
 * @param {number} z the value in radians to rotate on the z axis
 * @param {number} hex the color hex value of the orbital
 * @returns {THREE.Object3D}
 */
function rotateOrbital(x, y, z, hex) {
    var orb = orbitalDraw(hex);
    orb.rotation.x += x;
    orb.rotation.y += y;
    orb.rotation.z += z;
    return orb;
}

/*
 * Creates an orbital with the given hex colour
 * @param {number} hex the color hex value of the orbital
 * @returns {THREE.Object3D}
 */
function orbitalDraw(hex) {
    var obj = new THREE.Object3D();
    var colour = Number(hex);

    var mOffset = 350;

    var end = createSphere(colour, 1);
    moveShapeRel(end, mOffset, 0, 0);
    scaleShape(end, 1.5, 1, 1);
    obj.add(end);

    end = createSphere(colour, 1);
    moveShapeRel(end, -mOffset, 0, 0);
    scaleShape(end, 1.5, 1, 1);
    obj.add(end);

    end = createSphere(colour, 1);
    moveShapeRel(end, 0, 0, mOffset);
    scaleShape(end, 1, 1, 1.5);
    obj.add(end);

    end = createSphere(colour, 1);
    moveShapeRel(end, 0, 0, -mOffset);
    scaleShape(end, 1, 1, 1.5);
    obj.add(end);

    return obj;
}

/*
 * Resets the viewport to the default position
 */
function resetView() {
    camera.position.set(2000, 2000, -2000);
}

/**
 * Creates an axis label at the given position with the given colour
 * Automicatically adds the text to the scene and the text array
 * @param {number} x the x position of the text
 * @param {number} y the y position of the text
 * @param {number} z the z position of the text
 * @param {string} text the text to render onto the screen
 * @param {number} color the colour to paint the text
 */
function createAxisLabel(x, y, z, text, color) {

    var textGeo = new THREE.TextGeometry(text, {
        size: 50,
        height: 20,
        font: "helvetiker",
        bevelEnabled: false
    });

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    var material = new THREE.MeshBasicMaterial({color: color});
    var textMesh = new THREE.Mesh(textGeo, material);

    textMesh.position.x = x;
    textMesh.position.y = y;
    textMesh.position.z = z;

    textMesh.lookAt(camera.position);
    scene.add(textMesh);

    textMeshs.push(textMesh);
}

/**
 * Updates the axe labels to ensure they are always facing the camera
 */
function updateText() {
    for (i = 0; i < textMeshs.length; i++) {
        textMeshs[i].lookAt(camera.position);
    }
}

// Run the main functions
init();
animate();
