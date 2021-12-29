class Timer {

    timerStep = 0;
    tickHandlers = [];
    tickFinalHandlers = [];

    /**
     * @returns {Array}
     */
    getTickHandlers() {
        return this.tickHandlers;
    }

    /**
     * @returns {Array}
     */
    getTickFinalHandler() {
        return this.tickFinalHandlers;
    }

    /**
     * @param {function} handler
     */
    addTickHandler(handler) {
        this.tickHandlers.push(handler);
    }

    /**
     * @param {function} handler
     */
    addTickFinalHandler(handler) {
        this.tickFinalHandlers.push(handler);
    }

    /**
     * @param {CallableFunction} callback
     */
    tickTimer = function(callback) {

        if (!config.TICKS_ENABLED || config.TICKS_LIMIT === 0) {
            callback();
            return;
        }

        let _this = this,
            timerStart = Date.now(),
            minTickInterval = config.TICKS_MIN_INTERVAL / config.TICKS_BOOST,
            boosted = false,
            timerInterval;

        if (config.LOGS) {
            logTimeEvent('Start ticks.');
        }

        _this.timerStep = 0;

        let tickerFn = function() {

            if (_this.timerPaused) {
                return;
            }

            for (let i = 0; i < _this.tickHandlers.length; i++) {
                _this.tickHandlers[i](_this.timerStep);
            }

            if (_this.timerStep === config.TICKS_LIMIT) {

                for (let i = 0; i < _this.tickFinalHandlers.length; i++) {
                    _this.tickFinalHandlers[i]();
                }

                if (config.LOGS) {
                    logTimeEvent('Ticks ended. Avg. time per tick: ' + Math.round((Date.now() - timerStart) / config.TICKS_LIMIT) + 'ms');
                }

                clearInterval(timerInterval);
            }

            _this.timerStep++;

            callback();

            if (!boosted && _this.timerStep > config.TICKS_BOOST_STEPS) {
                clearInterval(timerInterval);
                minTickInterval *= config.TICKS_BOOST;
                timerInterval = setInterval(tickerFn, minTickInterval);
                boosted = true;
            }
        };

        timerInterval = setInterval(tickerFn, minTickInterval);
    };

    /**
     * @returns {number}
     */
    getTick() {
        return this.timerStep;
    }

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