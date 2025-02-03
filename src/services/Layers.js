import { Layer } from '../render/Layer.js';
export const LAYER_BIOMES = 0;
export const LAYER_BIOMES_IMAGES = 1;
export const LAYER_FOREST = 2;
export const LAYER_HABITAT = 3;
export const LAYER_ANIMALS = 4;
export const LAYER_FACTIONS = 5;
export const LAYER_FACTIONS_BORDERS = 6;
export default class Layers {
    constructor(width, height) {
        this.layers = [];
        this.width = width;
        this.height = height;
        // Initialize layers array with Layer instances
        this.layers = Array.from({ length: this.getMaxLevel() + 1 }, () => new Layer(this.width, this.height));
    }
    getLayersLevels() {
        return [
            LAYER_BIOMES,
            LAYER_BIOMES_IMAGES,
            LAYER_FOREST,
            LAYER_HABITAT,
            LAYER_ANIMALS,
            LAYER_FACTIONS,
            LAYER_FACTIONS_BORDERS,
        ];
    }
    getMaxLevel() {
        return Math.max(...this.getLayersLevels());
    }
    getLayer(level) {
        return this.layers[level];
    }
    foreachLayerValues(level, callback) {
        this.layers[level].foreachFilledValues(callback);
    }
    foreachLayers(callback) {
        this.layers.forEach((_, level) => callback(level));
    }
    getMainMapLayersLevels() {
        return [
            LAYER_BIOMES_IMAGES,
            LAYER_FOREST,
            LAYER_HABITAT,
            LAYER_ANIMALS,
            LAYER_FACTIONS_BORDERS,
        ];
    }
    foreachMainMapLayersValues(callback) {
        this.getMainMapLayersLevels().forEach(level => this.foreachLayerValues(level, callback));
    }
    getMiniMapLayersLevels() {
        return [
            LAYER_BIOMES,
            LAYER_FOREST,
            LAYER_FACTIONS,
            LAYER_FACTIONS_BORDERS,
        ];
    }
    foreachMiniMapLayersValues(callback) {
        this.getMiniMapLayersLevels().forEach(level => this.foreachLayerValues(level, callback));
    }
}
