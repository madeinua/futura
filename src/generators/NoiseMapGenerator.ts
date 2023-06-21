import PointMatrix from "../structures/PointMatrix.js";

declare const noise: any;

export default class NoiseMapGenerator {

    size: number;
    power: number;

    constructor(size: number, power: number) {
        this.size = size;
        this.power = power;
    }

    generate(): PointMatrix {

        noise.seed(Math.random());

        let _this = this,
            map = new PointMatrix(_this.size, _this.size);

        map.map(function (x, y) {
            return (noise.simplex2(x / _this.power, y / _this.power) + 1) * 0.5; // [0, 1] blurred height map
        });

        return map;
    }
}