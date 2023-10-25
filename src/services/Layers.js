import { Layer } from '../render/Layer.js';
export const LAYER_BIOMES = 0;
export const LAYER_FOREST = 1;
export const LAYER_HABITAT = 2;
export const LAYER_ANIMALS = 3;
export const LAYER_FRACTIONS = 4;
export default class Layers {
    constructor(width, height) {
        this.layers = [];
        this.getLayer = function (level) {
            if (typeof this.layers[level] === 'undefined') {
                this.layers[level] = new Layer(this.width, this.height);
            }
            return this.layers[level];
        };
        this.foreachLayersValues = function (callback) {
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].foreachValues(callback);
            }
        };
        this.width = width;
        this.height = height;
    }
}
