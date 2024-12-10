// Button navigation
document.getElementById('startBtn').addEventListener('click', () => {
    window.location.href = 'mode.html';
});
document.getElementById('leaderboardBtn').addEventListener('click', () => {
    window.location.href = 'leaderboard.html';
});

// GSAP fade in
gsap.from(".content-panel", {duration:1, opacity:0, y:30, ease:"power3.out"});

// Typed.js effect for subtitle
const subtitleEl = document.querySelector('.subtitle');
const typed = new Typed(subtitleEl, {
  strings: ["A Cosmic Test of Logic and Fortune", "Dare to Enter the Grid?", "Survive the Patterns Within..."],
  typeSpeed: 40,
  backSpeed: 20,
  backDelay: 2000,
  loop: true
});

// Three.js Scene
const canvas = document.getElementById('bgCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
renderer.setSize(innerWidth, innerHeight);
camera.position.z = 10;

const geometry = new THREE.SphereGeometry(3, 32, 32);
const wireframeMaterial = new THREE.MeshBasicMaterial({
    color:0x0fffff, wireframe:true, transparent:true, opacity:0.5
});
const sphere = new THREE.Mesh(geometry, wireframeMaterial);
scene.add(sphere);

// Add a small orbiting point light or glowing particle
const glowGeometry = new THREE.SphereGeometry(0.1,16,16);
const glowMaterial = new THREE.MeshBasicMaterial({color:0xff00ff});
const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(glowSphere);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.005; 
  sphere.rotation.x += 0.002;

  glowSphere.position.x = Math.sin(Date.now()*0.001)*5;
  glowSphere.position.y = Math.cos(Date.now()*0.001)*5;
  glowSphere.position.z = Math.sin(Date.now()*0.0015)*5;

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});

// Lottie animation (scanner overlay)
const lottieContainer = document.getElementById('lottieContainer');
lottie.loadAnimation({
  container: lottieContainer,
  renderer:'svg',
  loop:true,
  autoplay:true,
  path:'animations/scanner.json'
});
