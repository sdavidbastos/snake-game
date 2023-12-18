const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d")
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")
const audio = new Audio("../assets/audio.mp3")

class Utils{
 
    static randomNumber = (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    }
    
    static randomPosition = () => {
        const number = this.randomNumber(0, canvas.width - 30);
        return Math.round(number / 30) * 30;
    }
    
   static randomColor = () => {
        const red = this.randomNumber(0, 255);
        const green = this.randomNumber(0, 255);
        const blue = this.randomNumber(0, 255);
    
        return `rgb(${red}, ${green}, ${blue})`;
    }

}
class Food{
    #ctx
    x
    y
    #color
    constructor(ctx) {
        this.#ctx = ctx;
    }
    createFood(){
        this.x = Utils.randomPosition();
        this.y = Utils.randomPosition();
        this.#color = Utils.randomColor();
    }

    draw(){
        this.#ctx.shadowColor = this.#color;
        this.#ctx.shadowBlur = 6;
        this.#ctx.fillStyle = this.#color;
        this.#ctx.fillRect(this.x, this.y, 30, 30);
        this.#ctx.shadowBlur = 0;
    }

    execute(){
        if(!this.#color){
            this.createFood();
        }
        this.draw();
    }

}
class Snake {
    length = [
        { x: 270, y: 240 },
    ];
    #ctx
    #size = 30
    #direction = {
        "w": (head) => { this.length.push({ x: head.x, y: head.y - this.#size }) },
        "s": (head) => { this.length.push({ x: head.x, y: head.y + this.#size }) },
        "d": (head) => { this.length.push({ x: head.x + this.#size, y: head.y }) },
        "a": (head) => { this.length.push({ x: head.x - this.#size, y: head.y }) },
    }
    #currentDirection = "d"
    constructor(ctx) {
        this.#ctx = ctx;
    }

    draw() {
        this.#ctx.fillStyle = "#ddd";
        this.length.forEach((position, index) => {
            if (index === this.length.length - 1) {
                this.#ctx.fillStyle = "#fff";
            }
            this.#ctx.fillRect(position.x, position.y, this.#size, this.#size);
        });
    }

    move() {
        const head = this.length.at(-1);
        if (this.#direction[this.#currentDirection]) {
            this.#direction[this.#currentDirection](head);
        }
        this.length.shift();
    }

    changeDirection(direction) {
        if (direction === "w" && this.#currentDirection === "s") return;
        if (direction === "s" && this.#currentDirection === "w") return;
        if (direction === "a" && this.#currentDirection === "d") return;
        if (direction === "d" && this.#currentDirection === "a") return;
        this.#currentDirection = direction;
    }

    collision(){
        const head = this.length.at(-1);
        const tail = this.length.length -2
        if(this.length.length > 3){
           return !!this.length.find((posititon, index) =>( index < tail && posititon.x == head.x && posititon.y == head.y));
        }
    }

    execute() {
        if(this.#currentDirection === null){
            return;
        }
        this.draw();
        this.move();
    }
}
class Game {
    #ctx
    #snake
    #food
    constructor(ctx, snake, food) {
        this.#ctx = ctx;
        this.#snake = snake;
        this.#food = food;
    }

    incrementScore(){
        score.innerText = +score.innerText + 10;
    }

    drawGrid(){
        this.#ctx.lineWidth = 1;
        this.#ctx.strokeStyle = "#191919";

        for (let i = 30; i < canvas.width; i += 30) {
            this.#ctx.beginPath();
            this.#ctx.lineTo(i, 0);
            this.#ctx.lineTo(i, 600);
            this.#ctx.stroke();
    
            this.#ctx.beginPath();
            this.#ctx.lineTo(0, i);
            this.#ctx.lineTo(600, i);
            this.#ctx.stroke();
        }

    }

    checkEat(){
        const head = this.#snake.length.at(-1);

        if(head.x == this.#food.x && head.y == this.#food.y){
            this.#snake.length.push(head);
            this.#food.createFood();
            this.incrementScore();
            audio.play()
            while(this.#snake.length.find((posititon) =>posititon.x == this.#food.x && posititon.y==this.#food.y)){
                this.#food.createFood()
            }
        }
    }

    checkCollision(){
        const head = this.#snake.length.at(-1);
        const canvasLimit = canvas.width - 30
        const wallCollision = (
        head.x < 0 
        || head.x > canvasLimit 
        || head.y < 0 
        || head.y > canvasLimit);
        const snakeCollision = this.#snake.collision();

        if(wallCollision || snakeCollision){
            this.gameOver();
            return true;
        }
    }

    gameOver(){
        this.#snake.currentDirection = null
        menu.style.display = "flex";
        finalScore.innerText = score.innerText;
        canvas.style.filter = "blur(2px)";
    }

    start() {
        this.#ctx.clearRect(0, 0, 600, 600);
        this.drawGrid();
        if(this.checkCollision()){
            return;
        };
        this.#snake.execute();
        this.#food.execute();
        this.checkEat();
        setTimeout(() => this.start(), 80);
    }
}

const snake = new Snake(ctx);
const food = new Food(ctx);
const game = new Game(ctx, snake, food);

game.start();
document.addEventListener("keypress", ({ key }) => {
    if (["w", "a", "s", "d"].includes(key)) {
        snake.changeDirection(key);
    }
})

buttonPlay.addEventListener("click", () => {
    window.location.reload();
})