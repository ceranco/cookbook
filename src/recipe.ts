export type Ingredient = string; export type IngredientList = Ingredient[];
export type Step = string;
export type StepList = Step[];
export class Section {
	name: string;
	ingredients: IngredientList;
	steps: StepList;

	constructor(name = "", ingredients: IngredientList = [], steps: StepList = []) {
		this.name = name;
		this.ingredients = ingredients;
		this.steps = steps;
	}
}

export type SectionList = Section[];
export class Recipe {
	name: string;
	sections: SectionList;

	constructor(name: string = "", sections: Section[] = []) {
		this.name = name;
		this.sections = sections;
	}

	static empty(): Recipe {
		return new Recipe(undefined, [
			new Section(undefined, [], [])
		]);
	}
}

