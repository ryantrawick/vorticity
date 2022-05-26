import { System, Not } from 'ecsy'
import * as UTILS from './utils'
import * as COMPONENTS from './components'
//import * as PIXI from './pixi'
import { nanoid } from 'nanoid'
import { DoubleSided, ReflectLine } from './components'
//import * as HERSHEY from './hershey'

Object.entries(COMPONENTS).forEach(([name, exported]) => window[name] = exported)

// export class RenderTextSystem extends System {
//   execute (delta, time) {
//     const graphics = this.queries.renderer.results[0].getComponent(Container).container
//
//     this.queries.entities.results.forEach(entity => {
//       const text = entity.getComponent(Text)
//
//       graphics.beginFill(0xffffff, 0)
//       graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
//       HERSHEY.FONT_HERSHEY.putText(text.text, { graphics: graphics, x: text.x, y: text.y, scale: text.scale, align: 'center' })
//       graphics.endFill()
//     })
//   }
// }
//
// RenderTextSystem.queries = {
//   entities: {
//     components: [Text]
//   },
//   renderer: {
//     components: [Renderer, Container],
//     mandatory: true
//   }
// }

export class SmokeSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container

    this.queries.entities.results.forEach(entity => {
      const timer = entity.getMutableComponent(Timer)
      timer.time += delta

      if (timer.time > timer.duration) {
        entity.remove()
        return
      }

      const smoke = entity.getMutableComponent(Smoke)

      // do verlet integration on smoke.vx and smoke.vy
      smoke.vx += smoke.acceleration * delta
      smoke.vy += smoke.acceleration * delta
      smoke.x += (smoke.vx + Math.sin(time * 4)) * delta
      smoke.y += (smoke.vy + Math.cos(time * 4)) * delta

      // smoke.x += smoke.vx
      // smoke.y += smoke.vy
      // smoke.vx *= smoke.friction
      // smoke.vy *= smoke.friction

      const size = UTILS.lerp(smoke.scale, 0.02, UTILS.easeOutQuint(timer.time / timer.duration))

      if (size > 1) {
        graphics.beginFill(0xffffff, 1)
        graphics.drawCircle(smoke.x, smoke.y, size)
        graphics.endFill()
      }
    })
  }
}

