<script setup>

import {ref} from "vue"
import {useRoute} from "vue-router"

let buttonDisp = ref(false)
let textDisp = ref(true)
let locked = ref(false)
const route = useRoute()
const chan = new BroadcastChannel("global")

chan.onmessage=(e)=>{
    if (e.data.type === "snapButtonShow" && e.data.id === Number(route.params.id)){ //the param is a string
        buttonDisp.value = e.data.action
        if (!locked.value){
            textDisp.value = !e.data.action
        }
    }
}

function snapInPlace(){
    chan.postMessage({type: "snapButtonAction", id:Number(route.params.id)})
    locked.value = true
    textDisp.value = false
}

</script>
<template>
    <div id="buttonContainer">
        <p v-if="textDisp">Drag me</p> 
        <button v-if="buttonDisp&&!locked" @click="snapInPlace()">Snap in place</button> 
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
