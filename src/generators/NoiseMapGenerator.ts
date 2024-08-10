import PointMatrix from "../structures/PointMatrix.js";

declare const noise: any;

export default class NoiseMapGenerator {
    private readonly size: number;
    private readonly power: number;

    constructor(size: number, power: number) {
        this.size = size;
        this.power = power;
    }

    generate(): PointMatrix {
        noise.seed(Math.random());

        const map = new PointMatrix(this.size, this.size);

        map.map((x: number, y: number): number => {
            return (noise.simplex2(x / this.power, y / this.power) + 1) * 0.5; // [0, 1] blurred height map
        });

        return map;
    }
}