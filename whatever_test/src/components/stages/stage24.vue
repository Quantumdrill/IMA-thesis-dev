<script setup>
import {ref, onMounted, useTemplateRef, reactive, watch} from "vue"
import {useRouter} from "vue-router"
import Naoto from "../character/Naoto.vue"
import ResetScreen from "../global/resetScreen.vue"

let router = useRouter()
let lorumPlaceholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"

const nextButton = useTemplateRef("nextButton")
const appearanceButton = useTemplateRef("appearanceButton")
const bodyDom = useTemplateRef("bodyDom")
const resetScreenState = ref(false)
const animSequence = ref(null)
let naotoLocalVars = reactive({
    stage24Appearance: true,
})
let appearance = ref(true) //false = in dark mode, showing "Light Mode" button
let naotoPos = 1


onMounted(() => {
    nextButton.value.disabled = true
})

function changeAppearance(){ 
    if (!appearance.value){
        appearance.value = true
        bodyDom.value.style.backgroundColor = "#ffffff"
        naotoLocalVars.stage24Appearance = true
    } else {
        appearance.value = false
        bodyDom.value.style.backgroundColor = "#000000"
        naotoLocalVars.stage24Appearance = false
    }
    switch (naotoPos){
        case 1:
            animSequence.value = "stage24AppearanceCheck"
            setTimeout(() => {
                animSequence.value = "stage24InitDrop"
            }, 1)
            break
        case 2:
            animSequence.value = null // reset the prop first, wait a ms, and then set the new prop value, to trigger the watcher
            setTimeout(() => {
                animSequence.value = "stage24AppearanceCheck"
            }, 1)
            break
        case 3:
            animSequence.value = null // reset the prop first, wait a ms, and then set the new prop value, to trigger the watcher
            setTimeout(() => {
                animSequence.value = "stage24AppearanceCheck"
            }, 1)
            animSequence.value = "stage24SecondDrop"
            break
        case 4:
            animSequence.value = null // reset the prop first, wait a ms, and then set the new prop value, to trigger the watcher
            setTimeout(() => {
                animSequence.value = "stage24AppearanceCheck"
            }, 1)
            break
        default:
            break
    }
}

function naotoPosUpdate(pos){
    naotoPos = pos
}

function nextButtonAction(){
    router.push('/stage24')
}

</script>
<template>
    <div id="body" ref="bodyDom"></div>
    <button id="appearanceButton" @click="changeAppearance" ref="appearanceButton">{{!appearance?"Light":"Dark"}} Mode</button>
    <div class="block" v-if="appearance" id="initBPlatform">{{ lorumPlaceholder.repeat(2) }}</div>
    <div class="block" v-if="!appearance" id="leftUpperWPlatform">{{ lorumPlaceholder.repeat(2) }}</div>
    <div class="block" v-if="!appearance" id="rightUpperWPlatform">{{ lorumPlaceholder.repeat(2) }}</div>
    <div class="block" v-if="appearance" id="midBPlatform">{{ lorumPlaceholder.repeat(3) }}</div>
    <div class="block" v-if="appearance" id="rightLowerWPlatform">{{ lorumPlaceholder.repeat(2) }}</div>
    <div class="block" v-if="appearance" id="leftLowerWPlatform">{{ lorumPlaceholder.repeat(2) }}</div>
    <button id="nextButton" @click="nextButtonAction" ref="nextButton">next</button>
    <ResetScreen v-if="resetScreenState" ref="resetScreenDom"/>
    <Naoto id="naoto" :parentComponent="'stage24'" 
    :animSequenceProp="animSequence" 
    :naotoLocalVarsProp="naotoLocalVars" 
    @nextButtonActivated="nextButton.disabled = false" 
    @naotoPosUpdate="naotoPosUpdate"
    @operationButtonOperation="(e)=>appearanceButton.disabled = !e" 
    @resetScreen="resetScreenState = true"
    />

</template>
<style scoped>

#body {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    z-index: 0;
}

#appearanceButton{
    position: fixed;
    top: 10vh;
    right: 10vw;
    z-index: 2;
}

#initBPlatform{
    position: fixed;
    width: 20vw;
    height: 10vh;
    left: 5vw;
    top: 20vh;
    overflow: hidden;
    z-index: 2;
}


#leftUpperWPlatform{
    position: fixed;
    width: 20vw;
    height: 10vh;
    left: 5vw;
    top: 50vh;
    overflow: hidden;
    color: #ffffff;
    z-index: 2;
}

#rightUpperWPlatform{
    position: fixed;
    width: 20vw;
    height: 10vh;
    right: 5vw;
    top: 50vh;
    overflow: hidden;
    color: #ffffff;
}

#midBPlatform{
    position: fixed;
    width: 20vw;
    height: 45vh;
    left: 40vw;
    bottom: 5vh;
    overflow: hidden;
}

#rightLowerWPlatform{
    position: fixed;
    width: 26vw;
    height: 10vh;
    right: 5vw;
    bottom: 5vh;
    overflow: hidden;
}

#leftLowerWPlatform{
    position: fixed;
    width: 15vw;
    height: 10vh;
    left: 25vw;
    bottom: 5vh;
    overflow: hidden;
}

#nextButton{
    position: fixed;
    left: 26vw;
    bottom: 18vh;
    z-index: 2;
}

#nextButton:disabled {
    color: #aaa;
}

#naoto{
    position: fixed;
    top: 0;
    z-index: 1;
}

</style>