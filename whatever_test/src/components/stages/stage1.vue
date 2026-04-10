<script setup>
import {useRouter} from "vue-router"

let lorumPlaceholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"

const router = useRouter()

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
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>Placeholder 2</h2>
            <div class="blockContent">
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>The Holy Cookie</h2>
            <div class="blockContent">
                <div class="blockImageContainer">ImagePlaceholder</div>
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
                    <button id="button3" @click="router.push('/stage21')">Get The Cookie Now!</button>
                </div>
            </div>
        </div>
        <div class="block">
            <h2>Placeholder 4</h2>
            <div class="blockContent">
                <div class="blockText">
                    <p>{{ lorumPlaceholder.repeat(3) }}</p>
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
}
</style>