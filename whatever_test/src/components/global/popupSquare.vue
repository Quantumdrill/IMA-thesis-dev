<script setup>

import {ref} from "vue"
import {useRoute} from "vue-router"

let disp = ref(false)
let locked = ref(false)
const route = useRoute()
const chan = new BroadcastChannel("global")

chan.onmessage=(e)=>{
    if (e.data.type === "snapButtonShow" && e.data.id === Number(route.params.id)){ //the param is a string
        disp.value = e.data.action
    }
}

function snapInPlace(){
    chan.postMessage({type: "snapButtonAction", id:Number(route.params.id)})
    locked.value = true
}

</script>
<template>
    <div id="buttonContainer">
        <button v-if="disp&&!locked" @click="snapInPlace()">Snap in place</button> 
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
