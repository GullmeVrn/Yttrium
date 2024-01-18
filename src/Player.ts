export class Player {
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null

    position: {
        x: number
        y: number
    }

    velocity: {
        x: number
        y: number
    }

    gravity: number

    width: number
    height: number

    sides

    constructor(
        canvas: HTMLCanvasElement | null,
        ctx: CanvasRenderingContext2D | null
    ) {
        this.canvas = canvas
        this.ctx = ctx

        this.position = {
            x: 100,
            y: 100,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.width = 100
        this.height = 100

        this.sides = {
            bottom: this.position.y + this.height,
        }

        this.gravity = 1
    }

    draw() {
        this.ctx!.fillStyle = 'red'
        this.ctx!.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.sides.bottom = this.position.y + this.height

        // Above bottom of canvas
        if (this.sides.bottom + this.velocity.y < this.canvas!.height) {
            this.velocity.y += 1
            this.sides.bottom = this.position.y + this.height
        } else {
            this.velocity.y = 0
        }
    }
}