SmokeSystem.queries = {
  entities: {
    components: [Smoke, Timer],
    mandatory: true
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class PlayerDrawSystem extends System {
  execute (delta, time) {
    this.queries.entities.results.forEach(entity => {
      const graphics = entity.getComponent(Container).container
      const player = entity.getMutableComponent(Player)

      // if (player.isDead) {
      //   graphics.alpha = easeOutQuint(player.deathTimer, 0, 1, player.deathDuration)
      // } else {
      //   graphics.alpha = 1
      // }
      graphics.clear()
      if (player.pectin > 0) {
        graphics.beginFill(0xffffff, 0)
        graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
        graphics.drawCircle(0, 0, 8)
        graphics.endFill()

        graphics.beginFill(0xffffff, 1)
        graphics.drawCircle(0, 0, UTILS.lerp(8, 0, player.pectin / player.maxPectin))
        graphics.endFill()
      } else {
        graphics.beginFill((entity.hasComponent(GameOver) ? 0x000000 : 0xffffff), 1)
        graphics.lineStyle(1, (entity.hasComponent(GameOver) ? 0x000000 : 0xffffff), 1, 0.5, true)
        // graphics.moveTo(0, 0)
        // graphics.lineTo(7, -5)
        // graphics.moveTo(7, -5)
        // graphics.lineTo(0, 14)
        // graphics.moveTo(0, 14)
        // graphics.lineTo(-7, -5)
        // graphics.moveTo(-7, -5)
        // graphics.lineTo(0, 0)
        if (!entity.hasComponent(DoubleSided)) {
          graphics.moveTo(0 - 2, 0)
          graphics.lineTo(-5 - 2, 7)
          graphics.moveTo(-5 - 2, 7)
          graphics.lineTo(14 - 2, 0)
          graphics.moveTo(14 - 2, 0)
          graphics.lineTo(-5 - 2, -7)
          graphics.moveTo(-5 - 2, -7)
          graphics.lineTo(0 - 2, 0)
        } else {
          graphics.moveTo(0, 6)
          graphics.lineTo(14, 0)
          graphics.moveTo(14, 0)
          graphics.lineTo(0, -6)
          graphics.moveTo(0, -6)
          graphics.lineTo(-14, 0)
          graphics.moveTo(-14, 0)
          graphics.lineTo(0, 6)
        }
        graphics.drawCircle(0, 0, player.radius)
        graphics.endFill()
      }
    })
  }
}

PlayerDrawSystem.queries = {
  entities: {
    components: [Player, Container],
    mandatory: true
  }
}

// export class CursorSystem extends System {
//   execute (delta, time) {
//     const input = this.queries.input.results[0].getComponent(InputState).states
//     const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer
//
//     this.queries.entities.results.forEach(entity => {
//       const graphics = entity.getMutableComponent(Container).container
//
//       graphics.position.x += input.lookX / (parseInt(renderer.view.style.maxHeight) / 240)
//       graphics.position.y += input.lookY / (parseInt(renderer.view.style.maxHeight) / 240)
//
//       if (input.forward.held) {
//         graphics.position.y -= 240 * delta
//       }
//       if (input.back.held) {
//         graphics.position.y += 240 * delta
//       }
//       if (input.left.held) {
//         graphics.position.x -= 240 * delta
//       }
//       if (input.right.held) {
//         graphics.position.x += 240 * delta
//       }
//
//       graphics.position.x = UTILS.clamp(graphics.position.x, 0, renderer.width)
//       graphics.position.y = UTILS.clamp(graphics.position.y, 0, renderer.height)
//
//       graphics.clear()
//
//       graphics.beginFill(0x000000)
//       graphics.drawCircle(0, 0, 4)
//       graphics.endFill()
//
//       graphics.beginFill(0xffffff)
//       graphics.drawCircle(0, 0, 3)
//       graphics.endFill()
//
//       // graphics.moveTo(4, 1)
//       // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
//       // graphics.lineTo(8, 1)
//       //
//       // graphics.moveTo(-4, 1)
//       // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
//       // graphics.lineTo(-8, 1)
//       //
//       // graphics.moveTo(1, 4)
//       // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
//       // graphics.lineTo(1, 8)
//       //
//       // graphics.moveTo(1, -4)
//       // graphics.lineStyle(1, 0x000000, 1, 0.5, true)
//       // graphics.lineTo(1, -8)
//       //
//       //
//       // graphics.moveTo(4, 0)
//       // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
//       // graphics.lineTo(8, 0)
//       //
//       // graphics.moveTo(-4, 0)
//       // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
//       // graphics.lineTo(-8, 0)
//       //
//       // graphics.moveTo(0, 4)
//       // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
//       // graphics.lineTo(0, 8)
//       //
//       // graphics.moveTo(0, -4)
//       // graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
//       // graphics.lineTo(0, -8)
//     })
//   }
// }
//
// CursorSystem.queries = {
//   entities: {
//     components: [Cursor, Container]
//   },
//   input: {
//     components: [InputState],
//     mandatory: true
//   },
//   renderer: {
//     components: [Renderer],
//     mandatory: true
//   }
// }

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
    //const cursor = this.queries.cursor.results[0].getComponent(Container).container.position
    const input = this.queries.input.results[0].getComponent(InputState).states
    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer

    this.queries.entities.results.forEach(entity => {
      const container = entity.getMutableComponent(Container).container
      const velocity = entity.getMutableComponent(Player).velocity
      velocity.set(0, 0)

      velocity.x += input.lookX / (parseInt(renderer.view.style.maxHeight) / 240)
      velocity.y += input.lookY / (parseInt(renderer.view.style.maxHeight) / 240)

      if (input.forward.held) {
        velocity.y -= 240 * delta
      }
      if (input.back.held) {
        velocity.y += 240 * delta
      }
      if (input.left.held) {
        velocity.x -= 240 * delta
      }
      if (input.right.held) {
        velocity.x += 240 * delta
      }

      if (entity.getComponent(Player).pectin <= 0) {
        const tempVx = container.position.x + velocity.x
        const tempVy = container.position.y + velocity.y

        let player = entity.getMutableComponent(Player)

        if (player.currentLineIndex === -1) { // Setting default
          player.currentLineIndex = this.queries.points.results.length - 1
        }

        let currentPointIndex = player.currentLineIndex
        let nextPointIndex = -1
        let previousPointIndex = -1

        if (currentPointIndex + 1 > this.queries.points.results.length - 1 || currentPointIndex - 1 < 0) {
          nextPointIndex = Math.min(Math.max(currentPointIndex - 1, 1), Math.min(this.queries.points.results.length - 1, currentPointIndex + 1))
          if (nextPointIndex === 1) {
            previousPointIndex = 0
            currentPointIndex = 1
            nextPointIndex = 2
          } else if (nextPointIndex === this.queries.points.results.length - 2) {
            previousPointIndex = this.queries.points.results.length - 3
            currentPointIndex = this.queries.points.results.length - 2
            nextPointIndex = this.queries.points.results.length - 1
          }
        } else {
          nextPointIndex = currentPointIndex + 1
          previousPointIndex = currentPointIndex - 1
        }

        const currentPoint = this.queries.points.results[currentPointIndex].getComponent(LinePoint)
        const nextPoint = this.queries.points.results[nextPointIndex].getComponent(LinePoint)
        const previousPoint = this.queries.points.results[previousPointIndex].getComponent(LinePoint)

        const pointOnFirstSegment = UTILS.getClosestPointOnLineSegment(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y, tempVx, tempVy)
        const pointOnSecondSegment = UTILS.getClosestPointOnLineSegment(previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y, tempVx, tempVy)

        const distanceToFirstSegment = UTILS.distanceBetweenPointsLong(pointOnFirstSegment.x, pointOnFirstSegment.y, tempVx, tempVy)
        const distanceToSecondSegment = UTILS.distanceBetweenPointsLong(pointOnSecondSegment.x, pointOnSecondSegment.y, tempVx, tempVy)

        const finalPoint = distanceToSecondSegment < distanceToFirstSegment ? pointOnSecondSegment : pointOnFirstSegment

        // const graphics = this.queries.renderer.results[0].getComponent(Container).container
        // graphics.beginFill(0xff0000)
        // graphics.drawCircle(currentPoint.x, currentPoint.y, 5)
        // graphics.endFill()
        // graphics.beginFill(0x00ff00)
        // graphics.drawCircle(nextPoint.x, nextPoint.y, 5)
        // graphics.endFill()
        // graphics.beginFill(0x0000ff)
        // graphics.drawCircle(previousPoint.x, previousPoint.y, 5)
        // graphics.endFill()

        if (player.directionX === -1) {
          player.directionX = container.position.x
          player.directionY = container.position.y
        }

        //const differenceX = finalPoint.x - container.position.x
        //const differenceY = finalPoint.y - container.position.y
        container.position.x = finalPoint.x
        container.position.y = finalPoint.y

        const playerDistanceToNextPoint = UTILS.distanceBetweenPointsLong(container.position.x, container.position.y, nextPoint.x, nextPoint.y)
        const playerDistanceToPreviousPoint = UTILS.distanceBetweenPointsLong(container.position.x, container.position.y, previousPoint.x, previousPoint.y)
        const playerDistanceToCurrentPoint = UTILS.distanceBetweenPointsLong(container.position.x, container.position.y, currentPoint.x, currentPoint.y)

        // if (playerDistanceToPreviousPoint < playerDistanceToCurrentPoint) { //  && playerDistanceToPreviousPoint < playerDistanceToNextPoint
        //   player.currentLineIndex--
        // }
        // if (playerDistanceToNextPoint < playerDistanceToCurrentPoint) { // && playerDistanceToNextPoint < playerDistanceToPreviousPoint
        //   player.currentLineIndex++
        // }
        if (finalPoint === pointOnFirstSegment && playerDistanceToNextPoint < playerDistanceToCurrentPoint) {
          player.currentLineIndex++
        } else if (finalPoint === pointOnSecondSegment && playerDistanceToPreviousPoint < playerDistanceToCurrentPoint) {
          player.currentLineIndex--
        }

        player.currentLineIndex = UTILS.clamp(player.currentLineIndex, 1, this.queries.points.results.length - 2)

        let normal

        if (finalPoint === pointOnFirstSegment) {
          normal = UTILS.rotateLine90Degrees(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y)
        } else {
          normal = UTILS.rotateLine90Degrees(previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y)
        }

        let normalAngle = Math.atan2(normal.y, normal.x)

        if (!input.attack.held) {
          const differenceX = UTILS.lerp(
            container.position.x - (Math.cos(normalAngle) * 4),
            container.position.x + (Math.cos(normalAngle) * 4),
            player.directionLerpX
          ) - player.directionX
          const differenceY = UTILS.lerp(
            container.position.y - (Math.sin(normalAngle) * 4),
            container.position.y + (Math.sin(normalAngle) * 4),
            player.directionLerpY
          ) - player.directionY
          player.directionX += differenceX + velocity.x //(velocity.x * Math.abs(normal.x / 2))
          player.directionY += differenceY + velocity.y //(velocity.y * Math.abs(normal.y / 2))

          const directionPointOnRotatedLine = UTILS.getClosestPointOnLineSegmentLong(
            container.position.x - (Math.cos(normalAngle) * 4), container.position.y - (Math.sin(normalAngle) * 4),
            container.position.x + (Math.cos(normalAngle) * 4), container.position.y + (Math.sin(normalAngle) * 4),
            player.directionX, player.directionY
          )

          player.directionLerpX = UTILS.inverseLerp(
            container.position.x - (Math.cos(normalAngle) * 4),
            container.position.x + (Math.cos(normalAngle) * 4),
            directionPointOnRotatedLine.x
          )

          player.directionLerpY = UTILS.inverseLerp(
            container.position.y - (Math.sin(normalAngle) * 4),
            container.position.y + (Math.sin(normalAngle) * 4),
            directionPointOnRotatedLine.y
          )

          player.directionX = directionPointOnRotatedLine.x
          player.directionY = directionPointOnRotatedLine.y
        } else {
          player.directionX = UTILS.lerp(
            container.position.x - (Math.cos(normalAngle) * 4),
            container.position.x + (Math.cos(normalAngle) * 4),
            player.directionLerpX
          )
          player.directionY = UTILS.lerp(
            container.position.y - (Math.sin(normalAngle) * 4),
            container.position.y + (Math.sin(normalAngle) * 4),
            player.directionLerpY
          )
        }

        let sideOfLine

        if (finalPoint === pointOnFirstSegment) {
          sideOfLine = UTILS.getSideOfLine(
            currentPoint.x, currentPoint.y,
            nextPoint.x, nextPoint.y,
            player.directionX, player.directionY
          )
        } else {
          sideOfLine = UTILS.getSideOfLine(
            previousPoint.x, previousPoint.y,
            currentPoint.x, currentPoint.y,
            player.directionX, player.directionY
          )
        }

        container.rotation = Math.atan2(normal.y * sideOfLine, normal.x * sideOfLine)

        // const graphics = this.queries.renderer.results[0].getComponent(Container).container
        // graphics.beginFill(0x00ff00)
        // graphics.lineStyle(1, 0x0000ff, 1, 0.5, true)
        // //graphics.moveTo(container.position.x, container.position.y)
        // //graphics.lineTo(container.position.x + (Math.cos(container.rotation) * 8), container.position.y + (Math.sin(container.rotation) * 8))
        // graphics.moveTo(container.position.x, container.position.y)
        // graphics.lineTo(container.position.x + (Math.cos(normalAngle) * 8), container.position.y + (Math.sin(normalAngle) * 8))
        // graphics.lineStyle(1, 0xff0000, 1, 0.5, true)
        // graphics.moveTo(container.position.x - (Math.cos(container.rotation) * 4), container.position.y - (Math.sin(container.rotation) * 4))
        // graphics.lineTo(container.position.x + (Math.cos(container.rotation) * 4), container.position.y + (Math.sin(container.rotation) * 4))
        // graphics.lineStyle(1, 0xff0000, 0, 0.5, true)
        // graphics.drawCircle(player.directionX, player.directionY, 2)
        // graphics.endFill()
      } else {
        container.position.x += velocity.x
        container.position.y += velocity.y
        const padding = renderer.width / 16
        container.position.x = UTILS.clamp(container.position.x, padding, renderer.width - padding)
        container.position.y = UTILS.clamp(container.position.y, padding, renderer.height - padding)
      }
    })
  }
}

