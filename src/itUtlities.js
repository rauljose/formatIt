function empty(v) {
    if(typeof v === 'undefined' || null === v)
        return true;
    if(typeof v === 'object')
        return Object.keys(v).length === 0;
    if(Array.isArray(v))
        return v.length === 0;
    if('' === v || false === v)
        return true;
    return !isNaN(v) && parseFloat(v) === 0.00;
}
function empty_test() {
    let cases = [
        [null, true],
        ['', true],
        ['0', true],
        ['0.0', true],
        ['0.00', true],
        ['0.000', true],
        ['-0.0000', true],
        [0, true],
        [0.00, true],
        [false, true],
        [{}, true],
        [[], true],
        [undefined, true],

        [[0], false],
        [[null], false],
        [[false], false],
        [[1], false],
        [[[]], false],

        [{null:false}, false],
        [{a:null}, false],
        [{a:1}, false],
        [{a:"a"}, false],

        ["1", false],
        ["a", false],
        [1, false],
        [-1, false],
        [3/0, false]
    ];
    let failed = 0;
    let testNumber = 0;
    for(let a of cases) {
        if(empty(a[0]) !== a[1]) {
            failed++;
            console.log(`    test #${testNumber}: empty(${a[0]})=${a[1]} Failed: `, a);
        }
        testNumber++;
    }
    console.log(`${failed === 0 ? "✓" : "✗"} empty() failed ${failed} of ${testNumber}`)
    return failed === 0;
}

/**
 *  ucwords Uppercase the first letter of each word, others are lowercased
 *
 * @requires ES9 or use XRegExp library
 * @param {string} str
 * @returns {string}
 */
function ucwords(str) {
    return str.toLowerCase().replace(
        /(^([a-zA-Z\p{L}]))|([ -][a-zA-Z\p{L}])/gmu,
        function(s) {return s.toUpperCase();}
    );
}

function titleCase(str) {
    str = ucwords(str);
    var regExpPattern;
    var notCapitalized = [
        "a", "al", "de", "del", "el", "ella", "la", "las", "los", "un", "una", "uno", "unos", "unas",
        "y", "e", "ni", "o", "u", "pero", "mas", "sino", "aunque", "ó", "más", "ante", "bajo", "cabe",
        "con", "contra", "desde", "en", "entre", "hacia", "hasta", "para", "por", "según", "segun", "sin",
        "sobre", "tras", "me", "te", "se", "nos", "os", "lo", "le", "les",
        "an", "the", "and", "but", "for", "nor", "or", "so", "yet", "at", "by", "in", "of", "on", "to", "up",
        "with", "as", "from", "into", "near", "over", "past", "than", "via"];
    for(let w of notCapitalized) {
        regExpPattern = new RegExp("\\b" + w.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') + "\\b", "giu");
        str = str.replace(regExpPattern, function(s){return s.toLowerCase();})
    }
    return str[0].toUpperCase() + str.substring(1)
}

/**
 * css priority by Specificity 1 selector 1, 0 equal, 2 selector2
 *
 * @param {a:num, b:num, c:num} selector1
 * @param {a:num, b:num, c:num} selector2
 * @returns {number} >0 selector1: greater Specificity. <0 selector2: greater Specificity. =0 Equal Specificity
 *
 * @see https://www.bram.us/2022/06/28/the-css-cascade-a-deep-dive-2022-06-09-css-day/
 *      https://drafts.csswg.org/css-cascade-5
 * @notes
 * 0 Transitions
 * 1 Origin & Importance
 *      !important in your author styles, the declaration moves from the Normal Author Declarations origin to the Important Author Declarations origin.
 * 2 Context
 * 3 Element attached styles (style tag)
 * 4 Layers
 * 5 Specificity
 * 6 Order of appearance
 */
function cssSpecificityCompare(selector1, selector2)  {
    if (selector1.a === selector2.a) {
        if (selector1.b === selector2.b)
            return selector1.c - selector2.c;
        return selector1.b - selector2.b;
    }
    return selector1.a - selector2.a;
}

// ? for text between quotes
// '/\'(?:[^\']|\'\')*\'/miU';
// SQL Parser
// $re = '/\s+(?=SELECT|FROM|WHERE|ORDER\s+BY|GROUP\s+BY|HAVING|WITH ROLLUP)/miU';
// $re2 = '/\s+(?=LEFT JOIN|INNER JOIN|RIGHT JOIN|STRAIGHT JOIN|LEFT OUTER JOIN|RIGHT OUTER JOIN)/miU';

// CSS line-clamp
// clamp & font-size: https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/ clamp & font-size: