import { destr } from 'destr'

type Shape = {
  x: number
  y: number
  width: number
  height: number
}

type WindowData = {
  id: number
  shape: Shape
  metadata: object
}

export class WindowManager {
  #id: number
  #count: number

  #windows: WindowData[]

  #winData: WindowData
  #winShapeChangeCallback: (() => void) | null
  #winChangeCallback: (() => void) | null

  constructor() {
    let self = this

    this.#id = 0
    this.#count = 0

    this.#windows = []

    this.#winData = {
      id: 0,
      shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      metadata: {},
    }
    this.#winShapeChangeCallback = null
    this.#winChangeCallback = null

    // Event listner for when localStorage is changed from another window
    addEventListener('storage', e => {
      if (e.key == 'windows') {
        let newWindows = destr<WindowData[]>(e.newValue)
        let winChange = self.#didWindowsChange(self.#windows, newWindows)

        self.#windows = newWindows

        if (winChange) {
          if (self.#winChangeCallback) {
            self.#winChangeCallback()
          }
        }
      }
    })

    // Event listener for when current window is about to be closed
    addEventListener('beforeunload', () => {
      let index = this.getWindowIndexFromId(self.#id)

      self.#windows.splice(index, 1)
      self.updateWindowsLocalStorage()
    })
  }

  // Check if theres any changes to the window list
  #didWindowsChange(prevWins: WindowData[], newWins: WindowData[]) {
    if (prevWins.length != newWins.length) {
      return true
    } else {
      return prevWins.some((win, i) => win.id != newWins[i].id)
    }
  }

  // Initiate current window (add metadada for custom data to store each window instance)
  init(metadata: object) {
    this.#windows = destr(localStorage.getItem('windows')) || []
    this.#count = parseInt(localStorage.getItem('count') || '0', 10)

    this.#count++

    this.#id = this.#count

    let shape = this.getWinShape()
    this.#winData = {
      id: this.#id,
      shape: shape,
      metadata: metadata,
    }

    const index = this.#windows.findIndex(win => win.id === this.#id)

    if (index !== -1) {
      this.#windows[index] = this.#winData
    } else {
      this.#windows.push(this.#winData)
    }

    localStorage.setItem('count', this.#count.toString())

    this.updateWindowsLocalStorage()
  }

  getWinShape() {
    return {
      x: window.screenLeft,
      y: window.screenTop,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  getWindowIndexFromId(id: number) {
    let index = -1

    for (let i = 0; i < this.#windows.length; i++) {
      if (this.#windows[i].id == id) index = i
    }

    return index
  }

  updateWindowsLocalStorage() {
    localStorage.setItem('windows', JSON.stringify(this.#windows))
  }

  setWinShapeChangeCallback(callback: () => void) {
    this.#winShapeChangeCallback = callback
  }

  setWinChangeCallback(callback: () => void) {
    this.#winChangeCallback = callback
  }

  getWindows() {
    return this.#windows
  }
}
