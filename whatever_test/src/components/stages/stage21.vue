<script setup>
import {ref, onMounted, useTemplateRef} from "vue"
import {useRouter} from "vue-router"
import { popupNewInstance, popupFixSize, popupFixPosition, popupSnapCheck, popupCloseCheck } from "../../functions/popup"


let router = useRouter()
let lorumPlaceholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
const browserTopHeight = window.outerHeight - window.innerHeight
const bridges = {
    left: {
        dom: useTemplateRef("bridgesLeftDom"),
        highlight: false,
        occupied: false,
        xPos: window.innerWidth*32.5/100,
        yPos: window.innerHeight*48/100+browserTopHeight
    },
    right: {
        dom: useTemplateRef("bridgesRightDom"),
        highlight: false,
        occupied: false,
        xPos: window.innerWidth*52.5/100,
        yPos: window.innerHeight*38/100+browserTopHeight
    },
}
const nextButton = useTemplateRef("nextButton")
    
let popups = []
let popupID = 0
let chan

onMounted(() => {
    chan = new BroadcastChannel("global")
    chan.onmessage=(e)=>{
        if (e.data.type==="snapButtonAction"){
            let popup
            popups.forEach(elem=>{
                if (elem.id===e.data.id){
                    popup = elem
                }
            })
            bridges[popup.occupyingBridge].occupied = true
            popup.locked = true
        }
    }
    // nextButton.value.disabled = true
})


function popupTick(){
    if (popups.length<1){
        cancelAnimationFrame(popupTick)
    }

    // disable dashed border highlight every frame before snap check
    // can't iterate through popups because the each popup's snap check will overwrite the status of the previous popup snap check
    bridges.left.highlight = false 
    bridges.right.highlight = false

    popups.forEach((elem,i)=>{ //iterate for all opened popups
        let popup = popups[i]
        if (document.hasFocus()){
            elem.window.focus()
        }
        popupCloseCheck(elem,popups,i,bridges)
        popupFixSize(elem.window,15)
        if (elem.locked){
            popupFixPosition(elem.window,elem.lockedPositionX,elem.lockedPositionY)
        }
        popupSnapCheck(elem,bridges)

        // broadcast popup inpositio status to the popup
        if (elem.inPos!==elem.inPosPrev){ //check if popup inPosition state changes
            if (elem.inPos===true){
                chan.postMessage({type:"snapButtonShow",id:elem.id,action:true})
            } else {
                chan.postMessage({type:"snapButtonShow",id:elem.id,action:false})
            }
        }
        elem.inPosPrev = elem.inPos
    })
    bridgeHighlightUpdate()
    requestAnimationFrame(popupTick)
}


function bridgeHighlightUpdate(){ // update after snap check
    bridges.left.dom.value.style.borderStyle = "hidden" //erase the dashed borders every frame before checking highlight status
    bridges.right.dom.value.style.borderStyle = "hidden"
    if (bridges.left.highlight){
        bridges.left.dom.value.style.borderStyle = "dashed"
    }
    if (bridges.right.highlight){
        bridges.right.dom.value.style.borderStyle = "dashed"
    }
}

function nextButtonAction(){
    for (let i=0;i<popups.length;i++){
        popups[i].window.close()
    }
    router.push('/stage22')
}

</script>

<template>
    <div id="body">
        <button id="popupButton" @click="popupNewInstance(popupID,popups,popupTick)">Create a popup window</button>
        <div class="block" id="leftPlatform">{{ lorumPlaceholder.repeat(2) }}</div>
        <div class="block" id="leftBridge" ref="bridgesLeftDom"></div>
        <div class="block" id="rightBridge" ref="bridgesRightDom"></div>
        <button id="nextButton" @click="nextButtonAction" ref="nextButton">next</button>
        <div class="block" id="rightPlatform">{{ lorumPlaceholder.repeat(2) }}</div>
    </div>
</template>



<style scoped>
#body {
    position: relative;
}

.block{
    /* background-color: rgb(111, 129, 209); */
}

#leftPlatform{
    position: fixed;
    width: 23vw;
    height: 35vh;
    left: 5vw;
    bottom: 10vh;
    overflow: hidden;
}

#rightPlatform{
    position: fixed;
    width: 23vw;
    height: 35vh;
    right: 5vw;
    top: 30vh;
    overflow: hidden;
}

#leftBridge{
    position: fixed;
    box-sizing: border-box;
    width: 15vw;
    height: 15vw;
    left: 32.5vw;
    top: 48vh;
    border-style: hidden;
    border-width: 4px;
}

#rightBridge{
    position: fixed;
    box-sizing: border-box;
    width: 15vw;
    height: 15vw;
    right: 32.5vw;
    top: 38vh;
    border-style: hidden;
    border-width: 4px;
}

#popupButton{
    position: fixed;
    left: 5vw;
    top: 20vh;
}

#nextButton{
    position: fixed;
    right: 10vw;
    top: 25vh;
}

#nextButton:disabled {
    color: #aaa;
}
</style>