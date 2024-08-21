function getFEAttributes(element) {
	return element.getAttributeNames().filter(c => c.startsWith("fe") && !c.includes("fe-item")).reduce((prev, curr) => {
		console.log(element.getAttribute(curr));
		prev[curr.replace("fe-", "")] = element.getAttribute(curr);
		return prev;
	}, {});
}

function createOption(value, displayName, attributes) {
	const option = document.createElement('option');
	option.value = value;
	option.innerHTML = displayName;
	Object.entries(attributes).forEach((attrKv) => option.setAttribute(attrKv[0], attrKv[1] ?? ''));

	return option;
}

/**
 * takes an array of items and build a map of `filter-key` and available `option[]` elements
 * @param {HTMLElement} items
 * @returns {{[filterKey: string]: HTMLOptionElement[]}}
 */
function buildOptionsFromPossibleVariations(items) {
	return items.reduce((prev, curr) => {
		const attributes = getFEAttributes(curr);

		Object.entries(attributes).forEach((attributeKv) => {
			console.log(attributeKv);
			const key = attributeKv[0];
			if (prev[key] == undefined) {
				prev[key] = [];
			}
			prev[key].push(createOption(attributeKv[1], attributeKv[1], Object.entries(attributes).reduce((prev, curr) => {prev["dyn-" + curr[0]] = curr[1]; return prev})));
		}, {});
		return prev;
	}, {});
}

function initializeFE() {
	const items = Array.from(document.querySelectorAll('[fe-item]'));
	const options = buildOptionsFromPossibleVariations(items);
	const selects = document.querySelectorAll('select');
	console.log("from-elements.js has successfully loaded.");
	console.debug(options);
	selects.forEach((select, i) => {
		const values = Object.entries(options).find(c => c[0] === select.name)?.[1];
		if (!values) return;

		values.forEach((val) => {
			select.add(val)
		});
	});
}

initializeFE();
