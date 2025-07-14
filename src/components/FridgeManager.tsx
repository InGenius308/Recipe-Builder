import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: string;
  expiryDate: string;
  status: 'fresh' | 'warning' | 'expired';
}

export const FridgeManager = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Tomatoes', category: 'Vegetables', quantity: '4 pieces', expiryDate: '2025-07-20', status: 'fresh' },
    { id: '2', name: 'Chicken Breast', category: 'Meat', quantity: '500g', expiryDate: '2025-07-16', status: 'warning' },
    { id: '3', name: 'Milk', category: 'Dairy', quantity: '1L', expiryDate: '2025-07-15', status: 'expired' }
  ]);
  
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: '',
    quantity: '',
    expiryDate: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Grains', 'Spices', 'Other'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <CheckCircle className="h-4 w-4 text-ingredient-fresh" />;
      case 'warning': return <Clock className="h-4 w-4 text-ingredient-warning" />;
      case 'expired': return <AlertTriangle className="h-4 w-4 text-ingredient-expired" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'bg-ingredient-fresh/20 text-ingredient-fresh border-ingredient-fresh/40';
      case 'warning': return 'bg-ingredient-warning/20 text-ingredient-warning border-ingredient-warning/40';
      case 'expired': return 'bg-ingredient-expired/20 text-ingredient-expired border-ingredient-expired/40';
      default: return '';
    }
  };

  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.category) return;

    const today = new Date();
    const expiry = new Date(newIngredient.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'fresh' | 'warning' | 'expired' = 'fresh';
    if (daysUntilExpiry <= 0) status = 'expired';
    else if (daysUntilExpiry <= 3) status = 'warning';

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      ...newIngredient,
      status
    };

    setIngredients([...ingredients, ingredient]);
    setNewIngredient({ name: '', category: '', quantity: '', expiryDate: '' });
    
    toast({
      title: "Ingredient added!",
      description: `${ingredient.name} has been added to your fridge.`
    });
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    toast({
      title: "Ingredient removed",
      description: "Ingredient has been removed from your fridge."
    });
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || ingredient.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold">My Fridge</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add New Ingredient */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Ingredient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Ingredient name"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
            />
            <Select value={newIngredient.category} onValueChange={(value) => setNewIngredient({...newIngredient, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Quantity"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
            />
            <Input
              type="date"
              value={newIngredient.expiryDate}
              onChange={(e) => setNewIngredient({...newIngredient, expiryDate: e.target.value})}
            />
            <Button onClick={addIngredient} className="w-full">
              Add Ingredient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIngredients.map((ingredient) => (
          <Card key={ingredient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{ingredient.name}</h3>
                <div className="flex items-center gap-1">
                  {getStatusIcon(ingredient.status)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{ingredient.category}</Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span>{ingredient.quantity}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <Badge className={getStatusColor(ingredient.status)}>
                    {new Date(ingredient.expiryDate).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeIngredient(ingredient.id)}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIngredients.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No ingredients found. Add some ingredients to get started!</p>
        </Card>
      )}
    </div>
  );
};