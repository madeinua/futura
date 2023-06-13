import HumidityMap from '../maps/HumidityMap.js';
import {Filters, logTimeEvent} from "../helpers.js";

export default class HumidityOperator {

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
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @return {HumidityMap}
     */
    generateHumidityMap = function(altitudeMap, riversMap, lakesMap) {

        let humidityMap = new HumidityMap(altitudeMap, riversMap, lakesMap, this.config),
            storage = this.config.STORE_DATA ? localStorage.getItem('humidityMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            humidityMap.fromString(storage);
        } else {

            humidityMap.generateMap();

            if (this.config.STORE_DATA) {
                localStorage.setItem('humidityMap', humidityMap.toString());
            }
        }

        humidityMap = Filters.apply('humidityMap', humidityMap);

        if (this.config.LOGS) {
            logTimeEvent('Humidity map created. Min: ' + humidityMap.getMin() + ' Max: ' + humidityMap.getMax() + ' Avg: ' + humidityMap.getAvgValue());
        }

        return humidityMap;
    };
}