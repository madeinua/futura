import BinaryMatrix from "../structures/BinaryMatrix.js";
import LakesMap from "../maps/LakesMap.js";
import RiversMap from "../maps/RiversMap.js";
import CoastMap from "../maps/CoastMap.js";
import OceanMap from '../maps/OceanMap.js';
import { Filters, logTimeEvent } from "../helpers.js";
import Config from "../../config.js";
export default class WaterOperator {
    constructor() {
        this.generateOceanMap = function (altitudeMap) {
            let oceanMap = new OceanMap(altitudeMap), storage = Config.STORE_DATA ? localStorage.getItem('oceanMap') : null;
            if (typeof storage !== 'undefined' && storage !== null) {
                oceanMap.fromString(storage);
            }
            else {
                oceanMap.generateMap();
                if (Config.STORE_DATA) {
                    localStorage.setItem('oceanMap', oceanMap.toString());
                }
            }
            oceanMap = Filters.apply('oceanMap', oceanMap);
            if (Config.LOGS) {
                logTimeEvent('Ocean map calculated. Size: ' + oceanMap.getSize() + '%');
            }
            return oceanMap;
        };
        this.getCoastMap = function (oceanMap, altitudeMap, temperatureMap) {
            let coastMap = new CoastMap(oceanMap, altitudeMap, temperatureMap), storage = Config.STORE_DATA ? localStorage.getItem('coastMap') : null;
            if (typeof storage !== 'undefined' && storage !== null) {
                coastMap.fromString(storage);
            }
            else {
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
        };
        this.generateLakesMap = function (altitudeMap, oceanMap) {
            let lakesMap = new LakesMap(altitudeMap, oceanMap), storage = Config.STORE_DATA ? localStorage.getItem('lakesMap') : null;
            if (typeof storage !== 'undefined' && storage !== null) {
                lakesMap.fromString(storage);
            }
            else {
                lakesMap.generateMap();
                if (Config.STORE_DATA) {
                    localStorage.setItem('lakesMap', lakesMap.toString());
                }
            }
            lakesMap = Filters.apply('lakesMap', lakesMap);
            if (Config.LOGS) {
                logTimeEvent('Lakes map calculated. Size: ' + lakesMap.getSize() + '%');
            }
            return lakesMap;
        };
        this.generateRiversMap = function (altitudeMap, lakesMap) {
            let riversMap = new RiversMap(altitudeMap, lakesMap), storage = Config.STORE_DATA ? localStorage.getItem('riversMap') : null;
            if (typeof storage !== 'undefined' && storage !== null) {
                riversMap.fromString(storage);
            }
            else {
                riversMap.generateMap();
                if (Config.STORE_DATA) {
                    localStorage.setItem('riversMap', riversMap.toString());
                }
            }
            riversMap = Filters.apply('riversMap', riversMap);
            if (Config.LOGS) {
                logTimeEvent('Rivers generated. Rivers: ' + riversMap.getGeneratedRiversCount());
            }
            return riversMap;
        };
        this.getFreshWaterMap = function (lakesMap, riversMap) {
            let freshWaterMap = new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
            freshWaterMap.combineWith(lakesMap);
            freshWaterMap.combineWith(riversMap);
            return freshWaterMap;
        };
    }
}
