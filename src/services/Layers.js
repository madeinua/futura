import { Layer } from '../render/Layer.js';
export default class Layers {
    constructor(width, height) {
        this.layers = [];
        this.getLayer = function (level) {
            if (typeof this.layers[level] === 'undefined') {
                this.layers[level] = new Layer(this.width, this.height);
            }
            return this.layers[level];
        };
        this.getLayersCount = function () {
            return this.layers.length;
        };
        this.width = width;
        this.height = height;
    }
}
