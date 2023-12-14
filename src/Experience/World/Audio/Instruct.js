import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Instruct {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.audioListener = new THREE.AudioListener();

        // Resource
        this.resource = this.resources.items.instruct;

        this.setModel();
    }

    setModel() {
        this.audio = new THREE.Audio(this.audioListener);
        this.audio.setBuffer(this.resource);

        // Set options for the audio (optional)
        this.audio.setLoop(false); // Set to true if you want to loop the audio
        this.audio.setVolume(0.5); // Set the volume (0.0 to 1.0)
    }

    playSound() {
        this.audio.play();
    }

}