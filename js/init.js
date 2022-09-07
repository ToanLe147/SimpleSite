window.addEventListener('load', function () {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d')
    canvas.width = 816
    canvas.height = 384

    let playerId;
    let playerRef;
    let players = {}
    let playerElements = {};

    const mapData = {
        minX: 0,
        maxX: 17,
        minY: 0,
        maxY: 8,
        blockedSpaces: {
            "2x3": true,
            // "6x3": true,
            // "7x3": true,
            // "8x3": true,
            // "7x4": true,
            // "2x5": true,
            // "2x6": true,
            // "2x7": true,
            // "4x5": true,
            // "4x6": true,
            // "4x7": true,
            // "16x7": true,
            // "13x5": true,
            // "13x6": true,
            // "14x5": true,
            // "14x6": true,
            // "15x6": true,
            // "15x5": true,
        },
    };

    function getRandomSafeSpot() {
        //We don't look things up by key here, so just return an x/y
        return randomFromArray([
            { x: 1, y: 4 },
            { x: 2, y: 4 },
            { x: 1, y: 5 },
            { x: 2, y: 6 },
            { x: 2, y: 8 },
            { x: 2, y: 9 },
            { x: 4, y: 8 },
            { x: 5, y: 5 },
            { x: 5, y: 8 },
            { x: 5, y: 10 },
            { x: 5, y: 11 },
            { x: 11, y: 7 },
            { x: 12, y: 7 },
            { x: 13, y: 7 },
            { x: 13, y: 6 },
            { x: 13, y: 8 },
            { x: 7, y: 6 },
            { x: 7, y: 7 },
            { x: 7, y: 8 },
            { x: 8, y: 8 },
            { x: 10, y: 8 },
            { x: 8, y: 8 },
            { x: 11, y: 4 },
        ]);
    }

    function getKeyString(x, y) {
        return `${x}x${y}`;
    }

    function randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function isSolid(x, y) {
        const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
        return (
            blockedNextSpace ||
            x >= mapData.maxX ||
            x < mapData.minX ||
            y >= mapData.maxY ||
            y < mapData.minY
        )
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 48
            this.height = 48
            this.sw = 16
            this.sh = 16
            this.frameX = 0
            this.frameY = 0
            this.x = 0
            this.y = 0
            this.image = document.getElementById('playerImage')
            this.direction = "down"
        }
        draw(context) {
            // context.fillStyle = 'white'
            // context.fillRect(this.x * this.width, this.y * this.height, this.width, this.height)
            context.drawImage(this.image,
                this.frameX * this.sw, this.frameY * this.sh, this.sw, this.sh,
                this.x * this.width, this.y * this.height, this.width, this.height)
        }

        handleMovePress(xChange = 0, yChange = 0) {
            const newX = this.x + xChange
            const newY = this.y + yChange

            if (xChange === 1) {
                this.direction = "right";
            }
            if (xChange === -1) {
                this.direction = "left";
            }
            if (yChange === 1) {
                this.direction = "down";
            }
            if (yChange === -1) {
                this.direction = "up";
            }

            if (!isSolid(newX, newY)) {
                //move to the next space
                this.x = newX;
                this.y = newY;
            }
        }

        moveAnimation() {
            if (this.direction == "right") {
                this.frameX = 3
            } else if (this.direction == "left") {
                this.frameX = 2
            } else if (this.direction == "up") {
                this.frameX = 1
            } else if (this.direction == "down") {
                this.frameX = 0
            }

            if (this.frameY < 3) {
                this.frameY += 1
            } else {
                this.frameY = 0
            }
        }

        move(input) {
            if (input == "Right") {
                this.handleMovePress(1, 0)
            }
            else if (input == "Left") {
                this.handleMovePress(-1, 0)
            }
            else if (input == "Down") {
                this.handleMovePress(0, 1)
            }
            else if (input == "Up") {
                this.handleMovePress(0, -1)
            }
            this.moveAnimation()
            // console.log(this.x, this.y)
        }
    }

    class Background {

    }

    function handleAction() {

    }

    function displayStatusText() {

    }

    // const input = new InputHandler()
    const btn_up = document.getElementById('btn_up')
    const btn_down = document.getElementById('btn_down')
    const btn_left = document.getElementById('btn_left')
    const btn_right = document.getElementById('btn_right')
    const player = new Player(canvas.width, canvas.height)

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        player.draw(ctx)

        // Action
        btn_up.onclick = function () {
            player.move("Up")
        }
        btn_down.onclick = function () {
            player.move("Down")
        }
        btn_left.onclick = function () {
            player.move("Left")
        }
        btn_right.onclick = function () {
            player.move("Right")
        }

        requestAnimationFrame(animate)
    }
    animate()

})
