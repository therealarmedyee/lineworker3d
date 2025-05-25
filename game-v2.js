
// Core Lineworker 3D Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x228822 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Player (Truck placeholder as a box)
const truck = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 4),
    new THREE.MeshStandardMaterial({ color: 0x3333ff })
);
truck.position.y = 0.5;
scene.add(truck);

// Transformer pole (simple cylinder and fuse box)
const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 10),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
);
pole.position.set(10, 5, 0);
scene.add(pole);

const transformer = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x999999 })
);
transformer.position.set(10, 6, 0);
scene.add(transformer);

// UI
const ui = document.createElement("div");
ui.id = "repairUI";
ui.style.position = "absolute";
ui.style.display = "none";
ui.style.top = "20%";
ui.style.left = "30%";
ui.style.width = "40%";
ui.style.background = "rgba(0,0,0,0.9)";
ui.style.color = "white";
ui.style.padding = "20px";
ui.style.fontFamily = "sans-serif";
ui.style.border = "2px solid #ffffff44";
ui.style.borderRadius = "8px";
document.body.appendChild(ui);

// Player Controls
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Interaction
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e' && truck.position.distanceTo(transformer.position) < 5) {
        openRepairUI();
    }
});

// Repair UI Logic
function openRepairUI() {
    ui.style.display = "block";
    ui.innerHTML = "<h3>Repair Tutorial</h3><p>Step 1: De-energize transformer.</p><button onclick='step2()'>Open Cutout</button>";
}

function step2() {
    ui.innerHTML = "<h3>Step 2: Inspect fuse.</h3><p>Fuse appears damaged.</p><button onclick='step3()'>Replace Fuse</button>";
}

function step3() {
    ui.innerHTML = "<h3>Step 3: Re-energize line.</h3><button onclick='completeRepair()'>Close Cutout</button>";
}

function completeRepair() {
    ui.innerHTML = "<h2 style='color: lightgreen;'>✅ Power Restored!</h2>";
    setTimeout(() => { ui.style.display = "none"; }, 3000);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (keys['w']) truck.position.z -= 0.1;
    if (keys['s']) truck.position.z += 0.1;
    if (keys['a']) truck.position.x -= 0.1;
    if (keys['d']) truck.position.x += 0.1;

    camera.position.set(truck.position.x, truck.position.y + 5, truck.position.z + 10);
    camera.lookAt(truck.position);

    renderer.render(scene, camera);
}
animate();
