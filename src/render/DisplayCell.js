export default class DisplayCell {
    constructor(color, image) {
        this.color = color;
        if (Array.isArray(image)) {
            this.images = image.filter((image) => image !== null);
        }
        else if (image === null) {
            this.images = [];
        }
        else {
            this.images = [image];
        }
    }
    getColor() {
        return this.color;
    }
    getImages() {
        return this.images;
    }
}
