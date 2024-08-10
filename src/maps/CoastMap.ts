import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import OceanMap from "./OceanMap.js";
import AltitudeMap from "./AltitudeMap.js";

export default class CoastMap extends BinaryMatrix {

    readonly oceanMap: OceanMap;
    readonly altitudeMap: AltitudeMap;

    constructor(oceanMap: OceanMap, altitudeMap: AltitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.oceanMap = oceanMap;
        this.altitudeMap = altitudeMap;
    }

    isCoast(altitude: number): boolean {
        return altitude >= Config.MIN_COAST_LEVEL && altitude <= Config.MIN_GROUND_LEVEL;
    }

    generateMap(): CoastMap {
        this.oceanMap.foreachFilled((x: number, y: number): void => {
            if (this.isCoast(this.altitudeMap.getCell(x, y))) {
                this.fill(x, y);
            }
        });
        return this;
    }
}