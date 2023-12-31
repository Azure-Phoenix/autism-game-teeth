import gsap from 'gsap';
import * as THREE from 'three';
import Experience from "./Experience";

import party from "party-js";
import JSConfetti from 'js-confetti'

export default class Sequence {

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.loading = this.experience.loading;
        this.camera = this.experience.camera;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();


        this.step = 1;
        this.prompotLimit = 0;
        this.timeoutLimit = 0;
        this.passActions = [3, 6];
        this.closeCamera = [7, 8, 9, 11, 12, 14]; //
        this.openingCount = 0;
        this.brushingCount = 0;
        this.brushingAction = [8, 9, 11, 12, 14];
        this.autoAction = [7, 10, 13, 15, 16, 17, 19, 20, 21, 22];
        this.canControlBrushing = false;
        this.availableAction = true;
        this.brushForward = true;

        this.gameFailure = 0;
        this.gameSuccess = 0;

        this.jsConfetti = new JSConfetti();


        // this.startRotation = new THREE.Euler(0, 2 * Math.PI, -Math.PI / 2);
        // this.endRotation = new THREE.Euler(0, 5, -1.55);

        // // Assuming these are your start and end positions
        // this.startPoint = new THREE.Vector3(-0.4515087306499481, 1.3392058610916138, 0.08033858239650726);
        // this.endPoint = new THREE.Vector3(-0.5015, 1.3392058610916138, -0.03);

        this.startRotation = [];
        this.startRotation[8] = new THREE.Euler(0, 2 * Math.PI, -Math.PI / 2);
        this.startRotation[9] = new THREE.Euler(Math.PI, 0, -Math.PI / 2);
        this.startRotation[11] = new THREE.Euler(0, 2 * Math.PI, -Math.PI / 2);
        this.startRotation[12] = new THREE.Euler(Math.PI, 0, -Math.PI / 2);
        this.startRotation[14] = new THREE.Euler(Math.PI, 0, -Math.PI / 2);
        this.endRotation = [];
        this.endRotation[8] = new THREE.Euler(0, 5, -1.55);
        this.endRotation[9] = new THREE.Euler(Math.PI, -1.23, -Math.PI / 2);
        this.endRotation[11] = new THREE.Euler(0, 5, -1.55);
        this.endRotation[12] = new THREE.Euler(Math.PI, -1.23, -Math.PI / 2);
        this.endRotation[14] = new THREE.Euler(Math.PI, 0, -Math.PI / 2);

        // Assuming these are your start and end positions
        this.startPoint = []
        this.startPoint[8] = new THREE.Vector3(-0.4515087306499481, 1.3392058610916138, 0.08033858239650726);
        this.startPoint[9] = new THREE.Vector3(-0.44859135150909424, 1.3386489152908325, -0.1079862043261528);
        this.startPoint[11] = new THREE.Vector3(-0.4515087306499481, 1.3392058610916138, 0.08033858239650726);
        this.startPoint[12] = new THREE.Vector3(-0.44859135150909424, 1.3386489152908325, -0.1079862043261528);
        this.startPoint[14] = new THREE.Vector3(-0.444, 1.3386489152908325, -0.1279862043261528);

        this.endPoint = [];
        this.endPoint[8] = new THREE.Vector3(-0.5015, 1.3392058610916138, -0.03);
        this.endPoint[9] = new THREE.Vector3(-0.5015, 1.3392058610916138, -0.002);
        this.endPoint[11] = new THREE.Vector3(-0.5015, 1.332, -0.03);
        this.endPoint[12] = new THREE.Vector3(-0.5015, 1.332, -0.002);
        this.endPoint[14] = new THREE.Vector3(-0.444, 1.3386489152908325, -0.09);

        window.addEventListener('mousedown', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.startObject = intersects[0].object;
            }

