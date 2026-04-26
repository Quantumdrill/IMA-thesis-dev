<script setup>
import {useRouter} from "vue-router"
let router = useRouter()
</script>
<template>
    <div id="startPageBody">
        <p>Welcome! Please read the following before starting the journey.</p>
        <p>This is a web game that utilizes popup windows as a part of the gameplay, meaning that it is manipulating the browser at a system level.</p>
        <p>Because of this, there are some limitations to the game and some requirements that you need to follow during the game:</p>
        <ul>
            <li>The game is tested on Chrome only.</li>
            <li>Due to different screen positioning mechanisms, the game is only compatible with a Windows machine.</li>
            <li>Please keep the main browser window maximized at all times, and try not to resize or move it.</li>
            <li>If you have dual monitors (or more), please place the main browser window on the main monitor.</li>
            <li>You can ignore any translation prompts from the popup windows.</li>
            <li>If you have to refresh the page, close all the popups and then refresh.</li>
        </ul>
        <button id="startButton" @click="router.push('/stage1')">Start</button>
    </div>
</template>
<style scoped>
#startPageBody{
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#startButton{
    margin-top: 2vw;
}
</style>