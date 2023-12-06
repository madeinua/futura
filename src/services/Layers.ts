import {Layer} from '../render/Layer.js';

export const LAYER_BIOMES = 0;
export const LAYER_BIOMES_IMAGES = 1;
export const LAYER_FOREST = 2;
export const LAYER_HABITAT = 3;
export const LAYER_ANIMALS = 4;
export const LAYER_FRACTIONS = 5;

export default class Layers {

    layers: Layer[] = [];

    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {

        this.width = width;
        this.height = height;

        for (let level = 0; level <= this.getMaxLevel(); level++) {
            this.layers[level] = new Layer(this.width, this.height);
        }
    }

    getLayersLevels = function (): number[] {
        return [
            LAYER_BIOMES,
            LAYER_BIOMES_IMAGES,
            LAYER_FOREST,
            LAYER_HABITAT,
            LAYER_ANIMALS,
            LAYER_FRACTIONS
        ];
    }

    getMaxLevel = function (): number {
        return this.getLayersLevels().map((level: number) => level).reduce((a: number, b: number) => Math.max(a, b));
    }

    getLayer = function (level: number): Layer {
        return this.layers[level];
    }

    foreachLayerValues = function (level: number, callback: Function): void {
        this.layers[level].foreachFilledValues(callback);
    }

    foreachLayers(callback: Function): void {
        for (let level = 0; level < this.layers.length; level++) {
            callback(level);
        }
    }

    getMiniManLayersLevels = function (): number[] {
        return [
            LAYER_BIOMES,
            LAYER_FOREST,
            LAYER_FRACTIONS
        ];
    }

    foreachMiniMapLayersValues = function (callback: Function): void {
        this.getMiniManLayersLevels().forEach(
            (level: number) => this.foreachLayerValues(level, callback)
        );
    }
}