import FractionGenerator from "../generators/FractionGenerator.js";
import { logTimeEvent, resetTimeEvent, throwError } from "../helpers.js";
import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
export default class FractionsOperator {
    constructor(args) {
        this.canIncreaseCellInfluence = function (positionX, positionY) {
            return !this.occupiedTerritories.filled(positionX, positionY);
        };
        this.increaseCellInfluence = function (positionX, positionY, fraction) {
            let _this = this, influenceOriginal = fraction.influenceTerritory.getCell(positionX, positionY), influence = 0;
            // Influence depends on a biome
            if (_this.forestMap.filled(positionX, positionY)) {
                influence *= Config.FRACTIONS.INFLUENCE.FOREST;
            }
            else {
                let infName = _this.biomesMap.getCell(positionX, positionY).getName();
                if (typeof Config.FRACTIONS.INFLUENCE[infName] === 'undefined') {
                    throwError('Unknown influence name: ' + infName, 10, true);
                }
                else {
                    influence *= Config.FRACTIONS.INFLUENCE[infName];
                }
            }
            // 1 is the maximum influence
            influence = Math.min(1, influenceOriginal + influence);
            // @TODO Logic..
            fraction.influenceTerritory.setCell(positionX, positionY, influence);
        };
        this.occupyCell = function (positionX, positionY, fraction) {
            fraction.territory.fill(positionX, positionY);
            fraction.influenceTerritory.setCell(positionX, positionY, 1);
            this.occupiedTerritories.fill(positionX, positionY);
        };
        this.canOccupyCell = function (positionX, positionY, fraction) {
            return !this.occupiedTerritories.filled(positionX, positionY)
                && fraction.influenceTerritory.getCell(positionX, positionY) === 1;
        };
        this.expandFraction = function (fraction) {
            const _this = this;
            fraction.borders.foreachFilledAroundRadiusToAllCells(function (nx, ny, fromCellX, fromCellY) {
                if (_this.canIncreaseCellInfluence(nx, ny)) {
                    _this.increaseCellInfluence(nx, ny, fraction);
                }
                if (_this.canOccupyCell(nx, ny, fraction)) {
                    _this.occupyCell(nx, ny, fraction);
                    _this.fillFractionsLayer([nx, ny], fraction);
                }
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
                if (fraction.territory.hasUnfilledNeighbors(x, y)) {
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
        this.fractionsGenerator = new FractionGenerator(args);
        this.forestMap = args.forestMap;
        this.biomesMap = args.biomesMap;
        this.fractionsLayer = args.fractionsLayer;
        this.fractionsBorderLayer = args.fractionsBorderLayer;
        this.fractions = [];
        this.occupiedTerritories = new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE);
        args.timer.addStepsHandler(function (step) {
            if (_this.fractions.length) {
                _this.expandFractions();
            }
            else if (Config.FRACTIONS.AUTO_CREATE_ON_STEP === step) {
                _this.createFractions(Config.FRACTIONS.COUNT);
            }
        });
    }
    createFractions(count) {
        resetTimeEvent();
        this.fractions = this.fractionsGenerator.generateFractions(count);
        for (let i = 0; i < this.fractions.length; i++) {
            this.occupyCell(this.fractions[i].startPosition[0], this.fractions[i].startPosition[1], this.fractions[i]);
            this.fillFractionsStartPosition(this.fractions[i].startPosition, this.fractions[i]);
        }
        if (Config.LOGS) {
            logTimeEvent('Fractions created.');
        }
    }
}
