import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Clock, Users, Tag, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { parseIngredient, formatQuantity } from '../utils/groceryUtils';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [servings, setServings] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/recipes/${id}`);
      setRecipe(res.data);
      setServings(res.data.servings || 4);
    } catch (err) {
      setError('Recipe not found or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${id}`);
        navigate('/recipes');
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    await toggleFavorite(recipe._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-bg-base">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4 font-display">{error}</h2>
          <Link to="/recipes" className="text-primary hover:underline font-semibold">Return to My Recipes</Link>
        </div>
      </div>
    );
  }

  const isFavorite = user?.favorites?.includes(recipe._id);
  const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  const scaleIngredient = (ingredientStr, currentServings, baseServings) => {
    const parsed = parseIngredient(ingredientStr);
    if (parsed.isUnscaled || !baseServings || parsed.quantity === null) {
      return {
        text: ingredientStr,
        isUnscaled: true
      };
    }
    const scaledQty = parsed.quantity * (currentServings / baseServings);
    
    // Format the unit
    let displayUnit = parsed.unit;
    if (scaledQty > 1) {
      if (displayUnit === 'cup') displayUnit = 'cups';
      else if (displayUnit === 'clove') displayUnit = 'cloves';
      else if (displayUnit === 'can') displayUnit = 'cans';
      else if (displayUnit === 'slice') displayUnit = 'slices';
      else if (displayUnit === 'piece') displayUnit = 'pieces';
      else if (displayUnit === 'head') displayUnit = 'heads';
      else if (displayUnit === 'pinch') displayUnit = 'pinches';
      else if (displayUnit === 'sprig') displayUnit = 'sprigs';
      else if (displayUnit === 'bunch') displayUnit = 'bunches';
      else if (displayUnit === 'package') displayUnit = 'packages';
      else if (displayUnit === 'bag') displayUnit = 'bags';
      else if (displayUnit === 'container') displayUnit = 'containers';
      else if (displayUnit === 'bottle') displayUnit = 'bottles';
      else if (displayUnit === 'jar') displayUnit = 'jars';
      else if (displayUnit === 'tsp') displayUnit = 'tsps';
      else if (displayUnit === 'tbsp') displayUnit = 'tbsps';
    } else {
      if (displayUnit === 'cups') displayUnit = 'cup';
      else if (displayUnit === 'cloves') displayUnit = 'clove';
      else if (displayUnit === 'cans') displayUnit = 'can';
      else if (displayUnit === 'slices') displayUnit = 'slice';
      else if (displayUnit === 'pieces') displayUnit = 'piece';
      else if (displayUnit === 'heads') displayUnit = 'head';
      else if (displayUnit === 'pinches') displayUnit = 'pinch';
      else if (displayUnit === 'sprigs') displayUnit = 'sprig';
      else if (displayUnit === 'bunches') displayUnit = 'bunch';
      else if (displayUnit === 'packages') displayUnit = 'package';
      else if (displayUnit === 'bags') displayUnit = 'bag';
      else if (displayUnit === 'containers') displayUnit = 'container';
      else if (displayUnit === 'bottles') displayUnit = 'bottle';
      else if (displayUnit === 'jars') displayUnit = 'jar';
      else if (displayUnit === 'tsps') displayUnit = 'tsp';
      else if (displayUnit === 'tbsps') displayUnit = 'tbsp';
    }

    const displayQty = formatQuantity(scaledQty);
    
    let displayName = parsed.name;
    // Pluralize/singularize ingredient name if no unit
    if (!displayUnit) {
      if (scaledQty > 1) {
        if (displayName.endsWith('tomato')) displayName = displayName.replace('tomato', 'tomatoes');
        else if (displayName.endsWith('potato')) displayName = displayName.replace('potato', 'potatoes');
        else if (!displayName.endsWith('s')) displayName += 's';
      } else {
        if (displayName.endsWith('tomatoes')) displayName = displayName.replace('tomatoes', 'tomato');
        else if (displayName.endsWith('potatoes')) displayName = displayName.replace('potatoes', 'potato');
        else if (displayName.endsWith('s') && !displayName.endsWith('ss')) displayName = displayName.slice(0, -1);
      }
    }

    return {
      text: `${displayQty} ${displayUnit ? displayUnit + ' ' : ''}${displayName}`,
      isUnscaled: false
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-bg-base pb-20"
    >
      <Navbar />
      
      {/* Hero Image Section */}
      <div className="relative h-64 md:h-96 w-full bg-stone-900">
        <img 
          src={imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Link to="/recipes" className="inline-flex items-center text-stone-300 hover:text-white mb-6 transition-colors font-semibold">
            <ArrowLeft size={20} className="mr-2" /> Back to recipes
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags && recipe.tags.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm border border-white/20 shadow-sm">
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 shadow-sm font-display">{recipe.title}</h1>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-surface rounded-2xl shadow-high border border-border-muted overflow-hidden">
          
          {/* Action Bar */}
          <div className="bg-stone-50 border-b border-border-muted px-6 py-4 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-text-secondary font-semibold">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span>Prep Time: {recipe.prepTime ? `${recipe.prepTime} mins` : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <span className="flex items-center gap-1.5">
                  Servings: 
                  <input
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 border border-border-muted rounded-lg text-text-primary bg-surface font-bold text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-all cursor-pointer active:scale-98 shadow-xs ${
                  isFavorite 
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                    : 'bg-surface border-border-muted text-text-secondary hover:bg-stone-50'
                }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-rose-600' : ''} />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>
              <Link 
                to={`/recipes/edit/${recipe._id}`} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-border-muted text-text-secondary rounded-lg text-sm font-semibold transition-all active:scale-98"
              >
                <Edit size={16} /> Edit
              </Link>
              <button 
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-lg text-sm font-semibold transition-all active:scale-98"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <p className="text-lg text-text-secondary mb-12 leading-relaxed font-sans">
              {recipe.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Ingredients */}
              <div className="md:col-span-1">
                <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border-muted pb-4 font-display">
                  Ingredients
                  <span className="bg-stone-100 border border-border-muted text-text-secondary text-xs py-1 px-2.5 rounded-full ml-auto font-semibold shadow-xs">
                    {recipe.ingredients?.length || 0} items
                  </span>
                </h3>
                <ul className="space-y-4">
                  {recipe.ingredients?.map((ingredientStr, idx) => {
                    const scaled = scaleIngredient(ingredientStr, servings, recipe.servings || 1);
                    return (
                      <li key={idx} className="flex items-start gap-3 text-text-secondary">
                        <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                        <div className="flex-grow min-w-0 font-medium">
                          <span className="leading-tight">{scaled.text}</span>
                          {scaled.isUnscaled && (
                            <span className="inline-flex items-center ml-2 text-text-muted italic text-xs font-normal" title="This ingredient format could not be auto-scaled. Please adjust manually.">
                              (unscaled)
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Instructions */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border-muted pb-4 font-display">
                  Instructions
                  <span className="bg-stone-100 border border-border-muted text-text-secondary text-xs py-1 px-2.5 rounded-full ml-auto font-semibold shadow-xs">
                    {recipe.instructions?.length || 0} steps
                  </span>
                </h3>
                <div className="space-y-8">
                  {recipe.instructions?.map((step, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-text-primary text-surface flex items-center justify-center font-bold text-sm shrink-0 shadow-low">
                          {idx + 1}
                        </div>
                        {idx !== recipe.instructions.length - 1 && (
                          <div className="w-px h-full bg-border-muted mt-2"></div>
                        )}
                      </div>
                      <p className="text-text-secondary pt-1 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default RecipeDetail;