PlayerMovementSystem.queries = {
  entities: {
    components: [Container, Player, Not(GameOver)]
  },
  points: {
    components: [LinePoint, Not(Removing)]
  },
  // cursor: {
  //   components: [Container, Cursor],
  //   mandatory: true
  // },
  input: {
    components: [InputState],
    mandatory: true
  },
  renderer: {
    components: [Renderer, Container],
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
            y: container.position.y,
            angle: (Math.random() * 360) * (Math.PI / 180),
            speed: Math.random() * 50
          })

        container.position.copyTo(lastPlop)

        entity.getMutableComponent(Player).pectin = UTILS.clamp(entity.getComponent(Player).pectin - 1, 0, entity.getComponent(Player).maxPectin)
      }
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

      const line = entity.getMutableComponent(LinePoint)

      line.x += (line.speed / 20) * Math.cos(line.angle + time) * delta
      line.y += (line.speed / 20) * Math.sin(line.angle + time) * delta

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
    components: [LinePoint, Not(Removing)]
  },
  player: {
    components: [Player, Container, Not(GameOver)],
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
      const player = entity.getMutableComponent(Player)
      const playerContainer = entity.getComponent(Container).container

      if (player.pectin === 0) {
        player.pectin--
        const smokeAmount = Math.round(UTILS.lerp(3, 7, Math.random()))

        for (let j = 0; j < smokeAmount; j++) {
          this.world.createEntity()
            .addComponent(Smoke, {
              x: playerContainer.position.x + (Math.random() * 16) - 8,
              y: playerContainer.position.y + (Math.random() * 16) - 8,
              vx: (Math.random() * 2 - 1) * (Math.random() * 12),
              vy: (Math.random() * 2 - 1) * (Math.random() * 12),
              scale: UTILS.lerp(4, 7, Math.random()),
            })
            .addComponent(Timer, {
              duration: UTILS.lerp(2.5, 4.5, Math.random()),
              time: 0
            })
        }
      }

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

export class UpgradeBarSystem extends System {
  execute (delta, time) {
    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer
    const graphics = this.queries.renderer.results[0].getComponent(Container).container

    this.queries.player.results.forEach(entity => {
      const player = entity.getMutableComponent(Player)
      const playerContainer = entity.getComponent(Container).container

      if (player.upgradeProgress >= player.maxUpgradeProgress) {
        player.upgradeProgress = 0
        player.maxUpgradeProgress += UTILS.clamp(Math.round(player.maxUpgradeProgress / 2), 1, 7)

        let upgraded = false

        while (!upgraded) {
          const diceRoll = Math.round(Math.random() * 3)

          if (diceRoll === 0) {
            if (!entity.hasComponent(TriShot)) {
              entity.addComponent(TriShot)
              if (entity.hasComponent(DoubleSided)) { //&& player.rounds < 10) {
                entity.removeComponent(DoubleSided)
              }
              if (entity.hasComponent(ReflectLine)) {
                entity.removeComponent(ReflectLine)
              }
              upgraded = true
            }
          } else if (diceRoll === 1) {
            if (!entity.hasComponent(ReflectLine)) {
              entity.addComponent(ReflectLine)
              if (entity.hasComponent(TriShot)) { // && player.rounds < 10) {
                entity.removeComponent(TriShot)
              }
              if (entity.hasComponent(DoubleSided)) {
                entity.removeComponent(DoubleSided)
              }
              upgraded = true
              // if (player.rounds >= 14) {
              //   entity.addComponent(ReflectLine)
              //   upgraded = true
              // } else if ((!entity.hasComponent(TriShot) || !entity.hasComponent(DoubleSided))) {
              //   entity.addComponent(DoubleSided)
              //   upgraded = true
              // }
            }
          } else if (diceRoll === 2) {
            if (!entity.hasComponent(DoubleSided)) {
              entity.addComponent(DoubleSided)
              if (entity.hasComponent(TriShot)) { // && player.rounds < 10) {
                entity.removeComponent(TriShot)
              }
              if (entity.hasComponent(ReflectLine)) {
                entity.removeComponent(ReflectLine)
              }
              upgraded = true
            }
          } else if (diceRoll === 3) {
            player.maxPectin = UTILS.clamp(player.maxPectin * 1.2, 25, 50)
            upgraded = true
          }
        }

        const width = (renderer.width / 2) - 6
        graphics.beginFill(0xffffff)
        graphics.drawRect(
          renderer.width / 2,
          2,
          width,
          (renderer.height / 16) - 4
        )
        graphics.drawRect(
          (renderer.width / 2) - width,
          2,
          width,
          (renderer.height / 16) - 4
        )
        graphics.endFill()

        const smokeAmount = Math.round(UTILS.lerp(3, 7, Math.random()))

        for (let j = 0; j < smokeAmount; j++) {
          this.world.createEntity()
            .addComponent(Smoke, {
              x: playerContainer.position.x + (Math.random() * 16) - 8,
              y: playerContainer.position.y + (Math.random() * 16) - 8,
              vx: (Math.random() * 2 - 1) * (Math.random() * 12),
              vy: (Math.random() * 2 - 1) * (Math.random() * 12),
              scale: UTILS.lerp(8, 12, Math.random()),
            })
            .addComponent(Timer, {
              duration: UTILS.lerp(4.5, 6.5, Math.random()),
              time: 0
            })
        }

        return
      }

      const width = UTILS.lerp(0, (renderer.width / 2) - 6, UTILS.inverseLerp(0, player.maxUpgradeProgress, player.upgradeProgress))//(player.pectin / player.maxPectin) * (renderer.width / 2)

      if (width > 0) {
        graphics.beginFill(0x0000ff, 0.5)
        graphics.drawRect(
          renderer.width / 2,
          4,
          width,
          (renderer.height / 16) - 8
        )
        graphics.drawRect(
          (renderer.width / 2) - width,
          4,
          width,
          (renderer.height / 16) - 8
        )
        graphics.endFill()
      }

      graphics.beginFill(0xffffff, 0)
      graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
      graphics.moveTo(5, 4)
      graphics.lineTo(5, (renderer.height / 16) - 4)
      graphics.moveTo(renderer.width - 5, 4)
      graphics.lineTo(renderer.width - 5, (renderer.height / 16) - 4)
      graphics.endFill()
    })
  }
}

UpgradeBarSystem.queries = {
  player: {
    components: [Player, Container]
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class SpawnShootersSystem extends System {
  execute (delta, time) {
    if (this.queries.shooters.results.length > 0) {
      return
    }

    const player = this.queries.player.results[0].getComponent(Player)
    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer

    if (player.pectin < ((player.maxPectin / 3) * 2)) {
      // TODO: Make this number by pectin times emptied
      for (let i = Math.ceil(Math.random() * (player.rounds < 9 ? 6 : 9)); i > 0; i--) {
        const padding = renderer.width / 16

        let randomPositionX
        let randomPositionY

        let iterations = 0
        while (iterations < 20) {
          randomPositionX = Math.round(UTILS.lerp(renderer.width - padding, padding, Math.random()))
          randomPositionY = Math.round(UTILS.lerp(renderer.height - padding, padding, Math.random()))
          let finished = false
          for (let j = 0; j < this.queries.points.results.length; j++) {
            const pointPosition = this.queries.points.results[j].getComponent(LinePoint)
            //if (Math.abs(randomPositionX - pointPosition.x) < 24 && Math.abs(randomPositionY - pointPosition.y) < 24) {
            if (UTILS.distanceBetweenPointsLong(randomPositionX, randomPositionY, pointPosition.x, pointPosition.y) < 24) {
              break
            }
            if (j === this.queries.points.results.length - 1) {
              finished = true
            }
          }
          if (finished) {
            break
          }
          iterations++
        }

        if (iterations === 20) {
          continue
        }

        const enemyType = Math.round(UTILS.lerp(0, UTILS.clamp(player.rounds, 0, 2.45), Math.random()))

        if (enemyType === 0) {
          this.world.createEntity()
            .addComponent(Shooter, {
              x: randomPositionX,
              y: randomPositionY,
              color: parseInt('0x' + UTILS.rgbToHex(255, 0, 0)),
              radius: 6,
              bulletCount: 6,
              bulletSpeed: 48, // 128
              bulletRadius: 3,
              bulletLife: 3,
              id: nanoid(),
              angle: Math.PI / 2,
              type: enemyType
            })
            .addComponent(Timer, {
              duration: 1.5,
              time: 0
            })
        } else if (enemyType === 1) {
          this.world.createEntity()
            .addComponent(Shooter, {
              x: randomPositionX,
              y: randomPositionY,
              color: parseInt('0x' + UTILS.rgbToHex(255, 255, 0)),
              radius: 5,
              bulletCount: 4,
              bulletSpeed: 32, // 128
              bulletRadius: 2,
              bulletLife: 3.5,
              id: nanoid(),
              health: 3,
              type: enemyType,
              cooldown: 1.2,
              maxTimesShot: 4
            })
            .addComponent(Timer, {
              duration: 0.2,
              time: 0,
              cooldown: 1,
            })
            .addComponent(Rotator, {
              speed: -(((Math.PI / 2) / 2) - (Math.PI / 3))
            })
        } else if (enemyType === 2) {
          this.world.createEntity()
            .addComponent(Shooter, {
              x: randomPositionX,
              y: randomPositionY,
              color: parseInt('0x' + UTILS.rgbToHex(0, 0, 255)),
              radius: 5,
              bulletCount: 2,
              bulletSpeed: 52, // 128
              bulletRadius: 3,
              bulletLife: 4,
              id: nanoid(),
            })
            .addComponent(Timer, {
              duration: 0.8,
              time: 0,
              cooldown: 0.8
            })
            .addComponent(Rotator, {
              speed: ((Math.PI / 2) / 2)
            })
        }

        const smokeAmount = Math.round(UTILS.lerp(3, 7, Math.random()))

        for (let j = 0; j < smokeAmount; j++) {
          this.world.createEntity()
            .addComponent(Smoke, {
              x: randomPositionX + (Math.random() * 16) - 8,
              y: randomPositionY + (Math.random() * 16) - 8,
              vx: (Math.random() * 2 - 1) * (Math.random() * 12),
              vy: (Math.random() * 2 - 1) * (Math.random() * 12),
              scale: UTILS.lerp(4, 7, Math.random()),
            })
            .addComponent(Timer, {
              duration: UTILS.lerp(2.5, 4.5, Math.random()),
              time: 0
            })
        }
      }
    }
  }
}

SpawnShootersSystem.queries = {
  shooters: {
    components: [Shooter, Timer]
  },
  player: {
    components: [Player, Container],
    mandatory: true
  },
  renderer: {
    components: [Renderer],
    mandatory: true
  },
  points: {
    components: [LinePoint, Not(Removing)]
  }
}

export class UpdateShootersSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const player = this.queries.player.results[0].getComponent(Player)

    this.queries.shooters.results.forEach(entity => {
      const shooter = entity.getMutableComponent(Shooter)

      if (player.pectin <= 0) {
        const timer = entity.getMutableComponent(Timer)
        if (timer.cooldown <= 0) {
          timer.time += delta
        } else {
          timer.cooldown -= delta
        }

        if (entity.hasComponent(Rotator)) {
          const rotator = entity.getComponent(Rotator)
          shooter.angle += rotator.speed * delta
        }

        if (timer.time > timer.duration) {
          timer.time = 0

          for (let i = 0; i < shooter.bulletCount; i++) {
            const angle = ((i / shooter.bulletCount) * Math.PI * 2) + shooter.angle // Math.random()
            const x = shooter.x + (Math.cos(angle) * shooter.radius)
            const y = shooter.y + (Math.sin(angle) * shooter.radius)

            this.world.createEntity()
              .addComponent(Bullet, {
                x: x,
                y: y,
                angle: angle,
                color: shooter.color,
                radius: shooter.bulletRadius,
                speed: shooter.bulletSpeed,
                parent: shooter.id,
              })
              .addComponent(Timer, {
                duration: shooter.bulletLife,
              })
              .addComponent(Rotator, {
                speed: entity.hasComponent(Rotator) ? entity.getComponent(Rotator).speed : 0
              })
          }

          if (shooter.maxTimesShot > 0) {
            shooter.timesShot++

            if (shooter.timesShot >= shooter.maxTimesShot) {
              timer.cooldown = shooter.cooldown
              shooter.timesShot = 0
            }
          }
        }
      }

      const timer = entity.getComponent(Timer)

      graphics.beginFill(shooter.color)
      graphics.lineStyle(1, 0x000000, 0, 0.5, true)
      graphics.drawCircle(shooter.x, shooter.y, UTILS.lerp(0, shooter.radius, timer.time / timer.duration))
      graphics.endFill()

      graphics.beginFill(0x000000, 0)
      graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
      graphics.drawCircle(shooter.x, shooter.y, shooter.radius)
      for (let i = 0; i < shooter.bulletCount; i++) {
        //const angle = ((i / shooter.bulletCount) + 0.25) * Math.PI * 2
        const angle = ((i / shooter.bulletCount) * Math.PI * 2) + shooter.angle
        const x = shooter.x + (Math.cos(angle) * shooter.radius)
        const y = shooter.y + (Math.sin(angle) * shooter.radius)
        graphics.drawCircle(x, y, 1.5)
      }
      graphics.endFill()
    })
  }
}

UpdateShootersSystem.queries = {
  shooters: {
    components: [Shooter, Timer]
  },
  player: {
    components: [Player, Container, Not(GameOver)],
    mandatory: true
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class UpdateBulletsSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const renderer = this.queries.renderer.results[0].getComponent(Renderer)

    const player = this.queries.player.results[0].getComponent(Player)

    if (player.pectin > 0) {
      for (let i = this.queries.bullets.results.length - 1; i >= 0; i--) {
        if (this.queries.bullets.results[i].hasComponent(PlayerBullet)) {
          continue
        }

        const entity = this.queries.bullets.results[i]
        const bullet = entity.getComponent(Bullet)

        const smokeAmount = Math.round(UTILS.lerp(2, 3, Math.random()))

        for (let j = 0; j < smokeAmount; j++) {
          this.world.createEntity()
            .addComponent(Smoke, {
              x: bullet.x + (Math.random() * bullet.radius) - (bullet.radius / 2),
              y: bullet.y + (Math.random() * bullet.radius) - (bullet.radius / 2),
              vx: (Math.random() * 2 - 1) * (Math.random() * 12),
              vy: (Math.random() * 2 - 1) * (Math.random() * 12),
              scale: UTILS.lerp(3, 5, Math.random()),
            })
            .addComponent(Timer, {
              duration: UTILS.lerp(2.5, 4.5, Math.random()),
              time: 0
            })
        }

        this.queries.bullets.results[i].remove()
      }
    }

    graphics.lineStyle(1, 0x000000, 0, 0.5, true)
    this.queries.bullets.results.forEach(entity => {
      const bullet = entity.getMutableComponent(Bullet)
      const timer = entity.getMutableComponent(Timer)
      timer.time += delta

      const padding = renderer.width / 16

      if (timer.time >= timer.duration
        || bullet.x < bullet.radius - padding
        || bullet.x > renderer.width + bullet.radius + padding
        || bullet.y < bullet.radius - padding ||
        bullet.y > renderer.height + bullet.radius + padding) {
        entity.remove()
      }

      bullet.x += Math.cos(bullet.angle) * bullet.speed * delta
      bullet.y += Math.sin(bullet.angle) * bullet.speed * delta

      if (entity.hasComponent(Rotator)) {
        const rotator = entity.getComponent(Rotator)
        bullet.angle += rotator.speed * delta
      }

      graphics.beginFill(bullet.color, 1)
      graphics.drawCircle(bullet.x, bullet.y, bullet.radius * UTILS.lerp(1, 0.1, UTILS.inverseLerpClamped(timer.duration - 0.1, timer.duration, timer.time)))
      graphics.endFill()
    })
  }
}

UpdateBulletsSystem.queries = {
  bullets: {
    components: [Bullet, Timer]
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  },
  player: {
    components: [Player, Container, Not(GameOver)],
    mandatory: true
  }
}

export class BulletsCollisionSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    //const renderer = this.queries.renderer.results[0].getComponent(Renderer)
    const playerContainer = this.queries.player.results[0].getComponent(Container).container
    const playerRadius = this.queries.player.results[0].getComponent(Player).radius
    const playerEntity = this.queries.player.results[0]

    this.queries.playerBullets.results.forEach(entity => {
      const bullet = entity.getComponent(Bullet)
      let removeBullet = false

      for (let i = 0; i < this.queries.shooters.results.length; i++) {
        const shooter = this.queries.shooters.results[i].getMutableComponent(Shooter)

        if (UTILS.circleCollision(bullet.x, bullet.y, bullet.radius, shooter.x, shooter.y, shooter.radius)) {
          graphics.lineStyle(1, 0x000000, 0, 0.5, true)
          graphics.beginFill(0xffffff, 1)
          graphics.drawCircle(shooter.x, shooter.y, shooter.radius)
          graphics.endFill()
          // TODO: Spawn smoke instead, or flash
          shooter.health--
          if (shooter.health <= 0) {
            this.queries.player.results[0].getMutableComponent(Player).upgradeProgress++

            for (let j = this.queries.enemyBullets.results.length - 1; j >= 0; j--) {
              const enemyBullet = this.queries.enemyBullets.results[j].getComponent(Bullet)
              if (enemyBullet.parent === shooter.id) {
                const smokeAmount = Math.round(UTILS.lerp(2, 3, Math.random()))

                for (let j = 0; j < smokeAmount; j++) {
                  this.world.createEntity()
                    .addComponent(Smoke, {
                      x: enemyBullet.x + (Math.random() * enemyBullet.radius) - (enemyBullet.radius / 2),
                      y: enemyBullet.y + (Math.random() * enemyBullet.radius) - (enemyBullet.radius / 2),
                      vx: (Math.random() * 2 - 1) * (Math.random() * 12),
                      vy: (Math.random() * 2 - 1) * (Math.random() * 12),
                      scale: UTILS.lerp(3, 5, Math.random()),
                    })
                    .addComponent(Timer, {
                      duration: UTILS.lerp(2.5, 4.5, Math.random()),
                      time: 0
                    })
                }

                this.queries.enemyBullets.results[j].remove()
              }
            }

            const smokeAmount = Math.round(UTILS.lerp(3, 7, Math.random()))

            for (let j = 0; j < smokeAmount; j++) {
              this.world.createEntity()
                .addComponent(Smoke, {
                  x: shooter.x + (Math.random() * 16) - 8,
                  y: shooter.y + (Math.random() * 16) - 8,
                  vx: (Math.random() * 2 - 1) * (Math.random() * 12),
                  vy: (Math.random() * 2 - 1) * (Math.random() * 12),
                  scale: UTILS.lerp(4, 7, Math.random()),
                })
                .addComponent(Timer, {
                  duration: UTILS.lerp(2.5, 4.5, Math.random()),
                  time: 0
                })
            }

            this.queries.shooters.results[i].remove()
          }
          removeBullet = true // Queue remove, errors out when overlapping enemies
        }
      }

      if (removeBullet) {
        entity.remove()
      }
    })

    // Player - Enemy collision check
    for (let i = 0; i < this.queries.shooters.results.length; i++) {
      const shooter = this.queries.shooters.results[i].getComponent(Shooter)

      // playerRadius * 2
      if (UTILS.circleCollision(playerContainer.position.x, playerContainer.position.y, shooter.radius, shooter.x, shooter.y, shooter.radius)) {
        this.queries.player.results[0].getMutableComponent(Player).upgradeProgress += 3

        // Spawn smoke
        const smokeAmount = Math.round(UTILS.lerp(3, 7, Math.random()))

        for (let j = 0; j < smokeAmount; j++) {
          this.world.createEntity()
            .addComponent(Smoke, {
              x: shooter.x + (Math.random() * 16) - 8,
              y: shooter.y + (Math.random() * 16) - 8,
              vx: (Math.random() * 2 - 1) * (Math.random() * 12),
              vy: (Math.random() * 2 - 1) * (Math.random() * 12),
              scale: UTILS.lerp(4, 7, Math.random()),
            })
            .addComponent(Timer, {
              duration: UTILS.lerp(2.5, 4.5, Math.random()),
              time: 0
            })
        }

        this.queries.shooters.results[i].remove()
      }
    }

    // Enemy bullet - Player's Solid Line ability check
    if (playerEntity.hasComponent(ReflectLine)) {
      const linePoints = []

      this.queries.points.results.forEach(entity => {
        const line = entity.getMutableComponent(LinePoint)

        linePoints.push(
          line.x,
          line.y
        )
      })

      for (let i = 0; i < linePoints.length - 2; i += 2) {
        for (let j = this.queries.enemyBullets.results.length - 1; j >= 0; j--) {
          const bullet = this.queries.enemyBullets.results[j].getComponent(Bullet)

          if (UTILS.lineCircleCollision(linePoints[i], linePoints[i + 1], linePoints[i + 2], linePoints[i + 3], bullet.x, bullet.y, bullet.radius / 2)) {
            // this.queries.enemyBullets.results[j].getMutableComponent(Timer).duration = 12
            // this.queries.enemyBullets.results[j].addComponent(PlayerBullet)
            // bullet.color = 0xffffff
            // bullet.angle = UTILS.reflectRadiant(bullet.angle)
            // bullet.parent = ''
            //const lineNormal = UTILS.getNormalOfLine2(linePoints[i], linePoints[i + 1], linePoints[i + 2], linePoints[i + 3])
            //const sideOfLine = -UTILS.getSideOfLine(linePoints[i], linePoints[i + 1], linePoints[i + 2], linePoints[i + 3], bullet.x, bullet.y)
            //const reflectedAngle = Math.atan2(lineNormal.y * sideOfLine, lineNormal.x * sideOfLine)
            const bulletAngle = UTILS.reflectRadiant(bullet.angle)
            this.world.createEntity()
              .addComponent(Bullet, {
                x: bullet.x,
                y: bullet.y,
                angle: bulletAngle,
                color: 0xffffff,
                radius: bullet.radius,
                speed: bullet.speed,
              })
              .addComponent(Timer, {
                duration: 12,
                time: 0
              })
              .addComponent(PlayerBullet)

            this.queries.enemyBullets.results[j].remove()
          }
        }
      }
    }

    // Player - Enemy bullet collision check
    let gameOver = false

    this.queries.enemyBullets.results.forEach(entity => {
      if (gameOver) {
        return
      }

      const bullet = entity.getComponent(Bullet)

      if (UTILS.circleCollision(bullet.x, bullet.y, bullet.radius, playerContainer.position.x, playerContainer.position.y, playerRadius)) {
        gameOver = true
        this.queries.player.results[0].addComponent(GameOver, {
          bulletX: bullet.x,
          bulletY: bullet.y,
          playerX: playerContainer.position.x,
          playerY: playerContainer.position.y,
          //bulletRadius: bullet.radius,
          //playerRadius: playerRadius,
          //playerAngle: playerContainer.rotation,
          killingEnemy: bullet.parent
        })
        this.world.createEntity()
          .addComponent(Timer, {
            duration: 1.6,
            time: 0
          })
          .addComponent(FrameFlash)
        // graphics.lineStyle(1, 0x000000, 0, 0.5, true)
        // graphics.beginFill(0xffffff, 1)
        // graphics.drawRect(0, 0, renderer.width, renderer.height)
        // graphics.endFill()
        // graphics.beginFill(0x000000, 1)
        // graphics.drawCircle(playerContainer.position.x, playerContainer.position.y, playerRadius)
        // graphics.drawCircle(bullet.x, bullet.y, bullet.radius)
        // graphics.endFill()
        // TODO: Add killing bullet component here for game over pause draw, or just pass the data to the game over component
        //entity.remove()
      }
    })

    // if (gameOver) {
    //   return
    // }
  }
}

