class PointMatrix extends NumericMatrix {

    /**
     * @return {PointMatrix}
     */
    normalize() {
        this.setRange(0, 1);
        return this;
    }
}