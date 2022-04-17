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
import * as COMPONENTS from './components';
Object.entries(COMPONENTS).forEach(([name, exported]) => window[name] = exported);
import * as SYSTEMS from './systems';
Object.entries(SYSTEMS).forEach(([name, exported]) => window[name] = exported);
import * as PIXI from './pixi'
import { LinePointRenderer } from './components'
import { ContainerAddSystem } from './systems'

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
    .registerComponent(LinePointRenderer)
    .registerComponent(MainStage)

  world
    .registerSystem(KeyboardSystem)
    .registerSystem(MouseSystem)
    .registerSystem(TouchSystem)
    .registerSystem(ContainerAddSystem)
    .registerSystem(PlayerMovementSystem)
    .registerSystem(LinePointSpawnerSystem)
    .registerSystem(LinePointRendererSystem)
    //.registerSystem(BackgroundFadeSystem)

  world.createEntity()
    .addComponent(InputState)
    .addComponent(KeyboardState)
    .addComponent(MouseState)
    .addComponent(TouchState)

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
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  PIXI.settings.RESOLUTION = 1
  renderer = new PIXI.Renderer({ width: 640, height: 480, antialias: false, backgroundAlpha: 0 })
  document.body.appendChild(renderer.view)
  world.createEntity()
    .addComponent(Renderer, { renderer: renderer })
    .addComponent(Timer)

  stage = new PIXI.Container()
  world.createEntity()
    .addComponent(Container, { container: stage })
    .addComponent(MainStage)
  
  const player = new PIXI.Sprite(PIXI.Texture.WHITE)
  player.width = 32
  player.height = 32
  player.x = 320
  player.y = 240
  player.anchor.set(0.5)
  //stage.addChild(player)
  world.createEntity()
    .addComponent(Container, { container: player })
    .addComponent(Player, { lastPlop: player.position.clone() })
    //.addComponent(Timer)
  
  const lineGraphics = new PIXI.Graphics()
  //stage.addChild(lineGraphics)
  world.createEntity()
    .addComponent(Container, { container: lineGraphics })
    .addComponent(LinePointRenderer)

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
  const viewWidth = Math.min(Math.floor(window.innerWidth / 640), Math.floor(window.innerHeight / 480)) * 640
  const viewHeight = Math.min(Math.floor(window.innerWidth / 640), Math.floor(window.innerHeight / 480)) * 480
  renderer.view.style.maxWidth = viewWidth + 'px'
  renderer.view.style.maxHeight = viewHeight + 'px'
}

window.addEventListener('load', () => {
  init()
})
