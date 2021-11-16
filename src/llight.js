import utils from './llight-utils';

class LLight {

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



			// route hash change
			window.addEventListener('hashchange', _ => this.renderRoute());
		}

		for (let node of qa('[ll-for]')) {
			let arr = eval(node.getAttribute('ll-for')); // the array
			let childId = parseInt(node.getAttribute('ll-for-id')); // the id in .forId

			node.innerHTML = '';

			for (const [idx, item] of arr.entries()) {
				let newChildNode = this.forId[childId].cloneNode(true);
				node.appendChild(newChildNode);

				// The node to be edited can be the first child itself so if I dont find
				// anything with query selector I return itself
				(newChildNode.querySelector('[ll-for-here]') || newChildNode).innerText = item;

				node.querySelectorAll('*').forEach(node => {
					[...node.attributes]
						.filter(a => a.name.startsWith('ll-'))
						.map(a => {
							a.value = a.value.replace('$i$', idx);
							return a;
						})
				})
			}
		}


		qa('[ll-text]').forEach(node => {
			node.innerText = eval(node.getAttribute('ll-text'));
		});

		qa('[ll-bind]').forEach(node => {
			let variable = eval(node.getAttribute('ll-bind'));
			if (/checkbox|radio/.test(node.type)) node.checked = variable;
			else node.value = variable;
		})

		// class setup
		qa('[ll-class]').forEach(node => {
			// eg. ll-class="d-none:hiding"
			// the class *d-none* is applied if expression *hiding* is true
			let arr = node.getAttribute('ll-class').split(":");
			if (arr.length == 2) {
				if (eval(arr[1])) node.classList.add(arr[0]);
				else node.classList.remove(arr[0]);
			} else {
				console.error('ll-class must be in form: "class:expression"');
			}
		});

		// custom attribute
		qa('[ll-attr]').forEach(node => {
			let arr = node.getAttribute('ll-attr').split("=");
			if (arr.length == 2) {
				node.setAttribute(arr[0], eval(arr[1]));
			} else {
				console.error('ll-attr must be in form: "attribute=expression"');
			}
		});

		// shows or hide based on expression
		qa('[ll-show]').forEach(node => {
			let expr = node.getAttribute('ll-show');
			if (eval(expr))
				node.style.display = '';
			else
				node.style.display = 'none';
		});

		// goto link route
		qa('a[ll-goto]').forEach(node => {
			let route = node.getAttribute('ll-goto');
			// if it doesnt start with slash add it 
			if (!route.startsWith('/')) route = `/${route}`;

			node.href = `#${route}`;
		});

		// router nodes

		// if first time go to default route
		if (this.opts.routing) {
			if (firstTime) location.hash = '#/';
			this.renderRoute();
		}

		// setup event listeners
		qa('[ll-bind]').forEach(node => node.addEventListener('input', this.bind));
		qa('[ll-\\@enter]').forEach(node => node.addEventListener('keydown', this.enter));
		qa('[ll-\\@click]').forEach(node => {
			node.style.cursor = 'pointer';
			node.addEventListener('click', this.click);
		})

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
		e.preventDefault();
		let evalString = e.target.getAttribute('ll-@click');
		eval(evalString);
		ll.update();
	}

	enter(e) {
		if (e.key !== "Enter") return;
		eval(e.target.getAttribute('ll-@enter'));
		ll.update();
	}

	bind(e) {
		let variable = e.target.getAttribute('ll-bind');
		if (/checkbox|radio/.test(e.target.type)) {
			eval(`${variable} = ${e.target.checked}`);
		} else {
			eval(`${variable} = ${JSON.stringify(e.target.value)}`);
		}
		ll.update();
	}

	// evalInScope(js, contextAsScope) {
	// 	// from: https://stackoverflow.com/a/25859853/10718545
	// 	return function () { with (this) { return eval(js); }; }.call(contextAsScope);
	// }

	dbg(str) {
		if (this.opts.debug) console.log('[llight debug] ', str);
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
		document.addEventListener('DOMContentLoaded', () => window.ll.init());
	}
}