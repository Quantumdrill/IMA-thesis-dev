<script setup>

import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {gsap} from "gsap"
import {onMounted, useTemplateRef} from "vue"
import { LoadingManager } from "three"
import { loadCharAnim, loadCharSkm, animTransition, charMove } from "../../functions/char"

const scene = new THREE.Scene()
const canvas = useTemplateRef("canvasDom")
let renderer
const scrnRatio = window.innerWidth/window.innerHeight

//fps
const fps = 8
let accumulatedDelta = 0
const clock = new THREE.Timer()

//camera
const camZoomFactor = 5.5 
const cam = new THREE.OrthographicCamera(-window.innerWidth/camZoomFactor,window.innerWidth/camZoomFactor,window.innerHeight/camZoomFactor,-window.innerHeight/camZoomFactor,0.01,1000)
cam.position.set(0,25,50)

//lights
const backLightFront = new THREE.DirectionalLight(0xffffff, 2)
backLightFront.position.set(50, 20, -50)
const backLightBack = new THREE.DirectionalLight(0xffffff, 1)
backLightBack.position.set(-50, 10, -50)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(cam,backLightFront,backLightBack,ambientLight)

//loader
const loadingManager = new LoadingManager()
const modelLoader = new FBXLoader(loadingManager)

//characters
const naoto = {
    mesh: null,
    skm: null,
    animClips: {
    },
    animActions: {
    },
    mixer: null,
    currentAnim: "idle",
}
const unitToVw = 50/8 // height of naoto is 8vw, and 50 units, so 50/8 = 6.25 units per vw



onMounted(() => {
    renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas.value,alpha: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    loadCharSkm("Naoto", naoto, modelLoader)
    loadCharAnim("Naoto", "run", naoto, modelLoader)
    loadCharAnim("Naoto", "idle", naoto, modelLoader)

    loadingManager.onLoad = () => {
        naoto.skm.material = new THREE.MeshLambertMaterial({color: 0xffffff})
        scene.add(naoto.mesh)
        naoto.mesh.rotation.y = Math.PI/2
        naoto.mesh.position.set(-45*unitToVw,-41*unitToVw/scrnRatio,0)

        naoto.mixer = new THREE.AnimationMixer(naoto.mesh)
        naoto.animActions.run = naoto.mixer.clipAction(naoto.animClips.run)
        naoto.animActions.idle = naoto.mixer.clipAction(naoto.animClips.idle)

        naoto.animActions.idle.play()
        window.addEventListener("click", (e) => {
            charMove(naoto, 80, 0)
            animTransition(naoto, naoto.currentAnim, "run")
        })
        animTick()
    }
})

function globalUpdatePerFrame(){
    naoto.mixer.update(1/fps)
    renderer.render(scene,cam)
}

function animTick(){
    clock.update()
    let delta = clock.getDelta()
    accumulatedDelta += delta
    if (accumulatedDelta >= 1/fps){ //enable 8fps for all anim clips and transitions
        accumulatedDelta = 0
        globalUpdatePerFrame()
    }

    requestAnimationFrame(animTick)
}

</script>
<template>
    <canvas id="canvas" ref="canvasDom"></canvas>
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
    width: 100vw;
    height: 100vh;
    position: fixed;
}

</style>