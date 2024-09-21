export abstract class Html {
	static fieldset(class_: string, legend: string, ...content: string[]): string {
		return `<fieldset class=${class_}><legend>${legend}</legend>${content.join("")}</fieldset>`;
	}

	static li(content: string): string {
		return `<li>${content}</li>`;
	}

	static ul(class_: string, content: string): string {
		return `<ul class="${class_}">${content}</ul>`;
	}

	static label(for_: string, class_: string, text: string): string {
		return `<label for="${for_}" class="${class_}">${text}</label>`;
	}

	static input(name: string, value: string): string {
		return `<input type="text" name="${name}" value="${value}" required />`;
	}

	static button(type: string, class_: string, text: string): string {
		return `<button type="${type}" class="${class_}">${text}</button>`;
	}

	static div(...content: string[]) {
		return `<div>${content.join("")}</div>`;
	}

	static form(class_: string, ...content: string[]): string {
		return `<form class=${class_}>${content.join("")}</form>`;
	}
}
