import DisplayCell from "./DisplayCell.js";
import {preloadImages, rgbToHex} from "../helpers.js";
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

    renderCell(ctx: CanvasRenderingContext2D, displayCell: DisplayCell, x: number, y: number): void {
        if (displayCell.hasImage()) {
            ctx.drawImage(
                this.imagesCache[displayCell.getImage()],
                x * this.cellWidth,
                y * this.cellHeight,
                this.cellWidth,
                this.cellHeight
            );
        } else {
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = rgbToHex(displayCell.getColor());
            ctx.lineWidth = 2;
            ctx.strokeRect(
                x * this.cellWidth,
                y * this.cellHeight,
                this.cellWidth,
                this.cellHeight
            );

            ctx.globalAlpha = .2;
            ctx.fillStyle = rgbToHex(displayCell.getColor());
            ctx.fillRect(
                x * this.cellWidth,
                y * this.cellHeight,
                this.cellWidth,
                this.cellHeight
            );
            ctx.globalAlpha = 1;
        }
    }
}