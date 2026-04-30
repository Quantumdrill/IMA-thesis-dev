<script setup>

import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {gsap} from "gsap"
import MotionPathPlugin from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)
import {onMounted, useTemplateRef, watch, ref} from "vue"
import { LoadingManager } from "three"
import { loadCharAnim, loadCharSkm, animTransition, charMove, charMoveDuration, getBoneIndex } from "../../functions/char"
import NekomimiRightArmRef from "./NekomimiRightArmRef.vue"
import { orientConstraint } from "../../functions/rig"

const scene = new THREE.Scene()
const canvas = useTemplateRef("canvasDom")
let renderer
const scrnRatio = window.innerWidth/window.innerHeight
const props = defineProps(["animSequenceProp", "parentComponent", "rightArmRefProp"])
const emit = defineEmits(["nextButtonActivated", "nekomimiPosUpdate"])

//fps
const fps = 8
let accumulatedDelta = 0
const clock = new THREE.Timer()

//camera
let camFov = 15
let camDist = 180 
const cam = new THREE.PerspectiveCamera(camFov, window.innerWidth/window.innerHeight, 0.1, 1000)
cam.position.set(0,0,camDist)

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
    name: "Nekomimi",
    mesh: null,
    skm: null,
    skeleton: null,
    bones: {},
    animClips: {
    },
    animActions: {
    },
    mixer: null,
    currentAnim: "stage33After",
    animPlaying: false,
    localVars: {
        stage24Appearance: false,
    },
    reactiveRig: true,
    anims: {
        x: 0,
        y: 0,
    },
    loaded: false,
}
let unitToVw = Math.tan(camFov/2/180*Math.PI)*camDist / 25 // make sure the character position unit reacts to camera zoom and vw
let unitToVh = unitToVw/scrnRatio
const animArr = ["default", "stage33", "stage33After", "punch"]
const animArrOnce = ["stage33"] // animations that should only play once

//reactive related
let mousePos = {
    x: 0,
    y: 0,
}
let reactiveFKProp = ref({
    upperSpine: new THREE.Vector3(),
    shoulder: new THREE.Vector3(),
})
let nrarAnimSequence = ref(null)

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
        nekomimi.loaded = true

        nekomimi.skm.material = new THREE.MeshLambertMaterial({color: 0xffffff})
        nekomimi.mesh.scale.set(scrnRatio, scrnRatio, scrnRatio) // char scales in proportion to vw

        scene.add(nekomimi.mesh)

        nekomimi.mixer = new THREE.AnimationMixer(nekomimi.mesh)
        for (const anim of animArr){
            nekomimi.animActions[anim] = nekomimi.mixer.clipAction(nekomimi.animClips[anim])
        }
        for (const anim of animArrOnce){
            nekomimi.animActions[anim].loop = THREE.LoopOnce
        }

        nekomimi.animActions.stage33After.play()
     
        nekomimiCharInitialization()

        if (props.parentComponent == "stage51"){
            // get bones
            nekomimi.bones.head = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigneck_head_C0_JT")]
            nekomimi.bones.upperSpine = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigspine_1_C0_JT")]
            nekomimi.bones.clavicle = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigspine_2_C0_JT")]
            nekomimi.bones.shoulder = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_0_R0_JT")]
            nekomimi.bones.upperArmRollMid = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_1_R0_JT")]
            nekomimi.bones.upperArmRollEnd = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_2_R0_JT")]
            nekomimi.bones.elbow = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_3_R0_JT")]
            nekomimi.bones.lowerArmRollStart = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_4_R0_JT")]
            nekomimi.bones.lowerArmRollMid = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_5_R0_JT")]
            nekomimi.bones.lowerArmRollEnd = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_6_R0_JT")]
            nekomimi.bones.hand = nekomimi.skeleton.bones[getBoneIndex(nekomimi.skeleton, "Nekomimi_rigarm_end_R0_JT")]

            document.addEventListener("mousemove", (e) => {
                nekomimi.anims.x = (e.clientX/window.innerWidth*2-1)*scrnRatio // get x position -1*ratio to 1*ratio
                nekomimi.anims.y = -(e.clientY/window.innerHeight*2-1) // get y position: -1 to 1
                
            })
        }

        watch(()=>props.animSequenceProp, () => {
            nekomimiAnimSequences[props.animSequenceProp]()
        })
        animTick()
    }
})

