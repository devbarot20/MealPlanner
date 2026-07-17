import { useState, useEffect, useContext } from 'react';
import { Search, Filter, Loader2, PlusCircle, Heart, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const RecipeCardSkeleton = () => (
  <div className="bg-surface rounded-2xl shadow-sm border border-border-muted overflow-hidden animate-pulse h-80 flex flex-col">
    <div className="h-48 bg-stone-200"></div>
    <div className="p-5 flex-grow flex flex-col gap-3">
      <div className="h-3.5 bg-stone-200 rounded w-1/3"></div>
      <div className="h-5 bg-stone-200 rounded w-3/4 mt-1"></div>
      <div className="h-3.5 bg-stone-200 rounded w-full"></div>
      <div className="h-3.5 bg-stone-200 rounded w-5/6"></div>
    </div>
  </div>
);

const RecipeList = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [error, setError] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, [searchTerm, activeTag]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      let query = '/recipes?';
      if (searchTerm) query += `search=${searchTerm}&`;
      if (activeTag) query += `tag=${activeTag}`;
      
      const res = await api.get(query);
      setRecipes(res.data);

      if (isFirstLoad) {
        const initialTags = [...new Set(res.data.flatMap(r => r.tags || []))].filter(Boolean);
        setAvailableTags(initialTags);
        setIsFirstLoad(false);
      }
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-bg-base"
    >
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight font-display mb-1">My Recipes</h1>
            <p className="text-text-secondary text-sm">Manage and organize your personal cookbook.</p>
          </div>
          
          <Link 
            to="/recipes/new" 
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-amber-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-low hover:shadow-sm active:scale-98 cursor-pointer md:w-auto"
          >
            <PlusCircle size={20} />
            Add New Recipe
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border-muted mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-border-muted rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary bg-stone-50/50"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98 ${
                favoritesOnly 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                  : 'bg-surface border-border-muted text-text-secondary hover:bg-stone-50'
              }`}
            >
              <Heart size={16} className={favoritesOnly ? 'fill-rose-600' : ''} />
              <span>Favorites Only</span>
            </button>
            
            <div className="h-6 w-px bg-border-muted hidden md:block"></div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
              <Filter size={18} className="text-text-muted hidden sm:block" />
              <button 
                onClick={() => setActiveTag('')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border whitespace-nowrap transition-all cursor-pointer ${
                  activeTag === '' 
                    ? 'bg-text-primary border-text-primary text-surface shadow-low' 
                    : 'bg-surface border-border-muted text-text-secondary hover:bg-stone-50'
                }`}
              >
                All
              </button>
              {availableTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border whitespace-nowrap transition-all cursor-pointer ${
                    activeTag === tag 
                      ? 'bg-primary border-primary text-surface shadow-low' 
                      : 'bg-surface border-border-muted text-text-secondary hover:bg-stone-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8 border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <RecipeCardSkeleton key={idx} />
            ))}
          </div>
        ) : (() => {
          const displayedRecipes = favoritesOnly 
            ? recipes.filter(r => user?.favorites?.includes(r._id)) 
            : recipes;

          if (displayedRecipes.length > 0) {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            );
          }

          return (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border-muted border-dashed shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-text-muted mb-4 border border-border-muted shadow-xs">
                {favoritesOnly ? (
                  <Heart size={32} className="text-rose-400" />
                ) : (
                  <ChefHat size={32} className="text-stone-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-text-primary font-display mb-2">
                {favoritesOnly ? 'No favorited recipes' : 'No recipes found'}
              </h3>
              <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
                {favoritesOnly 
                  ? 'Add recipes to your favorites by clicking the heart icon on any recipe!'
                  : (searchTerm || activeTag ? "Try adjusting your search or filters to find what you're looking for." : "You haven't added any recipes yet. Create your first recipe to get started!")
                }
              </p>
              {!(searchTerm || activeTag || favoritesOnly) && (
                <Link 
                  to="/recipes/new" 
                  className="inline-flex items-center gap-2 bg-primary hover:bg-amber-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-low"
                >
                  <PlusCircle size={20} />
                  Create Recipe
                </Link>
              )}
            </div>
          );
        })()}
      </main>
    </motion.div>
  );
};

export default RecipeList;
