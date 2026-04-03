<script setup>

import {ref} from "vue"

let disp = ref("")

const chan = new BroadcastChannel("global")

chan.onmessage=(e)=>{
    if (e.data.action){
        disp.value="嘿嘿"
    } else {
        disp.value=""
    }
}

</script>
<template>
    <p>{{ disp }}</p>
</template>
<style scoped>

</style>