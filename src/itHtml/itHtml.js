
class itHtml {

    /**
     * The selected option's css class is added to the select class, the previous selected option class is removed
     *
     * @usage
     *   <script>
     *       window.onload = function() {
     *          itHtml.selectColorea("id");
     *          document.getElementById("id").addEventListener('change', itHtml.selectColorea);
     *       }
     *   </script>
     *   <style>
     *         SELECT {background-color: white}
     *         OPTION:NOT(:checked) {color:initial;background-color:initial;font-weight:initial;}
     *         OPTION.classToSelect {color:red}
     *         .classToSelect {color:red}
     *         OPTION.otra {color:blue}
     *         .otra {color:blue}
     *         OPTION.classNotChange {color:blue}
     *   </style>
     *   <select id="id">
     *       <option class="classToSelect">class=classToSelect</option>
     *       <option>No Class defined</option>
     *       <option class="otra">Class=Otra</option>
     *   </select>
     * @param {string|event} ev
     */
    static selectColorea(ev) {
        let selectElement = typeof ev === 'string' ? document.getElementById(ev) : ev.target;
        let prevClass = selectElement.dataset.selectedOptionClass;
        if(prevClass)
            selectElement.classList.remove(prevClass);
        const optionClass = selectElement.options[selectElement.selectedIndex].className;
        if(optionClass.length)
            selectElement.classList.add(optionClass);
        selectElement.dataset.selectedOptionClass = optionClass;
    }

    static radioButtonValue(name, value) {
        if(typeof value === 'undefined')
            return (document.querySelector(`input[name='${name}']:checked`) || {}).value || undefined;
        (document.querySelector(`input[name='${name}'][value='${value}']`) || {}).checked=true;
    }

}
