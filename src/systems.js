import { System, Not } from 'ecsy'
import * as UTILS from './utils'
import * as COMPONENTS from './components'
import { getClosestPointOnLineSegment } from './utils'
//import * as PIXI from './pixi'

Object.entries(COMPONENTS).forEach(([name, exported]) => window[name] = exported)

export class PlayerDrawSystem extends System {
  execute (delta, time) {
    this.queries.entities.results.forEach(entity => {
      const graphics = entity.getComponent(Container).container

      graphics.clear()
      graphics.beginFill(0xffffff)
      graphics.drawCircle(0, 0, 8)
      graphics.endFill()
    })
  }
}

PlayerDrawSystem.queries = {
  entities: {
    components: [Player, Container]
  }
}

export class CursorSystem extends System {
  execute (delta, time) {
    const input = this.queries.input.results[0].getComponent(InputState).states
    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer

    this.queries.entities.results.forEach(entity => {
      const graphics = entity.getMutableComponent(Container).container

      graphics.position.x += input.lookX / (parseInt(renderer.view.style.maxHeight) / 240)
      graphics.position.y += input.lookY / (parseInt(renderer.view.style.maxHeight) / 240)

      if (input.forward.held) {
        graphics.position.y -= 240 * delta
      }
      if (input.back.held) {
        graphics.position.y += 240 * delta
      }
      if (input.left.held) {
        graphics.position.x -= 240 * delta
      }
      if (input.right.held) {
        graphics.position.x += 240 * delta
      }

      graphics.position.x = UTILS.clamp(graphics.position.x, 0, renderer.width)
      graphics.position.y = UTILS.clamp(graphics.position.y, 0, renderer.height)

      graphics.clear()

      graphics.beginFill(0x000000)
      graphics.drawCircle(0, 0, 4)
      graphics.endFill()

      graphics.beginFill(0xffffff)
      graphics.drawCircle(0, 0, 3)
      graphics.endFill()

      // graphics.moveTo(4, 1)
      // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
      // graphics.lineTo(8, 1)
      //
      // graphics.moveTo(-4, 1)
      // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
      // graphics.lineTo(-8, 1)
      //
      // graphics.moveTo(1, 4)
      // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
      // graphics.lineTo(1, 8)
      //
      // graphics.moveTo(1, -4)
      // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
      // graphics.lineTo(1, -8)
      //
      //
      // graphics.moveTo(4, 0)
      // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
      // graphics.lineTo(8, 0)
      //
      // graphics.moveTo(-4, 0)
      // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
      // graphics.lineTo(-8, 0)
      //
      // graphics.moveTo(0, 4)
      // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
      // graphics.lineTo(0, 8)
      //
      // graphics.moveTo(0, -4)
      // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
      // graphics.lineTo(0, -8)
    })
  }
}

CursorSystem.queries = {
  entities: {
    components: [Cursor, Container]
  },
  input: {
    components: [InputState],
    mandatory: true
  },
  renderer: {
    components: [Renderer],
    mandatory: true
  }
}

// export class BackgroundFadeSystem extends System {
//   execute (delta, time) {
//     //onst color = UTILS.clamp((Math.sin(time * 2) + 1) / 2, 0, 1)
//     this.queries.entities.results.forEach(entity => {
//       //renderer.getComponent(Container).container.alpha = Math.max(0, background.getComponent(Container).container.alpha - 0.01)
//       const timer = entity.getMutableComponent(Timer)
//       timer.time += delta
//
//       if (timer.time >= timer.duration) {
//         timer.time = 0
//         timer.duration = UTILS.lerp(0.5, 1.5, Math.random())
//
//         entity.getMutableComponent(Renderer).renderer.backgroundColor = UTILS.rgbToHex(Math.random(), Math.random(), Math.random())
//       }
//     })
//   }
// }
//
// BackgroundFadeSystem.queries = {
//   entities: {
//     components: [Renderer, Timer]
//   }
// }

