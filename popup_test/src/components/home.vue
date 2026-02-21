<script setup>
let popups = {}
let browserBarHeight
let scrn = {x: screen.availWidth, y:screen.availHeight}
function testBrowserBarHeight (){
    let testPopup = window.open("/","test","top=0,left=0,width=400,height=400")
    testPopup.resizeTo(400,400)
    browserBarHeight = testPopup.outerHeight-testPopup.innerHeight
    console.log(testPopup.outerHeight,testPopup.innerHeight,testPopup.outerWidth,testPopup.innerWidth,browserBarHeight)
    testPopup.close()
}
function openPopup(name,left,top,size){
    let newWindow
    newWindow = window.open(
        `/${name}`, 
        `${name}`, 
        `left=${left},top=${top},width=500,height=500`
    )
    newWindow.resizeTo(size,size)
    return newWindow
}
function moveDown(){
    popups.p1.moveBy(0, 100)
    popups.p2.moveBy(0, 100)
}

function colliderInitialize(){
    popups.p3.xp = popups.p3.screenX
    popups.p3.yp = popups.p3.screenY
    popups.p4.vx = 0
    popups.p4.vy = 0
}
function colliderTick(){
    colliderGetCurrentVelocity()
    collisionInter()
    collisionEdge()
    colliderUpdate()
    requestAnimationFrame(colliderTick)
}
function collisionInter(){
    if (Math.abs(popups.p4.screenX-popups.p3.screenX)<400&&Math.abs(popups.p4.screenY-popups.p3.screenY)<400){ //detect for collision with driver popup
        if (Math.abs(popups.p4.screenX-popups.p3.screenX)>Math.abs(popups.p4.screenY-popups.p3.screenY)){ //detect x or y collision, > meaning x
            if (popups.p4.screenX>popups.p3.screenX){ // p4 to the right of p3
                popups.p4.moveTo(popups.p3.screenX+400,popups.p4.screenY)
                popups.p4.vx*=-1
            } else if (popups.p4.screenX<popups.p3.screenX){ // p4 to the left of p3
                popups.p4.moveTo(popups.p3.screenX-400,popups.p4.screenY)
                popups.p4.vx*=-1
            }   
        } else {
            if (popups.p4.screenY>popups.p3.screenY){ // p4 to the bottom of p3
                popups.p4.moveTo(popups.p4.screenX,popups.p3.screenY+400)
                popups.p4.vy*=-1
            } else if (popups.p4.screenY<popups.p3.screenY){ // p4 to the top of p3
                popups.p4.moveTo(popups.p4.screenX,popups.p3.screenY-400)
                popups.p4.vy*=-1
            }
        }
         
        popups.p4.vx += popups.p3.vx
        popups.p4.vy += popups.p3.vy
    }
}
function collisionEdge(){
    if (popups.p4.screenX<5||popups.p4.screenX+400>scrn.x-5){
        popups.p4.vx*=-1
    } else if (popups.p4.screenY<5||popups.p4.screenY+400>scrn.y-5){
        popups.p4.vy*=-1
    }
}
function colliderUpdate(){
    if (popups.p4.vx>20){  // speed limit
        popups.p4.vx=20
    }
    if (popups.p4.vy>20){
        popups.p4.vy=20
    }
    popups.p4.moveBy(popups.p4.vx,popups.p4.vy)
    popups.p4.vx*=0.99 // speed damping
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
    <button @click="popups.p1 = openPopup('popup1',100,100,400);popups.p2 = openPopup('popup2',600,100,400)" >popups</button>
    <button @click="moveDown">move both down</button>
    <button @click="popups.p3 = openPopup('popup3',100,100,400);popups.p4 = openPopup('popup4',600,100,400);colliderInitialize();requestAnimationFrame(colliderTick())" >colliders</button>
</template>
<style scoped>
</style>