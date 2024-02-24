import gsap from "gsap"
import * as THREE from "three"
import Experience from "./Experience"

import JSConfetti from "js-confetti"

export default class Sequence {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.loading = this.experience.loading
    this.camera = this.experience.camera
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.gameVariation = 1
    this.step = 1 // current action step
    this.promptLimit = 0 // Count prompt
    this.timeoutLimit = 0 // Count timeout
    this.passActions = [3, 6] // No action steps
    this.closeCamera = [7, 8, 9, 11, 12, 14] // Close up camera when brushing
    this.openingCount = 0 // Toothpaste Cap opening count - 3 times
    this.brushingCount = 0 // Brushing count - 3 times
    this.brushingAction = [8, 9, 11, 12, 14] // Brushing Action Steps
    this.autoAction = [4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] // Auto pass action steps
    this.draggingAction = [1, 4, 18] // Dragging Action Steps
    this.canControlBrushing = false // Flag for brushing
    this.availableAction = true // Flag for user interaction
    this.brushForward = true // Flag for brush direction
    this.isDragging = false // Flag for dragging
    this.isReversing = false // Flag for dragging action reversing
    this.foamChange = true // Flag for starting foam shaping
    this.perStepPecentage = 1 / 4

    this.gameFailure = 0
    this.gameSuccess = false

    // for Metrics
    this.finishType = "Success"
    this.tags = []
    this.responseTime = 0
    this.responseTimes = []
    this.tempResponseTime = 0
    this.interactPositions = []
    this.finishResponseInterval = false
    this.responses = []
    this.scores = [100]
    console.log(this.scores)
    this.gameScore = 0
    this.gameDuration = 0
    this.successInterection = 0
    this.totalInteraction = 0

    this.jsConfetti = new JSConfetti()

    this.posFrom = new THREE.Vector3()
    this.posTo = new THREE.Vector3()
    this.maxX = 0
    this.maxY = 0
    this.minX = 0
    this.minY = 0
    this.dragProgress = {}

    // Brush positions and rotations
    this.startRotation = []
    this.startRotation[8] = new THREE.Euler(0, 2 * Math.PI, -Math.PI / 2)
    this.startRotation[9] = new THREE.Euler(Math.PI, 0, -Math.PI / 2)
    this.startRotation[11] = new THREE.Euler(0, 2 * Math.PI, -Math.PI / 2)
    this.startRotation[12] = new THREE.Euler(Math.PI, 0, -Math.PI / 2)
    this.startRotation[14] = new THREE.Euler(Math.PI, 0, -Math.PI / 2)
    this.endRotation = []
    this.endRotation[8] = new THREE.Euler(0, 5, -1.55)
    this.endRotation[9] = new THREE.Euler(Math.PI, -1.23, -Math.PI / 2)
    this.endRotation[11] = new THREE.Euler(0, 5, -1.55)
    this.endRotation[12] = new THREE.Euler(Math.PI, -1.23, -Math.PI / 2)
    this.endRotation[14] = new THREE.Euler(Math.PI, 0, -Math.PI / 2)
    this.startPoint = []
    this.startPoint[8] = new THREE.Vector3(
      -0.4515087306499481,
      1.3392058610916138,
      0.08033858239650726
    )
    this.startPoint[9] = new THREE.Vector3(
      -0.44859135150909424,
      1.3386489152908325,
      -0.1079862043261528
    )
    this.startPoint[11] = new THREE.Vector3(
      -0.4515087306499481,
      1.3392058610916138,
      0.08033858239650726
    )
    this.startPoint[12] = new THREE.Vector3(
      -0.44859135150909424,
      1.3386489152908325,
      -0.1079862043261528
    )
    this.startPoint[14] = new THREE.Vector3(
      -0.444,
      1.3386489152908325,
      -0.1279862043261528
    )
    this.endPoint = []
    this.endPoint[8] = new THREE.Vector3(-0.5015, 1.3392058610916138, -0.03)
    this.endPoint[9] = new THREE.Vector3(-0.5015, 1.3392058610916138, -0.002)
    this.endPoint[11] = new THREE.Vector3(-0.5015, 1.332, -0.03)
    this.endPoint[12] = new THREE.Vector3(-0.5015, 1.332, -0.002)
    this.endPoint[14] = new THREE.Vector3(-0.444, 1.3386489152908325, -0.09)

