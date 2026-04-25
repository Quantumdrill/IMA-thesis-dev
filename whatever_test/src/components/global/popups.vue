<script setup>

import {ref, onMounted, watch} from "vue"
import {useRoute} from "vue-router"

let buttonDispState = ref(false)
let textDispState = ref(true)
let lockedState = ref(false)
let textDisp = ref("Drag me")
const route = useRoute()
const chan = new BroadcastChannel("global")


onMounted(()=>{
    chan.postMessage({type:"handshake", id:Number(route.params.id)})
})
chan.onmessage=(e)=>{
    if (e.data.type === "snapButtonShow" && e.data.id === Number(route.params.id)){ //the param is a string
        buttonDispState.value = e.data.action
        if (!lockedState.value){
            textDispState.value = !e.data.action
        }
    }
    if (e.data.type === "typeInitialize" && e.data.id === Number(route.params.id)){
        if (e.data.popupType===1){
            textDisp.value = "Drag me"
        } else if (e.data.popupType===2){
            textDisp.value = "Wait"
        }
    }
}

function snapInPlace(){
    chan.postMessage({type: "snapButtonAction", id:Number(route.params.id)})
    lockedState.value = true
    textDispState.value = false
}


</script>
<template>
    <div id="buttonContainer">
        <p v-if="textDispState">{{textDisp}}</p> 
        <button v-if="buttonDispState&&!lockedState" @click="snapInPlace()">Snap in place</button> 
    </div>
</template>
<style scoped>
    #buttonContainer{
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
