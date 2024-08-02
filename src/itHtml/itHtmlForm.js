/**
 * 2-4 options: Almost always better with radio buttons
 * 5-7 options: Often still better with radio buttons, especially if the options are short
 * 8+ options: Consider using a select tag, especially if screen space is limited
 *
 * The exact threshold can vary based on factors like:
 *
 * Option length: Shorter options work better as radio buttons
 * Screen size: Smaller screens may benefit from select tags sooner
 * Importance of comparison: If users need to easily compare options, radio buttons may be preferred even for more options
 * Frequency of use: More frequently used forms might benefit from radio buttons for quick selection
 *
 * In a PWA, you might also consider using a responsive design approach:
 *
 * Use radio buttons on larger screens
 * Switch to a select tag on smaller screens if you have more than 4-5 options
 *
 * For binary options like Yes/No or On/Off, a toggle switch (often called just a "switch") is generally considered a better user interface choice than radio buttons
 *   except: When you want to force an explicit choice (a switch can imply a default state)
 *
 *   // This marker is 20 pixels wide by 32 pixels high.
 */
/**
 * Utilities to write html forms input elements
 *
 * @param {object} options
 * @returns {ItHtmlForm|{toLabel: function(string): string, toId: function(string): string, getCheckBoxesChecked: function(string): Array, radioButtons: function(string, Array<{string: string}>, (string|Array[string|number])): string, oneCheckBox: function(string, string, string, string, string): string, setRadioValue: function(string, string): void, getCheckBoxesAll: function(string): {}, checkAllCheckboxes: function(string): void, selectOptions: function(Array<{string: string}>, (string|Array[string|number])): string, attributes2string: function(*): *, chooseMany: function(string, string, Array<{string: string}>, (string|Array[string|number]), int): string, version: string, checkboxes: function(string, Array<{string: string}>, (string|Array[string|number])): string, toAttribute: function(string): string, getRadioValue: function(string): (string|undefined), checkOnlyCheckboxesWithValues: function(string, Array<string>): void, checkCheckboxesWithValues: function(string, Array<string>): void, uncheckAllCheckboxes: function(string): void, chooseOne: function(string, string, Array<{string: string}>, (string|Array[string|number]), int): string}}
 * @constructor
 *
 * 1. `chooseOne`: Generates HTML code for a select dropdown or radio buttons based on the number of options.
 * 2. `chooseMany`: Generates HTML code for a select dropdown or checkboxes based on the number of options.
 * 3. `radioButtons`: Generates HTML code for radio buttons.
 * 4. `getRadioValue`: Retrieves the value of the selected radio button.
 * 5. `setRadioValue`: Sets the value of a radio button.
 * 6. `oneCheckBox`: Generates HTML code for a single checkbox input.
 * 7. `checkboxes`: Generates HTML code for checkboxes.
 * 8. `getCheckBoxesChecked`: Retrieves the values of the checked checkboxes.
 * 9. `getCheckBoxesAll`: Retrieves the values and checked status of all checkboxes.
 * 10. `checkAllCheckboxes`: Checks all checkboxes.
 * 11. `uncheckAllCheckboxes`: Unchecks all checkboxes.
 * 12. `checkCheckboxesWithValues`: Checks specific checkboxes based on their values.
 * 13. `checkOnlyCheckboxesWithValues`: Unchecks all checkboxes and then checks specific checkboxes based on their values.
 * 14. `selectOptions`: Generates HTML code for select dropdown options.
 * 15. `attributes2string`: Converts an attributes object to a string representation.
 * 16. `toLabel`: Converts a camel, pascal, or snake case string to title case.
 * 17. `toId`: Converts a string to a valid HTML element id.
 * 18. `toAttribute`: Quotes and protects an attribute string.
 * 19. `_extend`: Emulates jQuery's extend function for merging objects.
 *
 */
