import { World } from 'ecsy'
// import {
//   KeyboardState,
//   MouseState,
//   TouchState,
//   InputState,
//   Container,
//   Player,
//   Camera,
//   Renderer,
//   Timer
// } from './components.js'
// import {
//   KeyboardSystem,
//   MouseSystem,
//   TouchSystem,
//   MovementSystem,
//   BackgroundFadeSystem
// } from './systems.js'
import * as COMPONENTS from './components'

Object.entries(COMPONENTS).forEach(([name, exported]) => window[name] = exported)
import * as SYSTEMS from './systems'

Object.entries(SYSTEMS).forEach(([name, exported]) => window[name] = exported)
import * as PIXI from './pixi'
import { UpgradeBarSystem } from './systems'

let world, stage, renderer, ticker, elapsedTime

//const ticker = PIXI.Ticker.shared;
// let controls
// const rawDirectionInput = new THREE.Vector2(0, 0)

function init () {
  world = new World()

  world
    .registerComponent(Player)
    .registerComponent(InputState)
    .registerComponent(KeyboardState)
    .registerComponent(MouseState)
    .registerComponent(TouchState)
    .registerComponent(Container)
    .registerComponent(Renderer)
    .registerComponent(Timer)
    .registerComponent(LinePoint)
    .registerComponent(MainStage)
    //.registerComponent(Cursor)
    .registerComponent(Removing)
    .registerComponent(Shooter)
    .registerComponent(Bullet)
    .registerComponent(Smoke)
    .registerComponent(GameTimer)
    .registerComponent(GameOver)
    .registerComponent(PlayerBullet)
    .registerComponent(FrameFlash)
    .registerComponent(Rotator)
    .registerComponent(TriShot)
    .registerComponent(DoubleSided)
    .registerComponent(ReflectLine)
  
  world
    .registerSystem(ResetInputSystem)
    .registerSystem(KeyboardSystem)
    .registerSystem(MouseSystem)
    .registerSystem(TouchSystem)
    .registerSystem(FinalizeInputSystem)
    .registerSystem(ClearGraphicsSystem)
    .registerSystem(ContainerAddSystem)
    //.registerSystem(CursorSystem)
    .registerSystem(PlayerMovementSystem)
    .registerSystem(PlayerShootSystem)
    .registerSystem(SpawnShootersSystem)
    .registerSystem(LinePointSpawnerSystem)
    .registerSystem(RemovingLineSystem)
    .registerSystem(LinePointRendererSystem)
    .registerSystem(UpdateShootersSystem)
    .registerSystem(UpdateBulletsSystem)
    .registerSystem(BulletsCollisionSystem)
    .registerSystem(UpgradeBarSystem)
    .registerSystem(SmokeSystem)
    .registerSystem(GameTimerSystem)
    .registerSystem(PectinBarRenderSystem)
    .registerSystem(PlayerDrawSystem)
    .registerSystem(RenderGameOverSystem)

  world.createEntity('input')
    .addComponent(InputState)
    .addComponent(KeyboardState)
    .addComponent(MouseState)
    .addComponent(TouchState)
    .addComponent(Timer, {
      duration: 0.15
    })

  //scene = new THREE.Scene()

  //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1024)
  //world.createEntity().addComponent(Camera).addComponent(Object3D, { object: camera })

  // playerGeometry = new THREE.SphereGeometry(0.5, 4, 2)
  // playerMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 0) })
  // playerMesh = new THREE.Mesh(playerGeometry, playerMaterial)
  // scene.add(playerMesh)
  //world.createEntity().addComponent(Player).addComponent(Object3D, { object: playerMesh })

  //renderer = new PIXI.WebGL1Renderer({ antialias: false, stencil: false, depth: true })
  //renderer.setPixelRatio(window.devicePixelRatio)
  //renderer.setSize(window.innerWidth, window.innerHeight)
  //document.body.appendChild(renderer.domElement)

  PIXI.utils.skipHello()
  //PIXI.settings.TARGET_FPMS = 0.12
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.RESOLUTION = 1
  // TODO: Replace with loader probably
  //PIXI.sound.add('round_end', './assets/round_end_crushed.mp3')
  renderer = new PIXI.Renderer({ width: 320, height: 240, antialias: false, backgroundAlpha: 0 })
  document.body.appendChild(renderer.view)
  const graphics = new PIXI.Graphics()
  world.createEntity('renderer')
    .addComponent(Renderer, { renderer: renderer })
    .addComponent(Container, { container: graphics })

  stage = new PIXI.Container()
  world.createEntity('main stage')
    .addComponent(Container, { container: stage })
    .addComponent(MainStage)
  
  // world.createEntity('text')
  //   .addComponent(Text, {
  //     text: 'Hello  22! Test text',
  //     x: 320 / 2,
  //     y: (240 / 2) - 50,
  //     scale: 0.6
  //   })

  const player = new PIXI.Graphics()
  // player.width = 16
  // player.height = 16
  player.x = renderer.width / 2
  player.y = renderer.height / 2
  //player.anchor.set(0.5)
  //stage.addChild(player)
  world.createEntity('player')
    .addComponent(Container, { container: player })
    .addComponent(Player, { lastPlop: player.position.clone() })
    .addComponent(Timer, { duration: 1 / 12 })
    //.addComponent(TriShot)
    //.addComponent(DoubleSided)
    //.addComponent(ReflectLine)

  world.createEntity("game timer")
    .addComponent(GameTimer)
    .addComponent(Timer, { duration: 12 })

  world.createEntity()
    .addComponent(LinePoint, {
      x: player.position.x,
      y: player.position.y,
      angle: (Math.random() * 360) * (Math.PI / 180),
      speed: Math.random() * 50
    })

  const cursor = new PIXI.Graphics()
  cursor.x = renderer.width / 2
  cursor.y = renderer.height / 2
  //world.createEntity('cursor')
  //  .addComponent(Container, { container: cursor })
  //  .addComponent(Cursor)

  //const lineGraphics = new PIXI.Graphics()
  //stage.addChild(lineGraphics)
  //world.createEntity("line renderer")
  //  .addComponent(Container, { container: lineGraphics })
  //  .addComponent(LinePointRenderer)

  // world.createEntity("game state")
  //   .addComponent(GameState)

  ticker = PIXI.Ticker.shared
  ticker.autoStart = false
  ticker.stop()
  //ticker.speed = 0.2
  elapsedTime = 0
  // ticker.add(delta => {
  //   elapsedTime += delta
  //   world.execute(delta)
  //   renderer.render(stage)
  // })

  document.addEventListener('click', function () {
    renderer.view.requestPointerLock()
  })

  document.addEventListener('gesturestart', function (event) {
    event.preventDefault()
  })

  fitViewport()
  window.addEventListener('resize', function () {
    fitViewport()
  })

  //animate(performance.now())
  window.requestAnimationFrame(animate)
}

function animate (time) {
  ticker.update(time)
  elapsedTime += ticker.elapsedMS / 1000

  world.execute(ticker.deltaMS / 1000, elapsedTime)

  renderer.render(stage)

  window.requestAnimationFrame(animate)
}

function fitViewport () {
  const viewWidth = Math.min(Math.floor(window.innerWidth / 320), Math.floor(window.innerHeight / 240)) * 320
  const viewHeight = Math.min(Math.floor(window.innerWidth / 320), Math.floor(window.innerHeight / 240)) * 240
  renderer.view.style.maxWidth = viewWidth + 'px'
  renderer.view.style.maxHeight = viewHeight + 'px'
}

window.addEventListener('load', () => {
  init()
})
