// noinspection JSUnusedLocalSymbols

// vChanged
function ItErrorDetector(url) {
    if(!(this instanceof ItErrorDetector))
        throw new Error("ERROR: usage: var itErrorDetector = new ItErrorDetector('/api/errorlog');");
    var _reportedErrors = {};
    window.addEventListener('error', this.report);

    /**
     * Report the error, once, ignoring repeated instances, to the url.
     *
     * @param {string | Error} error - The error message or error object.
     *
     * @return {void}
     */
    function report(error) {
        if(error === null || error === '')
            return;
        if(typeof error === 'string')
            error = {message: error.message};
        var key = error.message + "\t" + (error.filename || '') + "\t" + (error.lineno || '') + "\t" +
            (error.colno || '');
        if(_reportedErrors.hasOwnProperty(key)) {
            _reportedErrors[key]++;
            return;
        }
        _reportedErrors[key] = 1;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var errorData = {
            url: window.location.href,
            message: error.message,
            filename: error.filename || '',
            lineno: error.lineno || '',
            colno: error.colno || '',
            stack: error.stack || '',
        }
        xhr.onload = function () {
            if((xhr.status < 200 || xhr.status > 300) && typeof console === 'object' && typeof console.log === 'function')
                console.log('ERROR ItErrorDetector: ' + xhr.statusText + ' failed registering error to ' + url, errorData);
        };
        xhr.onerror = function() {
            if(typeof console === 'object' && typeof console.log === 'function')
                console.log('ERROR: ItErrorDetector failed registering error to ' + url, errorData);
        };
        xhr.send(JSON.stringify(errorData));
    }

    return {
        report: report,
    }
}
