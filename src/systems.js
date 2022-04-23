import { System, Not } from 'ecsy'
import * as UTILS from './utils'
import * as COMPONENTS from './components'
import { Removing } from './components'
import { getParallelLine, getPerpendicularDirection, getPerpendicularLine, rotateLine90Degrees } from './utils'
//import * as PIXI from './pixi'

Object.entries(COMPONENTS).forEach(([name, exported]) => window[name] = exported)

export class ShooterUpdateSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container

    this.queries.entities.results.forEach(entity => {
      graphics.clear()
      graphics.beginFill(0xffffff)
      graphics.drawCircle(0, 0, 8)
      graphics.endFill()
    })
  }
}

ShooterUpdateSystem.queries = {
  entities: {
    components: [Shooter, Timer]
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

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
      }
      else {
        graphics.beginFill(0xffffff, 0)
        graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
        graphics.moveTo(0, 0 - 3)
        graphics.lineTo(7, -5 - 3)
        graphics.moveTo(7, -5 - 3)
        graphics.lineTo(0, 14 - 3)
        graphics.moveTo(0, 14 - 3)
        graphics.lineTo(-7, -5 - 3)
        graphics.moveTo(-7, -5 - 3)
        graphics.lineTo(0, 0 - 3)
        graphics.endFill()
      }
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

        const graphics = this.queries.renderer.results[0].getComponent(Container).container
        graphics.beginFill(0xff0000)
        graphics.drawCircle(currentPoint.x, currentPoint.y, 5)
        graphics.endFill()
        graphics.beginFill(0x00ff00)
        graphics.drawCircle(nextPoint.x, nextPoint.y, 5)
        graphics.endFill()
        graphics.beginFill(0x0000ff)
        graphics.drawCircle(previousPoint.x, previousPoint.y, 5)
        graphics.endFill()

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

        // TODO: Set player shoot normal based on input direction to line segment
        // if (Math.abs(velocity.x) > 0 && Math.abs(velocity.y) > 0) {
        //   // if (finalPoint === pointOnFirstSegment) {
        //   //   const bigVx = container.position.x + (velocity.x * 6)
        //   //   const bigVy = container.position.y + (velocity.y * 6)
        //   //   const normal = UTILS.getNormalOfLineToPoint(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y, bigVx, bigVy)
        //   //   container.rotation = Math.atan2(normal.y, normal.x)
        //   // } else {
        //   //   const bigVx = container.position.x + (velocity.x * 6)
        //   //   const bigVy = container.position.y + (velocity.y * 6)
        //   //   const normal = UTILS.getNormalOfLineToPoint(currentPoint.x, currentPoint.y, previousPoint.x, previousPoint.y, bigVx, bigVy)
        //   //   container.rotation = Math.atan2(normal.y, normal.x)
        //   // }
        //   const normal = UTILS.getParallelDirectionOfLineFromPoint(
        //     currentPoint.x, currentPoint.y,
        //     nextPoint.x, nextPoint.y,
        //     tempVx, tempVy
        //   )
        //  
        //   container.rotation = Math.atan2(normal.y, normal.x)
        // }

        if (finalPoint === pointOnFirstSegment) {
          const normal = UTILS.rotateLine90Degrees(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y)
          container.rotation = Math.atan2(normal.y, normal.x)
        } else {
          const normal = UTILS.rotateLine90Degrees(previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y)
          container.rotation = Math.atan2(normal.y, normal.x)
        }
        
        graphics.beginFill(0xff0000)
        graphics.lineStyle(1, 0xffffff, 1, 0.5, true)
        graphics.moveTo(container.position.x, container.position.y)
        graphics.lineTo(container.position.x + (Math.cos(container.rotation) * 8), container.position.y + (Math.sin(container.rotation) * 8))
        graphics.endFill()
      } else {
        container.position.x += velocity.x
        container.position.y += velocity.y
        container.position.x = UTILS.clamp(container.position.x, 0, renderer.width)
        container.position.y = UTILS.clamp(container.position.y, 0, renderer.height)
      }
    })
  }
}