BulletsCollisionSystem.queries = {
  player: {
    components: [Player, Container, Not(GameOver)],
    mandatory: true
  },
  points: {
    components: [LinePoint, Not(Removing)]
  },
  shooters: {
    components: [Shooter]
  },
  playerBullets: {
    components: [Bullet, PlayerBullet]
  },
  enemyBullets: {
    components: [Bullet, Not(PlayerBullet)]
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class PlayerShootSystem extends System {
  execute (delta, time) {
    const player = this.queries.player.results[0].getMutableComponent(Player)

    if (player.pectin > 0) {
      return
    }

    const playerContainer = this.queries.player.results[0].getComponent(Container).container
    const playerTimer = this.queries.player.results[0].getMutableComponent(Timer)
    //const cursor = this.queries.cursor.results[0].getComponent(Container).container
    const input = this.queries.input.results[0].getComponent(InputState).states

    if (input.attack.held) {
      playerTimer.time += delta
      if (playerTimer.time >= playerTimer.duration) {
        playerTimer.time = 0
        if (this.queries.player.results[0].hasComponent(DoubleSided)) {
          if (this.queries.player.results[0].hasComponent(TriShot)) {
            for (let i = 0; i < 3; i++) {
              this.world.createEntity()
                .addComponent(Bullet, {
                  x: playerContainer.position.x,
                  y: playerContainer.position.y,
                  angle: playerContainer.rotation + (i - 1) * (Math.PI / 12),
                  speed: 240,
                  radius: 2,
                  color: 0xffffff
                })
                .addComponent(PlayerBullet)
                .addComponent(Timer, {
                  duration: 12,
                  time: 0
                })
              this.world.createEntity()
                .addComponent(Bullet, {
                  x: playerContainer.position.x,
                  y: playerContainer.position.y,
                  angle: (playerContainer.rotation + (i - 1) * (Math.PI / 12)) + Math.PI,
                  speed: 240,
                  radius: 2,
                  color: 0xffffff
                })
                .addComponent(PlayerBullet)
                .addComponent(Timer, {
                  duration: 12,
                  time: 0
                })
            }
          } else {
            this.world.createEntity()
              .addComponent(Bullet, {
                x: playerContainer.position.x,
                y: playerContainer.position.y,
                angle: playerContainer.rotation,
                speed: 240,
                radius: 2,
                color: 0xffffff
              })
              .addComponent(Timer, {
                duration: 12
              })
              .addComponent(PlayerBullet)

            this.world.createEntity()
              .addComponent(Bullet, {
                x: playerContainer.position.x,
                y: playerContainer.position.y,
                angle: playerContainer.rotation + Math.PI,
                speed: 240,
                radius: 2,
                color: 0xffffff
              })
              .addComponent(Timer, {
                duration: 12
              })
              .addComponent(PlayerBullet)
          }
        } else {
          if (this.queries.player.results[0].hasComponent(TriShot)) {
            for (let i = 0; i < 3; i++) {
              this.world.createEntity()
                .addComponent(Bullet, {
                  x: playerContainer.position.x,
                  y: playerContainer.position.y,
                  angle: playerContainer.rotation + (i - 1) * (Math.PI / 12),
                  speed: 240,
                  radius: 2,
                  color: 0xffffff
                })
                .addComponent(PlayerBullet)
                .addComponent(Timer, {
                  duration: 12,
                  time: 0
                })
            }
          } else {
            this.world.createEntity()
              .addComponent(Bullet, {
                x: playerContainer.position.x,
                y: playerContainer.position.y,
                angle: playerContainer.rotation,
                speed: 240,
                radius: 2,
                color: 0xffffff
              })
              .addComponent(Timer, {
                duration: 12
              })
              .addComponent(PlayerBullet)
          }
        }
      }
    } else if (input.attack.up) {
      playerTimer.time = playerTimer.duration
    }

    // if (player.ammo <= 0) {
    //   player.pectin = player.maxPectin
    //   player.currentLineIndex = -1
    //   player.ammo = player.maxAmmo
    //   for (let i = this.queries.points.results.length - 1; i > -1; i--) {
    //     this.queries.points.results[i]
    //       .addComponent(Removing)
    //       .addComponent(Timer, { duration: 1.6 })
    //   }
    //   //cursor.position.x = playerContainer.position.x
    //   //cursor.position.y = playerContainer.position.y
    //   this.world.createEntity()
    //     .addComponent(LinePoint, {
    //       x: playerContainer.position.x,
    //       y: playerContainer.position.y,
    //       angle: (Math.random() * 360) * (Math.PI / 180),
    //       speed: Math.random() * 50
    //     })
    //
    //   const smokeAmount = Math.round(UTILS.lerp(3, 7, Math.random()))
    //
    //   for (let j = 0; j < smokeAmount; j++) {
    //     this.world.createEntity()
    //       .addComponent(Smoke, {
    //         x: playerContainer.position.x + (Math.random() * 16) - 8,
    //         y: playerContainer.position.y + (Math.random() * 16) - 8,
    //         vx: (Math.random() * 2 - 1) * (Math.random() * 12),
    //         vy: (Math.random() * 2 - 1) * (Math.random() * 12),
    //         scale: UTILS.lerp(4, 7, Math.random()),
    //       })
    //       .addComponent(Timer, {
    //         duration: UTILS.lerp(2.5, 4.5, Math.random()),
    //         time: 0
    //       })
    //   }
    // }
  }
}

PlayerShootSystem.queries = {
  player: {
    components: [Player, Container, Timer, Not(GameOver)],
    mandatory: true
  },
  input: {
    components: [InputState],
    mandatory: true
  }
}

export class GameTimerSystem extends System {
  execute (delta, time) {
    const player = this.queries.player.results[0].getMutableComponent(Player)

    if (player.pectin > 0) {
      return
    }

    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const playerContainer = this.queries.player.results[0].getComponent(Container).container

    const timer = this.queries.entities.results[0].getMutableComponent(Timer)
    timer.time += delta

    if (timer.time >= timer.duration) {
      timer.time = 0
      //PIXI.sound.play('round_end')

      player.pectin = player.maxPectin
      player.currentLineIndex = -1
      player.rounds++

      for (let i = this.queries.points.results.length - 1; i > -1; i--) {
        this.queries.points.results[i]
          .addComponent(Removing)
          .addComponent(Timer, { duration: 1.6 })
      }

      this.queries.shooters.results.forEach(entity => {
        entity.getMutableComponent(Timer).time = 0
        entity.getMutableComponent(Timer).cooldown = entity.getComponent(Shooter).cooldown
        entity.getMutableComponent(Shooter).timesShot = 0
      })

      this.world.createEntity()
        .addComponent(LinePoint, {
          x: playerContainer.position.x,
          y: playerContainer.position.y,
          angle: (Math.random() * 360) * (Math.PI / 180),
          speed: Math.random() * 50
        })

      const smokeAmount = Math.round(UTILS.lerp(3, 7, Math.random()))

      for (let j = 0; j < smokeAmount; j++) {
        this.world.createEntity()
          .addComponent(Smoke, {
            x: playerContainer.position.x + (Math.random() * 16) - 8,
            y: playerContainer.position.y + (Math.random() * 16) - 8,
            vx: (Math.random() * 2 - 1) * (Math.random() * 12),
            vy: (Math.random() * 2 - 1) * (Math.random() * 12),
            scale: UTILS.lerp(4, 7, Math.random()),
          })
          .addComponent(Timer, {
            duration: UTILS.lerp(2.5, 4.5, Math.random()),
            time: 0
          })
      }

      return
    }

    const width = UTILS.inverseLerp(timer.duration, 0, timer.time) * (renderer.width / 2)

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
  }
}

GameTimerSystem.queries = {
  entities: {
    components: [Timer, GameTimer]
  },
  points: {
    components: [LinePoint, Not(Removing)]
  },
  player: {
    components: [Player, Container, Not(GameOver)],
    mandatory: true
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  },
  shooters: {
    components: [Shooter, Timer]
  }
}

export class RemovingLineSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    //const player = this.queries.player.results[0].getComponent(Container).container

    let linePoints = []
    let currentTime = 0
    let duration = 0

    for (let i = this.queries.points.results.length - 1; i > -1; i--) {
      const entity = this.queries.points.results[i]
      const timer = entity.getMutableComponent(Timer)
      timer.time += delta
      currentTime = timer.time
      duration = timer.duration

      if (timer.time >= timer.duration) {
        entity.remove()
        return
      }

      const point = entity.getMutableComponent(LinePoint)
      point.x += Math.cos(point.angle + time) * ((point.speed / 1.5) * UTILS.inverseLerp(duration, 0, currentTime)) * delta
      point.y += Math.sin(point.angle + time) * ((point.speed / 1.5) * UTILS.inverseLerp(duration, 0, currentTime)) * delta
      linePoints.push(point.x, point.y)
    }

    graphics.beginFill()
    const lerp = Math.floor(UTILS.inverseLerp(duration, 0, currentTime) * 255)
    graphics.lineStyle(1, parseInt('0x' + UTILS.rgbToHex(lerp, lerp, lerp)), 1, 0.5, true)
    for (let i = 0; i < linePoints.length; i += 2) {
      graphics.moveTo(linePoints[i], linePoints[i + 1])
      graphics.lineTo(linePoints[i + 2], linePoints[i + 3])
    }
    graphics.endFill()
  }
}

