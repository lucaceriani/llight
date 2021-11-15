import utils from './llight-utils';

class LLight {

	debugEnabled = false;
	isInitialized = false;
	forId = [];

	$ = {};
	_ = utils;

	// default options
	opts = {
		debug: false,
		routing: true,
	}

	init(opts) {
		this.opts = { ...this.opts, ...opts }
		this.update(true);
		document.dispatchEvent(new CustomEvent('llight:initialized'));
	}

	update(firstTime = false) {
		let ts = performance.now();

		const qa = (q) => document.querySelectorAll(q);

		if (firstTime) this.dbg("Called llight() first time!");
		else this.dbg("Called llight()");

		if (firstTime) {
			for (let node of qa('[ll-for]')) {
				node.setAttribute('ll-for-id', this.forId.length);
				// push the cloned first child
				this.forId.push(node.firstElementChild.cloneNode(true));
			}

			// element self biding
			for (let node of qa('[ll-self]')) {
				let name = node.getAttribute('ll-self');

				// if there is no name try to get the id
				if (!name) name = node.getAttribute('id');

				if (!name) {
					console.error('llight: No value for "ll-self" or "id"');
					continue
				}

				if (this.$.hasOwnProperty(name)) {
					console.error(`llight: Trying to self-bind with name "${name}" but it already exists!`);
				} else {
					this.$[name] = node;
				}
			}

			// setup event listeners
			for (let node of qa('[ll-bind]')) node.addEventListener('input', e => this.bind(e));
			for (let node of qa('[ll-\\@click]')) node.addEventListener('click', e => this.click(e));
			for (let node of qa('[ll-\\@enter]')) node.addEventListener('keydown', e => this.enter(e));

			// route hash change
			window.addEventListener('hashchange', _ => this.renderRoute());
		}

		for (let node of qa('[ll-bind]')) {
			let variable = eval(node.getAttribute('ll-bind'));

			if (/checkbox|radio/.test(node.type)) {
				node.checked = variable;
			} else {
				node.value = variable;
			}
		}

		for (let node of qa('[ll-text]')) {
			node.innerText = eval(node.getAttribute('ll-text'));
		}

		// class setup
		for (let node of qa('[ll-class]')) {
			// eg. ll-class="d-none:hiding"
			// the class *d-none* is applied if expression *hiding* is true
			let arr = node.getAttribute('ll-class').split(":");
			if (arr.length != 2) {
				console.error('ll-class must be in form: "class:expression"');
				continue // skip this node;
			}
			// else
			if (eval(arr[1])) node.classList.add(arr[0]);
			else node.classList.remove(arr[0]);
		}

		// custom attribute
		for (let node of qa('[ll-attr]')) {
			let arr = node.getAttribute('ll-attr').split("=");
			if (arr.length == 2) {
				node.setAttribute(arr[0], eval(arr[1]));
			} else {
				console.error('ll-attr must be in form: "attribute=expression"');
			}
		}

		// shows or hide based on expression
		for (let node of qa('[ll-show]')) {
			let expr = node.getAttribute('ll-show');
			if (eval(expr))
				node.style.display = '';
			else
				node.style.display = 'none';
		}

		// goto link route
		for (let node of qa('a[ll-goto]')) {
			let route = node.getAttribute('ll-goto');
			// if it doesnt start with slash add it 
			if (!route.startsWith('/')) route = `/${route}`;

			node.href = `#${route}`;
		}

		for (let node of qa('[ll-for]')) {
			let arr = eval(node.getAttribute('ll-for')); // the array
			let childId = parseInt(node.getAttribute('ll-for-id')); // the id in .forId

			node.innerHTML = '';

			for (let item of arr) {
				let newChildNode = this.forId[childId].cloneNode(true);
				node.appendChild(newChildNode);

				// The node to be edited can be the first child itself so if I dont find
				// anything with query selector I return itself
				(newChildNode.querySelector('[ll-for-here]') || newChildNode).innerText = item;
			}
		}


		// router nodes

		// if first time go to default route
		if (this.opts.routing) {
			if (firstTime) location.hash = '#/';
			this.renderRoute();
		}

		// everything ok

		if (firstTime) document.body.dispatchEvent(new Event('llight.initialized'));
		else document.body.dispatchEvent(new Event('llight.updated'));

		// performance
		let te = performance.now();
		this.dbg(`It took ${Math.round(te - ts)} ms`);

	}

	renderRoute() {
		let route = location.hash.substr(1); // location hash without '#'
		document.querySelectorAll(`[ll-route="${route}"]`).forEach(el => el.style.display = '');
		document.querySelectorAll(`[ll-route]:not([ll-route="${route}"])`).forEach(el => el.style.display = 'none');
	}

	click(e) {
		if (e.target.nodeName == 'A') e.preventDefault();
		let evalString = e.target.getAttribute('ll-@click');
		eval(evalString);
		this.update();
	}

	enter(e) {
		if (e.key !== "Enter") return;
		eval(e.target.getAttribute('ll-@enter'));
		this.update();
	}

	bind(e) {
		let variable = e.target.getAttribute('ll-bind');
		if (/checkbox|radio/.test(e.target.type)) {
			eval(`${variable} = ${e.target.checked}`);
		} else {
			eval(`${variable} = ${JSON.stringify(e.target.value)}`);
		}
		this.update();
	}

	dbg(str) {
		if (this.opts.debug) console.log('[llight debug] ' + str);
	}
}

// global variable setup
if (window.ll) {
	console.error("llight: LLight cannot be initialized, 'll' already exists");
} else {
	window.ll = new LLight();

	// if we need to autoinit continue...
	if (document.currentScript && !document.currentScript.hasAttribute('ll-autoinit')) return

	let autoinitValue = document.currentScript.getAttribute('ll-autoinit');

	if (!autoinitValue) {
		document.addEventListener('DOMContentLoaded', () => window.ll.init());
		return
	}

	let opts = null;
	try {
		opts = eval(`(${autoinitValue})`);
		if (typeof opts === 'object' && opts !== null) {
			document.addEventListener('DOMContentLoaded', () => window.ll.init(opts));
		} else {
			throw 'Option object is not of object type or is null :(';
		}
	} catch (e) {
		console.error('Error in parsing options, see below. Using default options!');
		console.error(e);
	}
	// init anyway because there is 'll-autoinit' attribute
	// init with default options
}