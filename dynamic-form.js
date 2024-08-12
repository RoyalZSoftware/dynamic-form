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
 */
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
