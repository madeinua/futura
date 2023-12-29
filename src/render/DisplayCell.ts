import {RGBa} from "../helpers.js";

export default class DisplayCell {

    readonly color: RGBa;
    readonly images: string[];

    constructor(color: RGBa, image: null | string | string[]) {
        this.color = color;

        if (Array.isArray(image)) {
            this.images = image.filter((image: string | null) => image !== null);
        } else if (image === null) {
            this.images = [];
        } else {
            this.images = [image];
        }
    }

    getColor(): RGBa {
        return this.color;
    }

    getImages(): string[] {
        return this.images;
    }
}