import EventEmitter from './EventEmitter.js'
import * as THREE from "three";

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.delta = 16
        this.clock = new THREE.Clock();

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        this.delta = this.clock.getDelta();

        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }
}