import NumericMatrix from './NumericMatrix.js';
// PointMatrix is a NumericMatrix with values in the range [0, 1]
export default class PointMatrix extends NumericMatrix {
    // Normalize the matrix values to the range [0, 1]
    normalize() {
        this.setRange(0, 1);
        return this;
    }
}
