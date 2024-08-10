var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Config from "../../config.js";
import { preloadImages, rgbToHex } from "../helpers.js";
export default class CellsRenderer {
    constructor(cellWidth, cellHeight) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.imagesCache = [];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield preloadImages(Config, this.imagesCache);
        });
    }
    render(ctx, displayCell, x, y) {
        const images = displayCell.getImages();
        const pixelX = x * this.cellWidth;
        const pixelY = y * this.cellHeight;
        if (images.length) {
            images.forEach(imageKey => {
                const image = this.imagesCache[imageKey];
                if (image) {
                    ctx.drawImage(image, pixelX, pixelY, this.cellWidth, this.cellHeight);
                }
                else {
                    console.warn(`Image with key ${imageKey} not found in cache.`);
                }
            });
        }
        else {
            ctx.fillStyle = rgbToHex(displayCell.getColor());
            ctx.fillRect(pixelX, pixelY, this.cellWidth, this.cellHeight);
        }
    }
}
