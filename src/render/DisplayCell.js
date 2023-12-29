export default class DisplayCell {
    constructor(color, image) {
        this.color = color;
        this.image = image;
    }
    getColor() {
        return this.color;
    }
    hasImage() {
        return this.image !== null;
    }
    getImage() {
        return this.image;
    }
}
