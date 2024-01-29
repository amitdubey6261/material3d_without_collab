import * as THREE from 'three' ; 

// Function to add a directional light

function addDirectionalLight(scene: THREE.Scene) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 5, 10); // Adjust the light position
    directionalLight.castShadow = true;

    // Set up shadow parameters
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 20;
    directionalLight.shadow.bias = -0.005;
    directionalLight.shadow.radius = 4;

    scene.add(directionalLight);
}

// Function to remove the directional light
function removeDirectionalLight(scene: THREE.Scene) {
    // Remove all directional lights
    const directionalLights = scene.children.filter((child) => {
        // Check if the child is a DirectionalLight before accessing isDirectionalLight
        return child.type === 'DirectionalLight';
    });

    directionalLights.forEach((directionalLight) => scene.remove(directionalLight));
}

export { addDirectionalLight, removeDirectionalLight }; 