    this.loading.on("start", () => {
      setInterval(() => {
        this.calcMetrics()
      }, 1000)

      this.finishResponseInterval = false

      // Mouse events
      window.addEventListener("mousedown", (event) => {
        this.totalInteraction++
        console.log(this.scores)
        this.scores[this.scores.length - 1] -= 20
        this.scores[this.scores.length - 1] = Math.max(
          0,
          this.scores[this.scores.length - 1]
        )

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        this.interactPositions.push({ x: this.mouse.x, y: this.mouse.y })

        this.raycaster.setFromCamera(this.mouse, this.camera.instance)

        const intersects = this.raycaster.intersectObjects(this.scene.children, true)

        if (intersects.length > 0) {
          this.startObject = intersects[0].object
          this.trigger_dragging(this.step)
        }

        // if (!this.autoAction.includes(this.step)) {
        if (event.clientY == 1) {
          if (this.brushingAction.includes(this.step)) {
            window.addEventListener("mousemove", this.brush)
            if (this.step == 8)
              this.experience.world.character.animation.actions.brushingURSK.play()
            if (this.step == 9)
              this.experience.world.character.animation.actions.brushingULSK.play()
            if (this.step == 11)
              this.experience.world.character.animation.actions.brushingLRSK.play()
            if (this.step == 12)
              this.experience.world.character.animation.actions.brushingLLSK.play()
            if (this.step == 14)
              this.experience.world.character.animation.actions.brushingFSK.play()
          }
        } else {
          if (this.brushingAction.includes(this.step) && this.canControlBrushing) {
            window.addEventListener("mousemove", this.brush)
            if (this.step == 8)
              this.experience.world.character.animation.actions.brushingURSK.play()
            if (this.step == 9)
              this.experience.world.character.animation.actions.brushingULSK.play()
            if (this.step == 11)
              this.experience.world.character.animation.actions.brushingLRSK.play()
            if (this.step == 12)
              this.experience.world.character.animation.actions.brushingLLSK.play()
            if (this.step == 14)
              this.experience.world.character.animation.actions.brushingFSK.play()
          }
        }
      })
      window.addEventListener("mouseup", (event) => {
        // console.log(this.step);
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera.instance)

        const intersects = this.raycaster.intersectObjects(this.scene.children, true)

        if (intersects.length > 0) {
          this.endObject = intersects[0].object
          this.trigger_action(this.step)
        }

        if (this.isDragging) {
          this.isReversing = true
          this.isDragging = false
          this.dragProgress.percent = 0
        }

        if (this.canControlBrushing) {
          window.removeEventListener("mousemove", this.brush)
        } else {
          if (event.clientY == 1) {
            window.removeEventListener("mousemove", this.brush)
          } else return
        }
        window.removeEventListener("mousemove", this.dragging)
      })

      // Touch events
      window.addEventListener("touchstart", (event) => {
        this.totalInteraction++
        this.scores[this.scores.length - 1] -= 20
        this.scores[this.scores.length - 1] = Math.max(
          0,
          this.scores[this.scores.length - 1]
        )
        this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1
        this.interactPositions.push({ x: this.mouse.x, y: this.mouse.y })

        this.raycaster.setFromCamera(this.mouse, this.camera.instance)

        const intersects = this.raycaster.intersectObjects(this.scene.children, true)

        if (intersects.length > 0) {
          this.startObject = intersects[0].object
          this.trigger_dragging(this.step)
        }

        if (event.changedTouches[0].clientY == 1) {
          if (this.brushingAction.includes(this.step)) {
            window.addEventListener("mousemove", this.brush)
            if (this.step == 8)
              this.experience.world.character.animation.actions.brushingURSK.play()
            if (this.step == 9)
              this.experience.world.character.animation.actions.brushingULSK.play()
            if (this.step == 11)
              this.experience.world.character.animation.actions.brushingLRSK.play()
            if (this.step == 12)
              this.experience.world.character.animation.actions.brushingLLSK.play()
            if (this.step == 14)
              this.experience.world.character.animation.actions.brushingFSK.play()
          }
        } else {
          if (this.brushingAction.includes(this.step) && this.canControlBrushing) {
            window.addEventListener("mousemove", this.brush)
            if (this.step == 8)
              this.experience.world.character.animation.actions.brushingURSK.play()
            if (this.step == 9)
              this.experience.world.character.animation.actions.brushingULSK.play()
            if (this.step == 11)
              this.experience.world.character.animation.actions.brushingLRSK.play()
            if (this.step == 12)
              this.experience.world.character.animation.actions.brushingLLSK.play()
            if (this.step == 14)
              this.experience.world.character.animation.actions.brushingFSK.play()
          }
        }
      })
      window.addEventListener("touchend", (event) => {
        this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera.instance)

        const intersects = this.raycaster.intersectObjects(this.scene.children, true)

        if (intersects.length > 0) {
          this.endObject = intersects[0].object
          this.trigger_action(this.step)
        }

        if (this.isDragging) {
          this.isReversing = true
          this.isDragging = false
          this.dragProgress.percent = 0
        }

        if (this.canControlBrushing) {
          window.removeEventListener("mousemove", this.brush)
        } else {
          if (event.changedTouches[0].clientY == 1) {
            window.removeEventListener("mousemove", this.brush)
          } else return
        }
        window.removeEventListener("touchmove", this.dragging)
      })
    })

    this.sequence()
  }

  sequence() {
    // start game
    this.loading.on("start", () => {
      setTimeout(() => {
        this.prompt_action(this.step)
        this.responseTimes[this.step - 1] = 0
        this.calcResponseTime = setInterval(() => {
          if (this.finishResponseInterval == true) {
            clearInterval(this.calcResponseTime)
            this.finishResponseInterval = false
          } else {
            this.tempResponseTime++
            this.responseTimes[this.step - 1] = this.tempResponseTime
          }
          console.log(this.responseTimes)
        }, 1000)
      }, 0)

      // If action is finished
      this.experience.world.character.animation.mixer.addEventListener(
        "finished",
        (e) => {
          if (this.isReversing) {
            // If action is reversing action
            this.isReversing = false
            // console.log("finish reserving");
            this.experience.world.toothbrush.animation.actions.current.paused = true
            this.experience.world.toothpaste.animation.actions.current.paused = true
            this.experience.world.toothpasteLid.animation.actions.current.paused = true
          } else if (!e.action._clip.name.includes("_SK")) {
            // If one step action is finished
            if (this.step == 23) {
              // If game is finished
              // this.confetti()
              this.gameSuccess = true
              this.finishType = "Success"
              this.refreshGame()
            }
            this.canControlBrushing = false
            this.availableAction = false
            if (this.passActions.includes(this.step)) {
              // If passActions
              this.step++
            }
            this.camera_move(this.step)
            if (this.step == 20)
              // All actions has 2 second of delay except 20th
              this.play_action(this.step)
            else {
              setTimeout(() => {
                if (this.autoAction.includes(this.step)) {
                  if (this.brushingAction.includes(this.step)) {
                    // for automatic brushing actions.
                    this.auto_brushing(this.step)
                  } else {
                    this.play_action(this.step)
                  }
                } else {
                  this.responseTimes.push(0)
                  console.log(this.responseTimes)
                  this.calcResponseTime = setInterval(() => {
                    if (this.finishResponseInterval == true) {
                      clearInterval(this.calcResponseTime)
                      this.finishResponseInterval = false
                    } else {
                      this.tempResponseTime++
                      this.responseTimes[this.responseTimes.length - 1] =
                        this.tempResponseTime
                    }
                    console.log(this.responseTimes)
                  }, 1000)
                  this.prompt_action(this.step) // Show Prompt
                }
              }, 2000)
            }
            if (this.timeoutLimit == 3) {
              // Timeout
              // Finish game
              // alert("Time Out");
              this.finishType = "TimeOut"
              this.gameFailure++
              this.exportMetrics()
              this.refreshGame()
            }
          }
        }
      )
    })
  }

  auto_brushing = (id) => {
    const width = window.innerWidth
    function fireMouseEvent(type, elem, x, y) {
      const evt = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
      elem.dispatchEvent(evt)
    }

    let currentPosition = { x: width / 2, y: 1 }

    const doMouseActions = () => {
      const elem = document.elementFromPoint(currentPosition.x, currentPosition.y)

      // Mouse Down at center
      fireMouseEvent("mousedown", elem, currentPosition.x, currentPosition.y)

      let actions
      if (id == 9 || id == 12 || id == 14) {
        actions = [
          { direction: "right", percent: 20 },
          { direction: "left", percent: 40 },
          { direction: "right", percent: 40 },
          { direction: "left", percent: 40 },
          { direction: "right", percent: 40 },
          { direction: "left", percent: 40 },
          { direction: "right", percent: 40 },
        ]
      } else {
        actions = [
          { direction: "left", percent: 20 },
          { direction: "right", percent: 40 },
          { direction: "left", percent: 40 },
          { direction: "right", percent: 40 },
          { direction: "left", percent: 40 },
          { direction: "right", percent: 40 },
          { direction: "left", percent: 40 },
        ]
      }

      let actionPromise = Promise.resolve()
      actions.forEach((action, i) => {
        let moveAmount = width * (action.percent / 100)
        if (action.direction === "left") {
          moveAmount *= -1
        }

        // Number of steps for smoothness
        let steps = 100

        for (let j = 0; j < steps; j++) {
          actionPromise = actionPromise.then(
            () =>
              new Promise((resolve) => {
                setTimeout(() => {
                  currentPosition.x += moveAmount / steps
                  fireMouseEvent("mousemove", elem, currentPosition.x, currentPosition.y)
                  resolve()
                }, 1000 / steps)
              })
          )
        }
      })
      actionPromise.then(() => {
        setTimeout(() => {
          // Mouse Up
          fireMouseEvent("mouseup", elem, currentPosition.x, currentPosition.y)
        }, 500)
      })
    }

    doMouseActions()
  }

  prompt_action(id) {
    this.promptLimit++
    if (this.promptLimit == 5) {
      // If user doesn't interact correctly during 4 prompts, do action automatically
      this.tempResponseTime = 0
      this.scores[this.scores.length - 1] = 100
      this.scores.push(100)
      this.finishResponseInterval = true
      if (this.brushingAction.includes(id)) {
        // for automatic brushing actions.
        this.auto_brushing(id)
      } else {
        this.play_action(id)
      }
      this.timeoutLimit++
    } else {
      // Show prompt
      this.availableAction = true
      // this.canControlBrushing = true

      this.experience.world.cursor.setPosition(
        this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`]
      )
      this.experience.world.cursor.show()
      this.experience.world.cursor.mesh.lookAt(this.camera.instance.position)
      this.experience.world.cursor.setScale(
        this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`].distanceTo(
          this.camera.instance.position
        )
      )
      // Audio indicator
      if (id == 1 || id == 4) {
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_pick)
      } else if (id == 2) {
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_open)
      } else if (id == 5 || id == 18) {
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_put)
      } else if (this.brushingAction.includes(id)) {
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_brush)
      }
      if (!this.brushingAction.includes(id)) {
        // Prompt for normal Actions
        gsap.fromTo(
          this.experience.world.cursor.mesh.position,
          this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`],
          {
            duration: 1.5,
            delay: 1,
            ...this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_to`],
            onComplete: () => {
              this.experience.world.cursor.hide()
            },
          }
        )
      } else {
        // Prompt for brushing Actions
        gsap.fromTo(
          this.experience.world.cursor.mesh.position,
          this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`],
          {
            duration: 0.5,
            delay: 1,
            repeat: 5,
            ease: "linear",
            yoyo: true,
            ...this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_to`],
            onComplete: () => {
              this.experience.world.cursor.hide()
            },
          }
        )
      }
      let tempOpeningCount = this.openingCount
      setTimeout(() => {
        if (this.step == id && tempOpeningCount == this.openingCount) {
          this.prompt_action(id)
        }
      }, 5000 + 2500)
    }
  }

  draggingReady(id) {
    // Calculate dragging action from/to positions
    this.posFrom =
      this.experience.world.hidden.hiddenObj[`Hidden_Action_${id}_from`].position.clone()
    this.posTo =
      this.experience.world.hidden.hiddenObj[`Hidden_Action_${id}_to`].position.clone()

    this.posFrom.project(this.camera.instance)
    this.posTo.project(this.camera.instance)

    let halfWidth = window.innerWidth / 2
    let halfHeight = window.innerHeight / 2

    this.posFrom.x = this.posFrom.x * halfWidth + halfWidth
    this.posFrom.y = -(this.posFrom.y * halfHeight) + halfHeight

    this.posTo.x = this.posTo.x * halfWidth + halfWidth
    this.posTo.y = -(this.posTo.y * halfHeight) + halfHeight

    this.maxX = Math.max(this.posFrom.x, this.posTo.x)
    this.minX = Math.min(this.posFrom.x, this.posTo.x)
    this.maxY = Math.max(this.posFrom.y, this.posTo.y)
    this.minY = Math.min(this.posFrom.y, this.posTo.y)
  }

  // Dragging Action EventListener
  dragging = (event) => {
    let mousePos = new THREE.Vector2()

    // For PC
    mousePos.x = event.clientX
    mousePos.y = event.clientY

    // For Mobile
    if (isNaN(mousePos.x)) {
      mousePos.x = event.changedTouches[0].clientX
      mousePos.y = event.changedTouches[0].clientY
    }

    if (
      mousePos.x >= this.minX &&
      mousePos.x <= this.maxX &&
      mousePos.y >= this.minY &&
      mousePos.y <= this.maxY
    ) {
      this.dragProgress.x = Math.abs(
        (mousePos.x - this.posFrom.x) / (this.posFrom.x - this.posTo.x)
      )
      this.dragProgress.y = Math.abs(
        (mousePos.y - this.posFrom.y) / (this.posFrom.y - this.posTo.y)
      )
      this.dragProgress.percent = Math.min(this.dragProgress.x, this.dragProgress.y)
    }

    // Adjust time
    if (this.step == 1) {
      this.experience.world.character.animation.actions.pickToothpaste.time =
        this.experience.world.character.animation.actions.pickToothpaste.getClip()
          .duration *
        (1 / 3) *
        Math.sqrt(this.dragProgress.percent)
      this.experience.world.toothpaste.animation.actions.pickToothpaste.time =
        this.experience.world.toothpaste.animation.actions.pickToothpaste.getClip()
          .duration *
        (1 / 3) *
        Math.sqrt(this.dragProgress.percent)
      this.experience.world.toothpasteLid.animation.actions.pickToothpaste.time =
        this.experience.world.toothpasteLid.animation.actions.pickToothpaste.getClip()
          .duration *
        (1 / 3) *
        Math.sqrt(this.dragProgress.percent)
    } else if (this.step == 4) {
      this.experience.world.character.animation.actions.pickToothbrush.time =
        this.experience.world.character.animation.actions.pickToothbrush.getClip()
          .duration *
        (2 / 5) *
        Math.sqrt(this.dragProgress.percent)
      this.experience.world.toothpaste.animation.actions.pickToothbrush.time =
        this.experience.world.toothpaste.animation.actions.pickToothbrush.getClip()
          .duration *
        (2 / 5) *
        Math.sqrt(this.dragProgress.percent)
      this.experience.world.toothbrush.animation.actions.pickToothbrush.time =
        this.experience.world.toothbrush.animation.actions.pickToothbrush.getClip()
          .duration *
        (2 / 5) *
        Math.sqrt(this.dragProgress.percent)
    } else if (this.step == 18) {
      this.experience.world.character.animation.actions.putBrush.time =
        (this.experience.world.character.animation.actions.putBrush.getClip().duration /
          2) *
        this.dragProgress.percent
      this.experience.world.toothbrush.animation.actions.putBrush.time =
        (this.experience.world.toothbrush.animation.actions.putBrush.getClip().duration /
          2) *
        this.dragProgress.percent
    }

    // If dragging arrived to target area
    if (
      mousePos.x >= this.posTo.x - window.innerWidth / 13 &&
      mousePos.x <= this.posTo.x &&
      mousePos.y >= this.posTo.y &&
      mousePos.y <= this.posTo.y + window.innerWidth / 13
    ) {
      // console.log("arrived at target");
      this.isDragging = false
      this.step++
      if(this.step != 19) this.confetti()
      if (this.step == 2) this.tags.push("Pick Toothpaste")
      else if (this.step == 5) this.tags.push("Pick Toothbrush")
      else if (this.step == 19) this.tags.push("Put Brush")
      this.tempResponseTime = 0
      this.successInterection++
      this.gameScore +=
        this.perStepPecentage * (1 / ((100 - this.scores[this.scores.length - 1]) / 20))
      this.scores.push(100)
      this.finishResponseInterval = true
      this.availableAction = false
      window.removeEventListener("mousemove", this.dragging)
      window.removeEventListener("touchmove", this.dragging)
    }
  }

  // Trigger Dragging
  trigger_dragging(id) {
    if (this.draggingAction.includes(id)) {
      if (this.startObject.name === `Hidden_Action_${id}_from`) {
        if (!this.isReversing && this.availableAction) {
          this.isDragging = true
          this.play_action(id)
          this.step--
          this.draggingReady(id)
          this.dragProgress.percent = 0
          window.addEventListener("mousemove", this.dragging)
          window.addEventListener("touchmove", this.dragging)
        }
      }
    }
  }

  // Trigger Normal Action
  trigger_action(id) {
    if (
      this.startObject.name === `Hidden_Action_${id}_from` &&
      this.endObject.name === `Hidden_Action_${id}_to` &&
      !this.brushingAction.includes(id) &&
      !this.draggingAction.includes(id)
    ) {
      if (this.availableAction || this.autoAction.includes(id)) {
        this.canControlBrushing = false
        this.availableAction = false
        this.experience.world.cursor.hide()
        this.confetti()
        console.log(this.step)
        if (this.step == 2) this.tags.push("Open Cap")
        else if (this.step == 5) this.tags.push("Put toothpaste")
        this.tempResponseTime = 0
        this.successInterection++
        this.gameScore +=
          this.perStepPecentage * (1 / ((100 - this.scores[this.scores.length - 1]) / 20))
        this.scores.push(100)
        this.finishResponseInterval = true
        this.play_action(id)
      }
    }
  }

  // Defining Action steps
  play_action(id) {
    this.promptLimit = 0
    this.step++

    switch (id) {
      case 1: // Action 1: Pick Toothpaste
        this.experience.world.character.animation.play("pickToothpaste")
        this.experience.world.toothpaste.animation.play("pickToothpaste")
        this.experience.world.toothpasteLid.animation.play("pickToothpaste")
        break
      case 2: // Action 2: Open Cap
        this.openingCount++
        switch (this.openingCount) {
          case 1:
            this.experience.world.character.animation.play("openToothpaste1")
            this.experience.world.toothpaste.animation.play("openToothpaste1")
            this.experience.world.toothpasteLid.animation.play("openToothpaste1")
            this.step = 2
            break
          case 2:
            this.experience.world.character.animation.play("openToothpaste2")
            this.experience.world.toothpaste.animation.play("openToothpaste2")
            this.experience.world.toothpasteLid.animation.play("openToothpaste2")
            this.step = 2
            break
          case 3:
            this.experience.world.character.animation.play("openToothpaste3")
            this.experience.world.toothpaste.animation.play("openToothpaste3")
            this.experience.world.toothpasteLid.animation.play("openToothpaste3")
            break
          default:
            break
        }
        break
      // case 3: // Action 3: Putting Cap
      //     this.play_action(this.step);
      //     break;
      case 4: // Action 4: Pick Toothbrush
        if (this.gameVariation == 1) this.exportMetrics()
        this.experience.world.character.animation.play("pickToothbrush")
        this.experience.world.toothpaste.animation.play("pickToothbrush")
        this.experience.world.toothbrush.animation.play("pickToothbrush")
        break
      case 5: // Action 5: Squeeze Toothpaste
        this.experience.world.toothpaste.animation.play("squeezeToothpaste")
        this.experience.world.toothbrush.animation.play("squeezeToothpaste")
        this.experience.world.toothpasteContent.animation.play("squeezeToothpaste")
        this.experience.world.character.animation.play("squeezeToothpaste")
        break
      // case 6: // Action 6: Putting Toothpaste
      //     break;
      case 7: // Action 7: Opening Mouth
        this.experience.world.instruct.playSound(
          this.experience.world.instruct.a_openMouth
        )
        this.experience.world.character.animation.play("openMouth")
        this.experience.world.toothpasteContent.model.visible = false
        this.experience.world.toothbrush.animation.play("openMouth")
        break
      case 8: // Action 8: Brushing Upper Right
        this.experience.world.character.animation.play("brushingUR")
        this.experience.world.toothbrush.animation.play("brushingUR")
        break
      case 9: // Action 9: Brushing Upper Left
        this.experience.world.character.animation.play("brushingUL")
        this.experience.world.toothbrush.animation.play("brushingUL")
        break
      case 10: // Action 10: Spitting Sputum
        this.experience.world.character.animation.play("spitFirst")
        this.experience.world.sputum.animation.play("spitFirst")
        this.experience.world.foam.spitFirst()
        this.experience.world.foam.model.visible = false
        setTimeout(() => {
          this.experience.world.toothbrush.animation.play("spitFirst")
          this.experience.world.foam.model.visible = true
        }, 2000)
        break
      case 11: // Action 11: Brushing Lower Right
        this.experience.world.character.animation.play("brushingLR")
        this.experience.world.toothbrush.animation.play("brushingLR")
        break
      case 12: // Action 12: Brushing Lower Left
        this.experience.world.character.animation.play("brushingLL")
        this.experience.world.toothbrush.animation.play("brushingLL")
        break
      case 13: // Action 13: Spitting Sputum
        this.experience.world.character.animation.play("spitSecond")
        this.experience.world.sputum.animation.play("spitFirst")
        this.experience.world.foam.spitSecond()
        this.experience.world.foam.model.visible = false
        setTimeout(() => {
          this.experience.world.toothbrush.animation.play("spitSecond")
          this.experience.world.foam.model.visible = true
        }, 3000)
        break
      case 14: // Action 14: Brushing Front
        this.experience.world.character.animation.play("brushingF")
        this.experience.world.toothbrush.animation.play("brushingF")
        break
      case 15: // Action 15: Spitting Sputum
        this.experience.world.character.animation.play("spitThird")
        this.experience.world.sputum.animation.play("spitFirst")
        this.experience.world.foam.spitThird()
        this.experience.world.foam.model.visible = false
        break
      case 16: // Action 16: Opening Tap
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_open)
        this.experience.world.character.animation.play("openTap")
        this.experience.world.toothbrush.animation.play("openTap")
        this.experience.world.waterFlow.animation.play("openTap")
        break
      case 17: // Action 17: Washing Toothbrush
        this.experience.world.character.animation.play("washBrush")
        this.experience.world.toothbrush.animation.play("washBrush")
        break
      case 18: // Action 18: Putting Brush
        this.experience.world.character.animation.play("putBrush")
        this.experience.world.toothbrush.animation.play("putBrush")
        break
      case 19: // Action 19: Picking and filling up a Cup
        this.experience.world.character.animation.play("pickCup")
        this.experience.world.waterCup.animation.play("pickCup")
        this.experience.world.waterFlow.animation.play("pickCup")
        this.experience.world.waterInCup.animation.play("pickCup")
        break
      case 20: // Action 20: Closing Tap
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_close)
        this.experience.world.character.animation.play("closeTap")
        this.experience.world.waterCup.animation.play("closeTap")
        this.experience.world.waterFlow.animation.play("closeTap")
        this.experience.world.waterInCup.animation.play("closeTap")
        break
      case 21: // Action 21: Cleaning Mouth
        this.experience.world.character.animation.play("cleanMouth")
        this.experience.world.waterCup.animation.play("cleanMouth")
        this.experience.world.sputum.animation.play("cleanMouth")
        this.experience.world.waterInCup.animation.play("cleanMouth")
        break
      case 22: // Action 22: Final Animation
        this.experience.world.character.animation.play("final")
        break
      default:
        break
    }
  }

  // Brushing Action EventListener
  brush = (event) => {
    if (event.clientY != 1 && !this.canControlBrushing) return
    if (isNaN(event.clientY)) {
      if (event.changedTouches[0].clientY != 1 && !this.canControlBrushing) return
    }
    // For PC
    let mouseX = (event.clientX / window.innerWidth) * 2 - 1

    // For Mobile
    if (isNaN(mouseX)) {
      mouseX = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1
    }

    let delta
    if (this.step == 8 || this.step == 11) {
      // Left direction
      delta = (mouseX - this.mouse.x) * 4
    } else if (this.step == 9 || this.step == 12 || this.step == 14) {
      // Right direction
      delta = -(mouseX - this.mouse.x) * 4
    }

    // Set brush's position & rotation
    this.experience.world.toothbrush.model.children[0].position.set(
      this.startPoint[this.step].x +
        (this.startPoint[this.step].x - this.endPoint[this.step].x) * delta,
      this.startPoint[this.step].y +
        (this.startPoint[this.step].y - this.endPoint[this.step].y) * delta,
      this.startPoint[this.step].z +
        (this.startPoint[this.step].z - this.endPoint[this.step].z) * delta
    )
    this.experience.world.toothbrush.model.children[0].rotation.set(
      this.startRotation[this.step].x +
        (this.startRotation[this.step].x - this.endRotation[this.step].x) * delta,
      this.startRotation[this.step].y +
        (this.startRotation[this.step].y - this.endRotation[this.step].y) * delta,
      this.startRotation[this.step].z +
        (this.startRotation[this.step].z - this.endRotation[this.step].z) * delta
    )

    // Limit brush position & rotation
    if (this.step == 8 || this.step == 11) {
      if (
        this.experience.world.toothbrush.model.children[0].position.z <=
        this.endPoint[this.step].z
      ) {
        this.experience.world.toothbrush.model.children[0].position.copy(
          this.endPoint[this.step]
        )
      } else if (
        this.experience.world.toothbrush.model.children[0].position.z >=
        this.startPoint[this.step].z
      ) {
        this.experience.world.toothbrush.model.children[0].position.copy(
          this.startPoint[this.step]
        )
      }

      if (
        this.experience.world.toothbrush.model.children[0].rotation.y <=
        this.endRotation[this.step].y
      ) {
        this.experience.world.toothbrush.model.children[0].rotation.copy(
          this.endRotation[this.step]
        )
      } else if (
        this.experience.world.toothbrush.model.children[0].rotation.y >=
        this.startRotation[this.step].y
      ) {
        this.experience.world.toothbrush.model.children[0].rotation.copy(
          this.startRotation[this.step]
        )
      }
    } else if (this.step == 9 || this.step == 12 || this.step == 14) {
      if (
        this.experience.world.toothbrush.model.children[0].position.z >=
        this.endPoint[this.step].z
      ) {
        this.experience.world.toothbrush.model.children[0].position.copy(
          this.endPoint[this.step]
        )
      } else if (
        this.experience.world.toothbrush.model.children[0].position.z <=
        this.startPoint[this.step].z
      ) {
        this.experience.world.toothbrush.model.children[0].position.copy(
          this.startPoint[this.step]
        )
      }

      if (
        this.experience.world.toothbrush.model.children[0].rotation.y <=
        this.endRotation[this.step].y
      ) {
        this.experience.world.toothbrush.model.children[0].rotation.copy(
          this.endRotation[this.step]
        )
      } else if (
        this.experience.world.toothbrush.model.children[0].rotation.y >=
        this.startRotation[this.step].y
      ) {
        this.experience.world.toothbrush.model.children[0].rotation.copy(
          this.startRotation[this.step]
        )
      }
    }

    // Foam shaping for first brushing
    if (this.brushingCount == 0 && this.foamChange == true) {
      if (this.step == 8) {
        this.experience.world.foam.animation.actions.brushingURSK0.reset()
        this.experience.world.foam.animation.actions.brushingURSK0.play()
        this.experience.world.foam.animation.actions.idle8SK.stop()
      } else if (this.step == 9) {
        this.experience.world.foam.animation.actions.brushingULSK0.reset()
        this.experience.world.foam.animation.actions.brushingULSK0.play()
        this.experience.world.foam.animation.actions.idle9SK.stop()
      } else if (this.step == 11) {
        this.experience.world.foam.animation.actions.brushingLRSK0.reset()
        this.experience.world.foam.animation.actions.brushingLRSK0.play()
        this.experience.world.foam.animation.actions.idle11SK.stop()
      } else if (this.step == 12) {
        this.experience.world.foam.animation.actions.brushingLLSK0.reset()
        this.experience.world.foam.animation.actions.brushingLLSK0.play()
        this.experience.world.foam.animation.actions.idle12SK.stop()
      } else if (this.step == 14) {
        this.experience.world.foam.animation.actions.brushingFSK0.reset()
        this.experience.world.foam.animation.actions.brushingFSK0.play()
        this.experience.world.foam.animation.actions.idle14SK.stop()
      }
      this.foamChange = false
    }

    // Limit brush percentage
    let percentage =
      (this.startPoint[this.step].z -
        this.experience.world.toothbrush.model.children[0].position.z) /
      (this.startPoint[this.step].z - this.endPoint[this.step].z)
    if (percentage < 0) {
      percentage = 0
    } else if (percentage > 1) {
      percentage = 1
    }

    let brushPercentage, foamPercentage

    if (percentage == 1 && this.brushForward == true) {
      // Brushing forward
      this.brushForward = false
    } else if (percentage == 0 && this.brushForward == false) {
      // Brushing backward
      this.brushingCount++
      this.foamChange = true
      if (this.brushingCount == 1) {
        // Foam shaping from second brushing
        if (this.step == 8) {
          this.experience.world.foam.animation.actions.brushingURSK1.play()
          this.experience.world.foam.animation.actions.brushingURSK0.stop()
        } else if (this.step == 9) {
          this.experience.world.foam.animation.actions.brushingULSK1.play()
          this.experience.world.foam.animation.actions.brushingULSK0.stop()
        } else if (this.step == 11) {
          this.experience.world.foam.animation.actions.brushingLRSK1.play()
          this.experience.world.foam.animation.actions.brushingLRSK0.stop()
        } else if (this.step == 12) {
          this.experience.world.foam.animation.actions.brushingLLSK1.play()
          this.experience.world.foam.animation.actions.brushingLLSK0.stop()
        } else if (this.step == 14) {
          this.experience.world.foam.animation.actions.brushingFSK1.play()
          this.experience.world.foam.animation.actions.brushingFSK0.stop()
        }
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_one)
      } else if (this.brushingCount == 2) {
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_two)
      } else if (this.brushingCount == 3) {
        // Pause foam shaping
        if (this.step == 8) {
          this.experience.world.foam.animation.actions.brushingURSK1.paused = true
        } else if (this.step == 9) {
          this.experience.world.foam.animation.actions.brushingULSK1.paused = true
        } else if (this.step == 11) {
          this.experience.world.foam.animation.actions.brushingLRSK1.paused = true
        } else if (this.step == 12) {
          this.experience.world.foam.animation.actions.brushingLLSK1.paused = true
        } else if (this.step == 14) {
          this.experience.world.foam.animation.actions.brushingFSK1.paused = true
        }
        this.experience.world.instruct.playSound(this.experience.world.instruct.a_three)
      }
      this.brushForward = true
      if (this.brushingCount == 3) {
        // Finish brushing
        window.removeEventListener("mousemove", this.brush)
        window.removeEventListener("touchmove", this.brush)
        this.experience.world.cursor.hide()
        this.brushingCount = 0
        this.availableAction = false
        this.canControlBrushing = false
        this.experience.world.character.animation.brushingMixer.stopAllAction()
        // this.confetti()
        console.log(this.step)
        if (this.step == 8) this.tags.push("Brush Upper Right")
        else if (this.step == 9) this.tags.push("Brush Upper Left")
        else if (this.step == 11) this.tags.push("Brush Lower Right")
        else if (this.step == 12) this.tags.push("Brush Lower Left")
        else if (this.step == 14) this.tags.push("Brush Front")
        this.tempResponseTime = 0
        this.successInterection++
        this.gameScore +=
          this.perStepPecentage * (1 / ((100 - this.scores[this.scores.length - 1]) / 20))
        this.scores.push(100)
        this.finishResponseInterval = true
        this.play_action(this.step)
      }
    }

    // Foam shaping percentage
    if (this.brushForward == true) {
      foamPercentage = percentage * 0.5
    } else {
      foamPercentage = 1 - percentage * 0.5
    }

    // Adjust brush percentage
    if (this.step == 12) {
      if (this.brushForward == true) {
        brushPercentage = 0.9 + percentage * 0.4
      } else {
        brushPercentage = 1.7 - percentage * 0.4
      }
    } else if (this.step == 11 || this.step == 9) {
      if (this.brushForward == true) {
        brushPercentage = 0.6 + percentage * 0.5
      } else {
        brushPercentage = 1.6 - percentage * 0.5
      }
    } else {
      if (this.brushForward == true) {
        brushPercentage = 0.5 + percentage * 0.5
      } else {
        brushPercentage = 1.5 - percentage * 0.5
      }
    }

    // Shaping cheek
    this.experience.world.character.animation.brushingMixer.setTime(
      this.experience.world.character.animation.actions.brushingURSK.getClip().duration *
        (brushPercentage / 2)
    )
    // Shaping foam
    if (this.step == 14) {
      this.experience.world.foam.animation.foamMixer.setTime(
        this.experience.world.foam.animation.actions.brushingFSK1.getClip().duration *
          foamPercentage
      )
    } else {
      this.experience.world.foam.animation.foamMixer.setTime(
        this.experience.world.foam.animation.actions.brushingURSK0.getClip().duration *
          foamPercentage
      )
    }
  }

  // Camera Movement
  camera_move(id) {
    if (this.closeCamera.includes(id)) {
      // Close Up Camera
      this.experience.camera.instance.fov = 30
      this.experience.camera.instance.updateProjectionMatrix()
    } else {
      // Normal Camera
      this.experience.camera.instance.fov = 60
      this.experience.camera.instance.updateProjectionMatrix()
    }

    // Camera Movement
    gsap.fromTo(
      this.experience.camera.instance.position,
      this.experience.camera.instance.position,
      {
        duration: 2,
        x: this.experience.camera.camera_data[id - 1].data.position[0],
        y: this.experience.camera.camera_data[id - 1].data.position[1],
        z: this.experience.camera.camera_data[id - 1].data.position[2],
      }
    )

    // Camera Rotation
    let startQuaternion = new THREE.Quaternion().copy(
      this.experience.camera.instance.quaternion
    )
    let endQuaternion = new THREE.Quaternion()
    endQuaternion.setFromEuler(
      new THREE.Euler(
        this.experience.camera.camera_data[id - 1].data.rotation[0],
        this.experience.camera.camera_data[id - 1].data.rotation[1],
        this.experience.camera.camera_data[id - 1].data.rotation[2],
        "XYZ"
      )
    )

    let slerpValue = { t: 0 }

    gsap.to(slerpValue, {
      duration: 2,
      t: 1,
      onUpdate: () => {
        this.experience.camera.instance.quaternion.slerpQuaternions(
          startQuaternion,
          endQuaternion,
          slerpValue.t
        )
      },
    })
  }

  // Confetti
  confetti() {
    this.jsConfetti.addConfetti({
      confettiRadius: 3,
      confettiNumber: 500,
    })

    this.jsConfetti.addConfetti({
      emojis: ["✰"],
      emojiSize: 15,
    })
  }

  // Refresh Game
  refreshGame() {
    window.parent.postMessage(JSON.stringify(this.metricsData), "*")
    console.log("JSON DATA@Success: " + JSON.stringify(this.metricsData))
    
    if (this.gameFailure == 3) {
      alert("Game Over!")
      // this.gameVariation = 1
    } else if (this.gameSuccess) {
      // alert("Congratulation! Move to next!")
      location.reload()
    }

    this.step = 1
    this.promptLimit = 0
    this.timeoutLimit = 0
    this.openingCount = 0
    this.brushingCount = 0
    this.canControlBrushing = false
    this.availableAction = false
    this.brushForward = true

    this.finishType = "Success"
    this.responseTime = 0
    this.responseTimes = []
    this.tempResponseTime = 0
    this.interactPositions = []
    this.finishResponseInterval = false
    this.responses = []
    this.scores = [100]
    this.gameScore = 0
    this.gameDuration = 0
    this.successInterection = 0
    this.totalInteraction = 0

    this.experience.world.character.refresh()
    this.experience.world.toothbrush.refresh()
    this.experience.world.toothpaste.refresh()
    this.experience.world.toothpasteContent.refresh()
    this.experience.world.toothpasteLid.refresh()
    this.experience.world.waterCup.refresh()
    this.experience.world.waterFlow.refresh()
    this.experience.world.sputum.refresh()
    this.experience.world.foam.refresh()

    this.camera_move(1)

    setTimeout(() => {
      this.sequence()
    }, 4000)
  }

  exportMetrics() {
    for (let i = 0; i < this.responseTimes.length; i++) {
      if (this.scores[i] != 100) {
        this.responseTime += this.responseTimes[i]
        this.responses.push({
          respondedAt: this.responseTimes[i],
          score: this.scores[i] + 20,
          tag: this.tags[i],
        })
      }
    }

    this.metricsData = {
      iterationType: "ANIMATION_GAME",
      input: {
        event: "Segment Ended",
        message: this.finishType, //
      },
      responseTime: this.responseTime, //
      //responseStatus: responseStatus,
      coordinates: this.interactPositions, //
      response: this.responses,
      attemptCount: 0, //
      tag: "Animation_Game", //
      durartionInSec: this.gameDuration, //
      score: this.gameScore * 100, //
      assetDuration: this.gameDuration, //
      successInteractions: this.successInterection, //
      totalInteractions: this.totalInteraction, //
    }
  }

  calcMetrics() {
    console.log(this.canControlBrushing)
    this.gameDuration++
  }
}
