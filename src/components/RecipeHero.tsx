import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Refrigerator, Calendar, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";

interface RecipeHeroProps {
  onNavigate: (section: string) => void;
}

export const RecipeHero = ({ onNavigate }: RecipeHeroProps) => {
  const features = [
    {
      icon: Refrigerator,
      title: "Smart Fridge",
      description: "Track ingredients and expiry dates",
      action: () => onNavigate("fridge")
    },
    {
      icon: ChefHat,
      title: "Recipe Builder",
      description: "Create recipes with your ingredients",
      action: () => onNavigate("recipes")
    },
    {
      icon: Calendar,
      title: "Meal Planner",
      description: "Plan your weekly meals",
      action: () => onNavigate("planner")
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-gradient-to-br from-primary/90 to-primary/70 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-6 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build Delicious Recipes with What You Have
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Smart ingredient tracking, recipe creation, and meal planning all in one place
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => onNavigate("fridge")}
            >
              <ChefHat className="mr-3 h-6 w-6" />
              Start Cooking
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Cook Smarter</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-card to-accent/20"
              onClick={feature.action}
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};