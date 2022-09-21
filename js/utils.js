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
    // console.log("before handle move", player.x, player.y)

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

    // console.log("after handle move", player.x, player.y)
}

function moveAnimation(player) {
    if (player.direction == "right") {
        player.frameX = 3
    } else if (player.direction == "left") {
        player.frameX = 2
    } else if (player.direction == "up") {
        player.frameX = 1
    } else if (player.direction == "down") {
        player.frameX = 0
    }

    if (player.frameY < 3) {
        player.frameY += 1
    } else {
        player.frameY = 0
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
    moveAnimation(player)
    // console.log(player.x, player.y)
}

// export function chatBubble(ctx, player) {
//     // Shadow
//     ctx.fillStyle = "black"
//     ctx.font = "bold 30px Source Sans Pro"
//     ctx.fillText(`${player.chat_content}`, player.x * player.width, player.y * player.height - 8)
//     // Message
//     ctx.fillStyle = "white"
//     ctx.font = "bold 30px Source Sans Pro"
//     ctx.fillText(`${player.chat_content}`, player.x * player.width, player.y * player.height - 10)    
// }

export function chatBubble(ctx, player, areYou=false) {
    let color = "black"
    let background = "rgb(181, 181, 185)"
    if (areYou) {
        color = "white"
        background = "rgb(11, 147, 246)"
    }    
    const svgCode = `
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="0" y="0" width="120" height="120">
            <style>
            p {
                max-width: 120px;
                word-wrap: break-word;
                margin-bottom: 12px;
                line-height: 24px;    
                padding: 10px 10px;
                border-radius: 25px;                
                font-family: sans-serif;
                font-size: 15px;
                color: ${color}; 	 
	            background: ${background};
            }
            </style>
            <div xmlns="http://www.w3.org/1999/xhtml">
                <p>    
                    ${player.chat_content}
                </p>
            </div>
        </foreignObject>
    </svg>`;
    const svgCodeEncoded = svgCode.replace(/\n/g, '').replace(/"/g, "'");
    const img = document.createElement('img');
    img.onload = () => {        
        // Draw the image to the canvas
        ctx.drawImage(img, player.x * player.width - 120, player.y * player.height - 50);
    };
    img.src = `data:image/svg+xml,${svgCodeEncoded}`;
}