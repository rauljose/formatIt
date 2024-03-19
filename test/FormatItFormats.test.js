
const FormatItFormats = require('../src/FormatItFormats');
const assert = require('chai').assert;

// https://github.com/ahilke/js-crap-score
// https://github.com/pilotpirxie/cyclomatic-complexity

// Describe the test suite
describe('FormatItFormats Stores and edits formats by fieldName, and how record/row values change formatting, used by FormatIt', () => {
    let formatItFormats;

    beforeEach( () => {
        formatItFormats = new FormatItFormats();
    });

    describe('FormatItFormats.fieldNameFormat get, set & extend', () => {
        it('Extend, get & set', () => {
            let defaultfieldNameFormat = formatItFormats.fieldNameFormat;

            const newfieldNameFormat = {  anInt:  {dec: 0, myA:1, attributes:{class:"der", "data-ta":"taUnit"}}  };
            formatItFormats.fieldNameFormat = newfieldNameFormat;
            assert.deepStrictEqual(formatItFormats.fieldNameFormat, newfieldNameFormat, "Setter & getter Ok");

            formatItFormats.fieldNameFormatExtend({anotherInt: {dec:2, myT:2, attributes:{class:"magenta", "data-ta":"ta"}}}  );
            assert.deepStrictEqual(formatItFormats.fieldNameFormat,
                {
                    anInt:  {dec: 0, myA:1, attributes:{class:"der","data-ta":"taUnit"}},
                    anotherInt: {dec:2, myT:2, attributes:{class:"magenta", "data-ta":"ta"}},
                } ,
                "Add, extend a new fieldName"
            );

            formatItFormats.fieldNameFormatExtend({anotherInt: {dec:0, d:2, attributes:{ otra:1, "data-ta":"ta0"}}}  );
            assert.deepStrictEqual(formatItFormats.fieldNameFormat,
                {
                    anInt:  {dec: 0, myA:1, attributes:{class:"der","data-ta":"taUnit"}},
                    anotherInt: {dec:0, myT:2, d:2, attributes:{class:"magenta", "data-ta":"ta0", otra:1}},
                } ,
                "Add, extend an existing fieldName"
            );

            formatItFormats.fieldNameFormat = defaultfieldNameFormat;
        });
    });

    describe('FormatItFormats.rowFormats get, set & extend', () => {
        it('Extend, get & set', () => {
            let defaultRowFormat = formatItFormats.rowFormats;
            const newRowFormat = {unit: {"Dozen": {dec: 0}}};
            formatItFormats.rowFormats = newRowFormat;
            assert.deepStrictEqual(formatItFormats.rowFormats, newRowFormat, "Setter & getter Ok");

            formatItFormats.rowFormatsExtend({unit: {"Dozen": { attributes:{class:"der"}}} } )
            assert.deepStrictEqual(formatItFormats.rowFormats,
                {unit: {"Dozen": {dec: 0, attributes:{class:"der"}}} },
                "Extend existing fieldName-Value with new property"
            );
            formatItFormats.rowFormatsExtend({unit: {"Gruesa": {dec:1, myData:1, attributes:{class:"der"}}}});
            assert.deepStrictEqual(formatItFormats.rowFormats,
                {unit: {
                        "Dozen": {dec: 0, attributes:{class:"der"}},
                        "Gruesa": {dec:1, myData:1, attributes:{class:"der"}}
                    }},
                "New fieldName-value"
            );
            formatItFormats.rowFormatsExtend({item: {"red": {dec:13, myData:13, attributes:{class:"der"}}}});
            assert.deepStrictEqual(formatItFormats.rowFormats,
                {
                    unit: {
                        "Dozen": {dec: 0, attributes:{class:"der"}},
                        "Gruesa": {dec:1, myData:1, attributes:{class:"der"}}
                    },
                    item: {"red": {dec:13, myData:13, attributes:{class:"der"}}}
                },
                "New fieldName"
            );
            formatItFormats.rowFormats = defaultRowFormat;
        });
    });

});
