<script setup>
let popups = {}
function openPopup(name,left,top){
    return window.open(
        `/${name}`, 
        `${name}`, 
        `left=${left},top=${top},width=400,height=400`
    )
}
function moveDown(){
    popups.p1.moveBy(0, 100)
    popups.p2.moveBy(0, 100)
}
</script>
<template>
    <button @click="popups.p1 = openPopup('popup1',100,100);popups.p2 = openPopup('popup2',600,100)" >popups</button>
    <button @click="moveDown">move both down</button>
</template>
<style scoped>
</style>