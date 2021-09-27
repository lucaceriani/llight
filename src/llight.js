const llight = {
	debugEnabled: false,
	isInitialized: false,

	forId: [],

	// functions 	
	update: null,
	click: null,
	bind: null,
	enter: null,
	dbg: null,
};

llight.update = function () {

	let st = performance.now();
	const qa = (q) => document.body.querySelectorAll(q);
	let firstTime = !llight.isInitialized;

	if (firstTime) llight.dbg("Called llight() first time!");
	else llight.dbg("Called llight()");

	if (firstTime) {
		for (let node of qa('[ll-for]')) {
			node.setAttribute('ll-for-id', llight.forId.length);
			// push the cloned first child
			llight.forId.push(node.firstElementChild.cloneNode(true));
		}

		// setup event listeners

		for (let node of qa('[ll-bind]')) node.addEventListener('input', llight.bind);
		for (let node of qa('[ll-\\@click]')) node.addEventListener('click', llight.click);
		for (let node of qa('[ll-\\@enter]')) node.addEventListener('keydown', llight.enter);
	}

	for (let node of qa('[ll-bind]')) {
		let variable = eval(node.getAttribute('ll-bind'));
		node.value = variable;
	}

	for (let node of qa('[ll-text]')) {
		node.innerText = eval(node.getAttribute('ll-text'));
	}

	for (let node of qa('[ll-for]')) {
		let arr = eval(node.getAttribute('ll-for')); // the array
		let childId = parseInt(node.getAttribute('ll-for-id')); // the id in .forId

		node.innerHTML = '';

		for (let item of arr) {
			let newChildNode = llight.forId[childId].cloneNode(true);
			node.appendChild(newChildNode);

			// The node to be edited can be the first child itself so if I dont find
			// anything with query selector I return itself
			(newChildNode.querySelector('[ll-for-here]') || newChildNode).innerText = item;
		}
	}

	let et = performance.now()
	llight.dbg(`It took ${(et - st).toFixed(2)} ms`);

	// llight initialized
	llight.isInitialized = true;
}

llight.click = function (e) {
	let evalString = e.target.getAttribute('ll-@click');
	eval(evalString);
	llight.update();
}

llight.enter = function (e) {
	if (e.key !== "Enter") return;
	eval(e.target.getAttribute('ll-@enter'));
	llight.update();
}

llight.bind = function (e) {
	let variable = e.target.getAttribute('ll-bind');
	eval(`${variable} = ${JSON.stringify(e.target.value)}`); // assign the value
	llight.update();
}

llight.dbg = function (str) {
	if (llight.debugEnabled) console.log(str);
}

document.addEventListener('DOMContentLoaded', llight.update);