export class ContainerAddSystem extends System {
  execute (delta, time) {
    const mainStage = this.queries.mainStage.results[0].getComponent(Container).container

    this.queries.entities.added.forEach(entity => {
      const container = entity.getMutableComponent(Container).container

      if (container !== mainStage) {
        mainStage.addChild(container)
      }
    })
  }
}

ContainerAddSystem.queries = {
  entities: {
    components: [Container, Not(MainStage)],
    listen: {
      added: true
    }
  },
  mainStage: {
    components: [Container, MainStage],
    mandatory: true
  },
}

export class PlayerMovementSystem extends System {
  execute (delta) {
    const cursor = this.queries.cursor.results[0].getComponent(Container).container.position

    this.queries.entities.results.forEach(entity => {
      const container = entity.getMutableComponent(Container).container
      const velocity = entity.getMutableComponent(Player).velocity
      velocity.set(0, 0)

      if (entity.getComponent(Player).pectin <= 0) {
        // let closestX = 0
        // let closestY = 0
        //
        // let secondClosestX = 0
        // let secondClosestY = 0
        //
        // let closestCursorDistance = Infinity
        // let secondClosestDistance = Infinity
        //
        // this.queries.points.results.forEach(point => {
        //   const position = point.getComponent(LinePoint)
        //   const distance = UTILS.distanceBetweenPointsLong(cursor.x, cursor.y, position.x, position.y)
        //
        //   if (distance < closestCursorDistance) {
        //     secondClosestX = closestX
        //     secondClosestY = closestY
        //     closestX = position.x
        //     closestY = position.y
        //     secondClosestDistance = closestCursorDistance
        //     closestCursorDistance = distance
        //   } else if (distance < secondClosestDistance) {
        //     secondClosestX = position.x
        //     secondClosestY = position.y
        //     secondClosestDistance = distance
        //   }
        // })

        //const angle = Math.atan2(closestY - container.position.y, closestX - container.position.x)
        //const angle2 = Math.atan2(secondClosestY - container.position.y, secondClosestX - container.position.x)
        
        let closestCursorIndex = -1;
        let closestCursorDistance = Infinity;
        let closestPlayerIndex = -1;
        let closestPlayerDistance = Infinity;
        let index = 0;

        this.queries.points.results.forEach(point => {
          const cursorDistance = UTILS.distanceBetweenPointsLong(cursor.x, cursor.y, point.getComponent(LinePoint).x, point.getComponent(LinePoint).y)
          
          if (cursorDistance < closestCursorDistance) {
            closestCursorIndex = index
            closestCursorDistance = cursorDistance
          }

          const playerDistance = UTILS.distanceBetweenPointsLong(container.x, container.y, point.getComponent(LinePoint).x, point.getComponent(LinePoint).y)

          if (playerDistance < closestPlayerDistance) {
            closestPlayerIndex = index
            closestPlayerDistance = playerDistance
          }
          
          index++;
        })

        //const closestPoint = UTILS.getClosestPointOnLineSegment(secondClosestY, secondClosestY, closestX, closestY, cursor.x, cursor.y)
        const closestPoint = this.queries.points.results[closestCursorIndex].getComponent(LinePoint)
        
        // if (closestCursorIndex === this.queries.points.results.length - 1) {
        //   const angle = Math.atan2(closestPoint.y - container.position.y, closestPoint.x - container.position.x)
        //   velocity.set(Math.cos(angle), Math.sin(angle))
        // } else {
        //   const nextPoint = this.queries.points.results[closestCursorIndex + 1].getComponent(LinePoint)
        //   const angle = Math.atan2(nextPoint.y - closestPoint.y, nextPoint.x - closestPoint.x)
        //   velocity.set(Math.cos(angle), Math.sin(angle))
        // }
        
        if (closestCursorIndex + 1 > this.queries.points.results.length - 1 || closestCursorIndex - 1 < 0) {
          container.position.x = closestPoint.x
          container.position.y = closestPoint.y
        }
        else {
          const nextPoint = this.queries.points.results[closestCursorIndex + 1].getComponent(LinePoint)
          const nextDistance = UTILS.distanceBetweenPointsLong(cursor.x, cursor.y, nextPoint.x, nextPoint.y)
          const previousPoint = this.queries.points.results[closestCursorIndex - 1].getComponent(LinePoint)
          const previousDistance = UTILS.distanceBetweenPointsLong(cursor.x, cursor.y, previousPoint.x, previousPoint.y)
          
          const secondClosestPoint = previousDistance < nextDistance ? previousPoint : nextPoint

          const targetPoint = UTILS.getClosestPointOnLineSegment(secondClosestPoint.x, secondClosestPoint.y, closestPoint.x, closestPoint.y, cursor.x, cursor.y)

          container.position.x = targetPoint.x
          container.position.y = targetPoint.y
        }
      }
      
      cursor.subtract(container.position, velocity)

      if (velocity.magnitude() > entity.getComponent(Player).plopDistance) {
        velocity.normalize(velocity)
        velocity.multiplyScalar(entity.getComponent(Player).speed, velocity)
      } else {
        velocity.set(0, 0)
      }

      container.position.x += velocity.x * delta
      container.position.y += velocity.y * delta
    })
  }
}

