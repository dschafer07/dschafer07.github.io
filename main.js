import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Texture } from 'three';
import { Vector3 } from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(5);

// mouse controls to move screen 
const controls = new OrbitControls(camera, renderer.domElement);



//-----------------------MAIN BODY-----------------------//

var scale = 5;
var sizeScale = 0.9;

//add sun
const sunTexture = new THREE.TextureLoader().load('assets/sun.jpg');
const sunIMG = new THREE.Mesh(
  new THREE.SphereGeometry(8, 40, 40),
  new THREE.MeshBasicMaterial({map: sunTexture})
);
scene.add(sunIMG);

const geometry = new THREE.SphereGeometry(1, 40, 40);
const edges = new THREE.EdgesGeometry(geometry);
const sun = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
scene.add(sun);



//create planet function to reduce repeated code
function createPlanet(size, texture, xVal) {
  const geo = new THREE.SphereGeometry(size, 40, 40);
  const mat = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(texture)
  });
  const planet = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(planet);
  scene.add(obj);
  planet.position.x = xVal;
  return {planet, obj}
}

// //adding planets
const mercury = createPlanet(0.49/sizeScale, 'assets/mercury.jpg', 58/scale);
sun.add(mercury);
const venus = createPlanet(1.21/sizeScale, 'assets/venus.jpg', 110/scale);
sun.add(venus);
const earth = createPlanet(1.27/sizeScale, 'assets/earthDay.jpg', 150/scale);
sun.add(earth);
const mars = createPlanet(0.68/sizeScale, 'assets/mars.jpg', 228/scale);
sun.add(mars);
const jupiter = createPlanet(14.32/sizeScale, 'assets/jupiter.jpg', 779/scale);
sun.add(jupiter);
const saturn = createPlanet(12/sizeScale, 'assets/saturn.jpg', 1427/scale);
sun.add(saturn);
const uranus = createPlanet(5.18/sizeScale, 'assets/uranus.jpg', 2870/scale);
sun.add(uranus);
const neptune = createPlanet(4.95/sizeScale, 'assets/neptune.jpg', 4497/scale);
sun.add(neptune);
const pluto = createPlanet(0.25/sizeScale, 'assets/pluto.jpg', 5900/scale);
sun.add(pluto);

//lighting
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(pointLight, ambientLight);


//helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(500, 100);
scene.add(lightHelper);


//background
const spaceTexture = new THREE.TextureLoader().load('assets/milkyWay.jpg');
scene.background = spaceTexture;

//adding randomly generated stars to world
function addStar() {
 
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 24, 24),
    new THREE.MeshStandardMaterial({color: 0xffffff})
  );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)*2);

  star.position.set(x, y, z);
  scene.add(star);
}
Array(300).fill().forEach(addStar);

//adding randomly generated asteroids to world
function addAsteroid() {
  const i = THREE.MathUtils.randInt(1,3);
  var geo;
  var mesh = new THREE.MeshStandardMaterial(
    {map: new THREE.TextureLoader().load('assets/asteroid.jpg')}
  );

  switch (i) {
    case 1:
      geo = new THREE.TorusKnotGeometry( 1, 2, 10, 16 );
      break;
    case 2:
      geo = new THREE.OctahedronGeometry(2, 1);
      break;
    case 3:
      geo = new THREE.SphereGeometry(3, 24, 24);
      break;
    default:
      geo = new THREE.SphereGeometry(i, 24, 24);
      break;
  }

  const asteroid = new THREE.Mesh(geo, mesh);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)*2);
  asteroid.position.set(x, y, z);
  return asteroid;
}



// move on scroll
function moveCamera() {

  const t = document.body.getBoundingClientRect().top;

  camera.position.z = 20 + (t * -0.02);
  camera.position.x = 10 + t * -0.04;
  camera.position.y = 5 + t * -0.001;
}

document.body.onscroll = moveCamera


//basically screen refresh to animate stuff
function animate() {
  requestAnimationFrame( animate );

  sun.rotation.y += 0.01;
  mercury.obj.rotation.y += 0.00479;
  venus.obj.rotation.y += 0.0035;
  earth.obj.rotation.y += 0.00298;
  mars.obj.rotation.y += 0.00241;
  jupiter.obj.rotation.y += 0.00131;
  saturn.obj.rotation.y += 0.00097;
  uranus.obj.rotation.y += 0.00068;
  neptune.obj.rotation.y += 0.00054;


  mercury.planet.rotation.y += 0.00479;
  venus.planet.rotation.y += 0.0035;
  earth.planet.rotation.y += 0.00298;
  mars.planet.rotation.y += 0.00241;
  jupiter.planet.rotation.y += 0.00131;
  saturn.planet.rotation.y += 0.00097;
  uranus.planet.rotation.y += 0.00068;
  neptune.planet.rotation.y += 0.00054;

  controls.update();
  
  renderer.render( scene, camera );
}

//this does everything
animate();
