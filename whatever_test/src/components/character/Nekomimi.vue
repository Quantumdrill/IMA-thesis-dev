<script setup>

import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {gsap} from "gsap"
import MotionPathPlugin from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)
import {onMounted, useTemplateRef, watch, ref} from "vue"
import { LoadingManager } from "three"
import { loadCharAnim, loadCharSkm, animTransition, charMove, charMoveDuration, getBoneIndex } from "../../functions/char"

const scene = new THREE.Scene()
const canvas = useTemplateRef("canvasDom")
let renderer
const scrnRatio = window.innerWidth/window.innerHeight
const props = defineProps(["animSequenceProp", "parentComponent", "naotoLocalVarsProp"])
const emit = defineEmits(["nextButtonActivated", "naotoPosUpdate", "operationButtonOperation", "popupPushedStateUpdate"])

//fps
const fps = 8
let accumulatedDelta = 0
const clock = new THREE.Timer()

//camera
const camZoomFactor = 26
const cam = new THREE.PerspectiveCamera(camZoomFactor, window.innerWidth/window.innerHeight, 0.1, 1000)
cam.position.set(0,0,50)

//lights
const backLightFront = new THREE.DirectionalLight(0xffffff, 2)
backLightFront.position.set(50, 20, 20)
const backLightBack = new THREE.DirectionalLight(0xffffff, 1)
backLightBack.position.set(-50, 10, 20)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(cam,backLightFront,backLightBack,ambientLight)

//loader
const loadingManager = new LoadingManager()
const modelLoader = new FBXLoader(loadingManager)

//characters
const nekomimi = {
    mesh: null,
    skm: null,
    skeleton: null,
    bones: {},
    animClips: {
    },
    animActions: {
    },
    mixer: null,
    currentAnim: "idle",
    animPlaying: false,
    localVars: {
        stage24Appearance: false,
    },
    reactiveRig: true,
}
const unitToVw = 50/8 // height of naoto is 8vw, and 50 units, so 50/8 = 6.25 units per vw
const animArr = ["stage33"]
const animArrOnce = ["stage33"] // animations that should only play once

//misc
let mousePos = {
    x: 0,
    y: 0,
}

onMounted(() => {
    renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas.value,alpha: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.addEventListener("mousemove", (e) => {
        mousePos.x = e.clientX
        mousePos.y = e.clientY
    })
    
    loadCharSkm("Nekomimi", nekomimi, modelLoader)
    for (const anim of animArr){
        loadCharAnim("Nekomimi", anim, nekomimi, modelLoader)
    }
    
    loadingManager.onLoad = () => {
        nekomimi.skm.material = new THREE.MeshLambertMaterial({color: 0xffffff})
        // get bones
        // nekomimi.bones.head = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigneck_head_C0_JT")]
        // nekomimi.bones.upperSpine = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigspine_1_C0_JT")]

        scene.add(nekomimi.mesh)
        
        nekomimiCharInitialization()

        nekomimi.mixer = new THREE.AnimationMixer(nekomimi.mesh)
        for (const anim of animArr){
            nekomimi.animActions[anim] = nekomimi.mixer.clipAction(nekomimi.animClips[anim])
        }
        for (const anim of animArrOnce){
            nekomimi.animActions[anim].loop = THREE.LoopOnce
        }

        nekomimi.animActions.stage33.play()
        watch(()=>props.animSequenceProp, () => {
            nekomimiAnimSequences[props.animSequenceProp]()
        })
        animTick()
    }
})

function globalUpdatePerFrame(){
    nekomimi.mixer.update(1/fps)

    // place after mixer update to overwrite animated posture
    if (nekomimi.reactiveRig){
        reactiveRig()
    }

    renderer.render(scene,cam)
}

function reactiveRig(){

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

function nekomimiCharInitialization(){
    switch (props.parentComponent){
        case "stage33":
            nekomimi.mesh.position.set(-0*unitToVw, -100*unitToVw/scrnRatio,0)
            break
        default:
            break
    }
}

const nekomimiAnimSequences = {
    stage33Init: ()=>{
        if (!nekomimi.animPlaying){
            let tl = gsap.timeline()
            nekomimi.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                nekomimi.mesh.position.set(-0*unitToVw, -0*unitToVw/scrnRatio,0)
                charMove(nekomimi, "stage33", 0, 0)
            }, [], "+=0.5")
        }
    },
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