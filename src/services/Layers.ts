import {Layer} from '../render/Layer.js';

export default class Layers {

    layers: any[] = [];
    width: number;
    height: number;

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