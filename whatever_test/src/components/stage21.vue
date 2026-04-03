<script setup>
import {ref, onMounted, useTemplateRef} from "vue"
import {useRouter} from "vue-router"


let router = useRouter()
let lorumPlaceholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
const browserTopHeight = window.outerHeight - window.innerHeight
const bridges = {
    left: {
        dom: useTemplateRef("bridgesLeftDom"),
        occupied: false
    },
    right: {
        dom: useTemplateRef("bridgesRightDom"),
        occupied: false
    },
}
const nextButton = ref(null)
    
let popups = []
let chan
console.log(bridges.left.dom.value)

onMounted(() => {
    chan = new BroadcastChannel("global")
    // nextButton.value.disabled = true
})

function openPopup(left,top,vw){
    let newWindow
    newWindow = window.open(
        `/popupSquare`, 
        `bridge${popups.length}`,  //provide different names to open multiple popups
        `left=${left},top=${top},width=500,height=500`
    )
    newWindow.resizeTo(window.outerWidth*vw/100*1.04,window.outerWidth*vw/100*1.02)
    return newWindow
}

function popupNewInstance(){
    let newPopup = {
        window: openPopup(500,200,15),
        locked: false,
        inPos: false,
        inPosPrev: false,
        index: popups.length
    }
    popups.push(newPopup)
    if (popups.length===1){
        requestAnimationFrame(popupTick)
    }
}

function popupTick(){
    if (popups.length<1){
        cancelAnimationFrame(popupTick)
    }
    for (let i=0;i<popups.length;i++){ //iterate for all opened popups
        let popup = popups[i]
        if (document.hasFocus()){
            popup.window.focus()
        }
        popupCloseCheck(popup,i)
        popupFixSize(popup.window,15)
        popupSnapCheck(popup)

        if (popup.inPos!==popup.inPosPrev){ //check if popup inPosition state changes
            if (popup.inPos===true){
                chan.postMessage({index:popup.index,action:true})
            } else {
                chan.postMessage({index:popup.index,action:false})
            }
        }
        popup.inPosPrev = popup.inPos

    }
    // console.log(bridgeStatus.left.occupied)
    requestAnimationFrame(popupTick)
}


function popupFixSize(popupWin,vw){
    let sideSizePixel = window.outerWidth*vw/100
    if (popupWin.outerWidth!==sideSizePixel||popupWin.outerHeight!==sideSizePixel){
        popupWin.resizeTo(sideSizePixel*1.04,sideSizePixel*1.02)
    }
}

function popupFixPosition(popupWin,x,y){
    if (popupWin.screenX!==x||popupWin.screenY!==y){
        popupWin.moveTo(x,y)
    }
}

function popupSnapCheck(popupObj){

    popupObj.inPos = false
    popupObj.occupyingBridge = "null"
    bridges.left.dom.value.style.borderStyle = "hidden"
    bridges.right.dom.value.style.borderStyle = "hidden"

    //left bridge snap check
    if (Math.abs(popupObj.window.screenX-window.innerWidth*32.5/100)<100&&Math.abs(popupObj.window.screenY-(window.innerHeight*48/100+browserTopHeight))<100){ // check if in position
        if (!bridges.left.occupied) { //check if the space is occupied
            bridges.left.dom.value.style.borderStyle = "dashed"
            popupObj.inPos = true
            popupObj.lockedPositionX = window.innerWidth*32.5/100-5
            popupObj.lockedPositionY = window.innerHeight*48/100+browserTopHeight
            popupObj.occupyingBridge = "left"
            // bridgeStatus.left.occupied = true
        }
    }

    //right bridge snap check
    if (Math.abs(popupObj.window.screenX-window.innerWidth*52.5/100)<100&&Math.abs(popupObj.window.screenY-(window.innerHeight*38/100+browserTopHeight))<100){ 
        if (!bridges.right.occupied) { 
            bridges.right.dom.value.style.borderStyle = "dashed"
            popupObj.inPos = true
            popupObj.lockedPositionX = window.innerWidth*52.5/100-5
            popupObj.lockedPositionY = window.innerHeight*38/100+browserTopHeight
            popupObj.occupyingBridge = "right"
            // bridgeStatus.right.occupied = true
        }
    }
}

function popupCloseCheck(popupObj,i){
    if (popupObj.window.closed){
        popups.splice(i,1) //remove the popup from the array if it is closed
        bridges.left.dom.value.style.borderStyle = "hidden" //when the popup is closed while enabling border, hide the border
        bridges.left.dom.value.style.borderStyle = "hidden"
        bridgeStatus[popupObj.occupyingBridge].occupied = false //when the popup is closed, restore the occupying status of the occupied bridge
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
        <button id="popupButton" @click="popupNewInstance">Create a popup window</button>
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