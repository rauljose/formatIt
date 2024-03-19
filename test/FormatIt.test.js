
const formatIt = require('../src/FormatIt');
const assert = require('chai').assert;



describe('FormatIt format values as requested considering the record. or deduce by fieldName or value', () => {
    let formatItDefault;

    beforeEach(() => {
        formatItDefault = new formatIt();
    });

    describe('FormatIt.date Format a date from a Date Object or a y-m-d string as in mysql', () => {
        it('FormatIt.date null value', () => {
            assert.equal(formatItDefault.date(null, format), "");
        });
        it('FormatIt.date empty string', () => {
            assert.equal(formatItDefault.date("", format), "");
        });

        let ymd = "2026-07-28 19:34:56";
        let ymd2 = "2026-11-08 09:04:06";
        let format = "\\\\d=d, \\\\j=j, \\\\D=D, \\\\l=l, \\\\w=w, \\\\m=m, \\\\n=n, \\\\M=M, \\\\F=F, \\\\Y=Y, \\\\y=y, \\\\H=H, \\\\G=G, \\\\h=h, \\\\g=g, \\\\i=i, \\\\s=s, \\\\a=a, \\\\A=A";
        it('FormatIt.date Format a date y-m-d string', () => {
            assert.equal(formatItDefault.date(ymd, format), "d=28, j=28, D=Tu, l=Tuesday, w=2, m=07, n=7, M=Jul, F=July, Y=2026, y=26, H=19, G=19, h=07, g=7, i=34, s=56, a=pm, A=PM")
        });
        it('FormatIt.date Format an early date y-m-d string', () => {
            assert.equal(formatItDefault.date(ymd2, format), "d=08, j=8, D=Su, l=Sunday, w=0, m=11, n=11, M=Nov, F=November, Y=2026, y=26, H=09, G=9, h=09, g=9, i=04, s=06, a=am, A=AM")
        });
        it('FormatIt.date Format a Date()', () => {
            assert.equal(formatItDefault.date(new Date(ymd), format), "d=28, j=28, D=Tu, l=Tuesday, w=2, m=07, n=7, M=Jul, F=July, Y=2026, y=26, H=19, G=19, h=07, g=7, i=34, s=56, a=pm, A=PM")
        });
        it('FormatIt.date Format an early Date()', () => {
            assert.equal(formatItDefault.date(new Date(ymd2), format), "d=08, j=8, D=Su, l=Sunday, w=0, m=11, n=11, M=Nov, F=November, Y=2026, y=26, H=09, G=9, h=09, g=9, i=04, s=06, a=am, A=AM")
        });
    });

    describe('FormatIt.deduceFormat(fieldName, value, row) fieldName not in fieldNameFormat', () => {
        it('no fieldname, value: null value', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", null, {}), {});
        });
        it('no fieldname, value: empty value', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", "", {}), {});
        });
        it('no fieldname, value: string', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", "a string", {}), {});
        });
        it('no fieldname, value: an integer', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", 5, {}),
                formatItDefault.QUANTITY);
        });
        it('no fieldname, value: a number', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", 5.25, {}),
                formatItDefault.QUANTITY);
        });
        it('no fieldname, value: a number in a string', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", "5.25", {}),
                formatItDefault.QUANTITY);
        });
        it('no fieldname, value: zero in a string', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", "0", {}),
                formatItDefault.QUANTITY);
        });
        it('no fieldname, value: zero', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", 0, {}),
                formatItDefault.QUANTITY);
        });
        it('no fieldname, value: true', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", true, {}),
                formatItDefault.BOOL);
        });
        it('no fieldname, value: false', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", false, {}),
                formatItDefault.BOOL);
        });
        it('no fieldname, value: ymd', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", "2024-03-28", {}),
                formatItDefault.DATE);
        });
        it('no fieldname, value: ymd h:i:s', () => {
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("", "2024-03-28 05:28:00", {}),
                formatItDefault.DATETIME);
        });
        it('unkown _id fieldName', () => {
            const era = formatItDefault.addFieldName2class;
            formatItDefault.addFieldName2class = false;
            assert.deepStrictEqual( formatItDefault.getFormatForFieldName("fieldName_id", "2024-03-28 05:28:00", {}),
                formatItDefault.ID);
            formatItDefault.addFieldName2class = era;
        });
    });

    describe('FormatIt.mergeFormats(a, b)', () => {

        it("mergeFormats(a, b) should extend object a with object b. b's keys override a's keys, except in attributes' class & style they are concatenated. input formats are not modified", () => {
            const formatA = {
                onlyA: "onlyA",
                bothAB: "fromA",
                attributes: {
                    class: 'classA',
                    style: 'styleA',
                    onlyA: "onlyA",
                    bothAB: "fromA",
                },
            };
            const formatB = {
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                    bothAB: "fromB",
                },
            };

            // Call the mergeFormats method in the FormatFormats class
            const mergedFormat = formatItDefault.mergeFormats(formatA, formatB);

            // Assert that the mergedFormat is as expected
            assert.deepEqual(mergedFormat, {
                onlyA: "onlyA",
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classA classB',
                    style: 'styleA styleB',
                    onlyA: "onlyA",
                    onlyB: "onlyB",
                    bothAB: "fromB",
                },
            });

            assert.deepEqual(formatA, {
                onlyA: "onlyA",
                bothAB: "fromA",
                attributes: {
                    class: 'classA',
                    style: 'styleA',
                    onlyA: "onlyA",
                    bothAB: "fromA",
                },
            }, "First format is not modified");

            assert.deepEqual(formatB, {
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                    bothAB: "fromB",
                },
            }, "Second format is not modified");
        });

        it('mergeFormats(a, b) should extend object a with object b. b\'s keys override a\'s keys, except in attributes\' class & style they are concatenated. attributes.style missing.', () => {
            const formatA = {
                onlyA: "onlyA",
                bothAB: "fromA",
                attributes: {
                    class: 'classA',
                    onlyA: "onlyA",
                    bothAB: "fromA",
                },
            };
            const formatB = {
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                    bothAB: "fromB",
                },
            };

            // Call the mergeFormats method in the FormatFormats class
            const mergedFormat = formatItDefault.mergeFormats(formatA, formatB);

            // Assert that the mergedFormat is as expected
            assert.deepEqual(mergedFormat, {
                onlyA: "onlyA",
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classA classB',
                    style: 'styleB',
                    onlyA: "onlyA",
                    onlyB: "onlyB",
                    bothAB: "fromB",
                },
            });

            const mergedFormatInverse = formatItDefault.mergeFormats(formatB, formatA);
            // Assert that the mergedFormat is as expected
            assert.deepEqual(mergedFormatInverse, {
                onlyA: "onlyA",
                onlyB: "onlyB",
                bothAB: "fromA",
                attributes: {
                    class: 'classB classA',
                    style: 'styleB',
                    onlyA: "onlyA",
                    onlyB: "onlyB",
                    bothAB: "fromA",
                },
            }, "Reverse the format with missing attribute.style");

        });

        it('mergeFormats(a, b) should extend object a with object b. b\'s keys override a\'s keys, except in attributes\' class & style they are concatenated. attribute object missing.', () => {
            const formatA = {
                onlyA: "onlyA",
                bothAB: "fromA",
            };
            const formatB = {
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                },
            };

            // Call the mergeFormats method in the FormatFormats class
            const mergedFormat = formatItDefault.mergeFormats(formatA, formatB);

            // Assert that the mergedFormat is as expected
            assert.deepEqual(mergedFormat, {
                onlyA: "onlyA",
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                },
            });

            const mergedFormatInverse = formatItDefault.mergeFormats(formatB, formatA);
            // Assert that the mergedFormat is as expected
            assert.deepEqual(mergedFormatInverse, {
                onlyA: "onlyA",
                onlyB: "onlyB",
                bothAB: "fromA",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                },
            }, "Reverse the format with missing attribute object");

            const formatC = {
                onlyC: "onlyC",
                bothAB: "fromC",
            };
            const mergedFormatNoAttributes = formatItDefault.mergeFormats(formatC, formatA);
            assert.deepEqual(mergedFormatNoAttributes, {
                onlyA: "onlyA",
                onlyC: "onlyC",
                bothAB: "fromA",
            }, "Both formats missing attribute object");

        });

        it('mergeFormats(a, b) should extend object a with object b. b\'s keys override a\'s keys, except in attributes\' class & style they are concatenated. empty format.', () => {
            const formatA = {};
            const formatB = {
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                },
            };

            // Call the mergeFormats method in the FormatFormats class
            const mergedFormat = formatItDefault.mergeFormats(formatA, formatB);

            // Assert that the mergedFormat is as expected
            assert.deepEqual(mergedFormat, {
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                },
            });

            const mergedFormatInverse = formatItDefault.mergeFormats(formatB, formatA);
            // Assert that the mergedFormat is as expected
            assert.deepEqual(mergedFormatInverse, {
                onlyB: "onlyB",
                bothAB: "fromB",
                attributes: {
                    class: 'classB',
                    style: 'styleB',
                    onlyB: "onlyB",
                },
            }, "Reverse the format with missing attribute object");

            const formatC = {};
            const mergedFormatNoAttributes = formatItDefault.mergeFormats(formatC, formatA);
            assert.deepEqual(mergedFormatNoAttributes, {}, "Both formats are empty");

            assert.deepEqual(formatItDefault.mergeFormats(null, null), {}, "Both formats are null");
            assert.deepEqual(formatItDefault.mergeFormats(formatB, null), formatB, "First format is null");
            assert.deepEqual(formatItDefault.mergeFormats(null, formatB), formatB, "Second format is null");
        });

    });

});
