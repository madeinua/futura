import { Layer } from '../render/Layer.js';
export const LAYER_BIOMES = 0;
export const LAYER_BIOMES_IMAGES = 1;
export const LAYER_FOREST = 2;
export const LAYER_HABITAT = 3;
export const LAYER_ANIMALS = 4;
export const LAYER_FRACTIONS = 5;
export const LAYER_FRACTIONS_BORDERS = 6;
export default class Layers {
    constructor(width, height) {
        this.layers = [];
        this.getLayersLevels = function () {
            return [
                LAYER_BIOMES,
                LAYER_BIOMES_IMAGES,
                LAYER_FOREST,
                LAYER_HABITAT,
                LAYER_ANIMALS,
                LAYER_FRACTIONS,
                LAYER_FRACTIONS_BORDERS
            ];
        };
        this.getMaxLevel = function () {
            return this.getLayersLevels().map((level) => level).reduce((a, b) => Math.max(a, b));
        };
        this.getLayer = function (level) {
            return this.layers[level];
        };
        this.foreachLayerValues = function (level, callback) {
            this.layers[level].foreachFilledValues(callback);
        };
        this.getMiniManLayersLevels = function () {
            return [
                LAYER_BIOMES,
                LAYER_FOREST,
                LAYER_FRACTIONS_BORDERS
            ];
        };
        this.foreachMiniMapLayersValues = function (callback) {
            this.getMiniManLayersLevels().forEach((level) => this.foreachLayerValues(level, callback));
        };
        this.width = width;
        this.height = height;
        for (let level = 0; level <= this.getMaxLevel(); level++) {
            this.layers[level] = new Layer(this.width, this.height);
        }
    }
    foreachLayers(callback) {
        for (let level = 0; level < this.layers.length; level++) {
            callback(level);
        }
    }
}