function reactiveFK(){
    nekomimi.bones.upperSpine.rotation.z += nekomimi.anims.x/20
    nekomimi.bones.upperSpine.rotation.y += nekomimi.anims.x/20
    nekomimi.bones.upperSpine.rotation.x += nekomimi.anims.y/20
    nekomimi.bones.clavicle.rotation.y += nekomimi.anims.x/20
    nekomimi.bones.clavicle.rotation.x += nekomimi.anims.y/20
    nekomimi.bones.clavicle.rotation.z += nekomimi.anims.x/20
    nekomimi.bones.head.rotation.x = nekomimi.anims.y/20+0.1
    nekomimi.bones.head.rotation.y = nekomimi.anims.x/20
    nekomimi.bones.head.rotation.z = nekomimi.anims.y/30
    reactiveFKProp.value = {
        claviclePos: new THREE.Vector3().copy(nekomimi.bones.clavicle.getWorldPosition(new THREE.Vector3())),
        shoulderPos: new THREE.Vector3().copy(nekomimi.bones.shoulder.getWorldPosition(new THREE.Vector3())),
        clavicleRot: nekomimi.bones.clavicle.getWorldQuaternion(new THREE.Quaternion())
    }
}

function reactiveIKUpdate(e){
    nekomimi.bones.incomingIK = true
    nekomimi.bones.shoulderNewRotation = e.shoulder
    nekomimi.bones.elbowNewRotation = e.elbow
    nekomimi.bones.handNewRotation = new THREE.Euler().copy(e.hand)
}

function reactiveIK(){
    if (nekomimi.bones.incomingIK){
        nekomimi.bones.shoulder.rotation.copy(nekomimi.bones.shoulderNewRotation)
        nekomimi.bones.upperArmRollMid.rotation.x = nekomimi.bones.shoulderNewRotation.x*44.8/90
        nekomimi.bones.upperArmRollEnd.rotation.x = nekomimi.bones.shoulderNewRotation.x*43.2/90
        nekomimi.bones.elbow.rotation.copy(nekomimi.bones.elbowNewRotation)
        nekomimi.bones.elbow.rotation.x = nekomimi.bones.shoulderNewRotation.x*2/90
        nekomimi.bones.hand.rotation.copy(nekomimi.bones.handNewRotation)
        // console.log(nekomimi.bones.shoulderNewRotation)
    }
}

function globalUpdatePerFrame(){
    nekomimi.mixer.update(1/fps)

    // place after mixer update to overwrite animated posture
    if (nekomimi.reactiveRig&&nekomimi.loaded){
        reactiveRig()
    }

    renderer.render(scene,cam)
}

function reactiveRig(){
    reactiveFK()
    reactiveIK()
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
            camFov = 15 //26
            camDist = 180 
            nekomimi.mesh.position.set(0*unitToVw, 200*unitToVh, 0)
            cam.position.set(0,0,camDist)
            cam.fov = camFov
            cam.updateProjectionMatrix()
            unitToVw = Math.tan(camFov/2/180*Math.PI)*camDist / 25
            unitToVh = unitToVw/scrnRatio
            break
        case "stage51":
            camFov = 60 //26
            camDist = 50 
            // nekomimi.mesh.position.set(0*unitToVw, 200*unitToVh, 0)
            cam.position.set(0,0,camDist)
            cam.fov = camFov
            cam.updateProjectionMatrix()
            unitToVw = Math.tan(camFov/2/180*Math.PI)*camDist / 25
            unitToVh = unitToVw/scrnRatio
            charMove(nekomimi, "punch", 0, 0)
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
                nekomimi.mesh.position.set(0*unitToVw, -50*unitToVh+25*unitToVw,0)
                charMove(nekomimi, "stage33", 0, 0, false, 0)
            }, [], "+=0.5")
            tl.call(() => {
                emit("nekomimiPosUpdate", 2)
            }, [], `+=2.6`)
            tl.call(() => {
                charMove(nekomimi, "stage33After", 0, 0)
            }, [], `+=${charMoveDuration(nekomimi, "stage33", 0, 0)-2.6}`)
        }
    },
}
</script>
<template>
    
    <div id="nrar" v-show="true">
        <NekomimiRightArmRef 
        :animSequenceProp="nrarAnimSequence" 
        :reactiveFKProp="reactiveFKProp"
        :parentComponent="'stage51'"
        @reactiveIK="reactiveIKUpdate" />
    </div>
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

#nrar{
    position: fixed;
}

</style>