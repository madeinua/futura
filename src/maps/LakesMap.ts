import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";
import OceanMap from "./OceanMap.js";

export default class LakesMap extends BinaryMatrix {

    readonly altitudeMap: AltitudeMap;
    readonly oceanMap: OceanMap;

    constructor(altitudeMap: AltitudeMap, oceanMap: OceanMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
    }

    generateMap(): LakesMap {
        this.altitudeMap.foreachValues((altitude: number, x: number, y: number): void => {
            if (this.altitudeMap.isWater(altitude) && !this.oceanMap.filled(x, y)) {
                this.fill(x, y);
            }
        });

        return this;
    }
}