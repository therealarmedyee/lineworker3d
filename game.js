
// Basic Three.js scene setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(light);

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({ color: 0x555555 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Utility pole
function createPole(x, z) {
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 8),
        new THREE.MeshLambertMaterial({ color: 0x663300 })
    );
    pole.position.set(x, 4, z);
    scene.add(pole);

    const transformer = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
    );
    transformer.position.set(x, 7, z);
    transformer.userData.isRepairable = true;
    scene.add(transformer);
    return transformer;
}

// Add poles and transformers
const transformers = [
    createPole(-10, -10),
    createPole(0, -10),
    createPole(10, -10),
];

// Bucket truck (simplified)
const truck = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 4),
    new THREE.MeshLambertMaterial({ color: 0x3333ff })
);
truck.position.set(0, 0.5, 0);
scene.add(truck);

// Camera start
camera.position.set(0, 3, 10);
camera.lookAt(0, 0, 0);

// Controls
let keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Simple movement
function moveTruck() {
    if (keys['w']) truck.position.z -= 0.1;
    if (keys['s']) truck.position.z += 0.1;
    if (keys['a']) truck.position.x -= 0.1;
    if (keys['d']) truck.position.x += 0.1;
}

// Repair UI interaction
function openRepairUI() {
    document.getElementById('repairUI').style.display = 'block';
}
function closeRepairUI() {
    document.getElementById('repairUI').style.display = 'none';
    alert('Power Restored!');
}

