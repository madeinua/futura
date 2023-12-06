import FractionGenerator from "../generators/FractionGenerator.js";
import { logTimeEvent, resetTimeEvent } from "../helpers.js";
import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
export default class FractionsOperator {
    constructor(timer, fractionsLayer, fractionsBorderLayer, objects) {
        this.fillOccupiedTerritory = function (position) {
            this.occupiedTerritories.fill(position[0], position[1]);
        };
        this.occupyCell = function (positionX, positionY, fraction) {
            fraction.territory.fill(positionX, positionY);
            this.fillOccupiedTerritory([positionX, positionY]);
        };
        this.expandFraction = function (fraction) {
            const _this = this;
            fraction.borders.foreachFilledAroundRadiusToAllCells(function (nx, ny, fromCellX, fromCellY) {
                // Skip already filled
                if (_this.occupiedTerritories.filled(nx, ny)) {
                    return;
                }
                // @TODO Logic..
                _this.occupyCell(nx, ny, fraction);
                _this.fillFractionsLayer([nx, ny], fraction);
            }, 1);
        };
        this.expandFractions = function () {
            const _this = this;
            for (let i = 0; i < this.fractions.length; i++) {
                _this.expandFraction(this.fractions[i]);
                _this.updateFractionBorders(this.fractions[i]);
            }
            _this.fillFractionsBorderLayer();
        };
        this.updateFractionBorders = function (fraction) {
            fraction.borders.unfillAll();
            fraction.territory.foreachFilled(function (x, y) {
                if (fraction.territory.countFilledNeighbors(x, y) < 6) {
                    fraction.borders.fill(x, y);
                }
            });
        };
        this.fillFractionsStartPosition = function (position, fraction) {
            this.fractionsLayer.setCell(position[0], position[1], new DisplayCell(fraction.getFractionColor(), null, true));
        };
        this.fillFractionsLayer = function (position, fraction) {
            this.fractionsLayer.setCell(position[0], position[1], new DisplayCell(fraction.getFractionTerritoryColor(), null, true));
        };
        this.fillFractionsBorderLayer = function () {
            const _this = this;
            _this.fractionsBorderLayer.setAll(null);
            _this.fractions.forEach(function (fraction) {
                fraction.borders.foreachFilled(function (x, y) {
                    _this.fractionsBorderLayer.setCell(x, y, new DisplayCell(fraction.getFractionBorderColor(), null, true));
                });
            });
        };
        const _this = this;
        this.fractionsLayer = fractionsLayer;
        this.fractionsBorderLayer = fractionsBorderLayer;
        this.fractionsGenerator = new FractionGenerator(objects);
        this.fractions = [];
        this.occupiedTerritories = new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
        timer.addStepsHandler(function (step) {
            if (_this.fractions.length) {
                _this.expandFractions();
            }
            else if (Config.FRACTIONS.AUTO_CREATE_ON_STEP === step) {
                _this.createFractions(Config.FRACTIONS.CREATE_COUNT);
            }
        });
    }
    createFractions(count) {
        resetTimeEvent();
        this.fractions = this.fractionsGenerator.generateFractions(count);
        for (let i = 0; i < this.fractions.length; i++) {
            this.fillOccupiedTerritory(this.fractions[i].startPosition);
            this.fillFractionsStartPosition(this.fractions[i].startPosition, this.fractions[i]);
        }
        if (Config.LOGS) {
            logTimeEvent('Fractions created.');
        }
    }
    hasFractions() {
        return this.fractions.length > 0;
    }
}
