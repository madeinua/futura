class DisplayCell {

    /**
     * @param {array} color
     * @param {null|HTMLImageElement} image
     */
    constructor(color, image) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
    }

    /**
     * @return {array}
     */
    getColor() {
        return this.color;
    }

    /**
     * @return {null|HTMLImageElement}
     */
    getImage() {
        return this.image;
    }

    /**
     * @return {boolean}
     */
    hasImage() {
        return this.image instanceof HTMLImageElement;
    }
}