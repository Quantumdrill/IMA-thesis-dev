// requires creation of the popups array, bridges object and the popupIndex var

export function openPopup(popupID,popups,left,top,vw){
    let newWindow
    newWindow = window.open(
        `/popupSquare/${popupID}`, 
        `bridge${popups.length}`,  //provide different names to open multiple popups
        `left=${left},top=${top},width=500,height=500`
    )
    newWindow.resizeTo(window.outerWidth*vw/100*1.04,window.outerWidth*vw/100*1.02)
    return newWindow
}

export function popupNewInstance(popupID,popups,popupTick){
    let newPopup = {
        window: openPopup(popupID,popups,500,200,15),
        locked: false,
        inPos: false,
        inPosPrev: false,
        id: popupID
    }
    popupID += 1
    popups.push(newPopup)
    if (popups.length===1){
        requestAnimationFrame(popupTick)
    }
}

export function popupFixSize(popupWin,vw){
    let sideSizePixel = window.outerWidth*vw/100
    if (popupWin.outerWidth!==sideSizePixel||popupWin.outerHeight!==sideSizePixel){
        popupWin.resizeTo(sideSizePixel*1.04,sideSizePixel*1.02)
    }
}

export function popupFixPosition(popupWin,x,y){
    if (popupWin.screenX!==x||popupWin.screenY!==y){
        popupWin.moveTo(x,y)
    }
}

export function popupSnapCheck(popupObj,bridges){

    popupObj.inPos = false
    popupObj.occupyingBridge = "null"

    // iterate through bridges and check if the popup is in position
    for (const [key, value] of Object.entries(bridges)) {
        if (Math.abs(popupObj.window.screenX-value.xPos)<100&&Math.abs(popupObj.window.screenY-value.yPos)<100){ // check if in position
            if (!value.occupied) { //check if the space is occupied
                popupObj.inPos = true
                popupObj.lockedPositionX = value.xPos-5
                popupObj.lockedPositionY = value.yPos
                popupObj.occupyingBridge = key
                value.highlight = true
            }
        }
    }
}

export function popupCloseCheck(popupObj,popups,popupsArrIndex,bridges){
    if (popupObj.window.closed){
        popups.splice(popupsArrIndex,1) //remove the popup from the array if it is closed
        bridges[popupObj.occupyingBridge].highlight = false //when the popup is closed, restore the occupying status of the occupied bridge
    }
}