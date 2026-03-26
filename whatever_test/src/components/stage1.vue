<script setup>
let lorumPlaceholder = "Lorum Ipsum "
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
                    <p>{{ lorumPlaceholder.repeat(100) }}</p>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>Placeholder 2</h2>
            <div class="blockContent">
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(100) }}</p>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>The Holy Cookie</h2>
            <div class="blockContent">
                <div class="blockImageContainer">ImagePlaceholder</div>
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(100) }}</p>
                    <router-link id="button3" to="/stage21">Get The Cookie Now!</router-link>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>Placeholder 4</h2>
            <div class="blockContent">
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(100) }}</p>
                </div>
                <div class="blockImageContainer">ImagePlaceholder</div>
            </div>
        </div>
        <canvas></canvas>
    </div>
</template>
<style scoped>
#page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 10vw;
}

#h1Container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
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
    padding: 4vw 0;
}

.blockContent {
    display: flex;
}

.blockText {
    display: flex;
    flex-direction: column;
    width: 34vw;
    margin-right: 1vw;
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
    background-color: hsl(0, 0%, 90%);
}
</style>