class DisplayCell {

    /** {array} */
    color;

    /** {null|HTMLImageElement} */
    image;

    /** {boolean} */
    withBg;

    /**
     * @param {array} color
     * @param {null|HTMLImageElement} image
     * @param {boolean} withBackground
     */
    constructor(color, image, withBackground) {
        this.color = color;
        this.image = typeof image === 'undefined' ? null : image;
        this.withBg = withBackground;
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

    /**
     * @returns {boolean}
     */
    drawBackground() {
        return this.withBg || !this.hasImage();
    }
}