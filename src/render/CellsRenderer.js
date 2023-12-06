var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { preloadImages, rgbToHex } from "../helpers.js";
import Config from "../../config.js";
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
    renderCell(ctx, displayCell, x, y) {
        if (displayCell.hasImage()) {
            ctx.drawImage(this.imagesCache[displayCell.getImage()], x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
        }
        else {
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = rgbToHex(displayCell.getColor());
            ctx.lineWidth = 1;
            ctx.strokeRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
            ctx.globalAlpha = .2;
            ctx.fillStyle = rgbToHex(displayCell.getColor());
            ctx.fillRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
            ctx.globalAlpha = 1;
        }
    }
}
