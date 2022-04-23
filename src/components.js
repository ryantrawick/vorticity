import { TagComponent, Component, Types } from 'ecsy'
import * as PIXI from './pixi'

// export class GameState extends Component {}
//
// GameState.schema = {
//   drawMode: { type: Types.Boolean, default: true },
// }

export class Removing extends TagComponent {}

export class Smoke extends Component {}

Smoke.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
  vx: { type: Types.Number, default: 0 },
  vy: { type: Types.Number, default: 0 },
  acceleration: { type: Types.Number, default: 0.4 },
  scale: { type: Types.Number, default: 0 },
  // life: { type: Types.Number, default: 0 },
  // maxLife: { type: Types.Number, default: 0 },
  // alpha: { type: Types.Number, default: 0 },
  // scaleSpeed: { type: Types.Number, default: 0 },
  // rotation: { type: Types.Number, default: 0 },
  // rotationSpeed: { type: Types.Number, default: 0 },
  // color: { type: Types.Number, default: 0 },
  // colorSpeed: { type: Types.Number, default: 0 },
  // colorVariance: { type: Types.Number, default: 0 },
  // colorVarianceSpeed: { type: Types.Number, default: 0 },
  // colorVarianceMax: { type: Types.Number, default: 0 },
  // colorVarianceMin: { type: Types.Number, default: 0 },
  // colorVarianceRange: { type: Types.Number, default: 0 },
  // colorVarianceSpeedRange: { type: Types.Number, default: 0 },
  // colorVarianceSpeedMin: { type: Types.Number, default: 0 },
  // colorVarianceSpeedMax: { type: Types.Number, default: 0 },
}

export class Shooter extends Component {}

Shooter.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
  radius: { type: Types.Number, default: 6 },
  color: { type: Types.Number, default: 0xff0000 },
  bulletCount: { type: Types.Number, default: 6 },
  bulletSpeed: { type: Types.Number, default: 10 },
  bulletRadius: { type: Types.Number, default: 10 },
  bulletLife: { type: Types.Number, default: 3 },
  // bulletDamage: { type: Types.Number, default: 10 },
  // bulletSpread: { type: Types.Number, default: 0 },
  // bulletSpreadAngle: { type: Types.Number, default: 0 },
  // bulletSpreadAngleVariance: { type: Types.Number, default: 0 },
  // bulletSpreadAngleVarianceMax: { type: Types.Number, default: 0 },
  // bulletSpreadAngleVarianceMin: { type: Types.Number, default: 0 },
  // bulletSpreadAngleVarianceDirection: { type: Types.Number, default: 0 },
  // bulletSpreadAngleVarianceDirectionMax: { type: Types.Number, default: 0 },
  // bulletSpreadAngleVarianceDirectionMin: { type: Types.Number, default: 0 },
}

export class Bullet extends Component {}

Bullet.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
  angle: { type: Types.Number, default: 0 },
  speed: { type: Types.Number, default: 0 },
  radius: { type: Types.Number, default: 10 },
  color: { type: Types.Number, default: 0xff0000 },
  // damage: { type: Types.Number, default: 0 },
  // spread: { type: Types.Number, default: 0 },
  // spreadAngle: { type: Types.Number, default: 0 },
  // spreadAngleVariance: { type: Types.Number, default: 0 },
  // spreadAngleVarianceMax: { type: Types.Number, default: 0 },
  // spreadAngleVarianceMin: { type: Types.Number, default: 0 },
  // spreadAngleVarianceDirection: { type: Types.Number, default: 0 },
  // spreadAngleVarianceDirectionMax: { type: Types.Number, default: 0 },
  // spreadAngleVarianceDirectionMin: { type: Types.Number, default: 0 },
}

export class Player extends Component {}

Player.schema = {
  velocity: { type: Types.Ref, default: new PIXI.Point(0, 0) },
  speed: { type: Types.Number, default: 240 },
  lastPlop: { type: Types.Ref, default: new PIXI.Point(0, 0) },
  plopDistance: { type: Types.Number, default: 12 },
  pectin: { type: Types.Number, default: 25 },
  maxPectin: { type: Types.Number, default: 25 },
  currentLineIndex: { type: Types.Number, default: -1 },
  ammo: { type: Types.Number, default: 25 },
  maxAmmo: { type: Types.Number, default: 25 },
  directionX: { type: Types.Number, default: -1 },
  directionY: { type: Types.Number, default: -1 },
  directionLerpX: { type: Types.Number, default: 0.5 },
  directionLerpY: { type: Types.Number, default: 0.5 },
}

export class Cursor extends TagComponent {}

export class GameTimer extends TagComponent {}

//export class Camera extends TagComponent {}

// export class Position extends Component {}
// Position.schema = {
//   x: { type: Types.Number, default: 0 },
//   y: { type: Types.Number, default: 0 }
// }

