import DisplayCell from "./DisplayCell.js";
import {preloadImages, rgbToHex, throwError} from "../helpers.js";
import Config from "../../config.js";

export default class CellsRenderer {

    cellWidth: number;
    cellHeight: number;
    imagesCache: HTMLImageElement[];

    constructor(cellWidth: number, cellHeight: number) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.imagesCache = [];
    }

    async init(): Promise<void> {
        await preloadImages(Config, this.imagesCache);
    }

    render(ctx: CanvasRenderingContext2D, displayCell: DisplayCell, x: number, y: number): void {
        if (displayCell.hasImage()) {
            ctx.drawImage(
                this.imagesCache[displayCell.getImage()],
                x * this.cellWidth,
                y * this.cellHeight,
                this.cellWidth,
                this.cellHeight
            );
        } else {
            ctx.fillStyle = rgbToHex(displayCell.getColor());
            ctx.fillRect(
                x * this.cellWidth,
                y * this.cellHeight,
                this.cellWidth,
                this.cellHeight
            );
        }
    }
}