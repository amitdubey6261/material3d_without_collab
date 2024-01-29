import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { modelPaths } from './Experience/Static';
// import { createSubsurfaceMaterial, replaceMaterial } from './Experience/SubSurfaceMAterial';
import { createRenderer } from './Experience/renderer';
import { createComposer } from './Experience/composer';
import { createScene, createCamera, createOrbitControls } from './Experience/scene';
import { createLoaders } from './Experience/loaders';
import CamCollab from './Collab/Camera/CollCam';
import { selectModelVariant } from './Experience/selectModelVariant';
import { addDirectionalLight, removeDirectionalLight } from './Experience/directionalLights';
import { Raycaster } from './Experience/Raycaster';
import { processJSON1, processJSON2, processJSON3 } from './DynamicMaterials/ProcessJSON';
import { controlLight } from './Collab/Camera/CollLights';


const progressContainer = document.querySelector('.spinner-container') as HTMLElement;
progressContainer.style.display = "block";

let specificObject: THREE.Object3D;
const specificObjectToggleCheckbox = document.getElementById('specificObjectToggle') as HTMLInputElement;
specificObjectToggleCheckbox.addEventListener('change', () => {
  const isActivated = specificObjectToggleCheckbox.checked;
  specificObject.visible = isActivated;
});

let pt_l: THREE.PointLight;

// Function to add HDRI
function setupHDRI() {
  const rgbeloader = new RGBELoader();
  rgbeloader.load('hdri/neutral.hdr', (hdri) => {
    const myhdr = hdri;
    myhdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = myhdr;
    scene.background = new THREE.Color("#000");
  });
}

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const composer = createComposer(renderer, scene, camera);

const mycanvas = renderer.domElement;
mycanvas.id = "my-canavas";
let elem = document.querySelector('#canvas-container');
console.log(elem);
elem?.appendChild(mycanvas);

const controls = createOrbitControls(camera, mycanvas);
const loders = createLoaders(renderer);
const loader = loders.loader;
const ktx2loader = loders.ktx2Loader;
const dayNightToggle = document.getElementById('dayNightToggle');
let isDayMode = false; // Initial mode is day
setupHDRI();

//Changing Material variants
const loadedModelsMap: any = {}
selectModelVariant(loadedModelsMap);

