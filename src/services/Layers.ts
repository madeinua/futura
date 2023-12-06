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

        for (let i = 0; i < 5; i++) {
            this.layers[i] = new Layer(this.width, this.height);
        }
    }

    getLayer = function (level: number): Layer {
        return this.layers[level];
    }

    foreachLayerValues = function (level: number, callback: Function): void {
        this.layers[level].foreachValues(callback);
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