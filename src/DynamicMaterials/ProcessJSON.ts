import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { createMaterialFromJSON } from "./CreateMaterial";
// import { Raycaster } from "../Experience/Raycaster";
// import { createMaterialFromJSON } from "./CreateMaterial";

export const processJSON1 = (sofa : THREE.Object3D , className : string , ktx2loader : any ) => {
    fetch('MaterialData/SofaMaterials.json').then((res) => res.json()).then((data:any) => {
        const elems = document.querySelectorAll(className);
        Array.from(elems).map((elm) => {
            elm.addEventListener('dragend', async (e: Event) => {
                //@ts-ignore
                const thumbnailSelected = e.target.getAttribute('data-variant');
                const dmat = await createMaterialFromJSON(data[thumbnailSelected] , ktx2loader );
                //@ts-ignore
                sofa.scene.traverse((elem) => {
                    //@ts-ignore
                    if (elem.type == "Mesh") {
                        //@ts-ignore
                        elem.material = dmat.clone();
                    }
                })
            })
        })
        // trigger1("Pink_Fabric")
    })
}

export const processJSON2 = (sofa : THREE.Object3D , className : string , ktx2Loader : KTX2Loader  ) => {
    fetch('MaterialData/SofaMaterials.json').then((res) => res.json()).then((data:any) => {
        const elems = document.querySelectorAll(className);
        Array.from(elems).map((elm) => {
            elm.addEventListener('dragend', async (e: Event) => {
                //@ts-ignore
                const thumbnailSelected = e.target.getAttribute('data-variant');
                const dmat = await createMaterialFromJSON(data[thumbnailSelected] , ktx2Loader );
                //@ts-ignore
                sofa.scene.traverse((elem) => {
                    //@ts-ignore
                    if (elem.type == "Mesh") {
                        //@ts-ignore
                        elem.material = dmat.clone();
                    }
                })
            })
        })
    })
}


export const processJSON3 = (sofa : THREE.Object3D , className : string , ktx2loader : KTX2Loader  ) => {
    fetch('MaterialData/SofaMaterials.json').then((res) => res.json()).then((data:any) => {
        const elems = document.querySelectorAll(className);
        Array.from(elems).map((elm) => {
            elm.addEventListener('dragend', async (e: Event) => {
                //@ts-ignore
                const thumbnailSelected = e.target.getAttribute('data-variant');
                const dmat = await createMaterialFromJSON(data[thumbnailSelected] , ktx2loader );
                //@ts-ignore
                sofa.scene.traverse((elem) => {
                    //@ts-ignore
                    if (elem.type == "Mesh") {
                        //@ts-ignore
                        elem.material = dmat.clone();
                    }
                })
            })
        })
    })

}