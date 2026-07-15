// Código para crear el globo terráqueo con three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe-container').appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(5, 32, 32);
const texture = new THREE.TextureLoader().load('assets/img/earth_texture.jpg');
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Centrar el globo en México
const mexicoLat = 23.6345;
const mexicoLon = -102.5528;
const phi = (90 - mexicoLat) * (Math.PI / 180);
const theta = (mexicoLon + 180) * (Math.PI / 180);

camera.position.x = 10 * Math.sin(phi) * Math.cos(theta);
camera.position.y = 10 * Math.cos(phi);
camera.position.z = 10 * Math.sin(phi) * Math.sin(theta);
camera.lookAt(sphere.position);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Añadir puntos interactivos
const points = [
    { lat: 19.4326, lon: -99.1332, name: 'Ciudad de México', images: ['assets/img/cdmx1.jpg', 'assets/img/cdmx2.jpg'] },
    { lat: 20.6597, lon: -103.3496, name: 'Guadalajara', images: ['assets/img/guadalajara1.jpg', 'assets/img/guadalajara2.jpg'] },
    // Añade más puntos según sea necesario
];

points.forEach(point => {
    const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);

    const pointPhi = (90 - point.lat) * (Math.PI / 180);
    const pointTheta = (point.lon + 180) * (Math.PI / 180);

    pointMesh.position.x = 5 * Math.sin(pointPhi) * Math.cos(pointTheta);
    pointMesh.position.y = 5 * Math.cos(pointPhi);
    pointMesh.position.z = 5 * Math.sin(pointPhi) * Math.sin(pointTheta);

    pointMesh.userData = point;
    scene.add(pointMesh);

    pointMesh.callback = () => {
        showImages(point.images);
    };
});

// Mostrar imágenes al hacer clic en un punto
function showImages(images) {
    const container = document.createElement('div');
    container.className = 'image-container';
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        container.appendChild(img);
    });
    document.body.appendChild(container);
}

// Detectar clics en los puntos
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach(intersect => {
        if (intersect.object.callback) {
            intersect.object.callback();
        }
    });
});

// Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});