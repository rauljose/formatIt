

var itDetector = {

    browserMissing: function() {
        var missing = []
        if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
            missing.push("mediaDevices");
        if(!window.File)
            missing.push("File");
        if(!window.MediaStream)
            missing.push("MediaStream");
        else if(!window.MediaStream.prototype.getTracks) // Safari
            missing.push("MediaStream.getTracks");
        return missing;
    },

    isSafari: function() {
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1 && ua.indexOf('crios') === -1 && ua.indexOf('fxios') === -1);
    },

    errorTrap: function() {
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            var message = [
                'Message: ' + msg,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Column: ' + columnNo,
                // 'Error object: ' + JSON.stringify(error)
            ].join(' - ');
            alert(message);
            return false;
        };
        if ('onunhandledrejection' in window)
            window.onunhandledrejection = function(event) {
                /*  reason: ReferenceError: baba is not defined
                    columnNumber: 50
                    fileName: "debugger eval code"
                    lineNumber: 1
                    message: "baba is not defined"
                    stack: "@debugger eval code:1:50\npromise callback*@debugger eval code:1:12\n"
*/

                let summary = 'Unhandled promise rejection: \n';
                summary += 'Message: ' + event.reason.message + '\n';
                if (event.reason instanceof Error) {
                    summary += 'Stack: ' + event.reason.stack;
                }
                // Crashlytics.log(event.reason);
                // Prevent the default handling (such as outputting the
                // error to the console)0
                // event.preventDefault();
                alert(summary);
            };
    }

}