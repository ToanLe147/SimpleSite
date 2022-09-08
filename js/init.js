// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js';
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getDatabase, ref, set, onDisconnect, onChildAdded, onChildRemoved, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQC1IqU-jCKYRxmhOwJ1gXOIHiPHGd8tc",
  authDomain: "simplesite-d9db1.firebaseapp.com",
  databaseURL: "https://simplesite-d9db1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "simplesite-d9db1",
  storageBucket: "simplesite-d9db1.appspot.com",
  messagingSenderId: "1022730618259",
  appId: "1:1022730618259:web:afa846b412ea3c4cb91466"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let playerId;
let playerRef;
let players = {}
let charactors = {} 

const mapData = {
    minX: 1,
    maxX: 16,
    minY: 2,
    maxY: 7,
    blockedSpaces: {
        "12x4": true,
        "13x4": true,            
        "14x4": true,            
        "1x4": true,            
        "3x4": true,
        "1x5": true,            
        "2x6": true,            
        "3x5": true,
        "3x6": true,            
        "1x6": true,
    },
};

function getRandomSafeSpot() {
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

window.addEventListener('load', function () {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d')
    canvas.width = 816
    canvas.height = 384     

    const allPlayersRef = ref(database, `players`);
    
    auth.onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        //You're logged in!
        playerId = user.uid;
        playerRef = ref(database, `players/${playerId}`);
    
        // const name = createName();
        // playerNameInput.value = name;
    
        const init_pose = getRandomSafeSpot();
        const x_pos = init_pose.x
        const y_pos = init_pose.y
    
        set(playerRef, {
          id: playerId,          
          direction: "down",
          charactor: "Eskimo",
          x_pos,
          y_pos,      
        })
    
        //Remove me from Firebase when I diconnect
        onDisconnect(playerRef).remove();
    
        //Begin the game now that we are signed in
        initGame();
      } else {
        //You're logged out.
      }
    })
    
    signInAnonymously(auth).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
    });

    function initGame() {          
    class Player {
        constructor(gameWidth, gameHeight, x_init=0, y_init=0, charactor="Eskimo", direction="down") {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 48
            this.height = 48
            this.sw = 16
            this.sh = 16
            this.frameX = 0
            this.frameY = 0            
            this.x = x_init
            this.y = y_init            
            this.image = document.getElementById(`charactor_${charactor}`)
            this.direction = direction
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
            console.log(this.x, this.y)
        }
    }

    class Background {
      constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.image = document.getElementById('backgroundImage');
        this.x = 0
        this.y = 0
        this.width = 816
        this.height = 384
      }
      draw(context) {
        context.drawImage(this.image, this.x, this.y)
      }
    }

    function handleAction() {

    }

    function displayStatusText() {

    }    

    const btn_up = document.getElementById('btn_up')
    const btn_down = document.getElementById('btn_down')
    const btn_left = document.getElementById('btn_left')
    const btn_right = document.getElementById('btn_right')                
    const background = new Background(canvas.width, canvas.height)

    onValue(allPlayersRef, (snapshot) => {
      //Fires whenever a change occurs
      players = snapshot.val() || {};
      console.log(players[playerId].x_pos)      
    })

    onChildAdded(allPlayersRef, (snapshot) => {
      //Fires whenever a new node is added the tree
      const addedPlayer = snapshot.val();
      if (addedPlayer.id === playerId) {        
        charactors[addedPlayer.id] = new Player(canvas.width, canvas.height, addedPlayer.x_pos, addedPlayer.y_pos, addedPlayer.charactor, addedPlayer.direction)
      }  
    })

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        background.draw(ctx)
        charactors[playerId].draw(ctx)

        // Action
        btn_up.onclick = function () {
          charactors[playerId].move("Up")
        }
        btn_down.onclick = function () {
          charactors[playerId].move("Down")
        }
        btn_left.onclick = function () {
          charactors[playerId].move("Left")
        }
        btn_right.onclick = function () {
          charactors[playerId].move("Right")
        }

        requestAnimationFrame(animate)
    }
    animate()
  }  
})

