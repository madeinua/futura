import FractionGenerator, {FractionsGeneratorArgs} from "../generators/FractionGenerator.js";
import {Layer} from "../render/Layer.js";
import Timer from "../services/Timer.js";
import {Filters, logTimeEvent, resetTimeEvent, throwError} from "../helpers.js";
import Config from "../../config.js";
import Fraction from "../human/Fraction.js";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import {Cell} from "../structures/Cells.js";
import BiomesMap from "../maps/BiomesMap.js";

export type FractionsOperatorArgs = FractionsGeneratorArgs & {
    timer: Timer,
    fractionsLayer: Layer,
    fractionsBorderLayer: Layer,
};

export default class FractionsOperator {

    readonly fractionsGenerator: FractionGenerator;
    readonly fractionsLayer: Layer;
    readonly fractionsBorderLayer: Layer;
    readonly forestMap: BinaryMatrix;
    readonly biomesMap: BiomesMap;

    fractions: Fraction[];
    occupiedTerritories: BinaryMatrix;

    constructor(args: FractionsOperatorArgs) {
        const _this: FractionsOperator = this;

        this.fractionsGenerator = new FractionGenerator(args);
        this.forestMap = args.forestMap;
        this.biomesMap = args.biomesMap;
        this.fractionsLayer = args.fractionsLayer;
        this.fractionsBorderLayer = args.fractionsBorderLayer;
        this.fractions = [];
        this.occupiedTerritories = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        args.timer.addStepsHandler(function (step: number): void {
            if (_this.fractions.length) {
                _this.expandFractions();
                Filters.apply('fractionsUpdated', _this.fractions);
            } else if (Config.FRACTIONS.AUTO_CREATE_ON_STEP === step) {
                _this.createFractions(Config.FRACTIONS.COUNT);
            }
        });
    }

    createFractions(count: number) {

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

    private canIncreaseCellInfluence = function (positionX: number, positionY: number): boolean {
        return !this.occupiedTerritories.filled(positionX, positionY);
    }

    private increaseCellInfluence = function (positionX: number, positionY: number, fraction: Fraction): void {
        let _this: FractionsOperator = this,
            influenceOriginal = fraction.influenceTerritory.getCell(positionX, positionY),
            influence = Config.FRACTIONS.INFLUENCE.BASE;

        // Influence depends on a biome
        if (_this.forestMap.filled(positionX, positionY)) {
            influence *= Config.FRACTIONS.INFLUENCE.FOREST;
        } else {
            let infName: string = _this.biomesMap.getCell(positionX, positionY).getName();

            if (typeof Config.FRACTIONS.INFLUENCE[infName] === 'undefined') {
                throwError('Unknown influence name: ' + infName, 10, true);
            } else {
                influence *= Config.FRACTIONS.INFLUENCE[infName];
            }
        }

        // 1 is the maximum influence
        influence = Math.min(1, influenceOriginal + influence);

        // @TODO Logic..
        fraction.influenceTerritory.setCell(positionX, positionY, influence);
    }

    private occupyCell = function (positionX: number, positionY: number, fraction: Fraction): void {
        fraction.territory.fill(positionX, positionY);
        fraction.influenceTerritory.setCell(positionX, positionY, 1);
        this.occupiedTerritories.fill(positionX, positionY);
    }

    private canOccupyCell = function (positionX: number, positionY: number, fraction: Fraction): boolean {
        return !this.occupiedTerritories.filled(positionX, positionY)
            && fraction.influenceTerritory.getCell(positionX, positionY) === 1;
    }

    private expandFraction = function (fraction: Fraction): void {
        const _this: FractionsOperator = this;

        fraction.borders.foreachFilledAroundRadiusToAllCells(function (nx: number, ny: number, fromCellX: number, fromCellY: number) {

            if (_this.canIncreaseCellInfluence(nx, ny)) {
                _this.increaseCellInfluence(nx, ny, fraction);
            }

            if (_this.canOccupyCell(nx, ny, fraction)) {
                _this.occupyCell(nx, ny, fraction);
                _this.fillFractionsLayer([nx, ny], fraction);
            }
        }, 1);
    }

    private expandFractions = function (): void {
        const _this: FractionsOperator = this;

        for (let i = 0; i < this.fractions.length; i++) {
            _this.expandFraction(this.fractions[i]);
            _this.updateFractionBorders(this.fractions[i]);
        }

        _this.fillFractionsBorderLayer();
    }

    private updateFractionBorders = function (fraction: Fraction): void {
        fraction.borders.unfillAll();
        fraction.territory.foreachFilled(function (x: number, y: number): void {
            if (fraction.territory.hasUnfilledNeighbors(x, y)) {
                fraction.borders.fill(x, y);
            }
        });
    }

    private fillFractionsStartPosition = function (position: Cell, fraction: Fraction): void {
        this.fractionsLayer.setCell(
            position[0],
            position[1],
            new DisplayCell(fraction.getFractionColor(), null, true)
        );
    }

    private fillFractionsLayer = function (position: Cell, fraction: Fraction): void {
        this.fractionsLayer.setCell(
            position[0],
            position[1],
            new DisplayCell(fraction.getFractionTerritoryColor(), null, true)
        );
    }

    private fillFractionsBorderLayer = function (): void {
        const _this: FractionsOperator = this;

        _this.fractionsBorderLayer.setAll(null);

        _this.fractions.forEach(function (fraction: Fraction): void {
            fraction.borders.foreachFilled(function (x: number, y: number): void {
                _this.fractionsBorderLayer.setCell(
                    x,
                    y,
                    new DisplayCell(fraction.getFractionBorderColor(), null, true)
                );
            });
        });
    }
}