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
    <button v-if="disp&&!locked" @click="snapInPlace()">Snap in place</button> 
</template>
<style scoped>

</style>
