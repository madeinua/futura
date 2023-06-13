import BinaryMatrix from "../structures/BinaryMatrix.js";
import LakesMap from "../maps/LakesMap.js";
import RiversMap from "../maps/RiversMap.js";
import CoastMap from "../maps/CoastMap.js";
import OceanMap from '../maps/OceanMap.js';
import {Filters, logTimeEvent} from "../helpers.js";

export default class WaterOperator {

    /** @var {Object} */
    config;

    /**
     * @param {Object} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {OceanMap}
     */
    generateOceanMap = function(altitudeMap) {

        let oceanMap = new OceanMap(altitudeMap, this.config),
            storage = this.config.STORE_DATA ? localStorage.getItem('oceanMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            oceanMap.fromString(storage);
        } else {

            oceanMap.generateMap();

            if (this.config.STORE_DATA) {
                localStorage.setItem('oceanMap', oceanMap.toString());
            }
        }

        oceanMap = Filters.apply('oceanMap', oceanMap);

        if (this.config.LOGS) {
            logTimeEvent('Ocean map calculated. Size: ' + oceanMap.getSize() + '%');
        }

        return oceanMap;
    }

    /**
     * @param {OceanMap} oceanMap
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @return {CoastMap}
     */
    getCoastMap = function(oceanMap, altitudeMap, temperatureMap) {

        let coastMap = new CoastMap(oceanMap, altitudeMap, temperatureMap, this.config),
            storage = this.config.STORE_DATA ? localStorage.getItem('coastMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            coastMap.fromString(storage);
        } else {

            coastMap.generateMap();

            if (this.config.STORE_DATA) {
                localStorage.setItem('coastMap', coastMap.toString());
            }
        }

        coastMap = Filters.apply('coastMap', coastMap);

        if (this.config.LOGS) {
            logTimeEvent('Coast map calculated.');
        }

        return coastMap;
    }

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @return {LakesMap}
     */
    generateLakesMap = function(altitudeMap, oceanMap) {

        let lakesMap = new LakesMap(altitudeMap, oceanMap, this.config),
            storage = this.config.STORE_DATA ? localStorage.getItem('lakesMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            lakesMap.fromString(storage);
        } else {

            lakesMap.generateMap();

            if (this.config.STORE_DATA) {
                localStorage.setItem('lakesMap', lakesMap.toString());
            }
        }

        lakesMap = Filters.apply('lakesMap', lakesMap);

        if (this.config.LOGS) {
            logTimeEvent('Lakes map calculated. Size: ' + lakesMap.getSize() + '%');
        }

        return lakesMap;
    }

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {LakesMap} lakesMap
     * @return {RiversMap}
     */
    generateRiversMap = function(altitudeMap, lakesMap) {

        let riversMap = new RiversMap(altitudeMap, lakesMap, this.config),
            storage = this.config.STORE_DATA ? localStorage.getItem('riversMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            riversMap.fromString(storage);
        } else {

            riversMap.generateMap();

            if (this.config.STORE_DATA) {
                localStorage.setItem('riversMap', riversMap.toString());
            }
        }

        riversMap = Filters.apply('riversMap', riversMap);

        if (this.config.LOGS) {
            logTimeEvent('Rivers generated. Rivers: ' + riversMap.getGeneratedRiversCount());
        }

        return riversMap;
    }

    /**
     * @param {LakesMap} lakesMap
     * @param {RiversMap} riversMap
     * @return {BinaryMatrix}
     */
    getFreshWaterMap = function(lakesMap, riversMap) {

        let freshWaterMap = new BinaryMatrix(0, this.config.WORLD_SIZE, this.config.WORLD_SIZE);

        freshWaterMap.combineWith(lakesMap);
        freshWaterMap.combineWith(riversMap);

        return freshWaterMap;
    }
}