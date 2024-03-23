// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

const FormatItFormats = require('./FormatItFormats');
var formatItLocale = formatItLocale || {};

{
    const importIfNotPresent = (currentObj, modulePath) => {
        const moduleObj = require(modulePath);
        for(const key in moduleObj)
            if(!(key in currentObj))
                currentObj[key] = moduleObj[key];
    }
    importIfNotPresent(formatItLocale, './i18n/formatItLocale_en.js');
    importIfNotPresent(formatItLocale, './i18n/formatItLocale_es.js');
}


/*

    @DUDA: fmt.num 0 es 0 o "" o "-",
    @TODO: tag? o format link: url, email, tel
    @TODO: ul/ol?
    @TODO: classes, .cen, .der, .negative
    @TODO: format string options
    @TODO: format callback
 */

class FormatIt {
    static version = "2024-03-28";
    BOOL = { attributes:{class: "cen"}}
    DATE = {dateFormat: 'd/M/y', attributes: {class:"cen"}}
    DATETIME = {dateFormat: 'd/M/y H:i', attributes: {class:"cen"}}
    ID = { attributes:{class:"der id"}}
    QUANTITY = {dec: 2, attributes:{class:"der"}}

    #language = {}
    #addFieldName2class = true;
    #formats;
    #intlNumFmt = {};
    /**
     *
     * @type {string}
     */
    #null2String = "";

    /**
     *
     * @param {string|Object} language
     * @param {FormatItFormats|null} formats an
     * @param {string} null2String
     * @param {boolean} addFieldName2class
     */
    constructor(language = "en", formats= null, null2String = "",
                addFieldName2class = false)
    {
        this.language = language;
        this.#formats = null === formats ? new FormatItFormats() : formats;
        this.#null2String = null2String;
        this.#addFieldName2class = addFieldName2class;
        this._language = language;
    }

    get language() {
        return this.#language;
    }

    set language(language) {
        this.#language = typeof language === 'object' ? language : formatItLocale[language] || formatItLocale.en;
    }

