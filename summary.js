function watchOn(element, dynForm, index, bindProperty) {
  dynForm.addEventListener('change', (e) => {
    if (!e.detail) return;
    const selectedOption = Array.from(e.detail.selectedOptions)[index];

    let value;
    if (!bindProperty) {
      value = selectedOption.value;
    } else
    if (bindProperty == 'text') {
      value = selectedOption.innerHTML;
    } else
    {
      value = selectedOption.getAttribute(bindProperty);
    }
    element.innerHTML = value;
  });
}

const summaryFields = document.querySelectorAll('[summary]');
const dynForm = document.querySelector('[dyn-form]');

summaryFields.forEach((summaryField) => {
  const index = summaryField.getAttribute("dyn-index");
  const bindProperty = summaryField.getAttribute("dyn-bind");
  if (!index || !bindProperty) {
    console.error("When using the [summary] attribute please specify [dyn-index] attr (the select field index) and [dyn-bind] attr (to specify what value should be displayed)");
    return;
  }
  watchOn(summaryField, dynForm, index, bindProperty);
});

