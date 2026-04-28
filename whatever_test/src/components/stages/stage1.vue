<script setup>
import {useRouter} from "vue-router"
import { ref, onMounted } from "vue"
import Naoto from "../character/Naoto.vue"
let lorumPlaceholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"

const router = useRouter()

let initialized = false
const animSequence = ref(null)

window.onload = () => {
    window.scrollTo(0,0)
}

window.addEventListener("scroll", (e) => {
    if (window.scrollY > 40*window.innerWidth/100+window.innerHeight && !initialized){
        console.log("scroll")
        animSequence.value = "stage1"
        initialized = true
    }
})
</script>
<template>
    <div id="page">
        <div id="h1Container">
            <h1>The web artifacts</h1>
        </div>
        <div class="block">
            <h2>Placeholder 1</h2>
            <div class="blockContent">
                <div class="blockImageContainer">ImagePlaceholder</div>
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>Placeholder 2</h2>
            <div class="blockContent">
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>The Holy Cookie</h2>
            <div class="blockContent">
                <div class="blockImageContainer">ImagePlaceholder</div>
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
                    <button id="button3" @click="router.push('/popupBridges')">Get The Cookie Now!</button>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>Placeholder 4</h2>
            <div class="blockContent">
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
                </div>
                <div class="blockImageContainer">ImagePlaceholder</div>
            </div>
        </div>
        <Naoto id="naoto" :parentComponent="'stage1'" 
        :animSequenceProp="animSequence" 
        :naotoLocalVarsProp="naotoLocalVars" 
        @nextButtonActivated="nextButton.disabled = false" 
        @operationButtonOperation="(e)=>appearanceButton.disabled = !e" 
        />
    </div>
</template>
<style scoped>
#page {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
}

#h1Container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

h1 {
    font-size: 4vw;
}

h2 {
    text-align: center;
    padding: 3vw 0;
}

.block {
    width: 70vw;
    padding: 6vw 0;
}

.blockContent {
    height: 20vw;
    display: flex;
    overflow: hidden;
}

.blockText {
    display: flex;
    flex-direction: column;
    width: 34vw;
    margin-right: 1vw;
    position: relative;
}


.blockImageContainer {
    width: 34vw;
    margin-right: 1vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

#button3 {
    width: 10vw;
    align-self: flex-end;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
}
#naoto{
    position: absolute;
    top: calc(100vh + 86vw);
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
}

button{
    padding: 0;
}
</style>