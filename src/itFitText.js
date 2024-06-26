/**
 * Fits text within a given HTML element's width, reducing font size by 0.5px down to minFotSizePx
 *
 * @param {string|HTMLElement} element - The ID of the element or the actual element object.
 * @param {number} [minFontSizePx=9] - The minimum font size in pixels. Defaults to 9px.
 * @returns {boolean} Returns true if the text fits or was reduced to fit, false otherwise.
 */
function itFitText(element, minFontSizePx = 9) {
    try {
        if(typeof element === 'string')
            element = document.getElementById(element);
        if(typeof element === 'undefined' || element === null || typeof element !== 'object')
            return false;
        if(isNaN(minFontSizePx) || minFontSizePx < 1)
            minFontSizePx = 9;

        if(element.scrollWidth <= element.clientWidth)
            return true;
        let maxLoops = 16;
        let computedFontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
        if(computedFontSize === null || typeof computedFontSize !== 'string' || computedFontSize === '')
            return false;
        let fontSize = parseInt(computedFontSize.replace('px', ''));
        while(element.scrollWidth > element.clientWidth && fontSize >= minFontSizePx && --maxLoops > 0)
            element.style.fontSize = (fontSize -= 0.5) + 'px';
        return true;
    } catch(e) {
        return false;
    }
}
