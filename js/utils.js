export function getRandomSafeSpot() {
    //We don't look things up by key here, so just return an x/y
    return randomFromArray([
        { x: 2, y: 2 },
        { x: 4, y: 2 },
        { x: 2, y: 5 },
        { x: 13, y: 2 },
        { x: 10, y: 6 },
        { x: 13, y: 3 },
        { x: 11, y: 2 },
        { x: 6, y: 6 },
        { x: 6, y: 2 },
        { x: 6, y: 4 },
        { x: 9, y: 4 },
        { x: 11, y: 4 },
        { x: 15, y: 4 },
        { x: 15, y: 2 },
    ]);
}

export function getKeyString(x, y) {
    return `${x}x${y}`;
}

const mapData = {
    minX: 1,
    maxX: 16,
    minY: 2,
    maxY: 7,
    blockedSpaces: {
        "12x4": true,
        "13x4": true,
        "14x4": true,        
        "3x4": true,                
        "3x5": true,
        "3x6": true,        
    },
};

export function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function isSolid(x, y) {
    const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
    return (
        blockedNextSpace ||
        x >= mapData.maxX ||
        x < mapData.minX ||
        y >= mapData.maxY ||
        y < mapData.minY
    )
}

export function getLoadedImage(id) {
    return document.getElementById(id)
}

export function handleMovePress(xChange, yChange, player) {
    console.log("before handle move", player.x, player.y)

    const newX = player.x + xChange
    const newY = player.y + yChange

    if (xChange === 1) {
        player.direction = "right";
    }
    if (xChange === -1) {
        player.direction = "left";
    }
    if (yChange === 1) {
        player.direction = "down";
    }
    if (yChange === -1) {
        player.direction = "up";
    }

    if (!isSolid(newX, newY)) {
        // move to the next space
        player.x = newX;
        player.y = newY;
    }

    console.log("after handle move", player.x, player.y)
}

function moveAnimation() {
    if (direction == "right") {
        frameX = 3
    } else if (direction == "left") {
        frameX = 2
    } else if (this.direction == "up") {
        frameX = 1
    } else if (this.direction == "down") {
        frameX = 0
    }

    if (this.frameY < 3) {
        this.frameY += 1
    } else {
        this.frameY = 0
    }
}

export function move(input, player) {
    if (input == "Right") {
        handleMovePress(1, 0, player)
    }
    else if (input == "Left") {
        handleMovePress(-1, 0, player)
    }
    else if (input == "Down") {
        handleMovePress(0, 1, player)
    }
    else if (input == "Up") {
        handleMovePress(0, -1, player)
    }
    // moveAnimation()
    // console.log(player.x, player.y)
}


// function animate(){
//     // Animate
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     ctx.drawImage(getLoadedImage("CommonRoom"), 0, 0)   
    
//     // Action
//     btn_up.onclick = function () {
//         move("Up", players[playerId])
//     }
//     btn_down.onclick = function () {
//         move("Down", players[playerId])
//     }
//     btn_left.onclick = function () {
//         move("Left", players[playerId])
//     }
//     btn_right.onclick = function () {
//         move("Right", players[playerId])
//     }
//     btn_action.onclick = function () {
//         move("Right", players[playerId])
//     }

//     Object.keys(players).forEach(element => {                
//         console.log(players[element])
//         ctx.drawImage(getLoadedImage(players[element].charactor),
//             players[element].frameX * players[element].sw, players[element].frameY * players[element].sh, players[element].sw, players[element].sh,
//             players[element].x * players[element].width, players[element].y * players[element].height, players[element].width, players[element].height)
//     });  

//     requestAnimationFrame(animate)
// }
// animate()