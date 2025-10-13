import FactionGenerator, {FactionsGeneratorArgs} from "../generators/FactionGenerator.js";
import {Layer} from "../render/Layer.js";
import Timer from "../services/Timer.js";
import {Filters, logTimeEvent, resetTimeEvent, throwError} from "../helpers.js";
import Config from "../../config.js";
import Faction from "../human/Faction.js";
import DisplayCell from "../render/DisplayCell.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import {Cell} from "../structures/Cells.js";
import BiomesMap from "../maps/BiomesMap.js";

export type FactionsOperatorArgs = FactionsGeneratorArgs & {
    timer: Timer,
    factionsLayer: Layer,
    factionsBorderLayer: Layer,
};

export default class FactionsOperator {

    readonly factionsGenerator: FactionGenerator;
    readonly factionsLayer: Layer;
    readonly factionsBorderLayer: Layer;
    readonly forestMap: BinaryMatrix;
    readonly biomesMap: BiomesMap;

    private factions: Faction[] = [];
    private occupiedTerritories: BinaryMatrix;

    constructor(args: FactionsOperatorArgs) {
        this.factionsGenerator = new FactionGenerator(args);
        this.forestMap = args.forestMap;
        this.biomesMap = args.biomesMap;
        this.factionsLayer = args.factionsLayer;
        this.factionsBorderLayer = args.factionsBorderLayer;
        this.occupiedTerritories = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        args.timer.addStepsHandler((step: number): void => {
            if (this.factions.length) {
                this.expandFactions();
                Filters.apply('factionsUpdated', this.factions);
            } else if (Config.FACTIONS.AUTO_CREATE_ON_STEP === step) {
                this.createFactions(Config.FACTIONS.COUNT);
            }
        });
    }

    public createFactions(count: number): void {
        resetTimeEvent();

        this.factions = this.factionsGenerator.generateFactions(count);

        this.factions.forEach(faction => {
            this.occupyCell(faction.startPosition[0], faction.startPosition[1], faction);
            this.fillFactionsStartPosition(faction.startPosition, faction);
        });

        if (Config.LOGS) {
            logTimeEvent('Factions created.');
        }
    }

    private canIncreaseCellInfluence(positionX: number, positionY: number): boolean {
        return !this.occupiedTerritories.filled(positionX, positionY);
    }

    private increaseCellInfluence(positionX: number, positionY: number, faction: Faction): void {
        let influence = 1;
        const influenceOriginal = faction.influenceTerritory.getCell(positionX, positionY);
        const biome = this.biomesMap.getCell(positionX, positionY);

        // Influence depends on the biome
        if (this.forestMap.filled(positionX, positionY)) {
            influence *= Config.FACTIONS.INFLUENCE.FOREST_BOOST;
        } else {
            const infName = biome.getName();

            if (typeof Config.FACTIONS.INFLUENCE[infName] === 'undefined') {
                throwError(`Unknown influence name: ${infName}`, 10, true);
            } else {
                influence *= Config.FACTIONS.INFLUENCE[infName];
            }
        }

        // Influence depends on the altitude
        if (biome.isHills) {
            influence *= Config.FACTIONS.INFLUENCE.HILLS_BOOST;
        } else if (biome.isMountains) {
            influence *= Config.FACTIONS.INFLUENCE.MOUNTAINS_BOOST;
        }

        // 1 is the maximum influence
        influence = Math.min(1, influenceOriginal + influence);

        faction.influenceTerritory.setCell(positionX, positionY, influence);
    }

    private occupyCell(positionX: number, positionY: number, faction: Faction): void {
        faction.territory.fill(positionX, positionY);
        faction.influenceTerritory.setCell(positionX, positionY, 1);
        this.occupiedTerritories.fill(positionX, positionY);
    }

    private canOccupyCell(positionX: number, positionY: number, faction: Faction): boolean {
        return !this.occupiedTerritories.filled(positionX, positionY)
            && faction.influenceTerritory.getCell(positionX, positionY) === 1;
    }

    private expandFaction(faction: Faction): void {
        faction.borders.foreachFilledAroundRadiusToAllCells((nx: number, ny: number) => {
            if (this.canIncreaseCellInfluence(nx, ny)) {
                this.increaseCellInfluence(nx, ny, faction);
            }

            if (this.canOccupyCell(nx, ny, faction)) {
                this.occupyCell(nx, ny, faction);
                this.fillFactionsLayer([nx, ny], faction);
            }
        }, 1);
    }

    private expandFactions(): void {
        this.factions.forEach(faction => {
            this.expandFaction(faction);
            this.updateFactionBorders(faction);
        });

        this.fillFactionsBorderLayer();
    }

    private updateFactionBorders(faction: Faction): void {
        faction.borders.unfillAll();
        faction.territory.foreachFilled((x: number, y: number): void => {
            if (faction.territory.hasUnfilledNeighbors(x, y)) {
                faction.borders.fill(x, y);
            }
        });
    }

    private fillFactionsStartPosition(position: Cell, faction: Faction): void {
        this.factionsLayer.setCell(
            position[0],
            position[1],
            new DisplayCell(faction.getFactionColor(), null)
        );
    }

    private fillFactionsLayer(position: Cell, faction: Faction): void {
        this.factionsLayer.setCell(
            position[0],
            position[1],
            new DisplayCell(faction.getFactionTerritoryColor(), null)
        );
    }

    private fillFactionsBorderLayer(): void {
        this.factionsBorderLayer.unsetAll();

        this.factions.forEach(faction => {
            faction.borders.foreachFilled((x: number, y: number): void => {
                this.factionsBorderLayer.setCell(
                    x,
                    y,
                    new DisplayCell(faction.getFactionBorderColor(), null)
                );
            });
        });
    }
}