PlayerMovementSystem.queries = {
  entities: {
    components: [Container, Player]
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
      const player = entity.getMutableComponent(Player)
      const playerContainer = entity.getMutableComponent(Container).container

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

export class SpawnShootersSystem extends System {
  execute (delta, time) {
    if (this.queries.shooters.results.length > 0) {
      return
    }

    const player = this.queries.player.results[0].getComponent(Player)
    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer

    if (player.pectin < (player.maxPectin / 2)) {
      for (let i = Math.random() * 6; i > 0; i--) {
        const padding = renderer.width / 16
        // TODO: If close to player, re-roll position
        const randomPositionX = Math.round(UTILS.lerp(renderer.width - padding, padding, Math.random()))
        const randomPositionY = Math.round(UTILS.lerp(renderer.height - padding, padding, Math.random()))

        this.world.createEntity()
          .addComponent(Shooter, {
            x: randomPositionX,
            y: randomPositionY,
            color: parseInt('0x' + UTILS.rgbToHex(255, 0, 0)),
            radius: 6,
            bulletCount: 6,
            bulletSpeed: 128,
            bulletRadius: 3,
            bulletLife: 3,
          })
          .addComponent(Timer, {
            duration: 0.3,
            time: 0
          })

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
    components: [Shooter, Timer, Not(Removing)]
  },
  player: {
    components: [Player, Container],
    mandatory: true
  },
  renderer: {
    components: [Renderer],
    mandatory: true
  }
}

export class UpdateShootersSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const player = this.queries.player.results[0].getComponent(Player)

    this.queries.shooters.results.forEach(entity => {
      const shooter = entity.getComponent(Shooter)

      if (player.pectin <= 0) {
        const timer = entity.getMutableComponent(Timer)
        timer.time += delta

        if (timer.time > timer.duration) {
          timer.time = 0

          for (let i = 0; i < shooter.bulletCount; i++) {
            const angle = ((i / shooter.bulletCount) + 0.25) * Math.PI * 2 // Math.random()
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
              })
              .addComponent(Timer, {
                duration: shooter.bulletLife,
              })
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
        const angle = ((i / shooter.bulletCount) + 0.25) * Math.PI * 2
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
    components: [Shooter, Timer, Not(Removing)]
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

export class UpdateBulletsSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const renderer = this.queries.renderer.results[0].getComponent(Renderer)

    graphics.beginFill(0xff0000, 1)
    this.queries.bullets.results.forEach(entity => {
      const bullet = entity.getMutableComponent(Bullet)
      const timer = entity.getMutableComponent(Timer)
      timer.time += delta

      if (timer.time >= timer.duration
        || bullet.x < bullet.radius
        || bullet.x > renderer.width + bullet.radius
        || bullet.y < bullet.radius ||
        bullet.y > renderer.height + bullet.radius) {
        entity.remove()
      }

      // TODO: Collision

      bullet.x += Math.cos(bullet.angle) * bullet.speed * delta
      bullet.y += Math.sin(bullet.angle) * bullet.speed * delta
      
      graphics.drawCircle(bullet.x, bullet.y, bullet.radius)
    })
    graphics.endFill()
  }
}

UpdateBulletsSystem.queries = {
  bullets: {
    components: [Bullet, Timer, Not(Removing)]
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  }
}

export class PlayerAmmoSystem extends System {
  execute (delta, time) {
    const player = this.queries.player.results[0].getMutableComponent(Player)

    console.log(player.pectin)
    if (player.pectin > 0) {
      return
    }

    const renderer = this.queries.renderer.results[0].getComponent(Renderer).renderer
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const playerContainer = this.queries.player.results[0].getComponent(Container).container
    const playerTimer = this.queries.player.results[0].getMutableComponent(Timer)
    //const cursor = this.queries.cursor.results[0].getComponent(Container).container
    const input = this.queries.input.results[0].getComponent(InputState).states

    if (input.attack.held) {
      playerTimer.time += delta
      if (playerTimer.time >= playerTimer.duration) {
        if (player.ammo > 0) {
          player.ammo--
          const currentPlayerPoint = this.queries.points.results[player.currentLineIndex].getComponent(LinePoint)
          let vX = playerContainer.position.x
          let vY = playerContainer.position.y
          vX += input.lookX / (parseInt(renderer.view.style.maxHeight) / 240)
          vY += input.lookY / (parseInt(renderer.view.style.maxHeight) / 240)

          if (input.forward.held) {
            vY -= 240 * delta
          }
          if (input.back.held) {
            vY += 240 * delta
          }
          if (input.left.held) {
            vX -= 240 * delta
          }
          if (input.right.held) {
            vX += 240 * delta
          }
          const normal = UTILS.getNormalOfLineToPoint(
            currentPlayerPoint.x, currentPlayerPoint.y,
            playerContainer.position.x, playerContainer.position.y,
            vX, vY
          )
          const angle = Math.atan2(normal.y, normal.x)

          this.world.createEntity()
            .addComponent(Bullet, {
              x: playerContainer.position.x,
              y: playerContainer.position.y,
              angle: angle,
              speed: 240,
              radius: 2,
              color: 0xffffff
            })
            .addComponent(Timer, {
              duration: player.bulletDuration
            })
        }
        playerTimer.time = 0
      }
    } else if (input.attack.up) {
      playerTimer.time = playerTimer.duration
    }

    if (player.ammo <= 0) {
      player.pectin = player.maxPectin
      player.currentLineIndex = -1
      player.ammo = player.maxAmmo
      for (let i = this.queries.points.results.length - 1; i > -1; i--) {
        this.queries.points.results[i]
          .addComponent(Removing)
          .addComponent(Timer, { duration: 1.6 })
      }
      //cursor.position.x = playerContainer.position.x
      //cursor.position.y = playerContainer.position.y
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

    const width = UTILS.inverseLerp(player.maxAmmo, 0, player.ammo) * (renderer.width / 2)

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

PlayerAmmoSystem.queries = {
  // entities: {
  //   components: [Timer, GameTimer]
  // },
  points: {
    components: [LinePoint, Not(Removing)]
  },
  player: {
    components: [Player, Container, Timer],
    mandatory: true
  },
  renderer: {
    components: [Renderer, Container],
    mandatory: true
  },
  // cursor: {
  //   components: [Container, Cursor],
  //   mandatory: true
  // },
  input: {
    components: [InputState],
    mandatory: true
  }
}

export class RemovingLineSystem extends System {
  execute (delta, time) {
    const graphics = this.queries.renderer.results[0].getComponent(Container).container
    const player = this.queries.player.results[0].getComponent(Container).container

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
  player: {
    components: [Player, Container],
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
