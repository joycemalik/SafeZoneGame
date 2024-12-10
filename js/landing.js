// Handle button navigation
document.getElementById('startBtn').addEventListener('click', () => {
    window.location.href = 'mode.html';
});
document.getElementById('leaderboardBtn').addEventListener('click', () => {
    window.location.href = 'leaderboard.html';
});

// GSAP fade in animation
gsap.from(".content-panel", {duration:1, opacity:0, y:30, ease:"power3.out"});

// Three.js scene: A rotating wireframe sphere
const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
renderer.setSize(innerWidth, innerHeight);
camera.position.z = 10;

// Create a glowing wireframe sphere
const geometry = new THREE.SphereGeometry(3, 32, 32);
const wireframeMaterial = new THREE.MeshBasicMaterial({
    color:0x0fffff, wireframe:true, transparent:true, opacity:0.5
});
const sphere = new THREE.Mesh(geometry, wireframeMaterial);
scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.005; 
  sphere.rotation.x += 0.002;
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});
