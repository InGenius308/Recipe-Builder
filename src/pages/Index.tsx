import { useState } from "react";
import { RecipeHero } from "@/components/RecipeHero";
import { FridgeManager } from "@/components/FridgeManager";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { MealPlanner } from "@/components/MealPlanner";
import { Button } from "@/components/ui/button";
import { Refrigerator, ChefHat, Calendar, Home } from "lucide-react";

type Section = 'home' | 'fridge' | 'recipes' | 'planner';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('home');

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'fridge', label: 'My Fridge', icon: Refrigerator },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'planner', label: 'Meal Planner', icon: Calendar }
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'fridge':
        return <FridgeManager />;
      case 'recipes':
        return <RecipeBuilder />;
      case 'planner':
        return <MealPlanner />;
      default:
        return <RecipeHero onNavigate={(section) => setCurrentSection(section as Section)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      {currentSection !== 'home' && (
        <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Recipe Builder</span>
              </div>
              
              <div className="flex items-center gap-2">
                {navigation.map((nav) => (
                  <Button
                    key={nav.id}
                    variant={currentSection === nav.id ? "default" : "ghost"}
                    onClick={() => setCurrentSection(nav.id as Section)}
                    className="flex items-center gap-2"
                  >
                    <nav.icon className="h-4 w-4" />
                    {nav.label}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={currentSection === 'home' ? '' : 'container mx-auto px-6 py-8'}>
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;