PlayerMovementSystem.queries = {
  entities: {
    components: [Container, Player]
  },
  points: {
    components: [LinePoint]
  },
  cursor: {
    components: [Container, Cursor],
    mandatory: true
  }
}

export class LinePointSpawnerSystem extends System {
  execute (delta, time) {
    this.queries.entities.results.forEach(entity => {
      if (entity.getComponent(Player).pectin <= 0) {
        return
      }

      const lastPlop = entity.getMutableComponent(Player).lastPlop
      const container = entity.getComponent(Container).container

      if (UTILS.distanceBetweenPointsLong(lastPlop.x, lastPlop.y, container.position.x, container.position.y) > entity.getComponent(Player).plopDistance) {
        this.world.createEntity()
          .addComponent(LinePoint, {
            x: container.position.x,
            y: container.position.y
          })
        // .addComponent(Timer, {
        //   time: 0,
        //   duration: 2.0
        // })

        container.position.copyTo(lastPlop)

        entity.getMutableComponent(Player).pectin = UTILS.clamp(entity.getComponent(Player).pectin - 1, 0, entity.getComponent(Player).maxPectin)

        // entity.getMutableComponent(Player).lastPlop.copy(container.position)
        //
        // const line = entity.getMutableComponent(Line).line
        // const point = entity.getMutableComponent(Point).point
        //
        // line.clear()
        // line.lineStyle(1, 0xffffff, 1)
        // line.moveTo(lastPlop.x, lastPlop.y)
        // line.lineTo(container.position.x, container.position.y)
        //
        // point.position.copy(container.position)
      }

      // if (lastPlop) {
      //   const lastPlopContainer = lastPlop.getComponent(Container).container
      //   const lastPlopPosition = lastPlopContainer.position
      //   const lastPlopRenderer = lastPlop.getComponent(Renderer).renderer
      //
      //   const line = entity.getMutableComponent(Line).line
      //   const lineContainer = entity.getMutableComponent(Container).container
      //   const linePosition = lineContainer.position
      //
      //   const point = new PIXI.Graphics()
      //   point.beginFill(lastPlopRenderer.backgroundColor)
      //   point.drawCircle(0, 0, 5)
      //   point.endFill()
      //
      //   const pointContainer = new PIXI.Container()
      //   pointContainer.addChild(point)
      //   pointContainer.position.set(lastPlopPosition.x, lastPlopPosition.y)
      //
      //   line.add(pointContainer)
      //   lineContainer.addChild(pointContainer)
      // }
    })
  }
}

LinePointSpawnerSystem.queries = {
  entities: {
    components: [Player, Container]
  }
}

