import { logTimeEvent } from "../helpers.js";
import Config from "../../config.js";
export default class Timer {
    constructor() {
        this.timerStep = 0;
        this.stepsHandlers = [];
        this.stepsTimer = function (callback) {
            let _this = this, timerStart = Date.now(), minStepInterval = Config.STEPS_MIN_INTERVAL / Config.STEPS_BOOST, boosted = false, timerInterval;
            _this.timerStep = 0;
            let makeStep = function () {
                if (_this.timerPaused) {
                    return;
                }
                for (let i = 0; i < _this.stepsHandlers.length; i++) {
                    _this.stepsHandlers[i](_this.timerStep);
                }
                _this.timerStep++;
                callback();
                if (_this.timerStep > Config.STEPS_LIMIT) {
                    if (Config.LOGS) {
                        logTimeEvent('Steps running has been ended. Avg. time per step: ' + Math.round((Date.now() - timerStart) / Config.STEPS_LIMIT) + 'ms');
                    }
                    clearInterval(timerInterval);
                    return;
                }
                if (!boosted && _this.timerStep > Config.STEPS_BOOST_STEPS) {
                    clearInterval(timerInterval);
                    minStepInterval *= Config.STEPS_BOOST;
                    timerInterval = setInterval(makeStep, minStepInterval);
                    boosted = true;
                }
            };
            timerInterval = setInterval(makeStep, minStepInterval);
            if (Config.LOGS) {
                logTimeEvent('Steps counting started.');
            }
            makeStep();
        };
        this.isTimerPaused = function () {
            return this.timerPaused;
        };
        this.pauseTimer = function () {
            if (this.isTimerPaused()) {
                return false;
            }
            this.timerPaused = true;
            return true;
        };
        this.unpauseTimer = function () {
            if (!this.isTimerPaused()) {
                return false;
            }
            this.timerPaused = false;
            return true;
        };
    }
    addStepsHandler(handler) {
        this.stepsHandlers.push(handler);
    }
}
