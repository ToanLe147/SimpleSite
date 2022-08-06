class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    init() {
        // Add background to the game
        const CommonRoom = new Image();
        CommonRoom.onload = () => {
            this.ctx.drawImage(
                CommonRoom, 
                0, // left cut
                0, //top cut
                816, // width of cut
                384  // height of cut
            )
        }
        CommonRoom.src = "../assets/CommonRoom.png";

        const x = 2
        const y = 2
        // Add player to the game
        const Player = new Image();
        Player.onload = () => {
            this.ctx.drawImage(
                Player, 
                0, 
                0,
                32,
                64,       
                x * 48,
                y * 48,
                32,
                64         
            )
        }
        Player.src = "../assets/actors/boy.png"
    }    
}