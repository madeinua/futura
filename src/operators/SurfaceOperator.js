import AltitudeMap from "../maps/AltitudeMap.js";
import {Filters, logTimeEvent} from "../helpers.js";

export default class SurfaceOperator {

    /** @var {Object} */
    config;

    /**
     * @param {Object} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @return {AltitudeMap}
     */
    generateAltitudeMap = function() {

        let altitudeMap = new AltitudeMap(this.config),
            storage = this.config.STORE_DATA ? localStorage.getItem('altitudeMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            altitudeMap.loadMap(storage);
        } else {

            altitudeMap.generateMap();

            if (this.config.STORE_DATA) {
                localStorage.setItem('altitudeMap', altitudeMap.toString());
            }
        }

        altitudeMap = Filters.apply('altitudeMap', altitudeMap);

        if (this.config.LOGS) {
            logTimeEvent('Altitude map generated. Min: ' + altitudeMap.getMin() + ' Max: ' + altitudeMap.getMax() + ' Avg: ' + altitudeMap.getAvgValue());
        }

        return altitudeMap;
    };
}