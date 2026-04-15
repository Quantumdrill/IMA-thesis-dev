import * as THREE from "three"
import gsap from "gsap"

export function loadCharAnim(charname, animName, charObj, modelLoader){
    modelLoader.load(`/src/assets/char/${charname}_anim_${animName}.fbx`, (loaded) => {
        charObj.animClips[animName] = loaded.animations[0]
        for (const track of charObj.animClips[animName].tracks) { // removes interpolation for 8fps anim
            track.setInterpolation(THREE.InterpolateDiscrete)
        }
    })
}
export function loadCharSkm(charname, charObj, modelLoader){
    modelLoader.load(`/src/assets/char/${charname}_skm.fbx`, (loaded) => {
        charObj.mesh = loaded
        charObj.skm = loaded.children[0]
    })
}

export function animTransition(charObj, currentAnimName, newAnimName, duration=0.25){
    let currentAnim = charObj.animActions[currentAnimName]
    let newAnim = charObj.animActions[newAnimName]
    newAnim.reset()
    newAnim.play()
    currentAnim.crossFadeTo(newAnim, duration)
    setTimeout(() => {
        charObj.currentAnim = newAnimName
    }, duration*1000)
}

export function charMove(charObj, displacementX, displacementY, parabola=false){
    let speed = 24
    let realDisplacementX = displacementX*50/8
    let realDisplacementY = displacementY*50/8
    let duration = displacementX/speed
    let frames = Math.floor(duration/0.125)
    gsap.to(charObj.mesh.position, {
        x: `+=${realDisplacementX}`,
        y: `-=${realDisplacementY}`,
        duration: duration,
        ease: "none"
    })
}