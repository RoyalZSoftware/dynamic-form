# Dynamic Form

Copyright RoyalZSoftware 2024: Dynamic Form

Author: Alexander Panov <panov@royalzsoftware.de>

## Abstract
This is intended to be a micro library to create forms with select fields that
change based on the selection of forms value

## Demo
![Demo video](./resources/demo.gif)

## Terminology
- A `form` is not just the html form, but it also contains a state TODO
- A `filter select field` is a select field that triggers a reevaluation of the select options
of all the select fields inside a `form`

## Requirements
1. It should be simple
2. There should be an attribute that creates a `form`: `dyn-form`.
3. There should be an attribute that creates a `filter select field`: `dyn-filter`
4. At form initialization it is expected that all select fields are rendered in the DOM.
5. When one of the `filter select field`s changes, then reevaluate the available options
for all the select fields
6. To specify the property of an option, pass the `dyn-*` attribute.
7. It is expected that all the options are rendered as <options> inside the select fields at initialization time.
Those will be hidden or shown depending on the filter.
