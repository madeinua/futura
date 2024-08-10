import FractionGenerator from "../generators/FractionGenerator.js";
import { Filters, logTimeEvent, resetTimeEvent, throwError } from "../helpers.js";
import Config from "../../config.js";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
export default class FractionsOperator {
    constructor(args) {
        this.fractions = [];
        this.fractionsGenerator = new FractionGenerator(args);
        this.forestMap = args.forestMap;
        this.biomesMap = args.biomesMap;
        this.fractionsLayer = args.fractionsLayer;
        this.fractionsBorderLayer = args.fractionsBorderLayer;
        this.occupiedTerritories = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        args.timer.addStepsHandler((step) => {
            if (this.fractions.length) {
                this.expandFractions();
                Filters.apply('fractionsUpdated', this.fractions);
            }
            else if (Config.FRACTIONS.AUTO_CREATE_ON_STEP === step) {
                this.createFractions(Config.FRACTIONS.COUNT);
            }
        });
    }
    createFractions(count) {
        resetTimeEvent();
        this.fractions = this.fractionsGenerator.generateFractions(count);
        this.fractions.forEach(fraction => {
            this.occupyCell(fraction.startPosition[0], fraction.startPosition[1], fraction);
            this.fillFractionsStartPosition(fraction.startPosition, fraction);
        });
        if (Config.LOGS) {
            logTimeEvent('Fractions created.');
        }
    }
    canIncreaseCellInfluence(positionX, positionY) {
        return !this.occupiedTerritories.filled(positionX, positionY);
    }
    increaseCellInfluence(positionX, positionY, fraction) {
        let influence = 1;
        const influenceOriginal = fraction.influenceTerritory.getCell(positionX, positionY);
        const biome = this.biomesMap.getCell(positionX, positionY);
        // Influence depends on the biome
        if (this.forestMap.filled(positionX, positionY)) {
            influence *= Config.FRACTIONS.INFLUENCE.FOREST_BOOST;
        }
        else {
            const infName = biome.getName();
            if (typeof Config.FRACTIONS.INFLUENCE[infName] === 'undefined') {
                throwError(`Unknown influence name: ${infName}`, 10, true);
            }
            else {
                influence *= Config.FRACTIONS.INFLUENCE[infName];
            }
        }
        // Influence depends on the altitude
        if (biome.isHills) {
            influence *= Config.FRACTIONS.INFLUENCE.HILLS_BOOST;
        }
        else if (biome.isMountains) {
            influence *= Config.FRACTIONS.INFLUENCE.MOUNTAINS_BOOST;
        }
        // 1 is the maximum influence
        influence = Math.min(1, influenceOriginal + influence);
        fraction.influenceTerritory.setCell(positionX, positionY, influence);
    }
    occupyCell(positionX, positionY, fraction) {
        fraction.territory.fill(positionX, positionY);
        fraction.influenceTerritory.setCell(positionX, positionY, 1);
        this.occupiedTerritories.fill(positionX, positionY);
    }
    canOccupyCell(positionX, positionY, fraction) {
        return !this.occupiedTerritories.filled(positionX, positionY)
            && fraction.influenceTerritory.getCell(positionX, positionY) === 1;
    }
    expandFraction(fraction) {
        fraction.borders.foreachFilledAroundRadiusToAllCells((nx, ny, fromCellX, fromCellY) => {
            if (this.canIncreaseCellInfluence(nx, ny)) {
                this.increaseCellInfluence(nx, ny, fraction);
            }
            if (this.canOccupyCell(nx, ny, fraction)) {
                this.occupyCell(nx, ny, fraction);
                this.fillFractionsLayer([nx, ny], fraction);
            }
        }, 1);
    }
    expandFractions() {
        this.fractions.forEach(fraction => {
            this.expandFraction(fraction);
            this.updateFractionBorders(fraction);
        });
        this.fillFractionsBorderLayer();
    }
    updateFractionBorders(fraction) {
        fraction.borders.unfillAll();
        fraction.territory.foreachFilled((x, y) => {
            if (fraction.territory.hasUnfilledNeighbors(x, y)) {
                fraction.borders.fill(x, y);
            }
        });
    }
    fillFractionsStartPosition(position, fraction) {
        this.fractionsLayer.setCell(position[0], position[1], new DisplayCell(fraction.getFractionColor(), null));
    }
    fillFractionsLayer(position, fraction) {
        this.fractionsLayer.setCell(position[0], position[1], new DisplayCell(fraction.getFractionTerritoryColor(), null));
    }
    fillFractionsBorderLayer() {
        this.fractionsBorderLayer.unsetAll();
        this.fractions.forEach(fraction => {
            fraction.borders.foreachFilled((x, y) => {
                this.fractionsBorderLayer.setCell(x, y, new DisplayCell(fraction.getFractionBorderColor(), null));
            });
        });
    }
}
