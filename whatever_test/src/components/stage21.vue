<script setup>
import {ref, onMounted} from "vue"
import {useRouter} from "vue-router"


let router = useRouter()
let lorumPlaceholder = "Lorum Ipsum "
const browserTopHeight = window.outerHeight - window.innerHeight
const leftBridge = ref(null)
const rightBridge = ref(null)
const nextButton = ref(null)
let bridgeStatus = {
    left: {occupied: false},
    right: {occupied: false}
}
let popups = []

onMounted(() => {
    // nextButton.value.disabled = true
})

function openPopup(left,top,vw){
    let newWindow
    newWindow = window.open(
        `/stage21/popupSquare`, 
        `bridge${popups.length}`,  //provide different names to open multiple popups
        `left=${left},top=${top},width=500,height=500`
    )
    newWindow.resizeTo(window.outerWidth*vw/100*1.04,window.outerWidth*vw/100*1.02)
    return newWindow
}

function popupNewInstance(){
    let newPopup = {
        window: openPopup(500,200,15),
        locked: false
    }
    popups.push(newPopup)
    if (popups.length===1){
        requestAnimationFrame(popupTick())
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
        if (popup.locked){
            popupFixPosition(popup.window,popup.lockedPositionX,popup.lockedPositionY)
        }
        popupFixSize(popup.window,15)
        popupSnapCheck(popup)
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

    //left bridge snap check
    if (Math.abs(popupObj.window.screenX-window.innerWidth*32.5/100)<100&&Math.abs(popupObj.window.screenY-(window.innerHeight*48/100+browserTopHeight))<100){
        if (!bridgeStatus.left.occupied) {
            leftBridge.value.style.borderStyle = "dashed"
            popupObj.locked = true
            popupObj.lockedPositionX = window.innerWidth*32.5/100-5
            popupObj.lockedPositionY = window.innerHeight*48/100+browserTopHeight
            popupObj.occupyingBridge = "left"
            bridgeStatus.left.occupied = true
        } else {
            leftBridge.value.style.borderStyle = "hidden"
        }
    } else {
        leftBridge.value.style.borderStyle = "hidden"
    }

    //right bridge snap check
    if (Math.abs(popupObj.window.screenX-window.innerWidth*52.5/100)<100&&Math.abs(popupObj.window.screenY-(window.innerHeight*38/100+browserTopHeight))<100){
        if (!bridgeStatus.right.occupied) {
            rightBridge.value.style.borderStyle = "dashed"
            popupObj.locked = true
            popupObj.lockedPositionX = window.innerWidth*52.5/100-5
            popupObj.lockedPositionY = window.innerHeight*38/100+browserTopHeight
            popupObj.occupyingBridge = "right"
            bridgeStatus.right.occupied = true
        } else {
            leftBridge.value.style.borderStyle = "hidden"
        }
    } else {
        rightBridge.value.style.borderStyle = "hidden"
    }
}

function popupCloseCheck(popupObj,i){
    if (popupObj.window.closed){
        popups.splice(i,1) //remove the popup from the array if it is closed
        leftBridge.value.style.borderStyle = "hidden" //when the popup is closed while enabling border, hide the border
        rightBridge.value.style.borderStyle = "hidden"
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
        <div class="block" id="leftPlatform">{{ lorumPlaceholder.repeat(50) }}</div>
        <div class="block" id="leftBridge" ref="leftBridge"></div>
        <div class="block" id="rightBridge" ref="rightBridge"></div>
        <button id="nextButton" @click="nextButtonAction" ref="nextButton">next</button>
        <div class="block" id="rightPlatform">{{ lorumPlaceholder.repeat(50) }}</div>
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