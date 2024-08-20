/**
 * Copyright RoyalZSoftware 2024: Dynamic Form
 * Author: Alexander Panov <panov@royalzsoftware.de>
 * 
 */
const QS_FORM = "dyn-form";
const QS_FILTER_SELECT_FIELD = "dyn-filter";

/**
 * Check if the attributes of an element match the filter
 *
 * @param {{[key: string]: string}} attributes
 * @param {{[key: string]: string}} filter
 * @param {string[]} dependsOn is the array of select field names that this input depends on
 */
function matches(attributes, filter, deps=Object.keys(filter)) {
    console.debug(filter);
    return deps.map((k) => {
        const v = filter[k];
        console.debug(k, v, attributes, attributes[k]);
        if (attributes[k] == undefined) {
            return true;
        }

        if (attributes[k] === v) {
            return true;
        }

        return false;
    }).every(c => c == true);
}

/**
 * @returns {undefined | string[]} either undefined if behavior is not set and otherwise an array of the select names
 */
function dependsOn(dynDependsOnAttr) {
	console.debug(dynDependsOnAttr);
	if (dynDependsOnAttr != null) {
		if (dynDependsOnAttr == "") return [];
		return dynDependsOnAttr.split(',');
	}
	return undefined;
}

/**
 * Setup the event listeners for all the select fields
 * @param {HTMLElement} element 
 */
function initializeForm(element) {
    const filter = {};
    const formValues = {};

    // find all selects
    const selectFields = Array.from(element.querySelectorAll('select'));

    const reevaluate = () => {
        selectFields.forEach((selectField) => {
	    let visibleFields = [];
            Array.from(selectField.options).forEach((option) => {
                const attributes = option.getAttributeNames();
		const dependsOnAttr = selectField.getAttribute("dyn-depends-on")
		const deps = dependsOn(dependsOnAttr);
		console.debug(deps);
                
                const attributeMap = attributes.reduce((prev, curr) => {
                    prev[curr.replace('dyn-', '')] = option.getAttribute(curr);
                    return prev;
                }, {});

                option.style.display = 'none';

                if (matches(attributeMap, filter, deps) && !visibleFields.includes(option.value)) {
                    option.style.display = 'block';
		    visibleFields.push(option.value);
                }
            });
            if (selectField.selectedOptions[0] && selectField.selectedOptions[0].style.display === 'none') {
                selectField.selectedIndex = 0;
                formValues[selectField.getAttribute('name')] = "";
            }
        });
    };

    selectFields.forEach((selectField) => {
        selectField.addEventListener('change', (event) => {
            const name = event.target.getAttribute('name');
            if (selectField.hasAttribute(QS_FILTER_SELECT_FIELD)) {
                filter[name] = event.target.value;
                console.debug(filter);
            }
            reevaluate();
            formValues[name] = event.target.value;
            element.dispatchEvent(new CustomEvent('change', {detail: {
                formValues,
                selectedOptions: selectFields.map(c => c.selectedOptions[0]),
            }}));
        })
    });

    filter[selectFields[0].name] = selectFields[0].options[0].value;
    reevaluate();
}

function initializeForms() {
    const formElements = document.querySelectorAll('[' + QS_FORM + ']');

    for (const formElement of formElements) {
        initializeForm(formElement);
    }
}

initializeForms();
