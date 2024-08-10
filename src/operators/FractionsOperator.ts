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

    private fractions: Fraction[] = [];
    private occupiedTerritories: BinaryMatrix;

    constructor(args: FractionsOperatorArgs) {
        this.fractionsGenerator = new FractionGenerator(args);
        this.forestMap = args.forestMap;
        this.biomesMap = args.biomesMap;
        this.fractionsLayer = args.fractionsLayer;
        this.fractionsBorderLayer = args.fractionsBorderLayer;
        this.occupiedTerritories = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        args.timer.addStepsHandler((step: number): void => {
            if (this.fractions.length) {
                this.expandFractions();
                Filters.apply('fractionsUpdated', this.fractions);
            } else if (Config.FRACTIONS.AUTO_CREATE_ON_STEP === step) {
                this.createFractions(Config.FRACTIONS.COUNT);
            }
        });
    }

    public createFractions(count: number): void {
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

    private canIncreaseCellInfluence(positionX: number, positionY: number): boolean {
        return !this.occupiedTerritories.filled(positionX, positionY);
    }

    private increaseCellInfluence(positionX: number, positionY: number, fraction: Fraction): void {
        let influence = 1;
        const influenceOriginal = fraction.influenceTerritory.getCell(positionX, positionY);
        const biome = this.biomesMap.getCell(positionX, positionY);

        // Influence depends on the biome
        if (this.forestMap.filled(positionX, positionY)) {
            influence *= Config.FRACTIONS.INFLUENCE.FOREST_BOOST;
        } else {
            const infName = biome.getName();

            if (typeof Config.FRACTIONS.INFLUENCE[infName] === 'undefined') {
                throwError(`Unknown influence name: ${infName}`, 10, true);
            } else {
                influence *= Config.FRACTIONS.INFLUENCE[infName];
            }
        }

        // Influence depends on the altitude
        if (biome.isHills) {
            influence *= Config.FRACTIONS.INFLUENCE.HILLS_BOOST;
        } else if (biome.isMountains) {
            influence *= Config.FRACTIONS.INFLUENCE.MOUNTAINS_BOOST;
        }

        // 1 is the maximum influence
        influence = Math.min(1, influenceOriginal + influence);

        fraction.influenceTerritory.setCell(positionX, positionY, influence);
    }

    private occupyCell(positionX: number, positionY: number, fraction: Fraction): void {
        fraction.territory.fill(positionX, positionY);
        fraction.influenceTerritory.setCell(positionX, positionY, 1);
        this.occupiedTerritories.fill(positionX, positionY);
    }

    private canOccupyCell(positionX: number, positionY: number, fraction: Fraction): boolean {
        return !this.occupiedTerritories.filled(positionX, positionY)
            && fraction.influenceTerritory.getCell(positionX, positionY) === 1;
    }

    private expandFraction(fraction: Fraction): void {
        fraction.borders.foreachFilledAroundRadiusToAllCells((nx: number, ny: number, fromCellX: number, fromCellY: number) => {
            if (this.canIncreaseCellInfluence(nx, ny)) {
                this.increaseCellInfluence(nx, ny, fraction);
            }

            if (this.canOccupyCell(nx, ny, fraction)) {
                this.occupyCell(nx, ny, fraction);
                this.fillFractionsLayer([nx, ny], fraction);
            }
        }, 1);
    }

    private expandFractions(): void {
        this.fractions.forEach(fraction => {
            this.expandFraction(fraction);
            this.updateFractionBorders(fraction);
        });

        this.fillFractionsBorderLayer();
    }

    private updateFractionBorders(fraction: Fraction): void {
        fraction.borders.unfillAll();
        fraction.territory.foreachFilled((x: number, y: number): void => {
            if (fraction.territory.hasUnfilledNeighbors(x, y)) {
                fraction.borders.fill(x, y);
            }
        });
    }

    private fillFractionsStartPosition(position: Cell, fraction: Fraction): void {
        this.fractionsLayer.setCell(
            position[0],
            position[1],
            new DisplayCell(fraction.getFractionColor(), null)
        );
    }

    private fillFractionsLayer(position: Cell, fraction: Fraction): void {
        this.fractionsLayer.setCell(
            position[0],
            position[1],
            new DisplayCell(fraction.getFractionTerritoryColor(), null)
        );
    }

    private fillFractionsBorderLayer(): void {
        this.fractionsBorderLayer.unsetAll();

        this.fractions.forEach(fraction => {
            fraction.borders.foreachFilled((x: number, y: number): void => {
                this.fractionsBorderLayer.setCell(
                    x,
                    y,
                    new DisplayCell(fraction.getFractionBorderColor(), null)
                );
            });
        });
    }
}