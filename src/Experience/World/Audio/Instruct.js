import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Instruct {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.audioListener = new THREE.AudioListener();
        this.audio = new THREE.Audio(this.audioListener);

        // Resource
        this.a_brush = this.resources.items.audio_brush;
        this.a_close = this.resources.items.audio_close
        this.a_open = this.resources.items.audio_open
        this.a_pick = this.resources.items.audio_pick
        this.a_put = this.resources.items.audio_put
        this.a_openMouth = this.resources.items.audio_openMouth
        this.a_one = this.resources.items.audio_one
        this.a_two = this.resources.items.audio_two
        this.a_three = this.resources.items.audio_three
    }

    playSound(audioFile) {
        this.audio.setBuffer(audioFile);
        
        // Set options for the audio (optional)
        this.audio.setLoop(false); // Set to true if you want to loop the audio
        this.audio.setVolume(0.5); // Set the volume (0.0 to 1.0)

        this.audio.play();
    }

}