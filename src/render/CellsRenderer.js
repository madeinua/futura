import Config from "../../config.js";
import { preloadImages, rgbToHex } from "../helpers.js";
export default class CellsRenderer {
    constructor(cellWidth, cellHeight) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.imagesCache = [];
    }
    async init() {
        // Preload images using the config object.
        await preloadImages(Config, this.imagesCache);
    }
    render(ctx, displayCell, x, y) {
        // Retrieve the images for this display cell once.
        const images = displayCell.getImages();
        // Compute pixel coordinates only once.
        const pixelX = x * this.cellWidth;
        const pixelY = y * this.cellHeight;
        if (images.length > 0) {
            // Cache imagesCache locally for slightly faster access.
            const cache = this.imagesCache;
            // Use a simple for loop rather than forEach for potential micro-optimizations.
            for (let i = 0, len = images.length; i < len; i++) {
                const imageKey = images[i];
                const image = cache[imageKey];
                if (image) {
                    ctx.drawImage(image, pixelX, pixelY, this.cellWidth, this.cellHeight);
                }
                else {
                    console.warn(`Image with key ${imageKey} not found in cache.`);
                }
            }
        }
        else {
            // If no images, fill the cell with the color converted to hex.
            ctx.fillStyle = rgbToHex(displayCell.getColor());
            ctx.fillRect(pixelX, pixelY, this.cellWidth, this.cellHeight);
        }
    }
}
