<script setup>
import {ref, onMounted, useTemplateRef, reactive, watch} from "vue"
import {useRouter, useRoute} from "vue-router"
import Naoto from "../character/Naoto.vue"
import Nekomimi from "../character/Nekomimi.vue"
import gsap from "gsap"

let router = useRouter()
const route = useRoute()
const browserTopHeight = window.outerHeight - window.innerHeight
const nextButtonDom = useTemplateRef("nextButtonDom")
const naotoAnimSequence = ref(null)
const nekomimiAnimSequence = ref(null)
const navItem5DropdownMovableDom = useTemplateRef("navItem5DropdownMovableDom")
const navItem5DropdownContainerDom = useTemplateRef("navItem5DropdownContainerDom")
const navItem5TitleContainerDom = useTemplateRef("navItem5TitleContainerDom")
let chan

//level related
let nekomimiVisible = ref(true)
let naotoVisible = ref(true)
let naotoAnimStage = ref("watching")
let charPos = ref(0)

onMounted(() => {
    chan = new BroadcastChannel("global")
    chan.onmessage=(e)=>{ //snap popup on message
        if (e.data.type==="handshake"){
            chan.postMessage({type:"typeInitialize",id:e.data.id,popupType:3})
        }
    }
    
    // setTimeout(() => {
    //     naotoAnimSequence.value = "stage33Init"
    // }, 1000)

})

function nekomimiPosUpdate(pos){
}

function naotoPosUpdate(pos){
    if (pos===1){ // what happens after nekomimi is summoned
        charPos.value = 1
    } else if (pos===4){ // what happens after naoto is stabbed in submarine
        charPos.value = 4
        naotoVisible.value = false
    }
}

function artifactMapClickAction(){
    nekomimiVisible.value = true; 
    nekomimiAnimSequence.value = 'stage33Init';
    navItem5DropdownMovableDom.value.style.display = 'block';
    navItem5DropdownContainerDom.value.style.display = 'flex';
    navItem5TitleContainerDom.value.style.backgroundColor = '#696969';
    naotoAnimStage.value = 'attacked';
    naotoAnimSequence.value = 'stage33Attacked';
    router.replace({
        query: {uninvitedGuest: true}
    })
    
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
            <div class="navItem" id="navItem1">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder1</p></div>
                <div class="navItemDropdownContainer" id="navItem1DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
            <div id="navItem2" class="navItem">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder2</p></div>
                <div class="navItemDropdownContainer" id="navItem2DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
                <div id="navItem3" class="navItem">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder3</p></div>
                <div class="navItemDropdownContainer" id="navItem3DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
            <div id="navItem4" class="navItem">
                <div class="navItemTitleContainer"><p class="navItemTitle">placeholder4</p></div>
                <div class="navItemDropdownContainer" id="navItem4DropdownContainer">
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 1</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 2</p></div>
                    <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">dropdown item 3</p></div>
                </div>
            </div>
            <div id="navItem5" class="navItem">
                <div class="navItemTitleContainer" ref="navItem5TitleContainerDom"><p class="navItemTitle">Traveller Tools</p></div>
                <div id="navItem5DropdownMovable" ref="navItem5DropdownMovableDom">
                    <div class="navItemDropdownContainer" id="navItem5DropdownContainer" ref="navItem5DropdownContainerDom">
                        <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Router</p></div>
                        <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Site Map</p></div>
                        <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Shield</p></div>
                        <div class="navItemDropdownItemContainer" 
                        @click="artifactMapClickAction"
                        ><p class="navItemDropdownItemText">Artifact Map</p></div>
                        <div class="navItemDropdownItemContainer"><p class="navItemDropdownItemText">Browser</p></div>
                    </div>
                </div>
            </div>
        </nav>
        <div id="footer">
            <div id="footerText">Copyright © 2026 Web Waypoint, All Rights Reserved</div>
        </div>
    </div>
    <!-- <Naoto id="naoto" v-show="naotoVisible" :parentComponent="'stage51'" :animSequenceProp="naotoAnimSequence" @nextButtonActivated="nextButton.disabled = false" @naotoPosUpdate="naotoPosUpdate" /> -->
    <div id="nekomimi" v-show="nekomimiVisible">
        <Nekomimi
        :parentComponent="'stage51'" 
        :animSequenceProp="nekomimiAnimSequence" 
        @nekomimiPosUpdate="nekomimiPosUpdate" />
    </div>
    
    
</template>



<style scoped>
#body {
    position: relative;
}

header{
    position: fixed;
    width: 100vw;
    height: calc(100vh - 37vw);
    top: 0;
    left: 0;
    overflow: hidden;
    background-color: #383838;
    box-sizing: border-box;
}

#titleContainer{
    width: 100vw;
    height: 3vw;
    padding-left: 5vw;
    bottom: 0.5vw;
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
    height: 4vw;
    top: calc(100vh - 37vw);
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
    font-size: 1vw;
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

#navItem5DropdownMovable{
    display: none;
}

.navItemDropdownItemContainer{
    width: 100%;
    height: 3vw;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5vw 0;
    box-sizing: border-box;
}

#navItem5DropdownMovable{
    position: relative;
    width: 100%;
    height: 15vw;
    overflow: hidden;
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

#navItem5:hover #navItem5DropdownMovable{
    background-color: #696969;
    display: block;
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

#nekomimi{
    position: fixed;
}
</style>