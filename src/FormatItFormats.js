
/**
 * Stores, edits formats by fieldName, and how record/row values change formatting. Used by FormatIt
 * Extend fieldNames with fieldNameExtend and/or rowFormat via rowExtend  or
 * extend/copy this class, pass it to FormatIt constructor override: #fieldNameFormat, #rowFormats
 *
 */
class FormatItFormats {
    /* Required properties */
    ID = { attributes:{class:"der id"}}
    DATE = {dateFormat: 'd/M/y', attributes: {class:"cen"}}
    DATETIME = {dateFormat: 'd/M/y H:i', attributes: {class:"cen"}}
    TIME = {dateFormat: 'H:i', attributes: {class:"cen"}}

    MONEY = {dec: 2, prefix:"$", attributes:{class:"der"}}
    QUANTITY = {dec: 2, attributes:{class:"der"}}
    INT = {dec: 0, attributes:{class:"der"}}

    TOTAL = {dec: 2, prefix:"$", attributes:{class:"total"}}
    SUBTOTAL = {dec: 2, prefix:"$", attributes:{class:"subtotal"}}
    TITLE = {stringFormat: 'title', attributes:{class: "title"}}
    BOOL = { attributes:{class: "cen"}}

    /**
     *
     * {fieldName:{ prefix:"", suffix:"", dec:int, dateFormat:'d/M/y', stringFormat:'formatStrings', func:function(fieldName, value, record), attributes:{htmlAttribute:"value"}}}
     *    dateFormat: php date format
     *    formatStrings: titleCase, ucWords, upperCase, lowerCase,c commasAnd, commasOr, htmlentities, attributeValue, fieldNameToLabel
     */
    #fieldNameFormat = {
        price: this.MONEY,
        amount: this.MONEY,
        cost: this.MONEY,
        income: this.MONEY,
        deposit: this.MONEY,
        withdrawal: this.MONEY,
        debit: this.MONEY,
        credit: this.MONEY,
        balance: this.MONEY,
        charge: this.MONEY,
        payment: this.MONEY,
        total: this.TOTAL,
        subtotal: this.SUBTOTAL,
        sub_total: this.SUBTOTAL,
        quantity: this.QUANTITY,
        
        dob: this.DATE,
        date: this.DATE,
        time: this.TIME,
        registered: this.DATETIME,
        updated: this.DATETIME,

        title: this.TITLE,

        precio: this.MONEY,
        monto: this.MONEY,
        costo: this.MONEY,
        gasto: this.MONEY,
        ingreso: this.MONEY,
        deposito: this.MONEY,
        retiro: this.MONEY,
        debito: this.MONEY,
        credito: this.MONEY,
        saldo: this.MONEY,
        cargo: this.MONEY,
        abono: this.MONEY,
        pago: this.MONEY,
        cantidad: this.QUANTITY,

        nacio_el: this.DATE,
        fecha_nacimiento: this.DATE,
        fecha: this.DATE,
        hora: this.TIME,
        registrado: this.DATETIME,
        registrado_el: this.DATETIME,
        ultimo_cambio: this.DATETIME,
        ultimo_cambio_el: this.DATETIME,
        titulo: this.TITLE,
        encabezado: this.TITLE,
    }

    /**
     *
     * {fieldName:{value:{dec:int, dateFormat:'d/M/y', attributes:{htmlAttribute:"value"}} }
     */
    #rowFormats = {
        moneda: {"usd":{attributes: {class:"usd"}}},
        moneda_id: {"2":{attributes: {class:"usd"}}},
        unidad: {"Kg":{dec:0},"pza":{dec:0},},
        unidades: {"Kg":{dec:0},"pza":{dec:0},},
        
    }

    fieldNameFormatExtend(fieldNameFormat) {this.#fieldNameFormat = this.#extend(true, this.#fieldNameFormat, fieldNameFormat);}

    get fieldNameFormat() {return this.#fieldNameFormat;}

    set fieldNameFormat(fieldNameFormat) {this.#fieldNameFormat = fieldNameFormat;}

    rowFormatsExtend(rowFormats) {this.#rowFormats = this.#extend(true, this.#rowFormats, rowFormats);}

    get rowFormats() {return this.#rowFormats;}

    set rowFormats(rowFormats) {this.#rowFormats = rowFormats;}

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
            for(let prop in obj) if (Object.prototype.hasOwnProperty.call(obj, prop)) {
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

}

module.exports = FormatItFormats;
