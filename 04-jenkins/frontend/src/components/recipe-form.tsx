import { type SubmitEventHandler, useState, type ChangeEventHandler, type FC, type KeyboardEventHandler, type MouseEventHandler } from "react";
import type { RecipeDifficulty } from "@/types/recipe";
import Heading from "./heading";

type RecipeFormData = {
  title: string;
  description: string;
  difficulty: RecipeDifficulty;
  prepTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
};

const defaultFormData: RecipeFormData = {
  title: "",
  description: "",
  difficulty: "medium",
  prepTime: 30,
  servings: 4,
  ingredients: [],
  steps: [],
};

export interface RecipeFormProps {
  onSubmit: (data: RecipeFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<RecipeFormData>;
}

const RecipeForm: FC<RecipeFormProps> = ({ onSubmit, isLoading = false, initialData }) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    ...defaultFormData,
    ...initialData,
    ingredients: initialData?.ingredients ?? defaultFormData.ingredients,
    steps: initialData?.steps ?? defaultFormData.steps,
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [stepInput, setStepInput] = useState("");

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    if (name === "prepTime" || name === "servings") {
      const parsedValue = Number.parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: Number.isNaN(parsedValue) ? 0 : parsedValue,
      }));
      return;
    }

    if (name === "difficulty") {
      setFormData((prev) => ({
        ...prev,
        difficulty: value as RecipeDifficulty,
      }));
      return;
    }

    if (name === "title" || name === "description") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        steps: [...prev.steps, stepInput.trim()],
      }));
      setStepInput("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const removeStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIngredientInput(e.target.value);
  };

  const handleStepInputChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setStepInput(e.target.value);
  };

  const handleIngredientInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancelClick: MouseEventHandler<HTMLButtonElement> = () => {
    window.history.back();
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-6">
      <div className="space-y-2">
        <label className="font-body font-semibold text-charcoal">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-base w-full"
          placeholder="Recipe title"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="font-body font-semibold text-charcoal">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-base field-sizing-content max-h-30 w-full"
          rows={3}
          placeholder="Describe your recipe"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="font-body font-semibold text-charcoal">Difficulty</label>
          <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="input-base w-full">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-body font-semibold text-charcoal">Prep Time (min)</label>
          <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} className="input-base w-full" min="1" />
        </div>

        <div className="space-y-2">
          <label className="font-body font-semibold text-charcoal">Servings</label>
          <input type="number" name="servings" value={formData.servings} onChange={handleChange} className="input-base w-full" min="1" />
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-3 border-t border-mist pt-6">
        <Heading as="h3" className="text-charcoal">
          Ingredients
        </Heading>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient: string, idx: number) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-mist p-3">
              <span className="font-body text-charcoal">{ingredient}</span>
              <button type="button" onClick={() => removeIngredient(idx)} className="font-body text-sm text-red-600 hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={ingredientInput}
            onChange={handleIngredientInputChange}
            onKeyDown={handleIngredientInputKeyDown}
            className="input-base flex-1"
            placeholder="Add ingredient"
          />
          <button type="button" onClick={addIngredient} className="btn-small">
            Add
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 border-t border-mist pt-6">
        <Heading as="h3" className="text-charcoal">
          Steps
        </Heading>
        <div className="space-y-2">
          {formData.steps.map((step: string, idx: number) => (
            <div key={idx} className="flex gap-3 rounded-lg bg-mist p-3">
              <span className="font-body font-semibold text-charcoal/60">{idx + 1}.</span>
              <div className="flex-1">
                <p className="font-body text-charcoal">{step}</p>
              </div>
              <button type="button" onClick={() => removeStep(idx)} className="font-body text-sm text-red-600 hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2">
          <textarea
            value={stepInput}
            onChange={handleStepInputChange}
            className="input-base field-sizing-content max-h-30 flex-1"
            rows={2}
            placeholder="Add step"
          />
          <button type="button" onClick={addStep} className="btn-small">
            Add
          </button>
        </div>
      </div>

      <div className="flex gap-3 border-t border-mist pt-6">
        <button type="submit" disabled={isLoading} className="btn-primary flex-1 disabled:opacity-50">
          {isLoading ? "Saving..." : "Save Recipe"}
        </button>
        <button type="button" className="btn-secondary flex-1" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
