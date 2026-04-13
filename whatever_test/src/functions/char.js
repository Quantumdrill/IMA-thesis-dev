import * as THREE from "three"

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
        console.log(charObj)
    })
}
