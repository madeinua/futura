import {Layer} from '../render/Layer.js';

export const LAYER_BIOMES = 0;
export const LAYER_FOREST = 1;
export const LAYER_HABITAT = 2;
export const LAYER_ANIMALS = 3;
export const LAYER_FRACTIONS = 4;

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