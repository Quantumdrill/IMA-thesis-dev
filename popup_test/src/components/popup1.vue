<script setup>
function resize(){
    window.resizeTo(600,600)
}
</script>
<template>
    <p>this is popup 1</p>
    <button @click="resize">make bigger</button>
</template>
<style scoped>
</style>