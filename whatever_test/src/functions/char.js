import * as THREE from "three"
import gsap from "gsap"
import MotionPathPlugin from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)

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

export function animTransition(charObj, newAnimName, duration=0.25){
    let currentAnim = charObj.animActions[charObj.currentAnim]
    let newAnim = charObj.animActions[newAnimName]
    newAnim.reset()
    newAnim.play()
    currentAnim.crossFadeTo(newAnim, duration)
    setTimeout(() => {
        charObj.currentAnim = newAnimName
    }, duration*1000)
}

export function charMove(charObj, newAnimName, displacementX, displacementY, parabola=false){
    const unitToVw = 50/8
    let speed = 24
    let realDisplacementX = displacementX*unitToVw
    let realDisplacementY = displacementY*unitToVw
    let duration
    if (newAnimName === "leap"){
        duration = 10*0.125
    } else {
        duration = displacementX/speed
    }
    let realHighPointX
    let realHighPointY
    if (parabola){
        if (displacementY > 0){
            realHighPointY = (displacementY+5)*unitToVw
        } else {
            realHighPointY = 5*unitToVw
        }
        realHighPointX = (displacementX/2+Math.atan(displacementY)/(Math.PI/4))*unitToVw
        gsap.to(charObj.mesh.position, {
            duration: duration,
            motionPath: {
                path: [
                    {x: realHighPointX, y: realHighPointY},
                    {x: realDisplacementX-realHighPointX, y: realDisplacementY-realHighPointY}
                ],
                type: "thru",
                relative: true,
                fromCurrent: true
            }
        })
    } else {
        gsap.to(charObj.mesh.position, {
            x: `+=${realDisplacementX}`,
            y: `+=${realDisplacementY}`,
            duration: duration,
            ease: "none"
        })
    }
    animTransition(charObj, newAnimName)
}

export function charMoveDuration(charObj, newAnimName, displacementX, displacementY, parabola=false){
    let speed = 24
    let duration
    if (newAnimName === "leap"){
        duration = 10*0.125
    } else {
        duration = displacementX/speed
    }
    return duration
}