export class LinePointRendererSystem extends System {
  execute (delta, time) {
    const linePoints = []

    this.queries.points.results.forEach(entity => {
      // const timer = entity.getMutableComponent(Timer)
      // timer.time += delta
      //
      // if (timer.time >= timer.duration) {
      //   entity.remove()
      //   return
      // }

      const line = entity.getComponent(LinePoint)

      linePoints.push(
        line.x,
        line.y
      )
    })

    if (this.queries.player.results[0].getComponent(Player).pectin > 0) {
      const player = this.queries.player.results[0].getComponent(Container).container
      linePoints.push(
        player.position.x,
        player.position.y
      )
    }

    if (linePoints < 4) {
      return
    }

    const graphics = this.queries.renderer.results[0].getComponent(Container).container

    graphics.beginFill()
    graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
    for (let i = 0; i < linePoints.length - 2; i += 2) {
      graphics.moveTo(linePoints[i], linePoints[i + 1])
      graphics.lineTo(linePoints[i + 2], linePoints[i + 3])
    }
    graphics.endFill()
  }
}

LinePointRendererSystem.queries = {
  points: {
    components: [LinePoint]
  },
  player: {
    components: [Player, Container],
    mandatory: true
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class PectinBarRenderSystem extends System {
  execute (delta, time) {
    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer
    const graphics = this.queries.renderer.results[0].getComponent(Container).container

    this.queries.player.results.forEach(entity => {
      const player = entity.getComponent(Player)

      const width = (player.pectin / player.maxPectin) * (renderer.width / 2)

      if (width > 0) {
        graphics.beginFill(0xffffff)
        graphics.drawRect(
          renderer.width / 2,
          renderer.height - (renderer.height / 16),
          width,
          renderer.height / 16
        )
        graphics.drawRect(
          (renderer.width / 2) - width,
          renderer.height - (renderer.height / 16),
          width,
          renderer.height / 16
        )
        graphics.endFill()
      }
    })
  }
}

PectinBarRenderSystem.queries = {
  player: {
    components: [Player, Container]
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class ClearGraphicsSystem extends System {
  execute (delta, time) {
    this.queries.renderer.results[0].getComponent(Container).container.clear()
  }
}

ClearGraphicsSystem.queries = {
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class ResetInputAxesSystem extends System {
  execute () {
    this.queries.controls.results.forEach(entity => {
      const input = entity.getMutableComponent(InputState)

      Object.keys(input.actions).forEach(action => {
        const type = input.actions[action].type

        if (type === 'axis') {
          input.states[action] = 0
        }
      })
    })
  }
}

ResetInputAxesSystem.queries = {
  controls: {
    components: [InputState],
  }
}

export class KeyboardSystem extends System {
  execute () {
    this.queries.controls.added.forEach(entity => {
      const keyboard = entity.getComponent(KeyboardState)

      document.addEventListener('keydown', keyboard.onKeyDown)
      document.addEventListener('keyup', keyboard.onKeyUp)
    })

    this.queries.controls.results.forEach(entity => {
      // Update keyboard inputs
      const keyboard = entity.getMutableComponent(KeyboardState)

      Object.keys(keyboard.states).forEach(key => {
        if (!keyboard.states[key].checked) {
          keyboard.states[key].down = true
          keyboard.states[key].held = true
          keyboard.states[key].checked = true
        } else {
          keyboard.states[key].down = false
        }

        if (!keyboard.states[key].held) {
          delete keyboard.states[key]
          return
        }

        if (keyboard.states[key].up) {
          keyboard.states[key].held = false
        }
      })

      // Update input actions with keyboard poll
      const input = entity.getMutableComponent(InputState)

      Object.keys(keyboard.actionMapping).forEach(action => {
        if (!input.actions[action]) {
          console.error(`InputState is missing the '${action}' action`)
        }

        let pollDown = 0
        let pollHeld = 0
        let pollUp = 0

        for (let i = 0; i < keyboard.actionMapping[action].length; i++) {
          const key = keyboard.actionMapping[action][i]

          if (!keyboard.states[key]) {
            continue
          }

          pollDown += keyboard.states[key].down ? 1 : 0
          pollHeld += keyboard.states[key].held ? 1 : 0
          pollUp += keyboard.states[key].up ? 1 : 0
        }

        if (!input.states[action]) {
          input.states[action] = { down: false, held: false, up: false }
        }

        input.states[action].down = pollDown > 0
        input.states[action].held = pollHeld > 0
        input.states[action].up = pollUp > 0
      })
    })
  }
}

KeyboardSystem.queries = {
  controls: {
    components: [KeyboardState, InputState],
    listen: { added: true }
  }
}

export class MouseSystem extends System {
  execute () {
    this.queries.controls.added.forEach(entity => {
      const mouse = entity.getComponent(MouseState)

      document.addEventListener('mousemove', mouse.onMouseMove)
      document.addEventListener('mousedown', mouse.onMouseDown)
      document.addEventListener('mouseup', mouse.onMouseUp)
    })

    this.queries.controls.results.forEach(entity => {
      const mouse = entity.getMutableComponent(MouseState)

      Object.keys(mouse.states).forEach(button => {
        if (button === 'mouseX' || button === 'mouseY') {
          return
        }

        if (!mouse.states[button].checked) {
          mouse.states[button].down = true
          mouse.states[button].held = true
          mouse.states[button].checked = true
        } else {
          mouse.states[button].down = false
        }

        if (!mouse.states[button].held) {
          delete mouse.states[button]
          return
        }

        if (mouse.states[button].up) {
          mouse.states[button].held = false
        }
      })

      const input = entity.getMutableComponent(InputState)

      Object.keys(mouse.actionMapping).forEach(action => {
        if (!input.actions[action]) {
          console.error(`InputState is missing the '${action}' action`)
        }
        const type = input.actions[action].type

        if (type === 'button') {
          let pollDown = 0
          let pollHeld = 0
          let pollUp = 0

          for (let i = 0; i < mouse.actionMapping[action].length; i++) {
            const button = mouse.actionMapping[action][i]

            if (!mouse.states[button]) {
              continue
            }

            pollDown += mouse.states[button].down ? 1 : 0
            pollHeld += mouse.states[button].held ? 1 : 0
            pollUp += mouse.states[button].up ? 1 : 0
          }

          if (!input.states[action]) {
            input.states[action] = { down: false, held: false, up: false }
          }

          input.states[action].down = pollDown > 0
          input.states[action].held = pollHeld > 0
          input.states[action].up = pollUp > 0
        } else if (type === 'axis') {
          const axis = mouse.actionMapping[action][0] // Only one bind allowed for an axis right now, makes sense I guess

          if (mouse.states[axis].moved === false || document.pointerLockElement !== this.queries.renderers.results[0].getComponent(Renderer).renderer.view) {
            //input.states[action] = 0
            mouse.states[axis].lastMove = 0
            mouse.states[axis].moved = false
            return
          }

          if (input.states[action] === null) {
            input.states[action] = 0
          }

          // input.states[action] = 0 // Move this to a different input clearing system before this

          input.states[action] += mouse.states[axis].lastMove
          mouse.states[axis].moved = false
        }
      })
    })
  }
}

MouseSystem.queries = {
  controls: {
    components: [MouseState, InputState],
    listen: { added: true }
  },
  renderers: {
    components: [Renderer]
  }
}

export class TouchSystem extends System {
  execute () {
    this.queries.controls.added.forEach(entity => {
      const touch = entity.getComponent(TouchState)

      document.addEventListener('touchstart', touch.onTouchStart)
      document.addEventListener('touchend', touch.onTouchEnd)
      document.addEventListener('touchmove', touch.onTouchMove)
    })

    this.queries.controls.results.forEach(entity => {
      const touch = entity.getMutableComponent(TouchState)

      Object.keys(touch.states).forEach(button => {
        if (button === 'touchX' || button === 'touchY') {
          return
        }

        if (!touch.states[button].checked) {
          touch.states[button].down = true
          touch.states[button].held = true
          touch.states[button].checked = true
        } else {
          touch.states[button].down = false
        }

        if (!touch.states[button].held) {
          delete touch.states[button]
          return
        }

        if (touch.states[button].up) {
          touch.states[button].held = false
        }
      })

      const input = entity.getMutableComponent(InputState)

      Object.keys(touch.actionMapping).forEach(action => {
        if (!input.actions[action]) {
          console.error(`InputState is missing the '${action}' action`)
        }
        const type = input.actions[action].type

        if (type === 'button') {
          let pollDown = 0
          let pollHeld = 0
          let pollUp = 0

          for (let i = 0; i < touch.actionMapping[action].length; i++) {
            const button = touch.actionMapping[action][i]

            if (!touch.states[button]) {
              continue
            }

            pollDown += touch.states[button].down ? 1 : 0
            pollHeld += touch.states[button].held ? 1 : 0
            pollUp += touch.states[button].up ? 1 : 0
          }

          if (!input.states[action]) {
            input.states[action] = { down: false, held: false, up: false }
          }

          input.states[action].down = pollDown > 0
          input.states[action].held = pollHeld > 0
          input.states[action].up = pollUp > 0
        } else if (type === 'axis') {
          const axis = touch.actionMapping[action][0] // Only one bind allowed for an axis right now, makes sense I guess

          if (touch.states[axis].moved === false) {
            //input.states[action] = 0
            return
          }

          if (input.states[action] === null) {
            input.states[action] = 0
          }

          input.states[action] += touch.states[axis].lastMove
          touch.states[axis].moved = false
        }
      })
    })
  }
}

TouchSystem.queries = {
  controls: {
    components: [TouchState, InputState],
    listen: { added: true }
  }
}

// const minPolarAngle = 0
// const maxPolarAngle = Math.PI
//
// const euler = new THREE.Euler(0, 0, 0, 'YXZ')
//
// const PI_2 = Math.PI / 2
//
// export class MouseLookSystem extends System {
//   execute () {
//     const input = this.queries.input.results[0].getComponent(InputState).states
//
//     this.queries.entities.results.forEach(entity => {
//       const camera = entity.getComponent(Object3D).object
//
//       euler.setFromQuaternion(camera.quaternion)
//
//       euler.y -= input.lookX
//       euler.x -= input.lookY
//
//       // console.log(input.lookX + ', ' + input.lookY)
//
//       euler.x = Math.max(PI_2 - maxPolarAngle, Math.min(PI_2 - minPolarAngle, euler.x))
//
//       camera.quaternion.setFromEuler(euler)
//     })
//   }
// }
// MouseLookSystem.queries = {
//   entities: { components: [Object3D, Camera] },
//   input: { components: [InputState] }
// }

/*
this.getDirection = (function () {
  const direction = new Vector3(0, 0, -1)

  return function (v) {
    return v.copy(direction).applyQuaternion(camera.quaternion)
  }
}())

this.moveForward = function (distance) {
  // move forward parallel to the xz-plane
  // assumes camera.up is y-up

  vec.setFromMatrixColumn(camera.matrix, 0)

  vec.crossVectors(camera.up, vec)

  camera.position.addScaledVector(vec, distance)
}
*/

// const playerPosition = new PIXI.Point()
//
// export class CameraSystem extends System {
//   execute (delta) {
//     const player = this.queries.player.results[0].getComponent(Container).object
//     playerPosition.copyFrom(player.position)
//
//     this.queries.entities.results.forEach(entity => {
//       const camera = entity.getComponent(Container).object
//
//       playerPosition.add(new PIXI.Point(0, 1), camera.position)
//     })
//   }
// }
// CameraSystem.queries = {
//   entities: { components: [Container, Camera] },
//   player: { components: [Container, Player] }
// }

/* import * as THREE from 'three'

export class RotatingSystem extends System {
  execute (delta) {
    const entities = this.queries.entities.results
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
      const rotatingSpeed = entity.getComponent(Rotating).rotatingSpeed
      const object = entity.getComponent(Object3D).object

      object.rotation.x += rotatingSpeed * delta
      object.rotation.y += rotatingSpeed * delta * 2
      object.rotation.z += rotatingSpeed * delta * 3
    }
  }
}

RotatingSystem.queries = {
  entities: { components: [Rotating, Object3D] }
}

const TIMER_TIME = 1

export class PulsatingColorSystem extends System {
  execute (delta, time) {
    time *= 1000
    const entities = this.queries.entities.results
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
      const object = entity.getComponent(Object3D).object
      if (entity.hasComponent(Colliding)) {
        object.material.color.setRGB(1, 1, 0)
      } else if (entity.hasComponent(Recovering)) {
        const col = 0.3 + entity.getComponent(Timeout).timer / TIMER_TIME
        object.material.color.setRGB(col, col, 0)
      } else {
        const r =
          Math.sin(
            time / 500 + entity.getComponent(PulsatingColor).offset * 12
          ) /
            2 +
          0.5
        object.material.color.setRGB(r, 0, 0)
      }
    }
  }
}

PulsatingColorSystem.queries = {
  entities: { components: [PulsatingColor, Object3D] }
}

export class PulsatingScaleSystem extends System {
  execute (delta, time) {
    const entities = this.queries.entities.results
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
      const object = entity.getComponent(Object3D).object

      let mul
      if (entity.hasComponent(Colliding)) {
        mul = 2
      } else if (entity.hasComponent(Recovering)) {
        mul = 1.2
      } else {
        mul = 0.8
      }

      const offset = entity.getComponent(PulsatingScale).offset
      const sca = mul * (Math.cos(time + offset) / 2 + 1) + 0.2
      object.scale.set(sca, sca, sca)
    }
  }
}

PulsatingScaleSystem.queries = {
  entities: { components: [PulsatingScale] }
}

export class MovingSystem extends System {
  execute (delta, time) {
    const entities = this.queries.entities.results
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
      const object = entity.getComponent(Object3D).object
      const offset = entity.getComponent(Moving).offset
      const radius = 5
      const maxRadius = 5
      object.position.z = Math.cos(time + 3 * offset) * maxRadius + radius
    }
  }
}

MovingSystem.queries = {
  entities: { components: [Moving] }
}

export class TimeoutSystem extends System {
  execute (delta) {
    const entities = this.queries.entities.results
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]

      const timeout = entity.getMutableComponent(Timeout)
      timeout.timer -= delta
      if (timeout.timer < 0) {
        timeout.timer = 0
        timeout.addComponents.forEach(componentName => {
          entity.addComponent(componentName)
        })
        timeout.removeComponents.forEach(componentName => {
          entity.removeComponent(componentName)
        })

        entity.removeComponent(Timeout)
      }
    }
  }
}

TimeoutSystem.queries = {
  entities: { components: [Timeout] }
}

const ballWorldPos = new THREE.Vector3()

export class ColliderSystem extends System {
  execute () {
    const boxes = this.queries.boxes.results
    const balls = this.queries.balls.results
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i]
      const ballObject = ball.getComponent(Object3D).object
      ballObject.getWorldPosition(ballWorldPos)
      if (!ballObject.geometry.boundingSphere) {
        ballObject.geometry.computeBoundingSphere()
      }
      const radiusBall = ballObject.geometry.boundingSphere.radius

      for (let j = 0; j < boxes.length; j++) {
        const box = boxes[j]
        const boxObject = box.getComponent(Object3D).object
        const prevColliding = box.hasComponent(Colliding)
        if (!boxObject.geometry.boundingSphere) {
          boxObject.geometry.computeBoundingSphere()
        }
        const radiusBox = boxObject.geometry.boundingSphere.radius
        const radiusSum = radiusBox + radiusBall

        if (
          boxObject.position.distanceToSquared(ballWorldPos) <=
          radiusSum * radiusSum
        ) {
          if (!prevColliding) {
            box.addComponent(Colliding)
          }
        } else {
          if (prevColliding) {
            box.removeComponent(Colliding)
            box.addComponent(Recovering)
            box.addComponent(Timeout, {
              timer: TIMER_TIME,
              removeComponents: [Recovering]
            })
          }
        }
      }
    }
  }
}

ColliderSystem.queries = {
  boxes: { components: [Collidable] },
  balls: { components: [Collider] }
}
*/
