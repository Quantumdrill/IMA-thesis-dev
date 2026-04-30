<script setup>

import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {gsap} from "gsap"
import MotionPathPlugin from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)
import {onMounted, useTemplateRef, watch, ref} from "vue"
import { LoadingManager } from "three"
import { loadCharSkm, getBoneIndex } from "../../functions/char"
import { create3JointIK, poleVectorConstraint, pointConstraint, aimConstraint, orientConstraint } from "../../functions/rig"

const scene = new THREE.Scene()
const canvas = useTemplateRef("canvasDom")
let renderer
const scrnRatio = window.innerWidth/window.innerHeight
const props = defineProps(["animSequenceProp", "parentComponent", "reactiveFKProp"])
const emit = defineEmits(["reactiveIK"])

//fps
const fps = 8
let accumulatedDelta = 0
const clock = new THREE.Timer()

//camera
let camFov = 60
let camDist = 50 
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
const nrar = {
    name: "NekomimiRightArmRef",
    mesh: null,
    skm: null,
    skeleton: null,
    bones: {},
    reactiveRig: true,
    anims: {}
}
let unitToVw = Math.tan(camFov/2/180*Math.PI)*camDist / 25 // make sure the character position unit reacts to camera zoom and vw
let unitToVh = unitToVw/scrnRatio

onMounted(() => {
    renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas.value,alpha: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    
    loadCharSkm("NekomimiRightArmRef", nrar, modelLoader)
    
    loadingManager.onLoad = () => {
        nrar.skm.material = new THREE.MeshLambertMaterial({color: 0xff0000})
        nrar.mesh.scale.set(scrnRatio, scrnRatio, scrnRatio) // char scales in proportion to vw

        // get bones
        nrar.bones.shoulderParent = nrar.skeleton.bones[getBoneIndex(nrar.skeleton, "joint0")]
        nrar.bones.shoulder = nrar.skeleton.bones[getBoneIndex(nrar.skeleton, "joint1")]
        nrar.bones.elbow = nrar.skeleton.bones[getBoneIndex(nrar.skeleton, "joint2")]
        nrar.bones.hand = nrar.skeleton.bones[getBoneIndex(nrar.skeleton, "joint3")]
        nrar.bones.ikHandle = nrar.skeleton.bones[getBoneIndex(nrar.skeleton, "ikHandle")]
        nrar.bones.rootBone = nrar.skeleton.bones[getBoneIndex(nrar.skeleton, "root")]
        nrar.bones.IkSolver = create3JointIK(nrar.skm,nrar.skeleton,["ikHandle","joint3","joint2","joint1"])

        scene.add(nrar.mesh)
     
        nrarCharInitialization()

        // reactive rig
        nrar.pv = new THREE.Object3D()
        nrar.pv.position.y = -5
        nrar.pv.position.x = -20
        // mouse interaction
        nrar.anims.charToCamDist = cam.position.z
        nrar.anims.charToPointerHoverDist = 20
        nrar.anims.planeToCamDist = nrar.anims.charToCamDist - nrar.anims.charToPointerHoverDist
        nrar.anims.wristToFingerTipDist = 1.9
        nrar.anims.camHeight = cam.position.y
        nrar.anims.curserToPointerMultiplier = Math.tan(camFov/2/180*Math.PI)*(nrar.anims.planeToCamDist)
        nrar.anims.wristRefBaseZ = -2
        nrar.anims.wristRefBase = new THREE.Vector3(-2,6,nrar.anims.wristRefBaseZ) // a point in the back of the character, the line between the fingertip and this is used to determine the orientation and the position of the wrist
        nrar.anims.pointerZbase = nrar.anims.charToPointerHoverDist
        nrar.anims.pointerZ = nrar.anims.pointerZbase
        nrar.anims.pointerVector = new THREE.Vector3(0,0,nrar.anims.pointerZ)
        document.addEventListener("mousemove", (e) => {
            nrar.anims.x = (e.clientX/window.innerWidth*2-1)*scrnRatio // get x position -1*ratio to 1*ratio
            nrar.anims.y = -(e.clientY/window.innerHeight*2-1) // get y position: -1 to 1
            nrar.anims.pointerY = nrar.anims.y*nrar.anims.curserToPointerMultiplier + nrar.anims.camHeight
            nrar.anims.pointerX = nrar.anims.x*nrar.anims.curserToPointerMultiplier
            nrar.anims.pointerVector.setComponent(0,nrar.anims.pointerX)
            nrar.anims.pointerVector.setComponent(1,nrar.anims.pointerY)

            // nrar.pv.position.x = (nrar.anims.x-1)*2
            // nrar.pv.position.z = (nrar.anims.x+2)*3
            // nrar.pv.position.y = (nrar.anims.y+nrar.anims.x)*5
        })

        watch(()=>props.animSequenceProp, () => {
            nrarAnimSequences[props.animSequenceProp]()
        })

        watch(()=>props.reactiveFKProp, () => {
            pointConstraint(props.reactiveFKProp.claviclePos,nrar.bones.shoulderParent,nrar.bones.rootBone)
            orientConstraint(props.reactiveFKProp.clavicleRot,nrar.bones.shoulderParent,nrar.bones.rootBone)
            pointConstraint(props.reactiveFKProp.shoulderPos,nrar.bones.shoulder,nrar.bones.shoulderParent)
        })
        animTick()
    }
})


