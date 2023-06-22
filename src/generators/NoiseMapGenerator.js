import PointMatrix from "../structures/PointMatrix.js";
export default class NoiseMapGenerator {
    constructor(size, power) {
        this.size = size;
        this.power = power;
    }
    generate() {
        noise.seed(Math.random());
        const _this = this, map = new PointMatrix(_this.size, _this.size);
        map.map(function (x, y) {
            return (noise.simplex2(x / _this.power, y / _this.power) + 1) * 0.5; // [0, 1] blurred height map
        });
        return map;
    }
}
