import Config from "../../config.js";
import { fromFraction, distance, randBetweenNumbers } from "../helpers.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import { arrayHasPoint } from "../structures/Array2D.js";
export default class RiversMap extends BinaryMatrix {
    constructor(altitudeMap, lakesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
        this.lakesMap = lakesMap;
        this.riversCount = 0;
    }
    generateMap() {
        const riverSources = this.getRiverSources(this.altitudeMap);
        const rivers = this.generateRiversCells(riverSources);
        // Optionally add river delta
        // rivers = this.addRiverDeltaToRiversMaps(rivers);
        this.createRiverMapFromRiversPoints(rivers);
        this.riversCount = rivers.length;
        return this;
    }
    getRiverSources(altitudeMap) {
        const spawns = [];
        altitudeMap.foreachValues((altitude, x, y) => {
            if (altitudeMap.isGround(altitude) &&
                altitude >= Config.RIVER_SOURCE_MIN_ALTITUDE &&
                altitude <= Config.RIVER_SOURCE_MAX_ALTITUDE) {
                spawns.push([x, y]);
            }
        });
        return spawns.shuffle();
    }
    generateRiversCells(riverSources) {
        const rivers = [];
        const riversLimit = Math.floor(fromFraction(Config.RIVERS_DENSITY, 1, Config.WORLD_SIZE));
        const startCloseness = Math.max(Config.RIVER_MIN_LENGTH, Config.RIVER_START_CLOSENESS);
        // Use an array for distance calculations and a Set for fast membership tests.
        const allRiversPoints = [];
        const allRiversPointsSet = new Set();
        for (let i = 0; i < riverSources.length; i++) {
            if (i > 0 &&
                startCloseness >= allRiversPoints.getClosestDistanceTo(riverSources[i][0], riverSources[i][1])) {
                continue;
            }
            const river = [];
            let finished = false;
            river.push(riverSources[i]);
            for (let j = 0; j < Config.WORLD_SIZE; j++) {
                const nextRiverPoint = this.getRiverDirection(river, this.altitudeMap);
                if (!nextRiverPoint)
                    break;
                const [x, y] = nextRiverPoint;
                const altitude = this.altitudeMap.getCell(x, y);
                // Instead of calling arrayHasPoint (a linear search), we use our Set.
                if (this.altitudeMap.isWater(altitude) || allRiversPointsSet.has(`${x},${y}`)) {
                    if (this.lakesMap.filled(x, y)) {
                        const lakeSize = this.lakesMap.getSizeFromPoint(x, y);
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
                // Update both the array and the Set.
                for (const point of river) {
                    const key = `${point[0]},${point[1]}`;
                    if (!allRiversPointsSet.has(key)) {
                        allRiversPoints.push(point);
                        allRiversPointsSet.add(key);
                    }
                }
                if (rivers.length === riversLimit)
                    break;
            }
        }
        return rivers;
    }
    getRiverDirection(river, altitudeMap) {
        const currentPoint = river[river.length - 1];
        const prevPoint = river.length > 1 ? river[river.length - 2] : null;
        const [cx, cy] = currentPoint;
        const currentAltitude = altitudeMap.getCell(cx, cy);
        const neighbors = altitudeMap.getNeighbors(cx, cy).shuffle();
        for (const [nx, ny] of neighbors) {
            const altitude = altitudeMap.getCell(nx, ny);
            if (altitude > currentAltitude)
                continue;
            if (prevPoint && distance(nx, ny, prevPoint[0], prevPoint[1]) === 1)
                continue;
            return [nx, ny];
        }
        return null;
    }
    addRiverDeltaToRiverMap(river) {
        const delta = [];
        const ratio = randBetweenNumbers(0.01, Config.RIVER_DELTA_MAX_LENGTH);
        const deltaLength = Math.floor(river.length * ratio);
        const notDeltaLength = river.length - deltaLength;
        for (let p = 0; p < river.length; p++) {
            if (p > notDeltaLength) {
                this.foreachAroundRadius(river[p][0], river[p][1], 1, (nx, ny) => {
                    if ([0, 1].randomElement() === 0 && !arrayHasPoint(river, nx, ny)) {
                        delta.push([nx, ny]);
                    }
                });
            }
        }
        return river.concat(delta);
    }
    createRiverMapFromRiversPoints(rivers) {
        for (const river of rivers) {
            for (const [x, y] of river) {
                this.fill(x, y);
            }
        }
    }
    getGeneratedRiversCount() {
        return this.riversCount;
    }
    addRiverDeltaToRiversMaps(rivers) {
        return rivers.map(river => this.addRiverDeltaToRiverMap(river));
    }
}
