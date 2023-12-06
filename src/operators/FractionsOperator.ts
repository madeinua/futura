import FractionGenerator, {FractionsGeneratorArgs} from "../generators/FractionGenerator.js";
import {Layer} from "../render/Layer.js";
import Timer from "../services/Timer.js";
import {Filters, logTimeEvent, resetTimeEvent} from "../helpers.js";
import Config from "../../config.js";
import Fraction from "../human/Fraction";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import {Cell} from "../structures/Cells.js";
import Layers from "../services/Layers";

export default class FractionsOperator {

    readonly fractionsGenerator: FractionGenerator;
    readonly fractionsLayer: Layer;
    readonly fractionsBorderLayer: Layer;
    fractions: Fraction[];
    occupiedTerritories: BinaryMatrix;

    constructor(timer: Timer, fractionsLayer: Layer, fractionsBorderLayer: Layer, objects: FractionsGeneratorArgs) {
        const _this: FractionsOperator = this;

        this.fractionsLayer = fractionsLayer;
        this.fractionsBorderLayer = fractionsBorderLayer;
        this.fractionsGenerator = new FractionGenerator(objects);
        this.fractions = [];
        this.occupiedTerritories = new BinaryMatrix(0, Config.WORLD_SIZE, Config.WORLD_SIZE);

        timer.addStepsHandler(function (step: number): void {
            if (_this.fractions.length) {
                _this.expandFractions();
            } else if (Config.FRACTIONS.AUTO_CREATE_ON_STEP === step) {
                _this.createFractions(Config.FRACTIONS.CREATE_COUNT);
            }
        });
    }

    createFractions(count: number) {

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

    hasFractions(): boolean {
        return this.fractions.length > 0;
    }

    private fillOccupiedTerritory = function (position: Cell): void {
        this.occupiedTerritories.fill(position[0], position[1]);
    }

    private occupyCell = function (positionX: number, positionY: number, fraction: Fraction): void {
        fraction.territory.fill(positionX, positionY);
        this.fillOccupiedTerritory([positionX, positionY]);
    }

    private expandFraction = function (fraction: Fraction): void {
        const _this: FractionsOperator = this;

        fraction.borders.foreachFilledAroundRadiusToAllCells(function (nx: number, ny: number, fromCellX: number, fromCellY: number) {

            // Skip already filled
            if (_this.occupiedTerritories.filled(nx, ny)) {
                return;
            }

            // @TODO Logic..

            _this.occupyCell(nx, ny, fraction);
            _this.fillFractionsLayer([nx, ny], fraction);
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
            if (fraction.territory.countFilledNeighbors(x, y) < 6) {
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