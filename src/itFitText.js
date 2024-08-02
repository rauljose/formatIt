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
            _calculateFontSize2Element(elements[i]);
        function _fitTheText2Element(el) {
            try {
                var maxLoops = 16;
                var computedFontSize = window.getComputedStyle(el, null).getPropertyValue('font-size');
                if(computedFontSize === null || typeof computedFontSize !== 'string' || computedFontSize === '')
                    return;
                var fontSize = parseFloat(computedFontSize.replace('px', ''));
                var fontSizeIni = fontSize;
                while(el.scrollWidth > el.clientWidth && fontSize > minFontSizePx && --maxLoops > 0)
                    el.style.fontSize = (fontSize -= 0.5) + 'px';
            } catch(err) {
                if(typeof js_errores_a_dime === 'function')
                    js_errores_a_dime(err);
                el.style.fontSize = fontSizeIni + 'px';
            }
        }
        function _calculateFontSize2Element(el) {
            try {
                var maxLoops = 16;
                var computedFontSize = window.getComputedStyle(el, null).getPropertyValue('font-size');
                if (computedFontSize === null || typeof computedFontSize !== 'string' || computedFontSize === '')
                    return;
                var fontSize = parseFloat(computedFontSize.replace('px', ''));
                if(fontSize <= minFontSizePx || el.scrollWidth <= el.clientWidth)
                    return;
                var fontSizeIni = fontSize;
                var desiredWidth = el.scrollWidth;
                var availableWidth = el.clientWidth;
                var scaleFactor = el.clientWidth / el.scrollWidth;
                var newFontSize = fontSize * scaleFactor;
                while (el.scrollWidth > el.clientWidth && newFontSize > minFontSizePx && --maxLoops > 0) {
                    el.style.fontSize = newFontSize + 'px';
                    newFontSize -= 0.5;
                }
            } catch (err) {
                if (typeof js_errores_a_dime === 'function')
                    js_errores_a_dime(err);
                el.style.fontSize = fontSizeIni + 'px';
            }
        }
    } catch (e) {
        if(typeof js_errores_a_dime === 'function')
            js_errores_a_dime(e)
    }
}