function ItHtmlForm(options) {
    if(!(this instanceof ItHtmlForm))
        return new ItHtmlForm(options);

    const version = '2024-08-01';
    const defaults = {
        css: {
            radioFieldset:"ItflexRow ItFieldset",
            radioDiv:"nowrap",
            checkBoxFieldset:"ItflexRow ItFieldset",
            checkBoxDiv:"nowrap",
        },
    };
    let settings = _extend(defaults, options);

    /**
     *
     * @param {string} label
     * @param {string} name
     * @param {Array<{string: string}>} options Array of objects representing the options for the select dropdown Each object should have a single key-value pair, the key represents the id or value of the option, the value represents the label or text that the user sees.
     * @param {string|array[string|number]} currentValue
     * @param {int} maxRadio
     * @returns {string}
     */
    function chooseOne(label, name, options, currentValue, maxRadio) {
        if(options.length <= (maxRadio || 4))
            return `<fieldset class="${settings.css.radioFieldset}"><legend>${label}</legend>${radioButtons(name, options, currentValue)}</fieldset>`;
        const id = toId(`${name}`);
        return `<label for="${id}">${label} </label><select id="${id}" name="${name}">${selectOptions(options, currentValue)}</select>`;
    }

    /**
     *
     * @param {string} label
     * @param {string} name
     * @param {Array<{string: string}>} options Array of objects representing the options for the select dropdown Each object should have a single key-value pair, the key represents the id or value of the option, the value represents the label or text that the user sees.
     * @param {string|array[string|number]} currentValue
     * @param {int} maxCheckboxes
     * @returns {string}
     */
    function chooseMany(label, name, options, currentValue, maxCheckboxes) {
        if(options.length <= (maxCheckboxes || 4))
            return `<fieldset class="${settings.css.checkBoxFieldset}"><legend>${label}</legend>${checkboxes(name, options, currentValue)}</fieldset>`;
        const id = toId(`${name}`);
        //@ToDo multiple, max selections?
        return `<label for="${id}">${label} </label><select id="${id}" name="${name}">${selectOptions(options, currentValue)}</select>`;
    }

    /**
     *
     * @param {string} name
     * @param {Array<{string: string}>} options Array of objects representing the options for the select dropdown Each object should have a single key-value pair, the key represents the id or value of the option, the value represents the label or text that the user sees.
     * @param {string|array[string|number]} currentValue
     * @returns {string}
     */
    function radioButtons(name, options, currentValue) {
        let radios = [];
        const cValue = Array.isArray(currentValue) && currentValue.length > 0 ? currentValue[0] : currentValue;
        for(let i=0, len = options.length; i < len; ++i ) {
            const id = toId(`${name}_-${i}`);
            const value = Object.keys(obj)[0];
            const text = Object.values(obj)[0];
            radios.push(`<div class="${settings.css.radioDiv}"><input id="${id}" name=${toAttribute(name)} value=${toAttribute(value)} ${value === cValue ? ' CHECKED="CHECKED" ' : ''} type="radio"><label for="${id}"> ${text}</label></div>`);
        }
        return radios.join("\n");
    }

    /**
     *
     * @param {string} name
     * @returns {string|undefined}
     */
    function getRadioValue(name) {
        const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
        for(const radioButton of radioButtons)
            if(radioButton.checked)
                return radioButton.value;
        return undefined;
    }

    /**
     *
     * @param {string} name
     * @param {string} value
     */
    function setRadioValue(name, value) {
        document.querySelector(`input[name='${name}'][value='${toAttribute(value)}']`).checked = true;
    }

    /**
     * Generates HTML code for a single checkbox input, sending to the server checked or unchecked value
     *
     * @param {string} label - The label for the checkbox.
     * @param {string} name - The name attribute for the checkbox.
     * @param {string} checkedValue - The value for the checkbox when it is checked.
     * @param {string} unCheckedValue - The value for the checkbox when it is not checked.
     * @param {string} currentValue - The current value of the checkbox.
     * @returns {string} - The generated HTML code for the checkbox input with label.
     */
    function oneCheckBox(label, name, checkedValue, unCheckedValue, currentValue) {
        const id = toId(`${name}`);
        return `<input type="hidden" name="${name}" value="${toAttribute(unCheckedValue)}"><input type="checkbox" id="${id}" name="${name}" value="${toAttribute(checkedValue)}"${currentValue === checkedValue ? ' checked="checked"' : ''}><label for="${id}"> ${label}</label>`;
    }

    /**
     *
     * @param {string} name
     * @param {Array<{string: string}>} options Array of objects representing the options for the select dropdown Each object should have a single key-value pair, the key represents the id or value of the option, the value represents the label or text that the user sees.
     * @param {string|array[string|number]} currentValue
     * @returns {string}
     */
    function checkboxes(name, options, currentValue) {
        let checkbox = [];
        const cValue = Array.isArray(currentValue) ? currentValue : [currentValue];
        for(let i=0, len = options.length; i < len; ++i ) {
            const id = toId(`${name}_-${i}`);
            const value = Object.keys(obj)[0];
            const text = Object.values(obj)[0];
            checkbox.push(`<div class="${settings.css.checkBoxDiv}"><input id="${id}" name="${name}" value="${toAttribute(value)}" ${value === cValue ? ' CHECKED="CHECKED" ' : ''} type="checkbox"><label for="${id}"> ${text}</label></div>`);
        }
        return checkbox.join("\n");
    }

    /**
     *
     *
     * @param {string} name
     * @returns {array<string>}
     */
    function getCheckBoxesChecked(name) {
        let checked = [];
        const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
        for(const checkbox of checkboxes)
            if(checkbox.checked)
                checked.push(checked.value);
        return checked;
    }

    /**
     *
     *
     * @param {string} name
     * @returns {object}
     */
    function getCheckBoxesAll(name) {
        let checked = {};
        const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
        for(const checkbox of checkboxes)
            checked[checked.value] = checkbox.checked;
        return checked;
    }

    /**
     * For checkboxes named 'name', uncheck all and then check only the ones that have a value in the array values.
     *
     * @param {string} name
     * @param {array<string>} values
     */
    function checkOnlyCheckboxesWithValues(name, values) {
        uncheckAllCheckboxes(name);
        checkCheckboxesWithValues(name, values);
    }

    /**
     * For checkboxes named 'name', check all that have a value in the array values.
     *
     * @param {string} name
     * @param {array<string>} values
     */
    function checkCheckboxesWithValues(name, values) {
        for(let v in values)
            if(values.hasOwnProperty(v))
                document.querySelectorAll(`input[name="${name}"][value="${toAttribute(v)}"]`).forEach(checkbox => {
                    checkbox.checked = true;
                });
    }

    /**
     * Check all checkboxes named 'name'.
     *
     * @param {string} name
     */
    function checkAllCheckboxes(name) {
        document.querySelectorAll(`input[name="${name}"]`).forEach(checkbox => {
            checkbox.checked = true;
        });
    }

    /**
     * Uncheck all checkboxes named 'name'.
     *
     * @param {string} name
     */
    function uncheckAllCheckboxes(name) {
        document.querySelectorAll(`input[name="${name}"]`).forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    /**
     *
     *
     * @param {Array<{string: string}>} options Array of objects representing the options for the select dropdown Each object should have a single key-value pair, the key represents the id or value of the option, the value represents the label or text that the user sees.
     * @param {string|array[string|number]} currentValue
     * @returns {string}
     */
    function selectOptions(options, currentValue) {
        let opt = [];
        const cValue = Array.isArray(currentValue) ? currentValue : [currentValue];
        for(let i=0, len = options.length; i < len; ++i ) {
            const value = Object.keys(obj)[0];
            const text = Object.values(obj)[0];
            opt.push(`<option value="${toAttribute(value)}"${cValue.includes(value) ? ' SELECTED="SELECTED" ' : ''}>${text}</option>`);
        }
        return opt.join("\n");
    }

    /**
     * Merges the user-provided attributes object with the desired attributes object.
     * The user object takes precedence, except for the "class" and "style" attributes.
     *
     * @param {object} userAttributes - The user-provided attributes object.
     * @param {object} itHtmlFormAttributes - The desired attributes object.
     * @param {array} both
     * @returns {object} - The merged attributes object.
     */
    function attributes(userAttributes, itHtmlFormAttributes = {}, both =['class', 'style']) {
        const mergedAttributes = { ...itHtmlFormAttributes };
        for(const attributeName in userAttributes)
            if(userAttributes.hasOwnProperty(attributeName))
                if(both.includes(attributeName))
                    mergedAttributes[attributeName] = `${itHtmlFormAttributes[attributeName]} ${userAttributes[attributeName]}`;
                else
                    mergedAttributes[attributeName] = userAttributes[attributeName];
        return mergedAttributes;
    }

    function attributes2string(attributes) {
        let atrr = [];
        for(let a of attributes)
            if(attributes.hasOwnProperty(a))
                attr.push(`${a}=${toAttribute(attributes[a])}`);
        return attr.join(" ");
    }

    /**
     * Change a camel, pascal or snake case to Title Case.
     *
     * @param {string} inputString
     * @returns {string}
     */
    function toLabel(inputString) {
        return inputString
            .replace(/([a-z\d])([A-Z])/g, '$1 $2') // for camelCase and PascalCase
            .replace(/(_)/g, ' ') // for snake_case
            .replace(/(\d)([a-zA-Z])/g, '$1 $2') // for numbers
            .replace(/(\b[a-z](?!\s))/g, function(x) { return x.toUpperCase(); });
    }

    /**
     * Make a valid html element id
     *
     * @param {string} inputString
     * @returns {string}
     */
    function toId(inputString) {
        let validId = inputString.replace(/[^a-zA-Z0-9_-]/g, '_');
        return validId.match(/^[a-zA-Z_]/) ? validId :'_' + validId;
    }

    /**
     * Quote and protect an attribute string
     *
     * @param {string} inputString
     * @returns {string}
     */
    function toAttribute(inputString) {
        //@ToDo cuando es onlick="llamada('algo')" vs Mc Donald's dijo "Papas"
        if(inputString.search('"') < 0)
            return `"${inputString}"`;
        if(inputString.search("'") < 0)
            return `'${inputString}'`;
        return `'${inputString.replaceAll("'", "&#39;")}'`;
    }

    /**
     * Emulate jQuery's extend
     *
     * @returns {any|{}}
     * @private
     */
    function _extend() {
        let target = arguments[0] || {};
        let deep = false;
        let i = 1;
        if(typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if(typeof target !== 'object' && typeof target !== 'function')
            target = {};
        for(; i < arguments.length; i++) {
            if(arguments[i] !== null) {
                for(let name in arguments[i]) if(arguments[i].hasOwnProperty(name)) {
                    let src = target[name];
                    let copy = arguments[i][name];
                    let copyIsArray;
                    if(target === copy)
                        continue;
                    if(deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
                        let clone = src && (copyIsArray || typeof src === 'object') ? src : copyIsArray ? [] : {};
                        target[name] = _extend(deep, clone, copy);
                    } else if(copy !== undefined)
                        target[name] = copy;
                }
            }
        }
        return target;
    }

    return {
        chooseOne: chooseOne,
        chooseMany: chooseMany,

        radioButtons: radioButtons,
        getRadioValue: getRadioValue,
        setRadioValue: setRadioValue,

        oneCheckBox: oneCheckBox,
        checkboxes: checkboxes,
        getCheckBoxesChecked: getCheckBoxesChecked,
        getCheckBoxesAll: getCheckBoxesAll,
        checkAllCheckboxes: checkAllCheckboxes,
        uncheckAllCheckboxes: uncheckAllCheckboxes,
        checkCheckboxesWithValues: checkCheckboxesWithValues,
        checkOnlyCheckboxesWithValues: checkOnlyCheckboxesWithValues,

        selectOptions: selectOptions,

        attributes2string: attributes2string,
        toLabel: toLabel,
        toAttribute: toAttribute,
        toId: toId,

        version: version
    };

}