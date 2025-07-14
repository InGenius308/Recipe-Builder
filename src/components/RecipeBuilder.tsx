import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Clock, Users, ChefHat, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const RecipeBuilder = () => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Tomato Basil Pasta',
      description: 'A simple and delicious pasta dish with fresh tomatoes and basil',
      ingredients: ['Pasta', 'Tomatoes', 'Fresh Basil', 'Garlic', 'Olive Oil'],
      instructions: [
        'Boil water and cook pasta according to package directions',
        'Heat olive oil in a pan and sauté garlic',
        'Add diced tomatoes and cook until soft',
        'Add cooked pasta and fresh basil',
        'Season with salt and pepper, serve hot'
      ],
      cookTime: '20 minutes',
      servings: '4',
      difficulty: 'easy',
      category: 'Pasta'
    }
  ]);

  const [currentRecipe, setCurrentRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    ingredients: [],
    instructions: [],
    cookTime: '',
    servings: '',
    difficulty: 'easy',
    category: ''
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const availableIngredients = ['Tomatoes', 'Chicken Breast', 'Milk', 'Pasta', 'Rice', 'Onions', 'Garlic', 'Bell Peppers'];
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Pasta', 'Soup', 'Salad'];

  const addIngredient = () => {
    if (newIngredient.trim() && !currentRecipe.ingredients?.includes(newIngredient)) {
      setCurrentRecipe({
        ...currentRecipe,
        ingredients: [...(currentRecipe.ingredients || []), newIngredient]
      });
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: currentRecipe.ingredients?.filter(ing => ing !== ingredient)
    });
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setCurrentRecipe({
        ...currentRecipe,
        instructions: [...(currentRecipe.instructions || []), newInstruction]
      });
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setCurrentRecipe({
      ...currentRecipe,
      instructions: currentRecipe.instructions?.filter((_, i) => i !== index)
    });
  };

  const saveRecipe = () => {
    if (!currentRecipe.name || !currentRecipe.ingredients?.length || !currentRecipe.instructions?.length) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const recipe: Recipe = {
      id: Date.now().toString(),
      name: currentRecipe.name!,
      description: currentRecipe.description || '',
      ingredients: currentRecipe.ingredients!,
      instructions: currentRecipe.instructions!,
      cookTime: currentRecipe.cookTime || '',
      servings: currentRecipe.servings || '',
      difficulty: currentRecipe.difficulty || 'easy',
      category: currentRecipe.category || 'Other'
    };

    setRecipes([...recipes, recipe]);
    setCurrentRecipe({
      name: '',
      description: '',
      ingredients: [],
      instructions: [],
      cookTime: '',
      servings: '',
      difficulty: 'easy',
      category: ''
    });
    setIsCreating(false);

    toast({
      title: "Recipe saved!",
      description: `${recipe.name} has been added to your recipe collection.`
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-recipe-easy/20 text-recipe-easy border-recipe-easy/40';
      case 'medium': return 'bg-recipe-medium/20 text-recipe-medium border-recipe-medium/40';
      case 'hard': return 'bg-recipe-hard/20 text-recipe-hard border-recipe-hard/40';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recipe Builder</h1>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Recipe
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Recipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Recipe Name *</label>
                <Input
                  value={currentRecipe.name}
                  onChange={(e) => setCurrentRecipe({...currentRecipe, name: e.target.value})}
                  placeholder="Enter recipe name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={currentRecipe.category} onValueChange={(value) => setCurrentRecipe({...currentRecipe, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Cook Time</label>
                <Input
                  value={currentRecipe.cookTime}
                  onChange={(e) => setCurrentRecipe({...currentRecipe, cookTime: e.target.value})}
                  placeholder="e.g., 30 minutes"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Servings</label>
                <Input
                  value={currentRecipe.servings}
                  onChange={(e) => setCurrentRecipe({...currentRecipe, servings: e.target.value})}
                  placeholder="e.g., 4 people"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={currentRecipe.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setCurrentRecipe({...currentRecipe, difficulty: value})}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={currentRecipe.description}
                onChange={(e) => setCurrentRecipe({...currentRecipe, description: e.target.value})}
                placeholder="Brief description of the recipe"
                rows={2}
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="text-sm font-medium">Ingredients *</label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add ingredient"
                  onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                />
                <Button onClick={addIngredient} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentRecipe.ingredients?.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                    {ingredient}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeIngredient(ingredient)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="text-sm font-medium">Instructions *</label>
              <div className="flex gap-2 mt-2">
                <Textarea
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  placeholder="Add cooking step"
                  rows={2}
                />
                <Button onClick={addInstruction} size="sm">Add</Button>
              </div>
              <div className="space-y-2 mt-3">
                {currentRecipe.instructions?.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-md">
                    <span className="font-semibold text-primary">{index + 1}.</span>
                    <span className="flex-1">{instruction}</span>
                    <X className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => removeInstruction(index)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveRecipe}>Save Recipe</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipe List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                {recipe.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{recipe.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recipe.cookTime}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {recipe.servings}
                </Badge>
                <Badge className={getDifficultyColor(recipe.difficulty)}>
                  {recipe.difficulty}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Ingredients:</h4>
                <div className="flex flex-wrap gap-1">
                  {recipe.ingredients.slice(0, 3).map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{recipe.ingredients.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Utensils className="h-4 w-4 mr-2" />
                View Recipe
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {recipes.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recipes yet. Create your first recipe to get started!</p>
        </Card>
      )}
    </div>
  );
};