/**
 * Fits text within a given HTML element's width, reducing font size by 0.5px down to minFotSizePx
 * TIP: on multiple calls reset font-size before each call.
 *
 * @param {string|HTMLElement|jQuery} element - The ID of the element or the actual element object, or jQuery.
 * @param {number} [minFontSizePx=9] - The minimum font size in pixels. Defaults to 8px.
 * @returns {boolean} Returns true if the text fits or was reduced to fit, false otherwise.
 */
function itFitText(element, minFontSizePx = 10) {

    try {
        var el
        if(typeof element === 'string')
            el = document.getElementById(element);
        else
            el = typeof jQuery === 'function' && element instanceof jQuery ? element[0] : element;
        if(typeof el === 'undefined' || el === null || typeof el !== 'object')
            return false;
        if(el.scrollWidth <= el.clientWidth)
            return true;
        if(isNaN(minFontSizePx) || minFontSizePx < 1)
            minFontSizePx = 10;

        var maxLoops = 16;
        var computedFontSize = window.getComputedStyle(el, null).getPropertyValue('font-size');
        if(computedFontSize === null || typeof computedFontSize !== 'string' || computedFontSize === '')
            return false;
        var fontSize = parseFloat(computedFontSize.replace('px', ''));
        while(el.scrollWidth > el.clientWidth && fontSize > minFontSizePx && --maxLoops > 0)
            el.style.fontSize = (fontSize -= 0.5) + 'px';
        return true;
    } catch(e) {
        console.log("Error itFitText", e);
        return false;
    }
}

/**
 * Fits text within a given HTML element's width, reducing font size by 0.5px down to minFotSizePx to all elements matching the given selector or elements
 * TIP: on multiple calls reset font-size before each call.
 *
 * @param {string|HTMLElement|NodeList|Array|jQuery} selector - CSS selector, NodeList, Array of elements, or jQuery object to fit its text to its width
 * @param {number} [minFontSizePx=8] - The minimum font size in pixels. Defaults to 8px.
 */
function itFitTextAll(selector, minFontSizePx = 10) {
    ajustarTamanoFuente_(selector ); return;
    var elements = [], error = false;
    if(isNaN(minFontSizePx) || minFontSizePx < 1)
        minFontSizePx = 10;
    try {
        if(typeof selector === 'string')
            elements = Array.from(document.querySelectorAll(selector));
        else if(selector instanceof NodeList)
            elements = Array.from(selector);
        else if(Array.isArray(selector))
            elements = selector;
        else if(typeof jQuery === 'function' && selector instanceof jQuery)
            elements = selector.toArray();
        else if(selector && typeof selector === 'object' && selector.nodeType === 1)
            elements = [selector];
        else {
            console.error('Invalid selector or elements provided to itFitTextAll');
            return;
        }
        for(var i = 0, len = elements.length; i < len; ++i)
            _fitTheText2Element(elements[i]);
        function _fitTheText2Element(el) {
            try {
                var maxLoops = 16;
                var computedFontSize = window.getComputedStyle(el, null).getPropertyValue('font-size');
                if(computedFontSize === null || typeof computedFontSize !== 'string' || computedFontSize === '')
                    return;
                var fontSize = parseFloat(computedFontSize.replace('px', ''));
                while(el.scrollWidth > el.clientWidth && fontSize > minFontSizePx && --maxLoops > 0)
                    el.style.fontSize = (fontSize -= 0.5) + 'px';
            } catch(err) {
                js_errores_a_dime(e);
            }
        }
    } catch (e) {
        js_errores_a_dime(e)
    }
}
