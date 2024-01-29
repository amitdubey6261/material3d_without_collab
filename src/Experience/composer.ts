import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

const createComposer = (renderer : THREE.WebGLRenderer , scene : THREE.Scene , camera : THREE.PerspectiveCamera) => {
    //Anti Aliasing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Replace the FXAA pass with SMAA pass
    const smaaPass = new SMAAPass(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
    composer.addPass(smaaPass);

    // SSAO pass
    const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
    ssaoPass.kernelRadius = 16;
    ssaoPass.minDistance = 0.01;
    ssaoPass.maxDistance = 0.05;
    composer.addPass(ssaoPass);
    return composer;
}

export { createComposer }; 