<script setup>
import {ref, onMounted, useTemplateRef, reactive, watch} from "vue"
import {useRouter} from "vue-router"
import { popupNewInstance, popupFixSize, popupFixPosition, popupSnapCheck, popupCloseCheck, bridgeCheck } from "../../functions/popup"
import Naoto from "../character/Naoto.vue"

let router = useRouter()
let lorumPlaceholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
const browserTopHeight = window.outerHeight - window.innerHeight
const nextButton = useTemplateRef("nextButton")
const animSequence = ref(null)
let popups = []
let popupID = {value: 0}
let chan

//level related
let yesOrNo = ref(null)
let yesOrNoPrev = ref(null)

onMounted(() => {
    for (let i=0;i<popups.length;i++){
        popups[i].window.close()
    }
    nextButton.value.disabled = true

    chan = new BroadcastChannel("global")
    chan.onmessage=(e)=>{ //snap popup on message
        if (e.data.type==="handshake"){
            chan.postMessage({type:"typeInitialize",id:e.data.id,popupType:1})
        }
    }
    
    watch(yesOrNo, (e)=>{

        yesOrNoPrev.value = yesOrNo.value 
        setTimeout(()=>{ // prevent immediate change
            if (yesOrNoPrev.value === e){
                if (e===true){
                    animSequence.value = "stage33Yes"
                } else if (e===false){
                    animSequence.value = "stage33No"
                } else if (e===null){
                    animSequence.value = "stage33Idle"
                }
            }
        }, 200)
    })
})


function popupTick(){
    if (popups.length<1){
        cancelAnimationFrame(popupTick)
    }

    //iterate for all opened popups
    popups.forEach((elem,i)=>{ 
        if (document.hasFocus()){
            elem.window.focus()
        }
        popupFixSize(elem.window,15,15)
        if (elem.locked){
            popupFixPosition(elem.window,elem.lockedPositionX,elem.lockedPositionY)
        }

    })

    requestAnimationFrame(popupTick)
}


</script>

<template>
    <div id="body">
        <header>
            <div id="titleContainer">
                <h1 id="titleWaypoint">Waypoint</h1>
                <h2 id="titleAfterWaypoint">for web travellers</h2>
            </div>
        </header>
        <nav>
            <div id="navTitlesBackground"></div>
            <div class="navItem" id="navItem1" @mouseenter="yesOrNo = false" @mouseleave="yesOrNo = null">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder1</p></div>
                <div class="navItemDropdownContainer" id="navItem1DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
            <div id="navItem2" class="navItem" @mouseenter="yesOrNo = false" @mouseleave="yesOrNo = null">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder2</p></div>
                <div class="navItemDropdownContainer" id="navItem2DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
                <div id="navItem3" class="navItem" @mouseenter="yesOrNo = false" @mouseleave="yesOrNo = null">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder3</p></div>
                <div class="navItemDropdownContainer" id="navItem3DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
            <div id="navItem4" class="navItem" @mouseenter="yesOrNo = false" @mouseleave="yesOrNo = null">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder4</p></div>
                <div class="navItemDropdownContainer" id="navItem4DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
            <div id="navItem5" class="navItem">
                <div class="navItemTitleContainer"><p class="navItemTitle">Traveller Tools</p></div>
                <div class="navItemDropdownContainer" id="navItem5DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Router</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Site Map</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Shield</p></div>
                    <div class="navItemDropdownItemContainer" @mouseenter="yesOrNo = true" @mouseleave="yesOrNo = null"><p class="navItemDropdownItemText">Artifact Map</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Browser</p></div>
                </div>
            </div>
        </nav>
        <!-- <div class="block" id="leftPlatform">{{ lorumPlaceholder.repeat(2) }}</div> -->
        <button id="nextButton" @click="nextButtonAction" ref="nextButton">next</button>
        <!-- <div class="block" id="rightPlatform">{{ lorumPlaceholder.repeat(2) }}</div> -->
        <div id="footer">
            <div id="footerText">Copyright © 2026 Web Waypoint, All Rights Reserved</div>
        </div>
    </div>
    <Naoto id="naoto" :parentComponent="'stage33'" :animSequenceProp="animSequence" @nextButtonActivated="nextButton.disabled = false" />
</template>



<style scoped>
#body {
    position: relative;
}

header{
    position: fixed;
    width: 100vw;
    height: 20vh;
    top: 0;
    left: 0;
    overflow: hidden;
    background-color: #383838;
    box-sizing: border-box;
}

#titleContainer{
    width: 100vw;
    height: 6vh;
    padding-left: 5vw;
    bottom: 1vh;
    left: 0;
    position: absolute;
}

#titleWaypoint{
    display: inline-block;
    font-size: 2vw;
    font-weight: bold;
    color: #fff;
    margin-right: 0.5vw;
}

#titleAfterWaypoint{
    display: inline-block;
    font-size: 1vw;
    font-weight: bold;
    color: #fff;
}

nav{
    position: absolute;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100vw;
    height: 8vh;
    top: 20vh;
    left: 0;
    padding: 0 10vw;
    box-sizing: border-box;
}

#navTitlesBackground{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #484848;
    z-index: -1;
}

.navItem{
    /* font-size: 1vw; */
    font-weight: bold;
    color: #fff;
    width: 15vw;
    height: 100%;
}

.navItemTitleContainer{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

.navItem:hover .navItemTitleContainer{
    background-color: #696969;
}

.navItemDropdownContainer{
    display: none;
    width: 100%;
    background-color: #696969;
    flex-direction: column;
    cursor: pointer;
}

.navItemDropdownItemContainer{
    width: 100%;
    height: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1vh 0;
}

.navItemDropdownItemContainer:hover{
    background-color: #383838;
}

#navItem1:hover #navItem1DropdownContainer{
    background-color: #696969;
    display: flex;
}

#navItem2:hover #navItem2DropdownContainer{
    background-color: #696969;
    display: flex;
}

#navItem3:hover #navItem3DropdownContainer{
    background-color: #696969;
    display: flex;
}

#navItem4:hover #navItem4DropdownContainer{
    background-color: #696969;
    display: flex;
}

#navItem5:hover #navItem5DropdownContainer{
    background-color: #696969;
    display: flex;
}

#footer{
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 10vh;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background-color: #383838;
}

#footerText{
    color: #aaa;
}


</style>

<style scoped>  

#nextButton{
    position: fixed;
    right: 10vw;
    bottom: 8vw;
}

#nextButton:disabled {
    color: #aaa;
}

#naoto{
    position: fixed;
    z-index: -2;
}


</style>