import FractionGenerator, {FractionsGeneratorArgs} from "../generators/FractionGenerator.js";
import {Layer} from "../render/Layer.js";
import Timer from "../services/Timer.js";
import {logTimeEvent} from "../helpers.js";
import Config from "../../config.js";
import Fraction from "../human/Fraction";
import DisplayCell from "../render/DisplayCell.js";

export default class FractionsOperator {

    readonly fractionsGenerator: FractionGenerator;
    readonly timer: Timer;
    readonly fractionsLayer: Layer;

    constructor(timer: Timer, fractionsLayer: Layer, objects: FractionsGeneratorArgs) {
        this.timer = timer;
        this.fractionsLayer = fractionsLayer;
        this.fractionsGenerator = new FractionGenerator(objects);
    }

    createFractions(count: number) {

        this.addFractionsToLayer(
            this.fractionsGenerator.generateFractions(count)
        );

        if (Config.LOGS) {
            logTimeEvent('Fractions created.');
        }
    }

    private addFractionsToLayer = function (fractions: Fraction[]): void {
        for (let i = 0; i < fractions.length; i++) {
            this.fractionsLayer.setCell(
                fractions[i].startPosition[0],
                fractions[i].startPosition[1],
                new DisplayCell(fractions[i].getFractionColor(), null, false)
            );
        }
    }
}