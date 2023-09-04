import NumericMatrix from './NumericMatrix.js';

// Point matrix is numeric matrix with values in range [0, 1]
export default class PointMatrix extends NumericMatrix {

    normalize(): this {
        this.setRange(0, 1);
        return this;
    }
}