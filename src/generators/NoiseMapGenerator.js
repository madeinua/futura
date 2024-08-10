import PointMatrix from "../structures/PointMatrix.js";
export default class NoiseMapGenerator {
    constructor(size, power) {
        this.size = size;
        this.power = power;
    }
    generate() {
        noise.seed(Math.random());
        const map = new PointMatrix(this.size, this.size);
        map.map((x, y) => {
            return (noise.simplex2(x / this.power, y / this.power) + 1) * 0.5; // [0, 1] blurred height map
        });
        return map;
    }
}
