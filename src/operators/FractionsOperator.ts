import FractionGenerator, {FractionsGeneratorArgs} from "../generators/FractionGenerator.js";
import {Layer} from "../render/Layer.js";
import Timer from "../services/Timer.js";
import {Filters, logTimeEvent, resetTimeEvent} from "../helpers.js";
import Config from "../../config.js";
import Fraction from "../human/Fraction";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import {Cell} from "../structures/Cells.js";

export default class FractionsOperator {

    readonly fractionsGenerator: FractionGenerator;
    readonly fractionsLayer: Layer;
    fractions: Fraction[];
    occupiedTerritories: BinaryMatrix;

    constructor(timer: Timer, fractionsLayer: Layer, objects: FractionsGeneratorArgs) {
        const _this: FractionsOperator = this;

        this.fractionsLayer = fractionsLayer;
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
            this.fillFractionsLayer(this.fractions[i].startPosition, this.fractions[i]);
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

    private fillFractionsLayer = function (position: Cell, fraction: Fraction): void {
        this.fractionsLayer.setCell(
            position[0],
            position[1],
            new DisplayCell(fraction.getFractionColor(), null, true)
        );
    }

    private occupyCell = function (positionX: number, positionY: number, fraction: Fraction, fromPositionX: number, fromPositionY: number): void {

        fraction.territory.fill(positionX, positionY);
        fraction.borders.fill(positionX, positionY);
        fraction.borders.unfill(fromPositionX, fromPositionY);

        this.occupiedTerritories.fill(positionX, positionY);

        this.fractionsLayer.setCell(
            positionX,
            positionY,
            new DisplayCell(fraction.getFractionColor(), null, true)
        );
    }

    private expandFraction = function (fraction: Fraction): void {
        const _this: FractionsOperator = this;

        fraction.borders.foreachFilledAroundRadiusToAllCells(function (nx: number, ny: number, cellX: number, cellY: number) {

            // Skip already filled
            if (_this.occupiedTerritories.filled(nx, ny)) {
                return;
            }

            _this.occupyCell(nx, ny, fraction, cellX, cellY);
        }, 1);
    }

    private expandFractions = function (): void {
        const _this: FractionsOperator = this;

        for (let i = 0; i < this.fractions.length; i++) {
            _this.expandFraction(this.fractions[i]);
        }
    }
}