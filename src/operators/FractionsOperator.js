import FractionGenerator from "../generators/FractionGenerator.js";
import { logTimeEvent, resetTimeEvent } from "../helpers.js";
import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
export default class FractionsOperator {
    constructor(timer, fractionsLayer, objects) {
        this.fillOccupiedTerritory = function (position) {
            this.occupiedTerritories.fill(position[0], position[1]);
        };
        this.fillFractionsLayer = function (position, fraction) {
            this.fractionsLayer.setCell(position[0], position[1], new DisplayCell(fraction.getFractionColor(), null, true));
        };
        this.occupyCell = function (positionX, positionY, fraction, fromPositionX, fromPositionY) {
            fraction.territory.fill(positionX, positionY);
            fraction.borders.fill(positionX, positionY);
            fraction.borders.unfill(fromPositionX, fromPositionY);
            this.occupiedTerritories.fill(positionX, positionY);
            this.fractionsLayer.setCell(positionX, positionY, new DisplayCell(fraction.getFractionColor(), null, true));
        };
        this.expandFraction = function (fraction) {
            const _this = this;
            fraction.borders.foreachFilledNeighborsToAllCells(function (nx, ny, cellX, cellY) {
                // Already filled
                if (_this.occupiedTerritories.filled(nx, ny)) {
                    return;
                }
                _this.occupyCell(nx, ny, fraction, cellX, cellY);
            });
        };
        this.explandFractions = function () {
            for (let i = 0; i < this.fractions.length; i++) {
                this.expandFraction(this.fractions[i]);
            }
        };
        this.timer = timer;
        this.fractionsLayer = fractionsLayer;
        this.fractionsGenerator = new FractionGenerator(objects);
        this.occupiedTerritories = new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
    }
    createFractions(count) {
        resetTimeEvent();
        this.fractions = this.fractionsGenerator.generateFractions(count);
        for (let i = 0; i < this.fractions.length; i++) {
            this.fillOccupiedTerritory(this.fractions[i].startPosition);
            this.fillFractionsLayer(this.fractions[i].startPosition, this.fractions[i]);
        }
        if (Config.LOGS) {
            logTimeEvent('Fractions created.');
        }
    }
    hasFractions() {
        return this.fractions.length > 0;
    }
}
