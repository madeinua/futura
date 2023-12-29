import Config from "../../config.js";
import DisplayCell from "./DisplayCell.js";
import {preloadImages, rgbToHex} from "../helpers.js";

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
        const images: string[] = displayCell.getImages();

        if (images.length) {
            for (let i = 0; i < images.length; i++) {
                ctx.drawImage(
                    this.imagesCache[images[i]],
                    x * this.cellWidth,
                    y * this.cellHeight,
                    this.cellWidth,
                    this.cellHeight
                );
            }
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