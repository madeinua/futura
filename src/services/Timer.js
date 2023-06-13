import {logTimeEvent} from "../helpers.js";

export default class Timer {

    /** @var {number} */
    timerStep = 0;

    /** @var {Array} */
    stepsHandlers = [];

    /** @var {Object} */
    config;

    /**
     * @param {Object} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @param {function} handler
     */
    addStepsHandler(handler) {
        this.stepsHandlers.push(handler);
    }

    /**
     * @param {CallableFunction} callback
     */
    stepsTimer = function(callback) {

        let _this = this,
            timerStart = Date.now(),
            minStepInterval = _this.config.STEPS_MIN_INTERVAL / _this.config.STEPS_BOOST,
            boosted = false,
            timerInterval;

        _this.timerStep = 0;

        let makeStep = function() {

            if (_this.timerPaused) {
                return;
            }

            for (let i = 0; i < _this.stepsHandlers.length; i++) {
                _this.stepsHandlers[i](_this.timerStep);
            }

            _this.timerStep++;

            callback();

            if (_this.timerStep > _this.config.STEPS_LIMIT) {

                if (_this.config.LOGS) {
                    logTimeEvent('Steps running has been ended. Avg. time per step: ' + Math.round((Date.now() - timerStart) / _this.config.STEPS_LIMIT) + 'ms');
                }

                clearInterval(timerInterval);
                return;
            }

            if (!boosted && _this.timerStep > _this.config.STEPS_BOOST_STEPS) {
                clearInterval(timerInterval);
                minStepInterval *= _this.config.STEPS_BOOST;
                timerInterval = setInterval(makeStep, minStepInterval);
                boosted = true;
            }
        };

        timerInterval = setInterval(makeStep, minStepInterval);

        if (_this.config.LOGS) {
            logTimeEvent('Steps counting started.');
        }

        makeStep();
    };

    /**
     * @return {boolean}
     */
    isTimerPaused = function() {
        return this.timerPaused;
    }

    /**
     * @return {boolean}
     */
    pauseTimer = function() {

        if (this.isTimerPaused()) {
            return false;
        }

        this.timerPaused = true;

        return true;
    };

    /**
     * @return {boolean}
     */
    unpauseTimer = function() {

        if (!this.isTimerPaused()) {
            return false;
        }

        this.timerPaused = false;

        return true;
    };
}