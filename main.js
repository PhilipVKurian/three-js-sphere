import * as THREE from 'three'
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from "gsap"
const scene = new THREE.Scene()

//Create our sphere geometry
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
})
const mesh = new THREE.Mesh(geometry, material);

const nav = document.getElementsByTagName("nav")
const title = document.getElementsByClassName("title")

//Add the object to scene
scene.add(mesh)

//Sizes
const sizes = {
  witdth: window.innerWidth,
  height: window.innerHeight,
}

//Lights
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0,10,10)
scene.add(light)

//-------------CAMERA---------------------------FOV -  Aspect, Ratio, clipping near, far 
const camera = new THREE.PerspectiveCamera(50, sizes.witdth/sizes.height , 0.1, 100)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.witdth, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true

//Resize
window.addEventListener("resize", () => {
  sizes.witdth = window.innerWidth
  sizes.height = window.innerHeight
  console.log(sizes.witdth, sizes.height)
  //Udate the camera
  camera.aspect = sizes.witdth / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.witdth, sizes.height)
})


const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop()

//TimeLine for animations -> sync multiple animation together
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo("nav", {y: "-100%"}, {y: "0%"})
tl.fromTo(".title", {opacity: 0}, {opacity: 1})

//Mouse down color change
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e)=> {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.witdth)*255),
      Math.round((e.pageY / sizes.height)*255),
      150,
    ]
    //Animate 
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
    
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }
})