    get addFieldName2class() {return this.#addFieldName2class;}

    set addFieldName2class(value) {this.#addFieldName2class = value;}

    format(fieldName, value, row) {
        let format = this.getFormatForFieldName(fieldName, value, row);
        if(format.hasOwnProperty('dateFormat'))
          return this.#prefixSuffix(format,
              this.date(value, format.dateFormat)
          );
        if(format.hasOwnProperty('dec'))
            return this.#prefixSuffix(format, this.num(value, format.dec));
        return this.#prefixSuffix(format, this.deduce(value));
    }

    attributes(fieldName, value, row) {
        let format = this.#formats.fieldName(fieldName, value, row);
        return format.attributes || {}
    }

    /**
     * Guess the value's data type and format accordingly
     *
     * @param value
     * @returns {string}
     */
    deduce(value) {
        if(null === value)
            return this.#null2String;
        if("" === value)
            return "";
        if(typeof value === "boolean" )
            return this.bool(value);
        if(!isNaN(value))
            return this.num(value);
        if(value instanceof Date || this.is_ymd(value))
            return this.date(value, "d/M/y");
        if(this.is_ymd_time(value))
            return this.date(value, "d/M/y H:i");
        if(Array.isArray(value))
            return this.comaSeparated(value);
        return String(value);
    }

    /**
     *
     * @param value
     * @param {string|null} trueString
     * @param {string|null} falseString
     * @returns {string}
     */
    bool(value, trueString = null, falseString = null) {
        if(Array.isArray(value)) {
            for(let i = 0, len = value.length; i < len; ++i)
                value[i] = this.bool(value[i]);
            return value;
        }
        if(null !== value && typeof value === 'object') {
            for(let i in value)
                if(value.hasOwnProperty(i))
                    value[i] = this.bool(value[i]);
            return value;
        }
        if(value)
            return null === trueString ? this.#language[true] || this.#language.true : trueString;
        return null === falseString ? this.#language[false] || this.#language.false : falseString;
    }

    /**
     *
     * @param  {array} value
     * @param  {string} lastAndOr
     * @returns {string}
     */
    comaSeparated(value, lastAndOr = 'or') {
        if(!Array.isArray(value))
            return this.deduce(value);
        let arr = [];
        for(let a of value)
            if(null !== a && "" !== a)
                arr.push(this.deduce(a));
        if(arr.length === 0)
            return "";
        if(arr.length === 1)
            return arr[0];

        let last = arr.pop();
        return `${arr.join(", ")} ${this.#language[lastAndOr] || lastAndOr} ${last}`;
    }
    
    fieldNameToLabel(fieldName) {
        return this.#recurseMe(fieldName,  (fieldName) => {
            return this.titleCase(
                fieldName
                    .replaceAll(/([_.])/g , " ")
                    .replaceAll(/([A-Z])/g, " $1")
                    .replaceAll(/(\d+)/g, " $1 ")
                    .replaceAll(/\s{2,}/, " ").trim()
            );
        });
    }

    lowerCase(str) {
        return this.#recurseMe(str,  (str) => {return String(str).toLocaleLowerCase();});
    }

    upperCase(str) {
        return this.#recurseMe(str,  (str) => {return String(str).toLocaleUpperCase();});
    }
    
    /**
     *
     * @param str
     * @returns {string}
     */
    ucWords(str) {
        return this.#recurseMe(str,  (str) => {
            return String(str).toLocaleLowerCase()
                .replace(/\b[a-z]/g, (l) => l.toLocaleUpperCase());
        });
    }
    
    /**
     *
     * @param str
     * @returns {string}
     */
    titleCase(str) {
        return this.#recurseMe(str,  (str) => {
            let nonCapitalizedWords = this.#language.titleCaseNonCapitalizedWords || {};
            return String(str).toLocaleLowerCase().replace(
                /\b([a-z\p{L}])+\b/gu,
                function(match, any, pos) {
                    if(pos && nonCapitalizedWords.hasOwnProperty(match))
                        return match;
                    return match.charAt(0).toLocaleUpperCase() + match.slice(1);
                });
        });
    }

    /**
     *
     * @param str
     * @returns {string}
     */
    htmlentities(str) {
        return this.#recurseMe(str,  (str) => {
            const charMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&apos;"
            };
            const pattern = /[&<>'"]/g;
            return String(str).replace(pattern, match => charMap[match]);
        });
    }

    /**
     *
     * @param  n
     * @param {int} dec
     * @returns {string}
     */
    num(n, dec = 2){
        if("" === n)
            return "";
        if(Array.isArray(n)) {
            for(let i = 0, len = n.length; i < len; ++i)
                n[i] = this.num(n[i], dec);
            return n;
        }
        if(null === n)
            return this.#null2String;
        if(typeof n === 'object') {
            for(let i in n)
                if(n.hasOwnProperty(i))
                    n[i] = this.num(n[i], dec);
            return n;
        }
        if(isNaN(n))
            return n;
        if(isNaN(dec) || dec < 0 || null === dec || "" === dec)
            dec = 2;
        if(!this.#intlNumFmt.hasOwnProperty(dec))
            this.#intlNumFmt[dec] = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: dec,
                maximumFractionDigits: dec
            });
        return this.#intlNumFmt[dec].format(n)
    }

    /**
     * Formats a date according to the given format string in PHP style
     *
     * @param {Date|string|number} inputDate - Date to format. Can be a Date object, a date string, or a timestamp.
     * @param {string} dateFormat="d/M/y" - The php format string. Defaults to "d/M/y"
     *      https://www.php.net/manual/en/datetime.format.php.
     * @returns {string} - The formatted date string.
     * @throws {Error} - If an error occurs during the formatting process.
     */
    date(inputDate, dateFormat = "d/M/y")  {
        if("" === inputDate)
            return "";
        if(Array.isArray(inputDate)) {
            for(let i = 0, len = inputDate.length; i < len; ++i)
                inputDate[i] = this.date(inputDate[i], dateFormat);
            return inputDate;
        }
        if(null === inputDate)
            return this.#null2String;
        if(typeof inputDate === 'object' && !(inputDate instanceof Date)) {
            for(let i in inputDate)
                if(inputDate.hasOwnProperty(i))
                    inputDate[i] =this.date(inputDate[i], dateFormat);
            return inputDate;
        }
        try {
            function padZero(value) {return value < 10  ? `0${value}` : `${value}`;}

            let date;
            if(inputDate instanceof Date)
                date = inputDate;
            else if(typeof inputDate === "object")
                return "[object]";
            else if(isNaN(inputDate))
                date = this.is_ymd(inputDate) ?
                    new Date(`${inputDate}T00:00:00`) : new Date(inputDate);
            else
                date = new Date(inputDate);

            const parts = {
                d: padZero(date.getDate()),
                j: date.getDate(),
                D: this.#language.shortDay[date.getDay()],
                l: this.#language.longDay[date.getDay()],
                w: date.getDay(),

                m: padZero(date.getMonth() + 1),
                n: date.getMonth() + 1,
                M: this.#language.shortMonth[date.getMonth()],
                F: this.#language.longMonth[date.getMonth()],

                Y: date.getFullYear(),
                y: date.getFullYear().toString().slice(-2),

                H: padZero(date.getHours()),
                G: date.getHours(),
                h: padZero(date.getHours() > 12 ? date.getHours() - 12 : date.getHours()),
                g: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
                i: padZero(date.getMinutes()),
                s: padZero(date.getSeconds()),

                a: date.getHours() < 12 ? "am" : "pm",
                A: date.getHours() < 12 ? "AM" : "PM",
            };

            let skip = false;
            let ret = [];
            for(let i = 0, len = dateFormat.length; i < len; ++i) {
                let c = dateFormat[i];
                if(c === "\\") {
                    skip = true;
                    continue;
                }
                if(skip) {
                    skip = false;
                    ret.push(c);
                    continue;
                }
                ret.push(parts.hasOwnProperty(c) ? parts[c] : c);
            }
            return ret.join("");
        }
        catch(error) {
            console.log("ERROR: formatIt.date:", error);
            console.log("       arguments", arguments);
            return inputDate;
        }

    }

    is_ymd(value) {
        if(null === value || !isNaN(value) || typeof value !== "string" || value.length !== 10)
            return false;
        const regex = /^\d\d\d\d[-.\\\/_](0[1-9]|1[0-2])[-.\\\/_](0[1-9]|[1-2][0-9]|3[0|1])$/gm;
        return value.match(regex) !== null;
    }

    is_ymd_time(value) {
        if(null === value || !isNaN(value) || typeof value !== "string" || value.length < 19 || value.length > 23)
            return false;
        const regex = /^\d\d\d\d[-.\\\/_](0[1-9]|1[0-2])[-.\\\/_](0[1-9]|[1-2][0-9]|3[0|1]).([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/gm;
        return value.match(regex) !== null;
    }

    #prefixSuffix(format, formattedValue) {
        return `${format.prefix || ''}${formattedValue}${format.suffix || ''}`;
    }

    getFormatForFieldName(fieldName, value, row) {
        let fieldNameFormat = this.#formats.fieldNameFormat;
        let f = fieldNameFormat[fieldName] || fieldNameFormat[fieldName.toLocaleLowerCase()]
            || this.#deduceFormat(fieldName, value, row);
        if(this.#addFieldName2class && typeof fieldName === 'string' && fieldName.length > 0)
            f = this.mergeFormats(f, {attributes:{class:fieldName}});
        if(!isNaN(value) && value < 0)
            f = this.mergeFormats(f, {attributes:{class: "negative"}});
        return this.mergeFormats(f, this.getFormatForRow(row));
    }

    getFormatForRow(row) {
        let format = {};
        let rowFormats = this.#formats.rowFormats
        for(let f in rowFormats) {
            if(rowFormats.hasOwnProperty(f) && row.hasOwnProperty(f) && rowFormats[f].hasOwnProperty(row[f]))
                format = this.mergeFormats(format, rowFormats[f][row[f]]);
            else {
                f = f.toLocaleLowerCase();
                if(rowFormats.hasOwnProperty(f) && row.hasOwnProperty(f) && rowFormats[f].hasOwnProperty(row[f]))
                    format = this.mergeFormats(format, rowFormats[f][row[f]]);
            }
        }
        return format;
    }
    
    #deduceFormat(fieldName, value, row) {
        if(null === value)
            return {};

        if(typeof value === 'boolean')
            return this.BOOL;
        if("" === value)
            return {};
        if(fieldName.endsWith('_id'))
            return this.#formats.ID || this.ID;
        if(!isNaN(value))
            return this.#formats.QUANTITY || this.QUANTITY;
        if(this.is_ymd(value))
            return this.#formats.DATE || this.DATE;
        if(value instanceof Date || this.is_ymd_time(value))
            return this.#formats.DATETIME || this.DATETIME;
        return {}
    }

    mergeFormats(a, b) {
        if(null === a)
            return null === b ? {} : b;
        if(null === b)
            return a;
        let ret = this.#extend(true, a, b);
        for(let m of ['class', 'style'])
            if(a.hasOwnProperty('attributes') && a.attributes.hasOwnProperty(m) &&
                b.hasOwnProperty('attributes') &&  b.attributes.hasOwnProperty(m)
            )
                ret.attributes[m] = a.attributes[m] + " " + b.attributes[m];
        return ret;
    }

    /**
     * A native JS $.extend()
     *
     * @author https://gist.github.com/egalink/086b1faae4072fa835c5ad91722f3996
     * @returns {{}}
     */
    #extend() {
        let me = this;
        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        // check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]' ) {
            deep = arguments[0];
            i ++;
        }

        // merge the object into the extended object
        let merge = function (obj) {
            for (let prop in obj) if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                // if deep merge and property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]')
                    extended[prop] = me.#extend(true, extended[prop], obj[prop]);
                else
                    extended[prop] = obj[prop];
            }
        };

        // loop through each object and conduct a merge
        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    }

    #recurseMe(parameter, callback) {
        if(Array.isArray(parameter)) {
            for(let i = 0, len = parameter.length; i < len; ++i)
                parameter[i] = this.#recurseMe(parameter[i], callback);
            return parameter;
        }
        if(null === parameter)
            return this.#null2String;
        if(typeof parameter === 'object') {
            for(let i in parameter)
                if(parameter.hasOwnProperty(i))
                    parameter[i] =this.#recurseMe(parameter[i], callback);
            return parameter;
        }
        if("" === parameter)
            return "";
        return callback[parameter];
    }

}

module.exports = FormatIt;
