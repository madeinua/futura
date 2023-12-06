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
            return this.layers[level];
        };
        this.foreachLayerValues = function (level, callback) {
            this.layers[level].foreachValues(callback);
        };
        this.getMiniManLayersLevels = function () {
            return [
                LAYER_BIOMES,
                LAYER_FOREST,
                LAYER_FRACTIONS
            ];
        };
        this.foreachMiniMapLayersValues = function (callback) {
            this.getMiniManLayersLevels().forEach((level) => this.foreachLayerValues(level, callback));
        };
        this.width = width;
        this.height = height;
        for (let i = 0; i < 5; i++) {
            this.layers[i] = new Layer(this.width, this.height);
        }
    }
    foreachLayers(callback) {
        for (let level = 0; level < this.layers.length; level++) {
            callback(level);
        }
    }
}
