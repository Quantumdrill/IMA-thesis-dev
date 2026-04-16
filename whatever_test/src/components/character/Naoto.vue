<script setup>

import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {gsap} from "gsap"
import MotionPathPlugin from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)
import {onMounted, useTemplateRef, watch, ref} from "vue"
import { LoadingManager } from "three"
import { loadCharAnim, loadCharSkm, animTransition, charMove, charMoveDuration } from "../../functions/char"

const scene = new THREE.Scene()
const canvas = useTemplateRef("canvasDom")
let renderer
const scrnRatio = window.innerWidth/window.innerHeight
const props = defineProps(["animSequenceProp", "parentComponent"])
const emit = defineEmits(["nextButtonActivated"])

//fps
const fps = 8
let accumulatedDelta = 0
const clock = new THREE.Timer()

//camera
const camZoomFactor = window.innerWidth*0.0027
const cam = new THREE.OrthographicCamera(-window.innerWidth/camZoomFactor,window.innerWidth/camZoomFactor,window.innerHeight/camZoomFactor,-window.innerHeight/camZoomFactor,0.01,1000)
cam.position.set(0,0,50)

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
    animPlaying: false,
}
const unitToVw = 50/8 // height of naoto is 8vw, and 50 units, so 50/8 = 6.25 units per vw
const animArr = ["run", "idle", "leap"]


onMounted(() => {
    renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas.value,alpha: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    loadCharSkm("Naoto", naoto, modelLoader)
    for (const anim of animArr){
        loadCharAnim("Naoto", anim, naoto, modelLoader)
    }

    loadingManager.onLoad = () => {
        naoto.skm.material = new THREE.MeshLambertMaterial({color: 0xffffff})
        scene.add(naoto.mesh)
        
        naotoCharInitialization()

        naoto.mixer = new THREE.AnimationMixer(naoto.mesh)
        for (const anim of animArr){
            naoto.animActions[anim] = naoto.mixer.clipAction(naoto.animClips[anim])
        }
        naoto.animActions.leap.loop = THREE.LoopOnce

        naoto.animActions.idle.play()
        watch(()=>props.animSequenceProp, () => {
            naotoAnimSequences[props.animSequenceProp]()
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

function naotoCharInitialization(){
    switch (props.parentComponent){
        case "stage21":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-45*unitToVw,-6*unitToVw/scrnRatio,0)
            break
        case "stage22":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-45*unitToVw,-6*unitToVw/scrnRatio,0)
            break
        default:
            break
    }
}

const naotoAnimSequences = {
    stage21NextLevel: ()=>{
        if (props.animSequenceProp==="stage21NextLevel"&&!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                charMove(naoto, "run", 16, 0)
            }, [], "+=0.5")
            tl.call(() => {
                charMove(naoto, "leap", 18, 7/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "run", 16, 0)}`)
            tl.call(() => {
                charMove(naoto, "leap", 22, 12/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "leap", 16, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "leap", 20, 10/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "leap", 20, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "run", 10, 0)
            }, [], `+=${charMoveDuration(naoto, "leap", 20, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
                naoto.animPlaying = false
                emit("nextButtonActivated")
            }, [], `+=${charMoveDuration(naoto, "run", 10, 0)}`)
        }
    }
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