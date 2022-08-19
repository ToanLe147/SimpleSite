window.addEventListener('load', function(){
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d')
  canvas.width = 816
  canvas.height = 384

  let playerId;
  let playerRef;
  let players = {}
  let playerElements = {};

  const mapData = {
    minX: 1,
    maxX: 14,
    minY: 4,
    maxY: 12,
    blockedSpaces: {
      "2x3": true,
      "6x3": true,
      "7x3": true,
      "8x3": true,
      "7x4": true,
      "2x5": true,
      "2x6": true,
      "2x7": true,
      "4x5": true,
      "4x6": true,
      "4x7": true,
      "16x7": true,      
      "13x5": true,
      "13x6": true,
      "14x5": true,
      "14x6": true,      
      "15x6": true,
      "15x5": true,
    },
  };

  function isSolid(x,y) {
    const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
    return (
      blockedNextSpace ||
      x >= mapData.maxX ||
      x < mapData.minX ||
      y >= mapData.maxY ||
      y < mapData.minY
    )
  }
  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener('keydown', e => {        
        if (  (e.key === 'ArrowDown' ||
              e.key === 'ArrowUp' ||
              e.key === 'ArrowLeft' ||
              e.key === 'ArrowRight')
            && this.keys.indexOf(e.key) === -1){
          this.keys.push(e.key);
        }
        console.log(e.key, this.keys)
      })
      window.addEventListener('keyup', e => {        
        if ( e.key === 'ArrowDown' ||
             e.key === 'ArrowUp' ||
             e.key === 'ArrowLeft' ||
             e.key === 'ArrowRight')
        {
          this.keys.splice(this.keys.indexOf(e.key), 1)
        }
        console.log(e.key, this.keys)
      })      
    }
  }

  class KeyPressListener {
    constructor(keyCode, callback) {
      let keySafe = true;
      this.keydownFunction = function(event) {
        if (event.code === keyCode) {
           if (keySafe) {
              keySafe = false;
              callback();
           }  
        }
     };
     this.keyupFunction = function(event) {
        if (event.code === keyCode) {
           keySafe = true;
        }         
     };
     document.addEventListener("keydown", this.keydownFunction);
     document.addEventListener("keyup", this.keyupFunction);
    }
  
    unbind() { 
      document.removeEventListener("keydown", this.keydownFunction);
      document.removeEventListener("keyup", this.keyupFunction);
    }
  
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
      this.speedX = 0
      this.speedY = 0
    }
    draw(context) {
      context.fillStyle = 'white'
      context.fillRect(this.x, this.y, this.width, this.height)
      context.drawImage(this.image, this.frameX * this.sw, this.frameY * this.sh, this.sw, this.sh, this.x, this.y, this.width, this.height)
    }
    
    update(input){
      this.x += this.speedX
      this.y += this.speedY
      if (input.keys.indexOf('ArrowRight') > -1) {
        this.speedX = 3
      }
      else if (input.keys.indexOf('ArrowLeft') > -1) {
        this.speedX = -3
      }
      else {
        this.speedX = 0
      }

      if (input.keys.indexOf('ArrowUp') > -1) {
        this.speedY = -3
      }
      else if (input.keys.indexOf('ArrowDown') > -1) {
        this.speedY = 3
      }
      else {
        this.speedY = 0
      }
    }
  }

  class Background {

  }

  function handleAction() {

  }

  function displayStatusText() {

  }  

  const input = new InputHandler()  
  const player = new Player(canvas.width, canvas.height)  
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw(ctx)
    player.update(input)
    requestAnimationFrame(animate) 
  }
  animate()

})