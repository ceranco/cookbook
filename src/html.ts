export abstract class Html {
	static fieldset(class_: string, legend: string, ...elements: Node[]): HTMLFieldSetElement {
		let legendElement = document.createElement("legend");
		legendElement.textContent = legend;

		let fieldset = document.createElement("fieldset");
		fieldset.className = class_;
		fieldset.appendChild(legendElement);
		elements.forEach(child => fieldset.appendChild(child));

		return fieldset;
	}

	static li(content: Node): HTMLLIElement {
		let li = document.createElement("li");
		li.appendChild(content);

		return li;
	}

	static ul(class_: string, items: HTMLLIElement[]): HTMLUListElement {
		let ul = document.createElement("ul");
		ul.className = class_;
		items.forEach(item => ul.appendChild(item));

		return ul;
	}

	static label(for_: string, class_: string, text: string): HTMLLabelElement {
		let label = document.createElement("label");
		label.htmlFor = for_;
		label.className = class_;
		label.textContent = text;

		return label;
	}

	static input(name: string, value: string): HTMLInputElement {
		let input = document.createElement("input");
		input.type = "text";
		input.name = name;
		input.value = value;
		input.required = true;

		return input;
	}

	static button(type: "button" | "submit" | "reset", class_: string, text: string): HTMLButtonElement {
		let button = document.createElement("button");
		button.type = type;
		button.className = class_;
		button.textContent = text;

		return button;
	}

	static div(...elements: Node[]): HTMLDivElement {
		let div = document.createElement("div");
		elements.forEach(child => div.appendChild(child));

		return div;
	}

	static form(class_: string, ...children: Node[]): HTMLFormElement {
		let form = document.createElement("form");
		form.className = class_;
		children.forEach(child => form.appendChild(child));

		return form;
	}
}
