import { Html } from "./html";
import { Ingredient, IngredientList, Recipe, Section, SectionList, Step, StepList } from "./recipe";

abstract class MdRecipeFormatter {
	static formatIngredient(ingredient: Ingredient): string {
		return `      * ${ingredient}`;
	}

	static formatIngredientList(ingredients: IngredientList): string {
		const mdIngredients = ingredients.map(MdRecipeFormatter.formatIngredient).join("\n");
		return `    * רכיבים:\n${mdIngredients}`;
	}

	static formatStep(step: Step): string {
		return `      * ${step}`;
	}

	static formatStepList(steps: StepList): string {
		const mdSteps = steps.map(MdRecipeFormatter.formatStep).join("\n");
		return `    * הוראות הכנה:\n${mdSteps}`;
	}

	static formatSection(section: Section): string {
		const ingredients = MdRecipeFormatter.formatIngredientList(section.ingredients);
		const steps = MdRecipeFormatter.formatStepList(section.steps);
		return `  * ${section.name}\n${ingredients}\n\n${steps}`;
	}

	static formatSectionList(sections: SectionList): string {
		return sections.map(MdRecipeFormatter.formatSection).join("\n\n");
	}

	static formatRecipe(recipe: Recipe): string {
		const sections = MdRecipeFormatter.formatSectionList(recipe.sections);
		return `# ${recipe.name}\n${sections}`;
	}
}

abstract class HtmlRecipeFormatter {
	static formatIngredient(ingredient: Ingredient): HTMLLIElement {
		const removeButton = Html.button("button", "remove_ingredient", "🚫");
		const ingredientDiv = Html.div(Html.input("ingredient", ingredient), removeButton);
		ingredientDiv.className = "ingredient";
		const ingredientLi = Html.li(ingredientDiv);

		removeButton.onclick = () => {
			ingredientLi.remove();
		}

		return ingredientLi;
	}

	static formatIngredientList(ingredients: IngredientList): HTMLElement {
		const button = Html.button("button", "add_ingredient", "⬅️");

		const list = ingredients.map(HtmlRecipeFormatter.formatIngredient);
		list.push(Html.li(button));

		const htmlIngredients = Html.ul("recipe_ingredients", list);
		button.onclick = () => {
			htmlIngredients.insertBefore(HtmlRecipeFormatter.formatIngredient(""), htmlIngredients.lastElementChild);
		}

		return Html.fieldset("ingredients", "רכיבים", htmlIngredients);
	}

	static formatStep(step: Step): HTMLLIElement {
		const removeButton = Html.button("button", "remove_step", "🚫");
		const stepDiv = Html.div(Html.input("step", step), removeButton);
		stepDiv.className = "step";
		const stepLi = Html.li(stepDiv);

		removeButton.onclick = () => {
			stepLi.remove();
		}

		return stepLi;
	}

	static formatStepList(steps: StepList): HTMLElement {
		const button = Html.button("button", "add_step", "⬅️");

		const list = steps.map(HtmlRecipeFormatter.formatStep);
		list.push(Html.li(button));

		const htmlSteps = Html.ul("recipe_steps", list);
		button.onclick = () => {
			htmlSteps.insertBefore(HtmlRecipeFormatter.formatStep(""), htmlSteps.lastElementChild);
		}

		return Html.fieldset("steps", "הוראות הכנה", htmlSteps);
	}

	static formatSection(section: Section): HTMLLIElement {
		const removeButton = Html.button("button", "remove_section", "🚫");
		const name = Html.div(Html.label("section_name", "section_name", "שם שלב:"), Html.input("section_name", section.name), removeButton);
		name.className = "section_name";
		const ingredients = HtmlRecipeFormatter.formatIngredientList(section.ingredients);
		const steps = HtmlRecipeFormatter.formatStepList(section.steps);
		const sectionLi = Html.li(Html.fieldset("section", "שלב", name, ingredients, steps));

		removeButton.onclick = () => {
			sectionLi.remove();
		}

		return sectionLi;
	}

	static formatSectionList(sections: SectionList): HTMLElement {
		const button = Html.button("button", "add_section", "⬅️");

		const list = sections.map(HtmlRecipeFormatter.formatSection);
		list.push(Html.li(button));
		const htmlSections = Html.ul("recipe_sections", list);

		button.onclick = () => {
			const emptySection = HtmlRecipeFormatter.formatSection(new Section());
			htmlSections.insertBefore(emptySection, htmlSections.lastElementChild);
		}

		return htmlSections;
	}

	static formatRecipe(recipe: Recipe): HTMLElement {
		const nameLabel = Html.label("recipe_name", "recipe_name", "שם מתכון:");
		const nameInput = Html.input("recipe_name", recipe.name);
		const nameDiv = Html.div(nameLabel, nameInput);
		nameDiv.className = "recipe_name";
		const sections = HtmlRecipeFormatter.formatSectionList(recipe.sections);
		const submit = Html.button("submit", "save_recipe", "📥 שמור מתכון 📥");
		const form = Html.form("recipe_form", nameDiv, sections, submit);

		form.onsubmit = () => {
			console.log("submit");
			const app = document.body.querySelector("#app")!;
			const recipe = HtmlRecipeDecoder.decodeRecipe(app);
			const mdRecipe = MdRecipeFormatter.formatRecipe(recipe);

			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(mdRecipe));
			element.setAttribute('download', `${recipe.name}.md`);

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
			return false;
		};

		return form
	}
}
abstract class HtmlRecipeDecoder {
	static decodeIngredientList(element: Element): IngredientList {
		const inputs = Array.from(element.querySelectorAll<HTMLTextAreaElement>("textarea[name='ingredient']"));
		return inputs.map(input => input.value);
	}

	static decodeStepList(element: Element): StepList {
		const inputs = Array.from(element.querySelectorAll<HTMLTextAreaElement>("textarea[name='step']"));
		return inputs.map(input => input.value);
	}

	static decodeSection(element: Element): Section {
		const name = element.querySelector<HTMLTextAreaElement>("textarea[name='section_name']")!.value;
		const ingredients = HtmlRecipeDecoder.decodeIngredientList(element.querySelector(".recipe_ingredients")!);
		const steps = HtmlRecipeDecoder.decodeStepList(element.querySelector(".recipe_steps")!);

		return new Section(name, ingredients, steps);
	}

	static decodeSectionList(element: Element): SectionList {
		const sections = Array.from(element.querySelectorAll(".section"));
		return sections.map(HtmlRecipeDecoder.decodeSection);
	}

	static decodeRecipe(element: Element): Recipe {
		const name = element.querySelector<HTMLTextAreaElement>("textarea[name='recipe_name']")!.value;
		const sections = HtmlRecipeDecoder.decodeSectionList(element.querySelector(".recipe_sections")!);

		return new Recipe(name, sections);
	}
}

const storedRecipe = sessionStorage.getItem("recipe");
const recipe = storedRecipe ? JSON.parse(storedRecipe) :
	new Recipe("פיצה", [
		new Section("בצק", ["קמח", "מים", "שמרים"], ["לשים את הקמח בקערה", "להוסיף את המים והשמרים"]),
		new Section("רוטב", ["רסק עגבניות", "תבלינים"], ["לערבב את כל המרכיבים"])
	]);
// Recipe.empty();

const html = HtmlRecipeFormatter.formatRecipe(recipe);
const app = document.body.querySelector("#app")!;
app.replaceChildren(html);

setInterval(() => {
	sessionStorage.setItem("recipe", JSON.stringify(HtmlRecipeDecoder.decodeRecipe(app)));
}, 100);