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
const props = defineProps(["animSequenceProp", "parentComponent", "naotoLocalVarsProp"])
const emit = defineEmits(["nextButtonActivated", "naotoPosUpdate", "operationButtonOperation", "popupPushedStateUpdate"])

//fps
const fps = 8
let accumulatedDelta = 0
const clock = new THREE.Timer()

//camera
const camZoomFactor = window.innerWidth*0.0032
const cam = new THREE.OrthographicCamera(-window.innerWidth/camZoomFactor,window.innerWidth/camZoomFactor,window.innerHeight/camZoomFactor,-window.innerHeight/camZoomFactor,-1000,1000)
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
    localVars: {
        stage24Appearance: false,
    }
}
const unitToVw = 50/8 // height of naoto is 8vw, and 50 units, so 50/8 = 6.25 units per vw
const animArr = ["run", "idle", "leap", "drop", "point", "turn", "stage1", "idea", "push", "walk", "leapReady"]
const animArrOnce = ["leap", "drop", "point", "turn", "stage1", "idea", "leapReady"] // animations that should only play once

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
        for (const anim of animArrOnce){
            naoto.animActions[anim].loop = THREE.LoopOnce
        }
        naoto.animActions.stage1.clampWhenFinished = true

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
        case "stage1": 
            naoto.mesh.position.set(-52*unitToVw,-5*unitToVw/scrnRatio,0)
            break
        case "stage21":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-36*unitToVw,-5*unitToVw/scrnRatio,0)
            break
        case "stage22":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-36*unitToVw,-5*unitToVw/scrnRatio,0)
            break
        case "stage24":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-40*unitToVw,30*unitToVw/scrnRatio,0)
            break
        case "stage31":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-20*unitToVw,10*unitToVw/scrnRatio,0)
            break
        case "stage32":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-27*unitToVw,30*unitToVw/scrnRatio,0)
            break
        case "stage32Submarine":
            naoto.mesh.rotation.y = Math.PI/2   
            naoto.mesh.position.set(-2*unitToVw, 16*unitToVw/scrnRatio,0)
            cam.left = -1/(0.0032*100/15)
            cam.right = 1/(0.0032*100/15)
            cam.top = 1/(0.0032*100/15)/scrnRatio
            cam.bottom = -1/(0.0032*100/15)/scrnRatio
            cam.updateProjectionMatrix()
            break
        default:
            break
    }
}

