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
