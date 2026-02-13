<script setup>
function move(){
    window.moveBy(200, 0); //window. functions must be used in a function than directly in @click
}
</script>
<template>
    <p>this is popup 2</p>
    <button @click="move">move to right</button>
</template>
<style scoped>
</style>