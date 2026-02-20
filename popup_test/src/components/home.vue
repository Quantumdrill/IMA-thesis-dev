<script setup>
let popups = {}
let browserBarHeight
let scrn = {x: screen.availWidth, y:screen.availHeight}
function testBrowserBarHeight (){
    let testPopup = window.open("/","test","top=200,width=100,height=100")
    browserBarHeight = testPopup.outerHeight-testPopup.innerHeight
    testPopup.close()
}
function openPopup(name,left,top){
    return window.open(
        `/${name}`, 
        `${name}`, 
        `left=${left},top=${top},width=400,height=${400-browserBarHeight}`
    )
}
function moveDown(){
    popups.p1.moveBy(0, 100)
    popups.p2.moveBy(0, 100)
}

function colliderInitialize(){
    popups.p3.xp = popups.p3.screenX
    popups.p3.yp = popups.p3.screenY
}
function colliderTick(){
    colliderGetCurrentVelocity()
    collisionInter()
    collisionEdge()
    colliderUpdate()
    requestAnimationFrame(colliderTick)
}
function collisionInter(){
    if (Math.abs(popups.p4.screenX-popups.p3.screenX)<400&&Math.abs(popups.p4.screenY-popups.p3.screenY)<400){
        console.log("co")
        popups.p4.vx = popups.p3.vx
        popups.p4.vy = popups.p3.vy
    }
}
function collisionEdge(){
    if (popups.p4.screenX<5||popups.p4.screenX+400>scrn.x-40){
        
        popups.p4.vx*=-1
    } else if (popups.p4.screenY<5||popups.p4.screenY+400>scrn.y-40){
        popups.p4.vy*=-1
    }
}
function colliderUpdate(){
    popups.p4.moveBy(popups.p4.vx,popups.p4.vy)
    popups.p4.vx*=0.99
    popups.p4.vy*=0.99
}
function colliderGetCurrentVelocity(){
    popups.p3.vx = popups.p3.screenX - popups.p3.xp
    popups.p3.vy = popups.p3.screenY - popups.p3.yp
    popups.p3.xp = popups.p3.screenX
    popups.p3.yp = popups.p3.screenY
}
</script>
<template>
    <button @click="testBrowserBarHeight();popups.p1 = openPopup('popup1',100,100);popups.p2 = openPopup('popup2',600,100)" >popups</button>
    <button @click="testBrowserBarHeight();popups.p3 = openPopup('popup3',100,100);popups.p4 = openPopup('popup4',600,100);requestAnimationFrame(colliderTick())" >colliders</button>
    <button @click="moveDown">move both down</button>
</template>
<style scoped>
</style>