function wristPosUpdate(){
    nrar.anims.wristRefLine = new THREE.Vector3().subVectors(nrar.anims.wristRefBase,nrar.anims.pointerVector) // line from fingertip to the wristRefBase
    nrar.anims.fingerTipToWristVec = new THREE.Vector3().copy(nrar.anims.wristRefLine).setLength(nrar.anims.wristToFingerTipDist)
    nrar.anims.wristToFingerTipVec = new THREE.Vector3().copy(nrar.anims.fingerTipToWristVec).negate()
    nrar.anims.wristCurrentZ = nrar.bones.hand.getWorldPosition(new THREE.Vector3()).z
    nrar.anims.newWristPos = new THREE.Vector3().addVectors(nrar.anims.pointerVector,nrar.anims.fingerTipToWristVec)
    pointConstraint(nrar.anims.newWristPos,nrar.bones.ikHandle,nrar.bones.rootBone)
    
    nrar.anims.wristUpV = new THREE.Vector3().crossVectors(new THREE.Vector3(-1,0,0),nrar.anims.wristToFingerTipVec).normalize()
    aimConstraint(nrar.bones.hand,nrar.anims.wristToFingerTipVec,nrar.anims.wristUpV,nrar.bones.elbow,true,new THREE.Vector3(-7,1,0.5),nrar.anims.wristUpV)
}

function globalUpdatePerFrame(){
    // place after mixer update to overwrite animated posture
    if (nrar.reactiveRig){
        reactiveRig()
    }

    renderer.render(scene,cam)
}

function reactiveRig(){
    // let elapsedTime = clock.getElapsed()
    // nrar.anims.pointerZ = nrar.anims.pointerZbase + Math.sin(elapsedTime*10)*10
    // nrar.anims.pointerVector.setComponent(2,nrar.anims.pointerZ)

    wristPosUpdate()
    poleVectorConstraint(nrar.bones.ikHandle,nrar.bones.hand,nrar.bones.elbow,nrar.bones.shoulder,nrar.pv,nrar.bones.shoulderParent,new THREE.Euler())
    nrar.bones.IkSolver.update()
    emit("reactiveIK",{
        shoulder: new THREE.Euler().copy(nrar.bones.shoulder.rotation),
        elbow: new THREE.Euler().copy(nrar.bones.elbow.rotation),
        hand: new THREE.Euler().copy(nrar.bones.hand.rotation),
    })
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

function nrarCharInitialization(){
    switch (props.parentComponent){
        case "stage51":
            camFov = 60
            camDist = 50 
            // nrar.mesh.position.set(0*unitToVw, -140*unitToVh, 0)
            cam.position.set(0,0,camDist)
            cam.fov = camFov
            cam.updateProjectionMatrix()
            unitToVw = Math.tan(camFov/2/180*Math.PI)*camDist / 25
            unitToVh = unitToVw/scrnRatio
            break
        default:
            break
    }
}

const nrarAnimSequences = {
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