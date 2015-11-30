/**
 * MoleculeRenderer.js
 * @author Roy Portas
 * NOTE: Load this after the body tag
 */

var scene, camera, renderer, model, axes;

// The type of the molecule
var moleculeType = "oct";

// Stores a list of orbitals currently in the scene
var orbitals = new Array();

/**
 * Sets the colours of the button
 * Buttons must have id's counting up (0, 1, 2, ...) up to but not including
 * 'upper'
 */
function setButtonColours(upper) {
    for(i = 0; i < upper; i++) {
        document.getElementById(String(i)).style.background = '#' + colours[i];
    }
}

/**
 * Sets the state of the given orbital
 * @param name A string representing the name of the orbital
 * @param state A boolean representing if the orbital is enabled or not
 */
function setOrbitalState(name, state) {
    var dArr = data["orbital"];
    for (i = 0; i < dArr.length; i++) {
        if (dArr[i]["name"] == name) {
            dArr[i]["enabled"] = state;        
        }
    }
}

/**
 * Enable the orbitals for the square state
 */
function enableSquareStates() {
    setOrbitalState("z^2", false);
    setOrbitalState("x^2 - y^2", true);
    setOrbitalState("xy", true);
    setOrbitalState("yz", false);
    setOrbitalState("xz", false);
}

/**
 * Enable the orbitals for the octagonal molecule
 */
function enableOctStates() {
    setOrbitalState("z^2", true);
    setOrbitalState("x^2 - y^2", true);
    setOrbitalState("xy", true);
    setOrbitalState("yz", true);
    setOrbitalState("xz", true);
}


/**
 * Updates which orbitals are enabled
 */
function updateMolecule(value) {
    moleculeType = value;
    updatePoints();
    plotPoints();
    redrawCircles(100);

    // Change the enabled and disabled states
    if (moleculeType == "oct") {
        enableOctStates();
    } else if (moleculeType == "square") {
        enableSquareStates();
    } else if (moleculeType == "tetra") {
        // TODO: Handle these states
    }

    // remove all existing orbitals
    for (key in orbitals) {
        scene.remove(orbitals[key]);
    }

    orbitals = {};
}

/**
 * Handles initializing the threejs canvas
 */
function init() {
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth - 10;
    var HEIGHT = window.innerHeight - 150;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0, 1);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000);
    camera.position.set(2000, 2000, -2000);
    scene.add(camera);

    setButtonColours(5);

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth - 10;
        var HEIGHT = window.innerHeight - 150;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH/HEIGHT;
        camera.updateProjectionMatrix();
    });

    // Set the background colour
    renderer.setClearColor( 0x333F47, 0);
    create_light(-1000, 1000, 1000);
    create_light(2000, -1000, -1000);
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
}

/**
 * Creates a light at a given point
 */
function create_light(x, y, z) {
    var light = new THREE.PointLight(0xffffff);
    light.position.set(x, y, z);
    scene.add(light);
}

/**
 * Creates a set of axes
 * Returns the axes object
 */
function buildAxes(length) {
    var axes = new THREE.Object3D();
    var origin = new THREE.Vector3(0, 0, 0);

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
 */
function scaleShape(shape, x, y, z) {
    shape.scale.x = x;
    shape.scale.y = y;
    shape.scale.z = z;
    return shape;
}

/**
 * Moves the shape relative to a position
 */
function moveShapeRel(shape, x, y, z) {
    shape.position.x += x;
    shape.position.y += y;
    shape.position.z += z;
    return shape;
}

/*
 * Creates a sphere with the given color and opacity
 * Returns the sphere object
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
 * Takes in an id and the name of the orbital
 */
function lookupAndCreate(id, name) {
    var obj = null;
    var dArr = data["orbital"];
    for (i = 0; i < dArr.length; i++) {
        if (dArr[i]["name"] == name && dArr[i]["enabled"] == true) {
            obj = dArr[i];
        }
    }

    if (obj != null) {
        var x = obj["x"];
        var y = obj["y"];
        var z = obj["z"];
        if (obj["isTorus"] == true) {
            createOrbitalAndTorus(name, x, y, z, "0x" + colours[id]);
        } else {
            toggleOrbital(x, y, z, name, "0x" + colours[id]);
        }
    } else {
        console.log("Could not retrieve orbital");
    }
}

/*
 * To be attached to a button's onClick command
 * Toggles a set of orbitals
 * The x, y, z params are rotations in radians
 * The key is a unique to store within the dictionary
 */
function handleButtonClick(id, x, y, z, key) {
    var val = toggleOrbital(x, y, z, key, "0x" + colours[id]);
}

/*
 * Similar the above function but creates a torus, used for the
 * z^2 method
 */
function handleButtonClickTorus(id, key) {
    var val = createOrbitalAndTorus(key, 0, 0, 0, "0x" + colours[id]);
}

/*
 * Draws any given orbital
 * This function will toggle a orbital on and off
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
 */
function createOrbitalAndTorus(key, x, y, z, hex) {
    if (key in orbitals) {
        scene.remove(orbitals[key]);
        delete orbitals[key];
        return false;
    } else {
        var obj = new THREE.Object3D();
        var colour = Number(hex);

        // Blue orbitals
        var end = createSphere(colour, 1);
        moveShapeRel(end, 0, -500, 0);
        scaleShape(end, 1, 1.5, 1);
        obj.add(end);

        var end = createSphere(colour, 1);
        moveShapeRel(end, 0, 500, 0);
        scaleShape(end, 1, 1.5, 1);
        obj.add(end);

        // The torus
        var torusGeom = new THREE.TorusGeometry(400, 100, 16, 100);
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
 * Returns an Object3D which can be added to the scene
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
 * Returns a Object3D containing the orbital
 */
function orbitalDraw(hex) {
    var obj = new THREE.Object3D();
    var colour = Number(hex);

    var end = createSphere(colour, 1);
    moveShapeRel(end, 500, 0, 0);
    scaleShape(end, 1.5, 1, 1);
    obj.add(end);

    var end = createSphere(colour, 1);
    moveShapeRel(end, -500, 0, 0);
    scaleShape(end, 1.5, 1, 1);
    obj.add(end);

    var end = createSphere(colour, 1);
    moveShapeRel(end, 0, 0, 500);
    scaleShape(end, 1, 1, 1.5);
    obj.add(end);

    var end = createSphere(colour, 1);
    moveShapeRel(end, 0, 0, -500);
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

init();
animate();
