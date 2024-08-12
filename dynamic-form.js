/**
 * Copyright RoyalZSoftware 2024: Dynamic Form
 * Author: Alexander Panov <panov@royalzsoftware.de>
 * 
 * Abstract:
 *  This is intended to be a micro library to create forms with select fields that
 *  change based on the selection of forms value
 * 
 * Terminology:
 *  - A `form` is not just the html form, but it also contains a state TODO
 *  - A `filter select field` is a select field that triggers a reevaluation of the select options
 * 
 * Requirements:
 *  1. It should be simple
 *  2. There should be an attribute that creates a `form`: `dyn-form`.
 *  3. There should be an attribute that creates a `filter select field`: `dyn-filter`
 *  4. At form initialization it is expected that all select fields are rendered in the DOM.
 *  5. When one of the `filter select field`s changes, then reevaluate the available options
 *     for all the select fields
 *  6. To specify the property of an option, pass the `dyn-*` attribute.
 *  7. It is expected that all the options are rendered as <options> inside the select fields at initialization time.
 *     Those will be hidden or shown depending on the filter.
 */

const QS_FORM = "dyn-form";
const QS_FILTER_SELECT_FIELDS = "dyn-filter";

function matches(attributes, filter) {
    console.debug(filter);
    return Object.keys(filter).map((k) => {
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
 * 
 * @param {HTMLElement} element 
 */
function initializeForm(element) {
    const filter = {};
    const formValues = {};

    // find all selects
    const selectFields = Array.from(element.querySelectorAll('select'));

    const filterSelectFields = selectFields.filter(c => c.getAttributeNames().includes(QS_FILTER_SELECT_FIELDS));

    const reevaluate = () => {
        selectFields.forEach((selectField) => {
            Array.from(selectField.options).forEach((option) => {
                const attributes = option.getAttributeNames();
                
                const attributeMap = attributes.reduce((prev, curr) => {
                    prev[curr.replace('dyn-', '')] = option.getAttribute(curr);
                    return prev;
                }, {});

                option.style.display = 'block';

                if (!matches(attributeMap, filter)) {
                    option.style.display = 'none';
                }
            });
            if (selectField.selectedOptions[0] && selectField.selectedOptions[0].style.display === 'none') {
                selectField.selectedIndex = 0;
                formValues[selectField.getAttribute('name')] = "";
            }
        });
    };

    filterSelectFields.forEach((selectField) => {
        selectField.addEventListener('change', (event) => {
            const name = event.target.getAttribute('name');
            filter[name] = event.target.value;
            console.debug(filter);
            reevaluate();
        })
    });

    selectFields.forEach((selectField) => {
        selectField.addEventListener('change', (event) => {
            console.debug(event);
            const name = event.target.getAttribute('name');
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
