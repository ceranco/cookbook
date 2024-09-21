import { Html } from "./html";
import { Ingredient, IngredientList, Recipe, Section, SectionList, Step, StepList } from "./recipe";

abstract class HtmlFormFormatter {
	static formatIngredient(ingredient: Ingredient): HTMLLIElement {
		return Html.li(Html.input("ingredient", ingredient));
	}

	static formatIngredientList(ingredients: IngredientList): HTMLElement {
		const button = Html.button("button", "add_ingredient", "הוסף רכיב");

		let list = ingredients.map(HtmlFormFormatter.formatIngredient);
		list.push(Html.li(button));

		const htmlIngredients = Html.ul("recipe_ingredients", list);

		return Html.fieldset("ingredients", "רכיבים", htmlIngredients);
	}

	static formatStep(step: Step): HTMLLIElement {
		return Html.li(Html.input("step", step));
	}

	static formatStepList(steps: StepList): HTMLElement {
		const button = Html.button("button", "add_step", "הוסף שלב");

		let list = steps.map(HtmlFormFormatter.formatStep);
		list.push(Html.li(button));

		const htmlSteps = Html.ul("recipe_steps", list);

		return Html.fieldset("steps", "הוראות הכנה", htmlSteps);
	}

	static formatSection(section: Section): HTMLLIElement {
		let name = Html.div(Html.label("section_name", "section_name", "שם שלב:"), Html.input("section_name", section.name));
		let ingredients = HtmlFormFormatter.formatIngredientList(section.ingredients);
		let steps = HtmlFormFormatter.formatStepList(section.steps);

		return Html.li(Html.fieldset("section", "שלב", name, ingredients, steps));
	}

	static formatSectionList(sections: SectionList): HTMLElement {
		const button = Html.button("button", "add_section", "הוסף שלב");

		let list = sections.map(HtmlFormFormatter.formatSection);
		list.push(Html.li(button));

		return Html.ul("recipe_sections", list);
	}

	static formatRecipe(recipe: Recipe): HTMLElement {
		let nameLabel = Html.label("recipe_name", "recipe_name", "שם מתכון:");
		let nameInput = Html.input("recipe_name", recipe.name);
		let sections = HtmlFormFormatter.formatSectionList(recipe.sections);
		let submit = Html.button("submit", "submit", "שמור מתכון");

		return Html.form("recipe_form", nameLabel, nameInput, sections, submit);
	}
}

export abstract class HtmlFormDecoder {
	static decodeIngredientList(element: Element): IngredientList {
		const inputs = Array.from(element.querySelectorAll<HTMLInputElement>("input[name='ingredient']"));
		return inputs.map(input => input.value);
	}

	static decodeStepList(element: Element): StepList {
		const inputs = Array.from(element.querySelectorAll<HTMLInputElement>("input[name='step']"));
		return inputs.map(input => input.value);
	}

	static decodeSection(element: Element): Section {
		const name = element.querySelector<HTMLInputElement>("input[name='section_name']")!.value;
		const ingredients = HtmlFormDecoder.decodeIngredientList(element.querySelector(".recipe_ingredients")!);
		const steps = HtmlFormDecoder.decodeStepList(element.querySelector(".recipe_steps")!);

		return new Section(name, ingredients, steps);
	}

	static decodeSectionList(element: Element): SectionList {
		const sections = Array.from(element.querySelectorAll(".section"));
		return sections.map(HtmlFormDecoder.decodeSection);
	}

	static decodeRecipe(element: Element): Recipe {
		const name = element.querySelector<HTMLInputElement>("input[name='recipe_name']")!.value;
		const sections = HtmlFormDecoder.decodeSectionList(element.querySelector(".recipe_sections")!);

		return new Recipe(name, sections);
	}
}

const recipe = new Recipe("פיצה", [
	new Section("בצק", ["קמח", "מים", "שמרים"], ["לשים את הקמח בקערה", "להוסיף את המים והשמרים"]),
	new Section("רוטב", ["רסק עגבניות", "תבלינים"], ["לערבב את כל המרכיבים"])
]);

// let recipe = Recipe.empty();
const html = HtmlFormFormatter.formatRecipe(recipe);
let app = document.body.querySelector("#app")!;
app.replaceChildren(html);
console.log(HtmlFormDecoder.decodeRecipe(app));
