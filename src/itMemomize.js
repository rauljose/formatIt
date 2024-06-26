// noinspection ES6ConvertVarToLetConst

/**
 * A memoization, cache, utility that allows storing and retrieving function results based on their parameters.
 *
 * @example
 *      var vx_cacheador = new ItMemoize();
 *      vx_cacheador.ttlSecondsDefault = 3600; // default is 0 never expire.
 *      function calculateAndMemoize(a, b) {
 *          let k = vx_cacheador.keyMake("calculateAndMemoize", arguments);
 *          if(vx_cacheador.hasItem(k)) return vx_cacheador.getItem(k);
 *          let c = a  + b;
 *          return vx_cacheador.setItem(k, c, ttlSeconds); // ttl <= 0: forever, undefined uses ttlSecondsDefault
 *      }
 *
 * @returns {{delFunctionName: ((function(string))), delItem: ((function(string))), hasItem: ((function(string): boolean)), getItem: (function(string): *), ttlSecondsDefault: number, keyMake: (function(string, *): string), setItem: (function(*, *, number=): *)}}
 * @constructor
 */
function ItMemoize() {
    if (!(this instanceof ItMemoize))
        throw "Error usage: var memoizer = new ItMemoize();";
    var _memoize = {};
    var ttlSecondsDefault = 0;

    /**
     * Create a key by concatenating the functionName and key parameter values.
     *
     * @param {string} functionName - The name of the function.
     * @param {any} key - The key parameter value.
     * @returns {string} - The key created by concatenating the functionName and key parameter values.
     */
    function keyMake(functionName, key) {return functionName + "\t" + JSON.stringify(key);}

    /**
     * Set an item in the storage.
     *
     * @param {string} key - The key to store the item under.
     * @param {*} value - The value to be stored.
     * @param {number} [ttlSeconds] - The time-to-live for the item in seconds. Defaults to 0 (no expiration).
     * @returns {*} - The stored value.
     */
    function setItem(key, value, ttlSeconds) {
        _memoize[key] = {
            value: value,
            ttl: typeof ttlSeconds === "undefined" ?
                ttlSecondsDefault :
                parseInt(ttlSeconds) || ttlSecondsDefault,
            timestamp: new Date()
        };
        return value;
    }

    /**
     * Checks if an item with the given key is present in the memoize cache.
     *
     * @param {string} key - The key to check for.
     * @returns {boolean} - Returns `true` if the item is present and hasn't expired, otherwise `false`.
     */
    function hasItem(key) {
        if(!_memoize.hasOwnProperty(key))
            return false;
        var cachedItem = _memoize[key];
        if(cachedItem.ttl <= 0)
            return true;
        return Date.now() - cachedItem.timestamp < cachedItem.ttl;
    }

    /**
     * Retrieves the value associated with a given key from the memoization cache.
     *
     * @param {string} key - The key of the item to retrieve from the cache.
     * @returns {any} - The value associated with the given key, or undefined if the key does not exist in the cache.
     */
    function getItem(key) {return this.hasItem(key) ? _memoize[key].value : undefined;}

    /**
     * Deletes an item from the memoization cache.
     *
     * @param {string} key - The key of the item to delete.
     */
    function delItem(key) {delete _memoize[key];}

    /**
     * Deletes all cached entries in the _memoize object that start with the given functionName.
     *
     * @param {string} functionName - The name of the function to delete cached entries for.
     */
    function delFunctionName(functionName) {
        let functionNameTerminated = functionName + "\t";
        for(let key in _memoize)
            if(_memoize.hasOwnProperty(key) && key.startsWith(functionNameTerminated))
                delete _memoize[key]
    }

    return {
        keyMake: keyMake,
        setItem: setItem,
        hasItem: hasItem,
        getItem: getItem,
        delItem: delItem,
        delFunctionName: delFunctionName,
        ttlSecondsDefault: ttlSecondsDefault
    };

}

var itThrottle = {
    /**
     * throttledFunction will only execute once every `delayMilliSeconds` milliseconds, other calls are ignored.
     *
     * @param {function} throttledFunction - The function to throttle.
     * @param {number} [delayMilliSeconds=500] - The number of milliseconds to delay between function invocations.
     * @returns {function} - The throttled function.
     */
    throttle: function(throttledFunction, delayMilliSeconds = 500) {
        var lastCall = 0;
        return function(...args) {
            var now = new Date().getTime();
            if (now - delayMilliSeconds < delay)
                return;
            lastCall = now;
            return throttledFunction(...args);
        }
    },

    /**
     * The listener's callback will only be called once every delayMilliSeconds,
     * repeated events will be ignored until delayMilliseconds have elapsed
     *
     * @param {string|object} elementOrId - The ID or dom object of the element to attach the event listener to.
     * @param {string} event - The event type to listen for.
     * @param {function} callback - The callback function to be called when the event is triggered.
     * @param {number} [delayMilliSeconds=500] - The delay in milliseconds before invoking the callback function.
     */
    eventListenerThrottled: function(elementOrId, event, callback, delayMilliSeconds = 500) {
        var element = typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
        var throttledCallback = this.throttle(callback, delayMilliSeconds);
        element.addEventListener(event, throttledCallback);
    },
};
