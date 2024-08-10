import BinaryMatrix from "../structures/BinaryMatrix.js";
import LakesMap from "../maps/LakesMap.js";
import RiversMap from "../maps/RiversMap.js";
import CoastMap from "../maps/CoastMap.js";
import OceanMap from '../maps/OceanMap.js';
import {Filters, logTimeEvent} from "../helpers.js";
import Config from "../../config.js";
import AltitudeMap from "../maps/AltitudeMap.js";
import IslandsMap from "../maps/IslandsMap.js";

export default class WaterOperator {

    generateOceanMap(altitudeMap: AltitudeMap): OceanMap {
        let oceanMap = new OceanMap(altitudeMap);
        const storage = Config.STORE_DATA ? localStorage.getItem('oceanMap') : null;

        if (storage) {
            oceanMap.fromString(storage);
        } else {
            oceanMap.generateMap();
            if (Config.STORE_DATA) {
                localStorage.setItem('oceanMap', oceanMap.toString());
            }
        }

        oceanMap = Filters.apply('oceanMap', oceanMap);

        if (Config.LOGS) {
            logTimeEvent(`Ocean map calculated. Size: ${oceanMap.getSize()}%`);
        }

        return oceanMap;
    }

    getCoastMap(oceanMap: OceanMap, altitudeMap: AltitudeMap): CoastMap {
        let coastMap = new CoastMap(oceanMap, altitudeMap);
        const storage = Config.STORE_DATA ? localStorage.getItem('coastMap') : null;

        if (storage) {
            coastMap.fromString(storage);
        } else {
            coastMap.generateMap();
            if (Config.STORE_DATA) {
                localStorage.setItem('coastMap', coastMap.toString());
            }
        }

        coastMap = Filters.apply('coastMap', coastMap);

        if (Config.LOGS) {
            logTimeEvent('Coast map calculated.');
        }

        return coastMap;
    }

    generateLakesMap(altitudeMap: AltitudeMap, oceanMap: OceanMap): LakesMap {
        let lakesMap = new LakesMap(altitudeMap, oceanMap);
        const storage = Config.STORE_DATA ? localStorage.getItem('lakesMap') : null;

        if (storage) {
            lakesMap.fromString(storage);
        } else {
            lakesMap.generateMap();
            if (Config.STORE_DATA) {
                localStorage.setItem('lakesMap', lakesMap.toString());
            }
        }

        lakesMap = Filters.apply('lakesMap', lakesMap);

        if (Config.LOGS) {
            logTimeEvent(`Lakes map calculated. Size: ${lakesMap.getSize()}%`);
        }

        return lakesMap;
    }

    generateRiversMap(altitudeMap: AltitudeMap, lakesMap: LakesMap): RiversMap {
        let riversMap = new RiversMap(altitudeMap, lakesMap);
        const storage = Config.STORE_DATA ? localStorage.getItem('riversMap') : null;

        if (storage) {
            riversMap.fromString(storage);
        } else {
            riversMap.generateMap();
            if (Config.STORE_DATA) {
                localStorage.setItem('riversMap', riversMap.toString());
            }
        }

        riversMap = Filters.apply('riversMap', riversMap);

        if (Config.LOGS) {
            logTimeEvent(`Rivers generated. Rivers: ${riversMap.getGeneratedRiversCount()}`);
        }

        return riversMap;
    }

    getFreshWaterMap(lakesMap: LakesMap, riversMap: RiversMap): BinaryMatrix {
        const freshWaterMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        freshWaterMap.combineWith(lakesMap);
        freshWaterMap.combineWith(riversMap);
        return freshWaterMap;
    }

    getIslandsMap(oceanMap: OceanMap): IslandsMap {
        let islandsMap = new IslandsMap(oceanMap);
        const storage = Config.STORE_DATA ? localStorage.getItem('islandsMap') : null;

        if (storage) {
            islandsMap.fromString(storage);
        } else {
            islandsMap.generateMap();
            if (Config.STORE_DATA) {
                localStorage.setItem('islandsMap', islandsMap.toString());
            }
        }

        islandsMap = Filters.apply('islandsMap', islandsMap);

        if (Config.LOGS) {
            logTimeEvent('Islands map generated.');
        }

        return islandsMap;
    }
}