// Function to load models one by one
function loadModels(index: number) {
  if (index >= modelPaths.length) {
    pt_l.visible = true;
    progressContainer.style.display = 'none';
    composer.setSize(window.innerWidth * 0.75, window.innerHeight);
    processJSON1(loadedModelsMap['Sofa'], '.dynamic-mate', ktx2loader);
    processJSON2(loadedModelsMap['Floor'], '.dynamic-mate-floor', ktx2loader);
    processJSON3(loadedModelsMap['Carpet'], '.dynamic-mate-carpet', ktx2loader);
    controlLight(scene);
    //@ts-ignore
    // addDelete(specificObject)
    return;
  }

  // While loading, set a different pixel ratio
  renderer.setPixelRatio(0.80);
  composer.setSize(window.innerWidth * 0.75, window.innerHeight);

  const modelPath = modelPaths[index];
  loader.load(modelPath,
    function (gltf) {
      console.log(`Loaded model from ${modelPath}`, gltf);
      let modelName;
      if (modelPath == 'https://d2629xvaofl3d3.cloudfront.net/models_29_01_23/version2/models_29_01_24/Sofa.glb') {
        modelName = 'Sofa';
      }
      else if (modelPath == 'https://d2629xvaofl3d3.cloudfront.net/models_29_01_23/version2/models_29_01_24/Floor.glb') {
        modelName = 'Floor';
      }
      else if (modelPath == 'https://d2629xvaofl3d3.cloudfront.net/models_29_01_23/version2/models_29_01_24/Carpet.glb') {
        modelName = 'Carpet';
      }
      else if (modelPath == 'https://d2629xvaofl3d3.cloudfront.net/models_29_01_23/Window.glb') {
        modelName = 'Window';
      }
      else if (modelPath == 'https://d2629xvaofl3d3.cloudfront.net/models_29_01_23/Wall.glb') {
        modelName = 'Wall';
      }
      else {
        modelName = modelPath.split('/')[3].split('.')[0]
      }
      loadedModelsMap[modelName] = gltf

      if (modelName === 'Carpet') {
        specificObject = gltf.scene; // Store the specific object
      }

      gltf.scene.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.receiveShadow = true;
          m.castShadow = true;
        }

        if ((child as THREE.Light).isLight) {
          let l = child as THREE.PointLight;
          pt_l = l;
          l.visible = false;
          l.castShadow = true;
          l.distance = 5;
          l.decay = 4;
          l.power = 400;
          l.shadow.bias = -0.005;
          l.shadow.mapSize.width = 1024;
          l.shadow.mapSize.height = 1024;
          l.shadow.radius = 2.5;
        }
      });

      gltf.scene.position.set(0, -0.5, 0);
      scene.add(gltf.scene);

      // Example: Replace material of 'FloorLamp_Cover' with subsurface scattering material
      // if (modelName === 'Floor_Lamp') {
      //   const FloorLamp_Cover = 'FloorLamp_Cover';
      //   const newMaterial = createSubsurfaceMaterial(); // Or any other material creation logic
      //   replaceMaterial(gltf.scene, FloorLamp_Cover, newMaterial);
      // }
      loadModels(index + 1);
    },
    //@ts-ignore
    (xhr) => {
      // console.log(`${modelPath}: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
      console.log(`${modelPath}: ${error}`);
      loadModels(index + 1);
    }
  );
}

// Example: Replace material of 'FloorLamp_Cover' with subsurface scattering material
// const subsurfaceScatteringMaterial = createSubsurfaceMaterial();
// Ensure that specificObject is defined before replacing its material
// if (specificObject) {
//   replaceMaterial(specificObject, 'FloorLamp_Cover', subsurfaceScatteringMaterial);
// }

// Start loading models
loadModels(0);

if (dayNightToggle) {
  dayNightToggle.addEventListener('change', () => {
    isDayMode = !isDayMode;

    // Show the spinner at the beginning
    // progressContainer.style.display = 'flex';
    // Use requestAnimationFrame to ensure the spinner is rendered before proceeding
    requestAnimationFrame(() => {
      if (isDayMode) {
        // Switch to day mode (remove night lights, add day lights)
        addDirectionalLight(scene);
        renderer.toneMappingExposure = 0.7;

        // Set the background color to white
        scene.background = new THREE.Color(0xffffff);

        for (const modelName in loadedModelsMap) {
          const modelData = loadedModelsMap[modelName];
          if (modelData.scene) {
            modelData.scene.traverse(function (child: THREE.Object3D) {
              if ((child as THREE.Light).isLight) {
                let l = child as THREE.PointLight;
                l.power = 0;
              }
            });
          }
        }
        // progressContainer.style.display = 'none';
      } else {

        removeDirectionalLight(scene);
        renderer.toneMappingExposure = 0.3;

        // Set the background color to black
        scene.background = new THREE.Color(0x000000);

        for (const modelName in loadedModelsMap) {
          const modelData = loadedModelsMap[modelName];
          if (modelData.scene) {
            modelData.scene.traverse(function (child: THREE.Object3D) {
              if ((child as THREE.Light).isLight) {
                let l = child as THREE.PointLight;
                l.power = 400;
              }
            });
          }
        }
        // progressContainer.style.display = 'none';
      }
    });
  });
}

new CamCollab(camera, mycanvas, controls);

const raycaster = new Raycaster(renderer, scene, camera);

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  composer.render();
  stats.update();
}

function render() {
  raycaster.render();
  renderer.render(scene, camera);
}

animate();