RemovingLineSystem.queries = {
  points: {
    components: [LinePoint, Removing, Timer],
    mandatory: true
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  },
  // player: {
  //   components: [Player, Container],
  //   mandatory: true
  // }
}

export class RenderGameOverSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer
    const gameOver = this.queries.player.results[0].getMutableComponent(GameOver)
    const player = this.queries.player.results[0].getMutableComponent(Player)
    const playerEntity = this.queries.player.results[0]
    const playerContainer = this.queries.player.results[0].getComponent(Container).container

    // White background
    graphics.beginFill(0xffffff, 1)
    graphics.lineStyle(1, 0xffffff, 0, 0.5, true)
    graphics.drawRect(0, 0, renderer.width, renderer.height)
    graphics.endFill()

    // Lines
    const linePoints = []

    this.queries.points.results.forEach(entity => {
      const line = entity.getMutableComponent(LinePoint)

      //line.x += (line.speed / 20) * Math.cos(line.angle + time) * delta
      //line.y += (line.speed / 20) * Math.sin(line.angle + time) * delta

      linePoints.push(
        line.x,
        line.y
      )
    })

    if (linePoints < 4) {
      return
    }

    graphics.beginFill()
    graphics.lineStyle(1, 0x000000, 1, 0.5, true)
    for (let i = 0; i < linePoints.length - 2; i += 2) {
      graphics.moveTo(linePoints[i], linePoints[i + 1])
      graphics.lineTo(linePoints[i + 2], linePoints[i + 3])
    }
    graphics.endFill()

    // Death circle red
    graphics.beginFill(0xff0000, 1)
    graphics.lineStyle(1, 0xffffff, 0, 0.5, true)
    const pointBetween = UTILS.lerp2D(gameOver.bulletX, gameOver.bulletY, gameOver.playerX, gameOver.playerY, 0.5)
    graphics.drawCircle(Math.round(pointBetween.x), Math.round(pointBetween.y), 16)
    graphics.endFill()

    this.queries.bullets.results.forEach(entity => {
      const bullet = entity.getComponent(Bullet)
      if (bullet.parent === gameOver.killingEnemy) {
        graphics.beginFill(0x000000, 1)
        graphics.lineStyle(1, 0xffffff, 0, 0.5, true)
        graphics.drawCircle(Math.round(bullet.x), Math.round(bullet.y), bullet.radius)
        graphics.endFill()
      }
    })

    this.queries.shooters.results.forEach(entity => {
      const shooter = entity.getComponent(Shooter)
      if (shooter.id === gameOver.killingEnemy) {
        graphics.beginFill(0x000000, 0)
        graphics.lineStyle(1, 0x000000, 1, 0.5, true)
        graphics.drawCircle(Math.round(shooter.x), Math.round(shooter.y), shooter.radius)
        graphics.endFill()
      }
    })

    this.queries.flashes.results.forEach(entity => {
      const timer = entity.getMutableComponent(Timer)
      timer.time += delta
      if (timer.time >= timer.duration) {
        graphics.beginFill(0x000000, 1)
        graphics.lineStyle(1, 0xffffff, 0, 0.5, true)
        graphics.drawRect(0, 0, renderer.width, renderer.height)
        graphics.endFill()

        gameOver.flashCount++

        if (gameOver.flashCount >= gameOver.flashCountMax) {
          gameOver.flashCount = 0
          // Remove shooters and bullets
          for (let i = this.queries.shooters.results.length - 1; i >= 0; i--) {
            this.queries.shooters.results[i].remove()
          }
          for (let i = this.queries.bullets.results.length - 1; i >= 0; i--) {
            this.queries.bullets.results[i].remove()
          }
          for (let i = this.queries.points.results.length - 1; i >= 0; i--) {
            this.queries.points.results[i].remove()
          }
          // TODO: Reset abilities here
          player.pectin = player.maxPectin
          player.currentLineIndex = -1
          player.rounds = 0
          player.maxPectin = 25
          player.maxUpgradeProgress = 9
          player.upgradeProgress = 0
          if (playerEntity.hasComponent(TriShot)) {
            playerEntity.removeComponent(TriShot)
          }
          if (playerEntity.hasComponent(DoubleSided)) {
            playerEntity.removeComponent(DoubleSided)
          }
          if (playerEntity.hasComponent(ReflectLine)) {
            playerEntity.removeComponent(ReflectLine)
          }
          playerContainer.x = renderer.width / 2
          playerContainer.y = renderer.height / 2
          this.queries.gameTimer.results[0].getMutableComponent(Timer).time = 0
          this.world.createEntity(LinePoint, {
            x: playerContainer.x,
            y: playerContainer.y,
            angle: (Math.random() * 360) * (Math.PI / 180),
            speed: Math.random() * 50
          })
          this.queries.player.results[0].removeComponent(GameOver)
        } else {
          this.world.createEntity()
            .addComponent(Timer, {
              duration: 0.2,
              time: 0
            })
            .addComponent(FrameFlash)
        }

        entity.remove()
      }
    })
  }
}

