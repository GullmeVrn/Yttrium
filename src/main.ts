import { consola } from 'consola'

import { Player } from './Player'
import { WindowManager } from './Services/WindowManager'

import './style.css'

const canvas = document.querySelector('canvas')
const ctx = canvas!.getContext('2d')

canvas!.width = document.documentElement.clientWidth
canvas!.height = document.documentElement.clientHeight

const player = new Player(canvas, ctx)
const keys = {
    z: {
        pressed: false,
    },
    q: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

function animate() {
    window.requestAnimationFrame(animate)

    ctx!.fillStyle = 'white'
    ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

    player.velocity.x = 0
    if (keys.d.pressed) player.velocity.x = 5
    else if (keys.q.pressed) player.velocity.x = -5

    player.draw()
    player.update()
}

animate()

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'z':
            if (player.velocity.y === 0) {
                player.velocity.y = -20
            }
            break
        case 'q':
            // Move player to the left
            keys.q.pressed = true
            break
        case 'd':
            // Move player to the right
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', e => {
    switch (e.key) {
        case 'q':
            keys.q.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

let wm
let initialized = false

if (new URLSearchParams(window.location.search).get('clear')) {
    localStorage.clear()
} else {
    // This code is essential to circumvent that some browsers preload the content of some pages before you actually hit the url
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState != 'hidden' && !initialized) {
            init()
        }
    })
}

window.addEventListener('load', () => {
    if (document.visibilityState != 'hidden') {
        init()
    }
})

function init() {
    initialized = true

    // add a short timeout because window.offsetX reports wrong values before a short period
    setTimeout(() => {
        setupWindowManger()
    }, 500)
}

function setupWindowManger() {
    wm = new WindowManager()
    wm.setWinChangeCallback(windowsUpdate)

    // Here you can add your custom metadata to each windows instance
    let metadada = { foo: 'bar' }

    // This will init the WindowManger and add this window to the cantralized pool of windows
    wm.init(metadada)

    // Call update windows initialy (it will later be called by the win change callback)
    windowsUpdate()
}

function windowsUpdate() {
    consola.info('Change detected')
}
