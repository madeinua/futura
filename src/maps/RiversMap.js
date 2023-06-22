import BinaryMatrix from "../structures/BinaryMatrix.js";
import { fromFraction, distance, randBetweenNumbers, arrayHasPoint } from "../helpers.js";
import Config from "../../config.js";
export default class RiversMap extends BinaryMatrix {
    constructor(altitudeMap, lakesMap) {
        super(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.generateMap = function () {
            const riverSources = this.getRiverSources(this.altitudeMap), rivers = this.generateRiversCells(riverSources);
            //rivers = _this.addRiverDeltaToRiversMaps(rivers);
            this.createRiverMapFromRiversPoints(rivers);
            this.riversCount = rivers.length;
            return this;
        };
        this.getRiverSources = function (altitudeMap) {
            const spawns = [];
            altitudeMap.foreach(function (x, y) {
                const altitude = altitudeMap.getCell(x, y);
                if (altitudeMap.isGround(altitude)
                    && altitude >= Config.RIVER_SOURCE_MIN_ALTITUDE
                    && Config.RIVER_SOURCE_MAX_ALTITUDE >= altitude) {
                    spawns.push([x, y]);
                }
            });
            return spawns.shuffle();
        };
        this.generateRiversCells = function (riverSources) {
            const _this = this, rivers = [], riversLimit = Math.floor(fromFraction(Config.RIVERS_DENSITY, 1, Config.WORLD_SIZE)), startCloseness = Math.max(Config.RIVER_MIN_LENGTH, Config.RIVER_START_CLOSENESS);
            let allRiversPoints = [];
            for (let i = 0; i < riverSources.length; i++) {
                // Start point is too close to the other river -> skip
                if (i > 0 && startCloseness >= allRiversPoints.getClosestDistanceTo(riverSources[i][0], riverSources[i][1])) {
                    continue;
                }
                let river = [], finished = false;
                // source = starting point of each river
                river.push(riverSources[i]);
                // max river length = worldSize
                for (let j = 0; j < Config.WORLD_SIZE; j++) {
                    const nextRiverPoint = _this.getRiverDirection(river, _this.altitudeMap);
                    if (!nextRiverPoint) {
                        break;
                    }
                    const x = nextRiverPoint[0], y = nextRiverPoint[1], altitude = _this.altitudeMap.getCell(x, y);
                    // lake/ocean or another river found. means river ending point found.
                    if (_this.altitudeMap.isWater(altitude) || arrayHasPoint(allRiversPoints, x, y)) {
                        if (_this.lakesMap.filled(x, y)) {
                            const lakeSize = _this.lakesMap.getSizeFromPoint(x, y);
                            // finish only when the lake size is bigger than the river length
                            if (lakeSize > river.length * Config.LAKE_TO_RIVER_RATIO) {
                                finished = true;
                                break;
                            }
                        }
                        else {
                            finished = true;
                            break;
                        }
                    }
                    if (!finished) {
                        river.push(nextRiverPoint);
                    }
                }
                if (finished && river.length >= Config.RIVER_MIN_LENGTH) {
                    rivers.push(river);
                    allRiversPoints = allRiversPoints.concat(river);
                    allRiversPoints.unique();
                    if (rivers.length === riversLimit) {
                        break;
                    }
                }
            }
            return rivers;
        };
        this.getRiverDirection = function (river, altitudeMap) {
            const currentPoint = river[river.length - 1], prevPoint = river.length > 1 ? river[river.length - 2] : false, cx = currentPoint[0], cy = currentPoint[1], currentAltitude = altitudeMap.getCell(cx, cy), neighbors = altitudeMap.getNeighbors(cx, cy).shuffle();
            let lowerPoint = null;
            for (let i = 0; i < neighbors.length; i++) {
                const nx = neighbors[i][0], ny = neighbors[i][1], altitude = altitudeMap.getCell(nx, ny);
                if (altitude > currentAltitude) {
                    continue;
                }
                // prevent river being "too wide"
                if (prevPoint && distance(nx, ny, prevPoint[0], prevPoint[1]) === 1) {
                    continue;
                }
                lowerPoint = [nx, ny];
                break;
            }
            return lowerPoint;
        };
        /**
         * Add river delta
         */
        this.addRiverDeltaToRiverMap = function (river) {
            const _this = this, ratio = randBetweenNumbers(0.01, Config.RIVER_DELTA_MAX_LENGTH), deltaLength = river.length * ratio, notDeltaLength = river.length - deltaLength, delta = [];
            for (let p = 0; p < river.length; p++) {
                if (p > notDeltaLength) {
                    _this.foreachAroundRadius(river[p][0], river[p][1], 1, function (nx, ny) {
                        if ([0, 1].randomElement() === 0 && !river.includes([nx, ny])) {
                            delta.push([nx, ny]);
                        }
                    });
                }
            }
            return river.concat(delta);
        };
        this.createRiverMapFromRiversPoints = function (rivers) {
            for (let i = 0; i < rivers.length; i++) {
                for (let p = 0; p < rivers[i].length; p++) {
                    this.fill(rivers[i][p][0], rivers[i][p][1]);
                }
            }
        };
        this.getGeneratedRiversCount = function () {
            return this.riversCount;
        };
        this.addRiverDeltaToRiversMaps = function (rivers) {
            for (let i = 0; i < rivers.length; i++) {
                rivers[i] = this.addRiverDeltaToRiverMap(rivers[i]);
            }
            return rivers;
        };
        this.altitudeMap = altitudeMap;
        this.lakesMap = lakesMap;
        this.riversCount = 0;
    }
}
