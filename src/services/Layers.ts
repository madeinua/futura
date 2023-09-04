import {Layer} from '../render/Layer.js';

export default class Layers {

    layers: Layer[] = [];
    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getLayer = function (level: number): Layer {

        if (typeof this.layers[level] === 'undefined') {
            this.layers[level] = new Layer(this.width, this.height);
        }

        return this.layers[level];
    }

    getLayersCount = function (): number {
        return this.layers.length;
    }
}