export class MainStage extends TagComponent {}

export class LinePoint extends Component {}

LinePoint.schema = {
  x: { type: Types.Number },
  y: { type: Types.Number },
  angle: { type: Types.Number },
  speed: { type: Types.Number },
}

// export class LinePointRenderer extends TagComponent {}

export class Timer extends Component {}

Timer.schema = {
  time: { type: Types.Number, default: 0 },
  duration: { type: Types.Number, default: 0 }
}

export class Container extends Component {}

Container.schema = {
  container: { type: Types.Ref, default: new PIXI.Container() }
}

export class Renderer extends Component {}

Renderer.schema = {
  renderer: { type: Types.Ref }
}

export class InputState extends Component {
  constructor () {
    super()
    this.states = {}
    this.actions = {
      forward: { type: 'button' },
      back: { type: 'button' },
      left: { type: 'button' },
      right: { type: 'button' },
      attack: { type: 'button' },
      lookX: { type: 'axis' },
      lookY: { type: 'axis' }
    }
  }
}

export class KeyboardState extends Component {
  constructor () {
    super()
    this.states = {}
    this.actionMapping = {
      forward: ['w', 'ArrowUp'],
      back: ['s', 'ArrowDown'],
      left: ['a', 'ArrowLeft'],
      right: ['d', 'ArrowRight'],
      attack: ['Space', ' '],
    }
    this.onKeyDown = (event) => {
      if (!this.states[event.key]) {
        this.states[event.key] = { down: false, held: false, up: false, checked: false }
      }
    }
    this.onKeyUp = (event) => {
      if (this.states[event.key]) {
        this.states[event.key].up = true
      }
    }
  }
}

export class MouseState extends Component {
  constructor () {
    super()
    this.states = { mouseX: { lastMove: 0, moved: false }, mouseY: { lastMove: 0, moved: false } }
    this.actionMapping = {
      attack: [0],
      lookX: ['mouseX'],
      lookY: ['mouseY']
    }
    //this.sensitivity = 1
    this.onMouseDown = (event) => {
      if (!this.states[event.button]) {
        this.states[event.button] = { down: false, held: false, up: false, checked: false }
      }
    }
    this.onMouseUp = (event) => {
      if (this.states[event.button]) {
        this.states[event.button].up = true
      }
    }
    this.onMouseMove = (event) => {
      this.states.mouseX.lastMove = (event.movementX || 0)// * this.sensitivity
      this.states.mouseY.lastMove = (event.movementY || 0)// * this.sensitivity
      this.states.mouseX.moved = true
      this.states.mouseY.moved = true
    }
  }
}

export class TouchState extends Component {
  constructor () {
    super()
    this.previousTouch = null
    this.states = { touchX: { lastMove: 0, moved: false }, touchY: { lastMove: 0, moved: false } }
    this.actionMapping = {
      lookX: ['touchX'],
      lookY: ['touchY']
    }
    //this.sensitivity = 0.02
    this.onTouchStart = (event) => {
      if (this.previousTouch != null) {
        this.previousTouch = null
      }
    }
    this.onTouchEnd = (event) => {
      if (this.previousTouch != null) {
        this.previousTouch = null
      }
    }
    this.onTouchMove = (event) => {
      if (this.previousTouch == null) {
        this.previousTouch = event.targetTouches[0]
      }
      this.states.touchX.lastMove = ((event.targetTouches[0].pageX - this.previousTouch.pageX) || 0)// * this.sensitivity
      this.states.touchY.lastMove = ((event.targetTouches[0].pageY - this.previousTouch.pageY) || 0)// * this.sensitivity
      this.states.touchX.moved = true
      this.states.touchY.moved = true
      this.previousTouch = event.targetTouches[0]
    }
  }
}

/* export class Collidable extends TagComponent {}
export class Collider extends TagComponent {}
export class Recovering extends TagComponent {}
export class Moving extends TagComponent {}

export class PulsatingScale extends Component {}

PulsatingScale.schema = {
  offset: { type: Types.Number, default: 0 }
}

export class Object3D extends Component {}

Object3D.schema = {
  object: { type: Types.Ref }
}

export class Timeout extends Component {}

Timeout.schema = {
  timer: { type: Types.Number },
  addComponents: { type: Types.Array },
  removeComponents: { type: Types.Array }
}

export class PulsatingColor extends Component {}

PulsatingColor.schema = {
  offset: { type: Types.Number }
}

export class Colliding extends Component {}

Colliding.schema = {
  value: { type: Types.Boolean }
}

export class Rotating extends Component {}

Rotating.schema = {
  enabled: { type: Types.Boolean },
  rotatingSpeed: { type: Types.Number },
  decreasingSpeed: { type: Types.Number, default: 0.001 }
}
*/
