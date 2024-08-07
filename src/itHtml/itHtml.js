const itHtml = {

    /**
     * The selected option's css class is added to the select class, the previous selected option class is removed
     *
     * @usage
     *   <script>
     *       window.onload = function() {
     *          itHtml.selectColorea("id");
     *          document.getElementById("id").addEventListener('change', itHtml.selectColorea);
     *       }
     *   </script>
     *   <style>
     *         SELECT {background-color: white}
     *         OPTION:NOT(:checked) {color:initial;background-color:initial;font-weight:initial;}
     *         OPTION.classToSelect {color:red}
     *         .classToSelect {color:red}
     *         OPTION.otra {color:blue}
     *         .otra {color:blue}
     *         OPTION.classNotChange {color:blue}
     *   </style>
     *   <select id="id">
     *       <option class="classToSelect">class=classToSelect</option>
     *       <option>No Class defined</option>
     *       <option class="otra">Class=Otra</option>
     *   </select>
     * @param {string|event} eventOrId
     */
    selectColorea: function(eventOrId) {
        let selectElement = typeof eventOrId === 'string' ? document.getElementById(eventOrId) : eventOrId.target;
        let prevClass = selectElement.dataset.selectedOptionClass;
        if(prevClass)
            selectElement.classList.remove(prevClass);
        const optionClass = selectElement.options[selectElement.selectedIndex].className;
        if(optionClass.length)
            selectElement.classList.add(optionClass);
        selectElement.dataset.selectedOptionClass = optionClass;
    },

    /**
     * Retrieves or sets the value of a radio button with the specified name.
     *
     * @param {string} name - The name of the radio button group.
     * @param {string} [value] - The value to set for the radio button, if defined.
     * @returns {*} If no value is provided, returns the value of the selected radio button.
     *               If a value is provided, returns undefined.
     */
    radioButtonValue: function(name, value) {
        if(typeof value === 'undefined')
            return (document.querySelector(`input[name='${name}']:checked`) || {}).value || undefined;
        (document.querySelector(`input[name='${name}'][value='${value}']`) || {}).checked=true;
    },

    /**
     * Create and display a blocking overlay on the page, preventing user interaction.
     *
     * @param {string} [overlayClassName=""] - The class name to be added to the overlay element. On empty a fallback style is used.
     * @param {string} [overlayElementOrId="itHtml_BlockUI"] - The id to be assigned to the overlay element. The default is "itHtml_BlockUI".
     * @param {number|null} [timeout=null] - The duration in milliseconds after which the overlay should be automatically removed.
     *                                       Pass null for no timeout. The default is null.
     */
    blockUI: function(overlayClassName = "", overlayElementOrId = "itHtml_BlockUI", timeout = null) {
        let overlay;
        if(document.getElementById(overlayElementOrId)) {
            overlay = document.getElementById(overlayElementOrId);
            if(overlay.style.display !== "none")
                return;
            overlay.style.display = "block";
        } else {
            overlay = document.createElement("div");
            overlay.id = overlayElementOrId;
            overlay.dataset.ithtml = "auto";
            if(typeof overlayClassName === 'string' && overlayClassName.length)
                overlay.classList.add(overlayClassName);
            else {
                overlay.style.background = "rgba(0, 0, 0, 0.5)";
                overlay.style.position = "fixed";
                overlay.style.top = "0";
                overlay.style.left = "0";
                overlay.style.width = "100%";
                overlay.style.height = "100%";
                overlay.style.zIndex = "9999";
            }
            document.body.appendChild(overlay);
        }
        if(timeout && typeof timeout === 'number')
            setTimeout(function() {this.unblockUI(overlayElementOrId)}, timeout);
    },

    /**
     * Removes the blocking overlay from the DOM.
     *
     * @param {string} overlayElementOrId - The ID of the overlay element to be removed. Default value is "itHtml_BlockUI".
     */
    unblockUI: function(overlayElementOrId = "itHtml_BlockUI") {
        let overlay = typeof overlayElementOrId === 'string' ?
            document.getElementById(overlayElementOrId) : overlayElementOrId;
        if(overlay)
            if(overlay.dataset.ithtml === "auto")
                document.body.removeChild(overlay);
            else
                overlay.style.display = "none";
    },


    preventDoubleSubmit: function(elementOrformId, overlayClassName = "", overlayId = "itHtml_BlockUI", timeout = null) {
        let form = typeof elementOrformId === 'string' ? document.getElementById(elementOrformId) : elementOrformId;
        if(form) {
            if(form.classList.contains('it_submitting')) {
                form.preventDefault();
                return;
            }
            form.addEventListener('submit', function(e) {
                if(this.checkValidity()) {
                    e.preventDefault();
                    this.classList.add('it_submitting');
                    itHtml.blockUI(overlayClassName, overlayId, timeout);
                    setTimeout(() => this.submit(), 0);
                } else {
                    this.reportValidity();
                }
            });
        }
    },

    /**
     * Attach an event listener that will run once to a given element
     * @usage one("id", "click", functionName); function functionName(clickEvent) {}
     *
     * @param {string|object} elementOrId - The id, or dom element, of the element to attach the event listener to
     * @param {string} event - The event type to listen for
     * @param {Function} callback - The callback function to execute when the event is fired
     */
    one: function(elementOrId, event, callback) {
        let element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        element.addEventListener(event, function handler(ev) {
            ev.currentTarget.removeEventListener(ev.type, handler);
            callback(ev);
        });
    },

    /**
     * throttledFunction will only execute once every `delayMilliSeconds` milliseconds, other calls are ignored.
     *
     * @param {function} throttledFunction - The function to throttle.
     * @param {number} [delayMilliSeconds=500] - The number of milliseconds to delay between function invocations.
     * @returns {function} - The throttled function.
     */
    throttle: function(throttledFunction, delayMilliSeconds = 500) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
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
        let element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        let throttledCallback = this.throttle(callback, delayMilliSeconds);
        element.addEventListener(event, throttledCallback);
    },

};