const naotoAnimSequences = {
    stage1: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                charMove(naoto, "stage1", 0, 0)
            }, [], "+=0")
        }
    },
    stage21NextLevel: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                charMove(naoto, "run", 8, 0)
            }, [], "+=0.5")
            tl.call(() => {
                charMove(naoto, "leap", 18, 7/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "run", 8, 0)}`)
            tl.call(() => {
                charMove(naoto, "leap", 20, 10/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "leap", 18, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "leap", 18, 8/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "leap", 20, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "run", 6, 0)
            }, [], `+=${charMoveDuration(naoto, "leap", 18, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
                naoto.animPlaying = false
                emit("nextButtonActivated")
            }, [], `+=${charMoveDuration(naoto, "run", 8, 0)}`)
        }
    },
    stage22NextLevel: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                charMove(naoto, "run", 8, 0)
            }, [], "+=0.5")
            tl.call(() => {
                charMove(naoto, "leap", 18, 0/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "run", 8, 0)}`)
            tl.call(() => {
                charMove(naoto, "run", 20, 0)
            }, [], `+=${charMoveDuration(naoto, "leap", 20, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "leap", 20, 0/scrnRatio, true, 1)
            }, [], `+=${charMoveDuration(naoto, "run", 20, 0)}`)
            tl.call(() => {
                charMove(naoto, "run", 6, 0)
            }, [], `+=${charMoveDuration(naoto, "leap", 20, 8/scrnRatio, true)}`)
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
                naoto.animPlaying = false
                emit("nextButtonActivated")
            }, [], `+=${charMoveDuration(naoto, "run", 8, 0)}`)
        }
    },
    stage24InitDrop: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            emit("operationButtonOperation", false)
            tl.call(() => {
                charMove(naoto, "drop", 0, -30/scrnRatio)
            }, [], "+=0")
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
                emit("naotoPosUpdate", 2)
            }, [], `+=${charMoveDuration(naoto, "drop", 0, -30/scrnRatio)}`)
            tl.call(() => {
                charMove(naoto, "point", 0, 0)
            }, [], `+=0.5`)
            tl.call(() => {
                emit("operationButtonOperation", true)
                charMove(naoto, "run", 10, 0)
            }, [], `+=${charMoveDuration(naoto, "point", 0, 0)}`)
            tl.call(() => {
                charMove(naoto, "leap", 34, 0)
            }, [], `+=${charMoveDuration(naoto, "run", 10, 0)}`)
            tl.call(() => {
                if (naoto.localVars.stage24Appearance){
                    charMove(naoto, "leap", 30, 0)
                    tl.call(() => {
                        if (!naoto.localVars.stage24Appearance){
                            emit("operationButtonOperation", false)
                            charMove(naoto, "run", 8, 0)
                            tl.call(() => {
                                charMove(naoto, "idle", 0, 0)
                            }, [], `+=${charMoveDuration(naoto, "run", 8, 0)}`)
                            tl.call(() => {
                                charMove(naoto, "turn", 0, 0)
                            }, [], `+=0.2`)
                            tl.call(() => {
                                charMove(naoto, "idle", 0, 0)
                                emit("operationButtonOperation", true)
                                emit("naotoPosUpdate", 3)
                                naoto.animPlaying = false // end of sequence
                            }, [], `+=${charMoveDuration(naoto, "turn", 0, 0)}`)
                            
                        } else {
                            charMove(naoto, "drop", 30, -40, false, 4)
                            tl.call(() => {
                                emit("resetScreen")
                            }, [], `+=${charMoveDuration(naoto, "drop", 30, -40, false, 4)}`)
                        }
                    }, [], `+=${charMoveDuration(naoto, "leap", 30, 0)-0.25}`)
                    
                } else {
                    charMove(naoto, "drop", 30, -40, false, 4)
                    tl.call(() => {
                        emit("resetScreen")
                    }, [], `+=${charMoveDuration(naoto, "drop", 30, -40, false, 4)}`)
                }
            }, [], `+=${charMoveDuration(naoto, "leap", 30, 0)-0.25}`)
        }
    },
    stage24SecondDrop: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            emit("operationButtonOperation", false)
            charMove(naoto, "drop", 0, -35/scrnRatio)
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
                emit("naotoPosUpdate", 4)
            }, [], `+=${charMoveDuration(naoto, "drop", 0, -35/scrnRatio)}`)
            tl.call(() => {
                charMove(naoto, "point", 0, 0)
            }, [], `+=0.5`)
            tl.call(() => {
                charMove(naoto, "run", -8, 0)
            }, [], `+=${charMoveDuration(naoto, "point", 0, 0)}`)
            tl.call(() => {
                emit("operationButtonOperation", true)
                charMove(naoto, "leap", -46, 0)
            }, [], `+=${charMoveDuration(naoto, "run", -8, 0)}`)
            tl.call(() => {
                if (naoto.localVars.stage24Appearance){
                    console.log(naoto.localVars.stage24Appearance)
                    canvas.value.style.display = "none"
                    emit("resetScreen")
                }
            }, [], `+=0.5`)
            tl.call(() => {
                if (naoto.localVars.stage24Appearance){
                    tl.call(() => {
                        charMove(naoto, "idle", 0, 0)
                        emit("nextButtonActivated")
                        naoto.animPlaying = false // end of sequence
                    }, [], `+=0.25`)
                } else {
                    charMove(naoto, "drop", -20, -20, false, 4)
                    tl.call(() => {
                        emit("resetScreen")
                    }, [], `+=${charMoveDuration(naoto, "drop", 30, -40, false, 4)}`)
                }
            }, [], `+=${charMoveDuration(naoto, "leap", -48, 0)-0.75}`)
        }
    },
    stage24AppearanceCheck: ()=>{
        naoto.localVars.stage24Appearance = props.naotoLocalVarsProp.stage24Appearance
    },
    stage31Go: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                charMove(naoto, "idea", 0, 0)
            }, [], "+=0.5")
            tl.call(() => {
                charMove(naoto, "walk", 6, 0)
            }, [], `+=${charMoveDuration(naoto, "idea", 0, 0)}`)
            tl.call(() => {
                charMove(naoto, "push", 20, 0, false, 3)
            }, [], `+=${charMoveDuration(naoto, "walk", 6, 0)}`)
            tl.call(() => {
                emit("popupPushedStateUpdate", "pushed")
            }, [], `+=0.3`)
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
            }, [], `+=${charMoveDuration(naoto, "push", 20, 0, false, 3)-0.3}`)
            tl.call(() => {
                emit("popupPushedStateUpdate", "dropping")
            }, [], `+=0.3`)
            tl.call(() => {
                charMove(naoto, "leapReady", 0, 0, false, 1)
            }, [], `+=0.5`)
            tl.call(() => {
                charMove(naoto, "leap", 18, -50/scrnRatio+15, true)
            }, [], `+=${charMoveDuration(naoto, "leapReady", 0, 0, false, 1)}`)
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
                naoto.animPlaying = false
                emit("nextButtonActivated")
            }, [], `+=${charMoveDuration(naoto, "leap", 12, -50/scrnRatio+15, true)}`)
        }
    },
    stage32Outer: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                charMove(naoto, "leapReady", 0, 0, false, 1)
            }, [], "+=0.5")
            tl.call(() => {
                charMove(naoto, "leap", 15, -25/scrnRatio, true)
            }, [], `+=${charMoveDuration(naoto, "leapReady", 0, 0, false, 1)}`)
            tl.call(() => {
                naoto.animPlaying = false
            }, [], `+=${charMoveDuration(naoto, "leap", 15, -25/scrnRatio, true)}`)
        }
    },
    stage32SubmarineInit: ()=>{
        if (!naoto.animPlaying){
            let tl = gsap.timeline()
            naoto.animPlaying = true
            props.animSequenceProp = null
            tl.call(() => {
                charMove(naoto, "drop", 1, -23.5/scrnRatio)
            }, [], "+=1.3")
            tl.call(() => {
                charMove(naoto, "idle", 0, 0)
                emit("naotoPosUpdate", 2) // submarine naoto landed
            }, [], `+=${charMoveDuration(naoto, "drop", 1, -23.5/scrnRatio)}`)
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