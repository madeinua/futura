class PointMatrix extends NumericMatrix {

    /**
     * @return {this}
     */
    normalize() {
        this.setRange(0, 1);
        return this;
    }
}