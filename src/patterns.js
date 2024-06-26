


//<editor-fold desc="JS Patterns Intro __________________________________________________________________________">
    /*
    JS Patterns
        IIFE (Immediately Invoked Function Expression) (function(), vars, code)
        Reavaling Module Pattern: como una clase
    JS Tips
        Immutability
        Design By Contract (DbC) emphasizing preconditions, postconditions, and invariants (properties that always hold true)
            @precondition, @postcondition, and @invariant
        Guards: Strategic Parameter Checks for invalid parameters could meaningfully compromise internal state or computations
            @guard
      Web Workers
        * Helper library https://www.npmjs.com/package/comlink
        * SharedArrayBuffer (SAB) and Atomics: These were initially disabled for security reasons but have been gradually re-enabled in a controlled way. They allow for genuine shared memory between the main thread and Workers, enabling true parallel processing, especially for numerically intensive tasks.

            Careful synchronization with Atomics operations is needed for safe use.

        * Worklets: A type of specialized Web Worker designed to run on the rendering pipeline. This makes them ideal for tasks like:

            Custom animations on the GPU (e.g., Paint Worklet)
            Manipulating audio streams (e.g., Audio Worklet)

        * Module Workers: Module support within Web Workers simplifies their creation and dependency management. You can now use import and export statements familiar from regular JavaScript code
        *  Terminate workers explicitly when they are no longer needed to free up resources.

      Service Worker
      */
//</editor-fold>

//<editor-fold desc="ADRs (Architectural Decision Records) __________________________________________________________________________">
/*
        ADRs (Architectural Decision Records):  A lightweight way to document a decision. Typical sections in an ADR include:
            https://adr.github.io/
            Title, Date, Context (Problem statement), Decision Consequences (positive and negative)
*/
//</editor-fold>

//<editor-fold desc="Markdown & Web __________________________________________________________________________">
/*
            md
            https://github.com/showdownjs/showdown
            https://github.com/markedjs/marked
                https://unpkg.com/mermaid https://css-tricks.com/making-mermaid-diagrams-in-markdown/
            markdown-it: One of the most flexible Markdown libraries. It has plugins like markdown-it-mermaid that enable Mermaid diagram rendering.
            Remarkable: Also supports Mermaid through plugins.
            Marked: https://marked.js.org/ (Simple, fast, and popular)
            markdown-it: https://github.com/markdown-it/markdown-it (Highly extensible, follows CommonMark specs)
            Showdown: https://github.com/showdownjs/showdown (One of the older but well-established options)
            Remarkable: https://github.com/jonschlinkert/remarkable (Fast, CommonMark and GFM compliant)
*/
//</editor-fold>
/* Pasar a onde sea

            https://github.com/pinoox/numera
            https://github.com/alrra/browser-logos
 */


//<editor-fold desc="Encapsulate Code __________________________________________________________________________">

    //<editor-fold desc="      Reavaling Module Pattern_ _________________________________________________________">
        /**
         * Forces use of new, everyting is private unless returned, needs ECMAScript 5 or greater
         * @usage let instance = new Counter(3); (new is optional)
         * @param {number} startValue
         * @returns {Counter|{dec: function(): void, set: function(*): void, get: function(): number, inc: function(): void}}
         * @constructor
         */
        var itCounter =(function(startValue) {
            if (!(this instanceof Counter))
                return new Counter(startValue);
            var value = startValue || 0;

            if(isNaN(value))
                value = 0;
            function privateZero() { value = 0;}

            function set(a) {value=a;}
            function inc() {++value;}
            function dec() {--value;}
            function get() {return value;}
            return {
                inc: inc,
                dec: dec,
                set: set,
                get: get
            };
        });

        function Person(name) {
            if(!new.target)
                return new Person(name);
            function log(txt) { console.log(txt) }
            function talk() { log(name + " is talking") }
            function dance() { log(name + " is dancing") }

            // interface
            return {
                private: {
                    log,
                    get name(){return name}
                },
                talk,
                dance
            }
        }

        function Woman(_name) {
            if(!new.target)
                return new Woman(_name);
            // Inherit
            let Super = Person(_name)
            let { name, log } = Super.private

            function talk() { log(name + " is a talking woman"); }
            function jump() { log(name + " is jumping") }

            return Object.assign(Super, { talk, jump }) // Override talk
        }

    //</editor-fold>

//</editor-fold>

//<editor-fold desc="Web Workers __________________________________________________________________________">

    //<editor-fold desc="call_worker __________________________________________________________________________">
        if(window.Worker) {
            const myWorker = new Worker("worker.js");
            myWorker.postMessage([first.value, second.value]);
            myWorker.onmessage = (e) => {
                result.textContent = e.data;
                console.log("Message received from worker");
            };
        }
    //</editor-fold>

    //<editor-fold desc="worker.js __________________________________________________________________________">
        // worker.js file
        onmessage = function(e) {
            console.log('Worker: Message received from main script');
            const result = e.data[0] * e.data[1];
            if(isNaN(result)) {
                postMessage('Please write two numbers');
            } else {
                const workerResult = 'Result: ' + result;
                console.log('Worker: Posting message back to main script');
                postMessage(workerResult);
            }
        }
    //</editor-fold>
//</editor-fold>



/** $("BODY").append("<div>"); in js */

/** $("selector", $("#scope")).append("<div>"); in js */

/** $("<div>", {attributes...}).append("<div>"); in js */

/** jQuery show, hide, toggle, toggle class */

function _trae() {
    return new Promise(function(resolve, reject)  {
        $.ajax({...})
            .done(function(data) {

                console.log("en done del ajax, el tradicional. Mando resolve(data) que se puede ignorar");
                resolve(data);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {

                console.log("en fail del ajax, el tradicional. Mando reject(errorTrhown) que se puede ignorar");
                reject(errorThrown);
            });
    });
}
function llamaTraeYResponde() {
    _trae()
        .then(function(data) {
            // This will run after successful ajax request
            console.log("en function llamadora then, es decir done");
        })
        .catch(function(error) {
            // This will run if the ajax request failed
            console.log("en function llamadora catch, es decir fail", error);
        });
}
