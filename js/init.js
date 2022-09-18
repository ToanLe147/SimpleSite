// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js';
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getDatabase, ref, set, onDisconnect, onChildAdded, onChildRemoved, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { move, getRandomSafeSpot, randomFromArray, getLoadedImage,  } from './utils.js'

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

let charactors = ["Eskimo", "Boy", "Princess", "Samurai", "Cavegirl2"]
let playerId;
let playerRef;
let players = {}

let sceneRef = "";
let scenes = {
    "CommonRoom": {
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
    }
}

window.addEventListener('load', function () {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d')    
    canvas.width = 816
    canvas.height = 384

    const btn_up = document.getElementById('btn_up')
    const btn_down = document.getElementById('btn_down')
    const btn_left = document.getElementById('btn_left')
    const btn_right = document.getElementById('btn_right')
    const btn_chat = document.getElementById('btn_chat')
    const btn_accept = document.getElementById('btn_accept')
    const btn_deny = document.getElementById('btn_deny')

    const chatInput = document.querySelector('.ChatInput')
    const chatSend = document.getElementById('SendBubble')
    const chatRecieve = document.getElementById('RecieveBubble')
    const chatBox = []

    const allPlayersRef = ref(database, `players`);
    const allScenesRef = ref(database, `scenes`)

    // sceneRef = ref(database, `scenes/CommonRoom`);    
    // set(allScenesRef, scenes["CommonRoom"])

    auth.onAuthStateChanged((user) => {
        console.log(user)
        if (user) {
            //You're logged in!
            playerId = user.uid;
            playerRef = ref(database, `players/${playerId}`);            

            const init_pose = getRandomSafeSpot();
            const x = init_pose.x
            const y = init_pose.y

            set(playerRef, {
                id: playerId,
                direction: "down",
                charactor: randomFromArray(charactors),
                chat: false,
                chat_content: "Hello",
                x,
                y,
                width: 48,
                height: 48,
                sw: 16,
                sh: 16,
                frameX: 0,
                frameY: 0,
                scene: "CommonRoom"
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

    // Action
    btn_up.onclick = function () {            
        move("Up", players[playerId])
        set(playerRef, players[playerId]);
    }
    btn_down.onclick = function () {
        move("Down", players[playerId])
        set(playerRef, players[playerId]);
    }
    btn_left.onclick = function () {
        move("Left", players[playerId])
        set(playerRef, players[playerId]);
    }
    btn_right.onclick = function () {
        move("Right", players[playerId])
        set(playerRef, players[playerId]);
    }
    btn_chat.onclick = function () {        
        if (!players[playerId].chat) {
            chatInput.style.display="inline"
            players[playerId].chat = true
        } else {
            chatInput.style.display="none"                                    
            players[playerId].chat = false
        }                           
    }
    btn_accept.onclick = function () {
        if (players[playerId].chat) {            
            players[playerId].chat_content = chatInput.value
            chatSend.innerHTML = players[playerId].chat_content
            chatSend.style.display="inline"
            update(playerRef, players[playerId])
        }
    }
    btn_deny.onclick = function () {
        if (players[playerId].chat) {                        
            chatSend.innerHTML = "..."
            chatSend.style.display="none"
            chatInput.style.display="none"
            players[playerId].chat = false
        }
    } 

    function initGame() {                                       

        onValue(allPlayersRef, (snapshot) => {
            //Fires whenever a change occurs
            players = snapshot.val() || {};
            // Animate
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(getLoadedImage("CommonRoom"), 0, 0)                        
            
            // console.log("Liet ke")

            Object.keys(players).forEach(element => {                
                // console.log(players[element])
                ctx.drawImage(getLoadedImage(players[element].charactor),
                    players[element].frameX * players[element].sw, players[element].frameY * players[element].sh, players[element].sw, players[element].sh,
                    players[element].x * players[element].width, players[element].y * players[element].height, players[element].width, players[element].height)
                
                // if (element != playerId) {
                //     if (players[element].chat) {            
                //         chatRecieve.innerHTML = players[element].charactor + ": " + players[element].chat_content
                //         chatRecieve.style.display="inline"                        
                //     }
                // }                
            });
            
            
        })

        onChildAdded(allPlayersRef, (snapshot) => {
            //Fires whenever a new node is added the tree
            const addedPlayer = snapshot.val();
            console.log("added", addedPlayer)            
        })

        onChildRemoved(allPlayersRef, (snapshot) => {
            const removedKey = snapshot.val().id;            
            delete players[removedKey];
        })        
       
    }
})
