export default class DisplayCell {
    constructor(color, image) {
        this.color = color;
        this.images = Array.isArray(image)
            ? image.filter((img) => img !== null)
            : (image ? [image] : []);
    }
    getColor() {
        return this.color;
    }
    getImages() {
        return this.images;
    }
}
