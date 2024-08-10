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
        const images = displayCell.getImages();
        const pixelX = x * this.cellWidth;
        const pixelY = y * this.cellHeight;

        if (images.length) {
            images.forEach(imageKey => {
                const image = this.imagesCache[imageKey];
                if (image) {
                    ctx.drawImage(image, pixelX, pixelY, this.cellWidth, this.cellHeight);
                } else {
                    console.warn(`Image with key ${imageKey} not found in cache.`);
                }
            });
        } else {
            ctx.fillStyle = rgbToHex(displayCell.getColor());
            ctx.fillRect(pixelX, pixelY, this.cellWidth, this.cellHeight);
        }
    }
}