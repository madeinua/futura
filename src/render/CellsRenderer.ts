import Config from "../../config";
import DisplayCell from "./DisplayCell";
import {preloadImages, rgbToHex} from "../helpers";

type ImageCache = HTMLImageElement[] & Record<string, HTMLImageElement>;

export default class CellsRenderer {
    cellWidth: number;
    cellHeight: number;
    imagesCache: ImageCache;

    constructor(cellWidth: number, cellHeight: number) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.imagesCache = Object.assign([] as HTMLImageElement[], {}) as ImageCache;
    }

    async init(): Promise<void> {
        // Preload images using the config object.
        await preloadImages(Config, this.imagesCache);
    }

    render(
        ctx: CanvasRenderingContext2D,
        displayCell: DisplayCell,
        x: number,
        y: number
    ): void {
        const images = displayCell.getImages();
        const pixelX = x * this.cellWidth;
        const pixelY = y * this.cellHeight;

        if (images.length > 0) {
            const cache = this.imagesCache;

            for (let i = 0, len = images.length; i < len; i++) {
                const imageKey = images[i];
                const image = cache[imageKey]; // string indexing OK now

                if (image) {
                    ctx.drawImage(image, pixelX, pixelY, this.cellWidth, this.cellHeight);
                } else {
                    console.warn(`Image with key ${imageKey} not found in cache.`);
                }
            }
        } else {
            ctx.fillStyle = rgbToHex(displayCell.getColor());
            ctx.fillRect(pixelX, pixelY, this.cellWidth, this.cellHeight);
        }
    }
}