RenderGameOverSystem.queries = {
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  },
  player: {
    components: [Player, GameOver],
    mandatory: true
  },
  bullets: {
    components: [Bullet]
  },
  shooters: {
    components: [Shooter]
  },
  flashes: {
    components: [FrameFlash, Timer]
  },
  gameTimer: {
    components: [Timer, GameTimer]
  },
  points: {
    components: [LinePoint]
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

export class ResetInputSystem extends System {
  execute () {
    this.queries.controls.results.forEach(entity => {
      const input = entity.getMutableComponent(InputState)

      Object.keys(input.actions).forEach(action => {
        const type = input.actions[action].type

        if (type === 'button') {
          if (!input.states[action]) {
            input.states[action] = { down: 0, held: 0, up: 0 }
          }
          input.states[action].down = 0
          input.states[action].held = 0
          input.states[action].up = 0
        } else if (type === 'axis') {
          if (input.states[action] === null) {
            input.states[action] = 0
          }
          input.states[action] = 0
        }
      })
    })
  }
}

ResetInputSystem.queries = {
  controls: {
    components: [InputState],
  }
}

export class FinalizeInputSystem extends System {
  execute () {
    this.queries.controls.results.forEach(entity => {
      const input = entity.getMutableComponent(InputState)

      Object.keys(input.actions).forEach(action => {
        const type = input.actions[action].type

        if (type === 'button') {
          input.states[action].down = input.states[action].down > 0
          input.states[action].held = input.states[action].held > 0
          input.states[action].up = input.states[action].up > 0
        }
      })
    })
  }
}

FinalizeInputSystem.queries = {
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

        // if (!input.states[action]) {
        //   input.states[action] = { down: 0, held: 0, up: 0 }
        // }

        input.states[action].down += pollDown // > 0
        input.states[action].held += pollHeld // > 0
        input.states[action].up += pollUp // > 0
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

          // if (!input.states[action]) {
          //   input.states[action] = { down: 0, held: 0, up: 0 }
          // }

          input.states[action].down += pollDown // > 0
          input.states[action].held += pollHeld // > 0
          input.states[action].up += pollUp // > 0
        } else if (type === 'axis') {
          const axis = mouse.actionMapping[action][0] // Only one bind allowed for an axis right now, makes sense I guess

          if (mouse.states[axis].moved === false || document.pointerLockElement !== this.queries.renderers.results[0].getComponent(Renderer).renderer.view) {
            //input.states[action] = 0
            mouse.states[axis].lastMove = 0
            mouse.states[axis].moved = false
            return
          }

          // if (input.states[action] === null) {
          //   input.states[action] = 0
          // }

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
  execute (delta, time) {
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

            const timer = entity.getMutableComponent(Timer)

            if (pollHeld > 0 && this.queries.player.results[0].getComponent(Player).pectin <= 0) {
              timer.time += delta

              if (timer.time < timer.duration) {
                return
              }
            }

            if (pollUp > 0) {
              timer.time = 0
            }
          }

          // if (!input.states[action]) {
          //   input.states[action] = { down: 0, held: 0, up: 0 }
          // }

          input.states[action].down += pollDown// > 0
          input.states[action].held += pollHeld// > 0
          input.states[action].up += pollUp// > 0
        } else if (type === 'axis') {
          const axis = touch.actionMapping[action][0] // Only one bind allowed for an axis right now, makes sense I guess

          if (touch.states[axis].moved === false) {
            //input.states[action] = 0
            return
          }

          // if (input.states[action] === null) {
          //   input.states[action] = 0
          // }

          input.states[action] += touch.states[axis].lastMove
          touch.states[axis].moved = false
        }
      })
    })
  }
}

TouchSystem.queries = {
  controls: {
    components: [TouchState, InputState, Timer],
    listen: { added: true }
  },
  player: {
    components: [Player, Timer],
    mandatory: true
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
