import NumericMatrix from './NumericMatrix.js';

export default class PointMatrix extends NumericMatrix {

    normalize(): this {
        this.setRange(0, 1);
        return this;
    }
}