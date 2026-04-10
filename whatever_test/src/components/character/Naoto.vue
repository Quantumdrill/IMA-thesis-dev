<script setup>

import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {gsap} from "gsap"
import {onMounted, useTemplateRef} from "vue"
import { LoadingManager } from "three"

const scene = new THREE.Scene()
const canvas = useTemplateRef("canvasDom")
let renderer
const camZoomFactor = 0.03
const cam = new THREE.OrthographicCamera(-1/camZoomFactor,1/camZoomFactor,1/camZoomFactor,-1/camZoomFactor,0.01,1000)
cam.position.set(50,20,0)
cam.rotation.y = Math.PI/2
const topLight = new THREE.DirectionalLight(0xffffff, 1)
topLight.position.set(0, 100, 0)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(cam,topLight,ambientLight)
const loadingManager = new LoadingManager()
const modelLoader = new FBXLoader(loadingManager)

const naoto = {
    skm: null,
    animClips: {
        run: null
    },
    animActions: {
        run: null
    },
    mixer: null
}

onMounted(() => {
    renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas.value})

    renderer.setSize(window.innerWidth/2, window.innerWidth/2)
    modelLoader.load("/src/assets/char/Naoto_anim_run.fbx", (loaded) => {
        naoto.animClips.run = loaded.animations[0]
        for (const track of naoto.animClips.run.tracks) {
            track.setInterpolation(THREE.InterpolateDiscrete)
        }
    })
    modelLoader.load("/src/assets/char/Naoto_skm.fbx", (loaded) => {
        naoto.mesh = loaded
        
        naoto.mesh.children[0].material = new THREE.MeshStandardMaterial({color: 0xffffff})

        scene.add(naoto.mesh)
    })
    loadingManager.onLoad = () => {
        naoto.mixer = new THREE.AnimationMixer(naoto.mesh)
        naoto.animActions.run = naoto.mixer.clipAction(naoto.animClips.run)
        

        naoto.animActions.run.play()
        animTick()
    }
})

function animTick(){
    naoto.mixer.update(1/60)

    renderer.render(scene,cam)
    requestAnimationFrame(animTick)
}

</script>
<template>
    <div id="canvasContainer">
        <canvas id="canvas" ref="canvasDom"></canvas>
    </div>
</template>
<style scoped>

#canvasContainer{
    width: 100vw;
    height: 100vh;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
}

#canvas{
    width: 10vw;
    height: 10vw;
    position: fixed;
}

</style>