const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d")

class Snake {
    #length = [
        { x: 200, y: 200 },
        { x: 230, y: 200 },
        { x: 260, y: 200 },
        { x: 280, y: 200 },
        { x: 300, y: 200 },
        { x: 320, y: 200 },
        { x: 340, y: 200 },
    ];
    #ctx
    #size = 30
    #direction = {
        "up": (head) => {this.#length.push({x: head.x, y: head.y + this.#size})},
        "left": (head) => {this.#length.push({x: head.x + this.#size, y: head.y})},
        "down": (head) => {this.#length.push({x: head.x, y: head.y - this.#size})},
        "right": (head) => {this.#length.push({x: head.x - this.#size, y: head.y})}
    }
    constructor(ctx){
        this.#ctx = ctx;
    }

    draw(){
        this.#ctx.fillStyle = "#ddd";
        this.#length.forEach((position, index) => {
            if(index === this.#length.length - 1){
                this.#ctx.fillStyle = "#fff";
            }
            this.#ctx.fillRect(position.x, position.y, this.#size, this.#size)});
    }

    move(direction){
        const head = this.#length.at(-1);
        this.#length.unshift();
        if(this.#direction[direction]){
            this.#direction[direction](head);
        }
    }

    execute(){
        this.draw();
    }
}

const snake = new Snake(ctx);

snake.execute();