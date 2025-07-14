import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChefHat, Clock, Users, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MealPlan {
  id: string;
  day: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeName: string;
  cookTime: string;
  servings: string;
}

export const MealPlanner = () => {
  const { toast } = useToast();
  
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([
    {
      id: '1',
      day: 'Monday',
      mealType: 'dinner',
      recipeName: 'Tomato Basil Pasta',
      cookTime: '20 minutes',
      servings: '4'
    }
  ]);

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedRecipe, setSelectedRecipe] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const availableRecipes = [
    // Breakfast
    'Pancakes', 'French Toast', 'Scrambled Eggs', 'Oatmeal with Berries', 'Avocado Toast',
    'Greek Yogurt Parfait', 'Breakfast Burrito', 'Smoothie Bowl', 'Bagel with Cream Cheese',
    
    // Lunch
    'Caesar Salad', 'Chicken Wrap', 'Grilled Cheese Sandwich', 'Quinoa Bowl', 'Tuna Salad',
    'BLT Sandwich', 'Caprese Salad', 'Chicken Caesar Wrap', 'Mediterranean Bowl', 'Soup and Salad',
    
    // Dinner
    'Tomato Basil Pasta', 'Chicken Stir Fry', 'Grilled Salmon', 'Beef Tacos', 'Vegetable Curry',
    'Spaghetti Carbonara', 'Chicken Parmesan', 'Fish and Chips', 'Steak with Vegetables',
    'Mushroom Risotto', 'Thai Green Curry', 'BBQ Ribs', 'Lamb Chops', 'Seafood Paella',
    
    // Snacks
    'Fruit Salad', 'Hummus with Vegetables', 'Trail Mix', 'Cheese and Crackers', 'Apple Slices',
    'Nuts and Dried Fruit', 'Yogurt with Granola', 'Vegetable Chips', 'Protein Smoothie'
  ];

  const addMealToPlan = () => {
    if (!selectedRecipe) {
      toast({
        title: "No recipe selected",
        description: "Please select a recipe to add to your meal plan.",
        variant: "destructive"
      });
      return;
    }

    const newMeal: MealPlan = {
      id: Date.now().toString(),
      day: selectedDay,
      mealType: selectedMealType,
      recipeName: selectedRecipe,
      cookTime: '30 minutes', // This would come from the recipe
      servings: '4' // This would come from the recipe
    };

    setMealPlan([...mealPlan, newMeal]);
    setSelectedRecipe('');
    
    toast({
      title: "Meal added!",
      description: `${selectedRecipe} has been added to your ${selectedDay} ${selectedMealType}.`
    });
  };

  const removeMealFromPlan = (id: string) => {
    setMealPlan(mealPlan.filter(meal => meal.id !== id));
    toast({
      title: "Meal removed",
      description: "Meal has been removed from your plan."
    });
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'lunch': return 'bg-green-100 text-green-800 border-green-300';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'snack': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMealsForDay = (day: string) => {
    return mealPlan.filter(meal => meal.day === day);
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    return daysOfWeek.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });
  };

  const weekDates = getCurrentWeekDates();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          Weekly Meal Planner
        </h1>
      </div>

      {/* Add Meal Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Meal to Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMealType} onValueChange={(value: 'breakfast' | 'lunch' | 'dinner' | 'snack') => setSelectedMealType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Meal type" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipe" />
              </SelectTrigger>
              <SelectContent>
                {availableRecipes.map(recipe => (
                  <SelectItem key={recipe} value={recipe}>{recipe}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={addMealToPlan} className="w-full">
              Add to Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekDates.map(({ day, date }) => (
          <Card key={day} className="min-h-[400px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-center">
                <div className="text-lg font-semibold">{day}</div>
                <div className="text-sm text-muted-foreground">{date}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getMealsForDay(day).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <ChefHat className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No meals planned</p>
                </div>
              ) : (
                getMealsForDay(day).map((meal) => (
                  <div key={meal.id} className="p-3 bg-gradient-to-br from-card to-accent/20 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getMealTypeColor(meal.mealType)}>
                        {meal.mealType}
                      </Badge>
                      <X 
                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => removeMealFromPlan(meal.id)}
                      />
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-2">{meal.recipeName}</h4>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {meal.cookTime}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {meal.servings} servings
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{mealPlan.length}</div>
              <div className="text-sm text-muted-foreground">Total Meals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {mealPlan.filter(m => m.mealType === 'breakfast').length}
              </div>
              <div className="text-sm text-muted-foreground">Breakfasts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {mealPlan.filter(m => m.mealType === 'lunch').length}
              </div>
              <div className="text-sm text-muted-foreground">Lunches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {mealPlan.filter(m => m.mealType === 'dinner').length}
              </div>
              <div className="text-sm text-muted-foreground">Dinners</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};