// Check for repairable transformer nearby
function checkRepairProximity() {
    for (let t of transformers) {
        let dist = truck.position.distanceTo(t.position);
        if (dist < 3 && t.userData.isRepairable) {
            openRepairUI();
            t.userData.isRepairable = false;
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    moveTruck();
    renderer.render(scene, camera);
}
animate();

// Interaction click
window.addEventListener('keydown', (e) => {
    if (e.key === 'e') {
        checkRepairProximity();
    }
});

let tutorialStep = 0;
const tutorialMessages = [
    "Use W A S D to drive your bucket truck.",
    "Drive near the highlighted transformer.",
    "Press E to begin the repair.",
    "De-energize the line before starting repairs.",
    "Inspect for damage and replace faulty components.",
    "Reconnect the line and energize it.",
    "Tutorial complete! You're ready for the real thing."
];

const tutorialBox = document.createElement('div');
tutorialBox.id = 'tutorialBox';
tutorialBox.style.position = 'absolute';
tutorialBox.style.bottom = '10px';
tutorialBox.style.left = '10px';
tutorialBox.style.padding = '15px';
tutorialBox.style.background = 'rgba(0,0,0,0.8)';
tutorialBox.style.color = 'white';
tutorialBox.style.fontFamily = 'sans-serif';
tutorialBox.style.fontSize = '16px';
tutorialBox.style.zIndex = '100';
tutorialBox.innerText = tutorialMessages[tutorialStep];
document.body.appendChild(tutorialBox);

function nextTutorialStep() {
    tutorialStep++;
    if (tutorialStep < tutorialMessages.length) {
        tutorialBox.innerText = tutorialMessages[tutorialStep];
    } else {
        tutorialBox.innerText = "Tutorial complete.";
        setTimeout(() => tutorialBox.style.display = 'none', 3000);
    }
}

// Modified moveTruck to trigger step 1
function moveTruck() {
    let moved = false;
    if (keys['w']) { truck.position.z -= 0.1; moved = true; }
    if (keys['s']) { truck.position.z += 0.1; moved = true; }
    if (keys['a']) { truck.position.x -= 0.1; moved = true; }
    if (keys['d']) { truck.position.x += 0.1; moved = true; }

    if (tutorialStep === 0 && moved) nextTutorialStep();
}

// Check transformer proximity with tutorial gating
function checkRepairProximity() {
    if (tutorialStep < 1) return; // Must move first
    for (let t of transformers) {
        let dist = truck.position.distanceTo(t.position);
        if (dist < 3 && t.userData.isRepairable) {
            if (tutorialStep === 1) nextTutorialStep();
            openRepairUI();
            t.userData.isRepairable = false;
            break;
        }
    }
}

// Expanded repair UI simulation with tutorial steps
function openRepairUI() {
    const repairUI = document.getElementById('repairUI');
    repairUI.style.display = 'block';
    repairUI.innerHTML = `
        <h2>Transformer Repair</h2>
        <p id="repairStep">Step 1: De-energize the line.</p>
        <button onclick="advanceRepair()">Continue</button>
    `;
}

let repairStep = 0;
function advanceRepair() {
    const stepText = document.getElementById('repairStep');
    repairStep++;
    switch (repairStep) {
        case 1:
            stepText.innerText = "Step 2: Inspect and identify the damage.";
            break;
        case 2:
            stepText.innerText = "Step 3: Replace the damaged fuse.";
            break;
        case 3:
            stepText.innerText = "Step 4: Re-energize the line.";
            break;
        case 4:
            stepText.innerText = "Repair complete! Power restored.";
            document.getElementById('repairUI').innerHTML += '<p style="color:lightgreen;">You completed a full transformer repair.</p>';
            if (tutorialStep === 2) nextTutorialStep(); // Unlock next tutorial step
            setTimeout(() => {
                closeRepairUI();
                repairStep = 0;
            }, 3000);
            break;
    }
}

// Enhanced repair system for tutorial
let currentFuseIndex = Math.floor(Math.random() * 3); // Randomly select a blown fuse (0-2)

function openRepairUI() {
    const repairUI = document.getElementById('repairUI');
    repairUI.style.display = 'block';
    repairUI.innerHTML = \`
        <h2>Transformer Repair Tutorial</h2>
        <div id="repairStep">Step 1: De-energize the line by opening the cut-out switch.</div>
        <button onclick="handleCutoutSwitch()">Open Cut-out Switch</button>
    \`;
}

let isLineDeEnergized = false;
let hasIdentifiedBlownFuse = false;
let hasReplacedFuse = false;

function handleCutoutSwitch() {
    isLineDeEnergized = true;
    document.getElementById('repairStep').innerHTML = "Step 2: Inspect the fuses for damage.";
    const repairUI = document.getElementById('repairUI');
    repairUI.innerHTML += "<p>Click each fuse to inspect:</p>";
    for (let i = 0; i < 3; i++) {
        repairUI.innerHTML += \`<button onclick="inspectFuse(\${i})">Inspect Fuse \${i + 1}</button> \`;
    }
}

function inspectFuse(index) {
    const stepEl = document.getElementById('repairStep');
    if (index === currentFuseIndex) {
        stepEl.innerHTML = "Step 3: Blown fuse found. Click below to replace it.";
        hasIdentifiedBlownFuse = true;
        const repairUI = document.getElementById('repairUI');
        repairUI.innerHTML += "<br><button onclick='replaceFuse()'>Replace Blown Fuse</button>";
    } else {
        stepEl.innerHTML = "This fuse appears to be intact. Keep inspecting.";
    }
}

function replaceFuse() {
    hasReplacedFuse = true;
    document.getElementById('repairStep').innerHTML = "Step 4: Re-energize the transformer by closing the cut-out switch.";
    const repairUI = document.getElementById('repairUI');
    repairUI.innerHTML += "<br><button onclick='reenergizeLine()'>Close Cut-out Switch</button>";
}

function reenergizeLine() {
    if (isLineDeEnergized && hasIdentifiedBlownFuse && hasReplacedFuse) {
        document.getElementById('repairUI').innerHTML = "<h2>Repair Complete!</h2><p style='color:lightgreen;'>You safely replaced the fuse and restored power.</p>";
        if (tutorialStep === 2) nextTutorialStep();
        setTimeout(() => {
            closeRepairUI();
            repairStep = 0;
        }, 4000);
    } else {
        alert("You missed a step! Make sure you've completed all tasks in order.");
    }
}

// ===== DEBUG PATCH =====
console.log("Initializing scene...");

// Add sky color for visibility
scene.background = new THREE.Color(0x87ceeb); // Light blue sky

// Add ambient light as fallback
scene.add(new THREE.AmbientLight(0x404040));

// Add a red cube to guarantee something is visible
const testCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
testCube.position.set(0, 1, 0);
scene.add(testCube);

// Raise the camera to a higher Y level
camera.position.set(0, 5, 10);
camera.lookAt(0, 1, 0);

console.log("Scene initialized. Rendering begins.");