            if (this.brushingAction.includes(this.step) && this.canControlBrushing) {
                window.addEventListener('mousemove', this.brush);
                if (this.step == 8)
                    this.experience.world.character.animation.actions.brushingURSK.play();
                if (this.step == 9) {
                    this.experience.world.character.animation.actions.brushingULSK.play();
                }
                if (this.step == 11) {
                    this.experience.world.character.animation.actions.brushingLRSK.play();
                }
                if (this.step == 12) {
                    this.experience.world.character.animation.actions.brushingLLSK.play();
                }
                if (this.step == 14) {
                    this.experience.world.character.animation.actions.brushingFSK.play();
                }
            }
        });
        window.addEventListener('mouseup', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.endObject = intersects[0].object;
                this.trigger_action(this.step);
            }
            window.removeEventListener('mousemove', this.brush);
        });


        window.addEventListener('touchstart', (event) => {
            this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.startObject = intersects[0].object;
            }

            if (this.brushingAction.includes(this.step) && this.canControlBrushing) {
                window.addEventListener('touchmove', this.brush);
                if (this.step == 8)
                    this.experience.world.character.animation.actions.brushingURSK.play();
                if (this.step == 9) {
                    this.experience.world.character.animation.actions.brushingULSK.play();
                }
                if (this.step == 11) {
                    this.experience.world.character.animation.actions.brushingLRSK.play();
                }
                if (this.step == 12) {
                    this.experience.world.character.animation.actions.brushingLLSK.play();
                }
                if (this.step == 14) {
                    this.experience.world.character.animation.actions.brushingFSK.play();
                }
            }
        });
        window.addEventListener('touchend', (event) => {
            this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.instance);

            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                this.endObject = intersects[0].object;
                this.trigger_action(this.step);
            }

            window.removeEventListener('touchmove', this.brush);
        });

        this.sequence();
    }

    sequence() {
        // start game
        this.loading.on('start', () => {
            setTimeout(() => {
                this.prompt_action(this.step);
            }, 1000);

            this.experience.world.character.animation.mixer.addEventListener("finished", (e) => {
                if (!e.action._clip.name.includes("_SK")) {
                    if (this.step == 23) {
                        this.confetti();
                        this.gameSuccess++;
                        this.refreshGame();
                    }
                    this.canControlBrushing = false;
                    this.availableAction = false;
                    if (this.passActions.includes(this.step)) {
                        this.step++;
                    }
                    console.log(this.step);
                    this.camera_move(this.step);
                    if (this.step == 20)
                        this.play_action(this.step);
                    else {
                        setTimeout(() => {
                            if (this.autoAction.includes(this.step)) {
                                this.play_action(this.step);
                            } else {
                                this.prompt_action(this.step);
                            }
                        }, 2000);
                    }
                    if (this.timeoutLimit == 3) {
                        //finish game
                        // alert("Time Out");
                        this.gameFailure++;
                        this.refreshGame();
                    }
                }
            });
        });
    }

    prompt_action(id) {
        this.prompotLimit++;
        if (this.prompotLimit == 5) { // == 5
            // do action automatically
            if (this.brushingAction.includes(id)) { // for atomatic brushing actions.
                const width = window.innerWidth;

                function fireMouseEvent(type, elem, x, y) {
                    const evt = new MouseEvent(type, {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        clientX: x,
                        clientY: y
                    });
                    elem.dispatchEvent(evt);
                }

                let currentPosition = { x: width / 2, y: window.innerHeight / 2 }

                function doMouseActions() {

                    const elem = document.elementFromPoint(currentPosition.x, currentPosition.y);

                    // Mouse Down at center
                    fireMouseEvent('mousedown', elem, currentPosition.x, currentPosition.y);


                    const actions = [
                        { direction: 'right', percent: 20 },
                        { direction: 'left', percent: 40 },
                        { direction: 'right', percent: 40 },
                        { direction: 'left', percent: 40 },
                        { direction: 'right', percent: 40 },
                        { direction: 'left', percent: 40 },
                        { direction: 'right', percent: 40 },
                    ];

                    let actionPromise = Promise.resolve();
                    actions.forEach((action, i) => {
                        let moveAmount = width * (action.percent / 100);
                        if (action.direction === 'left') {
                            moveAmount *= -1;
                        }

                        // Number of steps for smoothness
                        let steps = 100;

                        for (let j = 0; j < steps; j++) {
                            actionPromise = actionPromise.then(() => new Promise(resolve => {
                                setTimeout(() => {
                                    currentPosition.x += moveAmount / steps;
                                    fireMouseEvent('mousemove', elem, currentPosition.x, currentPosition.y);
                                    resolve();
                                }, 1000 / steps);
                            }));
                        }
                    });
                    actionPromise.then(() => {
                        setTimeout(() => {
                            // Mouse Up
                            fireMouseEvent('mouseup', elem, currentPosition.x, currentPosition.y);
                        }, 500);
                    });
                }

                doMouseActions();
            } else {
                this.play_action(id);
            }
            this.timeoutLimit++;
        } else {
            this.availableAction = true;
            this.canControlBrushing = true;

            this.experience.world.cursor.setPosition(this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`]);
            this.experience.world.cursor.show();
            this.experience.world.cursor.mesh.lookAt(this.camera.instance.position);
            this.experience.world.cursor.setScale(this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`].distanceTo(this.camera.instance.position));
            if (id == 1 || id == 4) {
                this.experience.world.instruct.playSound(this.experience.world.instruct.a_pick);
            } else if (id == 2) {
                this.experience.world.instruct.playSound(this.experience.world.instruct.a_open);
            } else if (id == 5 || id == 18) {
                this.experience.world.instruct.playSound(this.experience.world.instruct.a_put);
            } else if (this.brushingAction.includes(id)) {
                this.experience.world.instruct.playSound(this.experience.world.instruct.a_brush);
            }
            if (!this.brushingAction.includes(id)) {
                gsap.fromTo(this.experience.world.cursor.mesh.position, this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`], {
                    duration: 1.5,
                    delay: 1,
                    ...this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_to`],
                    onComplete: () => {
                        this.experience.world.cursor.hide();
                        // this.availableAction = true;
                    },
                });
            } else {
                console.log(id);
                gsap.fromTo(this.experience.world.cursor.mesh.position, this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_from`], {
                    duration: 0.5,
                    delay: 1,
                    repeat: 5,
                    ease: "linear",
                    yoyo: true,
                    ...this.experience.world.hidden.hiddenPos[`Hidden_Action_${id}_to`],
                    onComplete: () => {
                        this.experience.world.cursor.hide();
                        // this.availableAction = true;
                        // this.canControlBrushing = true;
                    },
                });
            }
            let tempOpeningCount = this.openingCount;
            setTimeout(() => {
                if (this.step == id && tempOpeningCount == this.openingCount) {
                    this.prompt_action(id);
                }
            }, 5000 + 2500);
        }
    }

    trigger_action(id) {
        if (this.startObject.name === `Hidden_Action_${id}_from` && this.endObject.name === `Hidden_Action_${id}_to` && !this.brushingAction.includes(id)) {
            if (this.availableAction || this.autoAction.includes(id)) {
                this.canControlBrushing = false;
                this.availableAction = false;
                this.experience.world.cursor.hide();
                this.confetti();
                this.play_action(id);
            }
        }
    }

    play_action(id) {
        this.prompotLimit = 0;
        this.step++;

        switch (id) {
            case 1: // Action 1: Pick Toothpaste
                this.experience.world.character.animation.play('pickToothpaste');
                this.experience.world.toothpaste.animation.play('pickToothpaste');
                this.experience.world.toothpasteLid.animation.play('pickToothpaste');
                break;
            case 2: // Action 2: Open Cap
                this.openingCount++;
                switch (this.openingCount) {
                    case 1:
                        this.experience.world.character.animation.play('openToothpaste1');
                        this.experience.world.toothpaste.animation.play('openToothpaste1');
                        this.experience.world.toothpasteLid.animation.play('openToothpaste1');
                        this.step = 2;
                        break;
                    case 2:
                        this.experience.world.character.animation.play('openToothpaste2');
                        this.experience.world.toothpaste.animation.play('openToothpaste2');
                        this.experience.world.toothpasteLid.animation.play('openToothpaste2');
                        this.step = 2;
                        break;
                    case 3:
                        this.experience.world.character.animation.play('openToothpaste3');
                        this.experience.world.toothpaste.animation.play('openToothpaste3');
                        this.experience.world.toothpasteLid.animation.play('openToothpaste3');
                        break;
                    default:
                        break;
                }
                break;
            // case 3: // Action 3: Putting Cap
            //     this.play_action(this.step);
            //     break;
            case 4: // Action 4: Pick Toothbrush
                this.experience.world.character.animation.play('pickToothbrush');
                this.experience.world.toothpaste.animation.play('pickToothbrush');
                this.experience.world.toothbrush.animation.play('pickToothbrush');
                break;
            case 5: // Action 5: Squeeze Toothpaste
                this.experience.world.toothpaste.animation.play('squeezeToothpaste');
                this.experience.world.toothbrush.animation.play('squeezeToothpaste');
                this.experience.world.toothpasteContent.animation.play('squeezeToothpaste');
                this.experience.world.character.animation.play('squeezeToothpaste');
                break;
            // case 6: // Action 6: Putting Toothpaste
            //     break;
            case 7: // Action 7: Opening Mouth
                this.experience.world.instruct.playSound(this.experience.world.instruct.a_openMouth);
                this.experience.world.character.animation.play('openMouth');
                this.experience.world.toothpasteContent.animation.play('openMouth');
                this.experience.world.toothbrush.animation.play('openMouth');
                break;
            case 8: // Action 8: Brushing Upper Right
                this.experience.world.character.animation.play('brushingUR');
                this.experience.world.toothbrush.animation.play('brushingUR');
                break;
            case 9: // Action 9: Brushing Upper Left
                this.experience.world.character.animation.play('brushingUL');
                this.experience.world.toothbrush.animation.play('brushingUL');
                break;
            case 10: // Action 10: Spitting Sputum
                this.experience.world.character.animation.play('spitFirst');
                this.experience.world.sputum.animation.play('spitFirst');
                setTimeout(() => {
                    this.experience.world.toothbrush.animation.play('spitFirst');
                }, 2000);
                break;
            case 11: // Action 11: Brushing Lower Right
                this.experience.world.character.animation.play('brushingLR');
                this.experience.world.toothbrush.animation.play('brushingLR');
                break;
            case 12: // Action 12: Brushing Lower Left
                this.experience.world.character.animation.play('brushingLL');
                this.experience.world.toothbrush.animation.play('brushingLL');
                break;
            case 13: // Action 13: Spitting Sputum
                this.experience.world.character.animation.play('spitSecond');
                this.experience.world.sputum.animation.play('spitFirst');
                setTimeout(() => {
                    this.experience.world.toothbrush.animation.play('spitSecond');
                }, 3000);
                break;
            case 14: // Action 14: Brushing Front
                this.experience.world.character.animation.play('brushingF');
                this.experience.world.toothbrush.animation.play('brushingF');
                break;
            case 15: // Action 15: Spitting Sputum
                this.experience.world.character.animation.play('spitThird');
                this.experience.world.sputum.animation.play('spitFirst');
                break;
            case 16: // Action 16: Opening Tap
                this.experience.world.instruct.playSound(this.experience.world.instruct.a_open);
                this.experience.world.character.animation.play('openTap');
                this.experience.world.toothbrush.animation.play('openTap');
                this.experience.world.waterFlow.animation.play('openTap');
                break;
            case 17: // Action 17: Washing Toothbrush
                this.experience.world.character.animation.play('washBrush');
                this.experience.world.toothbrush.animation.play('washBrush');
                break;
            case 18: // Action 18: Putting Brush
                this.experience.world.character.animation.play('putBrush');
                this.experience.world.toothbrush.animation.play('putBrush');
                break;
            case 19: // Action 19: Picking and filling up a Cup
                this.experience.world.character.animation.play('pickCup');
                this.experience.world.waterCup.animation.play('pickCup');
                this.experience.world.waterFlow.animation.play('pickCup');
                this.experience.world.waterInCup.animation.play('pickCup');
                break;
            case 20: // Action 20: Closing Tap
                this.experience.world.instruct.playSound(this.experience.world.instruct.a_close);
                this.experience.world.character.animation.play('closeTap');
                this.experience.world.waterCup.animation.play('closeTap');
                this.experience.world.waterFlow.animation.play('closeTap');
                this.experience.world.waterInCup.animation.play('closeTap');
                break;
            case 21: // Action 21: Cleaning Mouth
                this.experience.world.character.animation.play('cleanMouth');
                this.experience.world.waterCup.animation.play('cleanMouth');
                this.experience.world.sputum.animation.play('cleanMouth');
                this.experience.world.waterInCup.animation.play('cleanMouth');
                break;
            case 22: // Action 22: Final Animation
                this.experience.world.character.animation.play('final');
                break;
            default:
                break;
        }
    }

    brush = (event) => {
        console.log("dragging");
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;

        if (isNaN(mouseX)) {
            mouseX = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        }

        let delta;
        if (this.step == 8 || this.step == 11) {
            delta = (mouseX - this.mouse.x) * 4;
        } else if (this.step == 9 || this.step == 12 || this.step == 14) {
            delta = - (mouseX - this.mouse.x) * 4;
        }
        // console.log(this.experience.world.toothbrush.model.children[0].position);
        // console.log(this.experience.world.toothbrush.model.children[0].rotation);

        this.experience.world.toothbrush.model.children[0].position.set(
            this.startPoint[this.step].x + (this.startPoint[this.step].x - this.endPoint[this.step].x) * delta,
            this.startPoint[this.step].y + (this.startPoint[this.step].y - this.endPoint[this.step].y) * delta,
            this.startPoint[this.step].z + (this.startPoint[this.step].z - this.endPoint[this.step].z) * delta
        )

        this.experience.world.toothbrush.model.children[0].rotation.set(
            this.startRotation[this.step].x + (this.startRotation[this.step].x - this.endRotation[this.step].x) * delta,
            this.startRotation[this.step].y + (this.startRotation[this.step].y - this.endRotation[this.step].y) * delta,
            this.startRotation[this.step].z + (this.startRotation[this.step].z - this.endRotation[this.step].z) * delta
        )

        if (this.step == 8 || this.step == 11) {
            if (this.experience.world.toothbrush.model.children[0].position.z <= this.endPoint[this.step].z) {
                this.experience.world.toothbrush.model.children[0].position.copy(this.endPoint[this.step]);
            } else if (this.experience.world.toothbrush.model.children[0].position.z >= this.startPoint[this.step].z) {
                this.experience.world.toothbrush.model.children[0].position.copy(this.startPoint[this.step]);
            }

            if (this.experience.world.toothbrush.model.children[0].rotation.y <= this.endRotation[this.step].y) {
                this.experience.world.toothbrush.model.children[0].rotation.copy(this.endRotation[this.step]);
            } else if (this.experience.world.toothbrush.model.children[0].rotation.y >= this.startRotation[this.step].y) {
                this.experience.world.toothbrush.model.children[0].rotation.copy(this.startRotation[this.step]);
            }
        } else if (this.step == 9 || this.step == 12 || this.step == 14) {
            if (this.experience.world.toothbrush.model.children[0].position.z >= this.endPoint[this.step].z) {
                this.experience.world.toothbrush.model.children[0].position.copy(this.endPoint[this.step]);
            } else if (this.experience.world.toothbrush.model.children[0].position.z <= this.startPoint[this.step].z) {
                this.experience.world.toothbrush.model.children[0].position.copy(this.startPoint[this.step]);
            }

            if (this.experience.world.toothbrush.model.children[0].rotation.y <= this.endRotation[this.step].y) {
                this.experience.world.toothbrush.model.children[0].rotation.copy(this.endRotation[this.step]);
            } else if (this.experience.world.toothbrush.model.children[0].rotation.y >= this.startRotation[this.step].y) {
                this.experience.world.toothbrush.model.children[0].rotation.copy(this.startRotation[this.step]);
            }
        }

        let percentage = (this.startPoint[this.step].z - this.experience.world.toothbrush.model.children[0].position.z) / (this.startPoint[this.step].z - this.endPoint[this.step].z);
        let brushPercentage;

        if (percentage == 1 && this.brushForward == true) {
            this.brushForward = false;
        } else if (percentage == 0 && this.brushForward == false) {
            this.brushingCount++;
            this.brushForward = true;
            if (this.brushingCount == 3) {
                window.removeEventListener('mousemove', this.brush);
                this.experience.world.cursor.hide();
                this.brushingCount = 0;
                this.availableAction = false;
                this.canControlBrushing = false;
                this.experience.world.character.animation.tempMixer.stopAllAction();
                this.confetti();
                this.play_action(this.step);
            }
        }

        if (this.step == 12) {
            if (this.brushForward == true) {
                brushPercentage = 0.9 + percentage * 0.4;
            } else {
                brushPercentage = 1.7 - percentage * 0.4;
            }
        } else if (this.step == 11 || this.step == 9) {
            if (this.brushForward == true) {
                brushPercentage = 0.6 + percentage * 0.5;
            } else {
                brushPercentage = 1.6 - percentage * 0.5;
            }
        } else {
            if (this.brushForward == true) {
                brushPercentage = 0.5 + percentage * 0.5;
            } else {
                brushPercentage = 1.5 - percentage * 0.5;
            }
        }

        this.experience.world.character.animation.tempMixer.setTime(this.experience.world.character.animation.actions.brushingURSK.getClip().duration * (brushPercentage / 2));
    }

    camera_move(id) {
        console.log("camera", this.step);
        if (this.closeCamera.includes(id)) {
            this.experience.camera.instance.fov = 30;
            this.experience.camera.instance.updateProjectionMatrix();
        } else {
            this.experience.camera.instance.fov = 60;
            this.experience.camera.instance.updateProjectionMatrix();
        }

        gsap.fromTo(this.experience.camera.instance.position,
            this.experience.camera.instance.position,
            {
                duration: 2,
                x: this.experience.camera.camera_data[id - 1].data.position[0],
                y: this.experience.camera.camera_data[id - 1].data.position[1],
                z: this.experience.camera.camera_data[id - 1].data.position[2]
            }
        );

        let startQuaternion = new THREE.Quaternion().copy(this.experience.camera.instance.quaternion);
        let endQuaternion = new THREE.Quaternion();
        endQuaternion.setFromEuler(new THREE.Euler(
            this.experience.camera.camera_data[id - 1].data.rotation[0],
            this.experience.camera.camera_data[id - 1].data.rotation[1],
            this.experience.camera.camera_data[id - 1].data.rotation[2],
            'XYZ'
        ));

        let slerpValue = { t: 0 };

        gsap.to(slerpValue, {
            duration: 2,
            t: 1,
            onUpdate: () => {
                this.experience.camera.instance.quaternion.slerpQuaternions(startQuaternion, endQuaternion, slerpValue.t);
            }
        });
    }

    confetti() {
        this.jsConfetti.addConfetti({
            confettiRadius: 3,
            confettiNumber: 500,
        });

        this.jsConfetti.addConfetti({
            emojis: ['✰'],
            emojiSize: 15,
        });
    }

    refreshGame() {
        if (this.gameFailure == 3) {
            alert("Game Over!");
        } else if (this.gameSuccess == 4) {
            alert("Congratulation! Move to next!");
        }

        this.step = 1;
        this.prompotLimit = 0;
        this.timeoutLimit = 0;
        this.openingCount = 0;
        this.brushingCount = 0;
        this.canControlBrushing = false;
        this.availableAction = false;
        this.brushForward = true;

        this.experience.world.character.refresh();
        this.experience.world.toothbrush.refresh();
        this.experience.world.toothpaste.refresh();
        this.experience.world.toothpasteContent.refresh();
        this.experience.world.toothpasteLid.refresh();
        this.experience.world.waterCup.refresh();
        this.experience.world.waterFlow.refresh();
        this.experience.world.sputum.refresh();

        this.camera_move(1);
        // this.experience.camera.instance.position.set(...this.experience.camera.camera_data[0].data.position);
        // this.experience.camera.instance.rotation.set(...this.experience.camera.camera_data[0].data.rotation);
        setTimeout(() => {
            this.sequence();
        }, 4000);
    }
}