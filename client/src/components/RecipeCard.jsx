import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Tag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const RecipeCard = ({ recipe }) => {
  const { user, toggleFavorite } = useContext(AuthContext);
  const isFavorite = user?.favorites?.includes(recipe._id);

  const imageUrl = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(recipe._id);
  };

  const getTagStyles = (tag) => {
    const t = tag.trim().toLowerCase();
    if (t === 'vegan') return 'bg-[#3b7a57]/10 text-[#3b7a57] border-[#3b7a57]/20';
    if (t === 'protein' || t === 'meat') return 'bg-[#5c2516]/10 text-[#5c2516] border-[#5c2516]/20';
    if (t === 'gluten-free' || t === 'gluten free') return 'bg-[#d6a956]/10 text-[#825b16] border-[#d6a956]/20';
    if (t === 'dairy-free' || t === 'dairy free') return 'bg-[#7097b0]/10 text-[#263f4f] border-[#7097b0]/20';
    return 'bg-stone-100 text-text-secondary border-border-muted';
  };

  return (
    <Link to={`/recipes/${recipe._id}`} className="group h-full block">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.15 } }}
        className="h-full flex flex-col bg-surface rounded-2xl shadow-sm border border-border-muted overflow-hidden hover:shadow-low transition-all duration-300 relative"
      >
        <div className="relative h-48 overflow-hidden bg-stone-100 border-b border-border-muted">
          <img 
            src={imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm border shadow-sm transition-all duration-300 z-10 cursor-pointer ${
              isFavorite 
                ? 'bg-rose-500/90 border-rose-500 text-white' 
                : 'bg-white/80 border-border-muted text-text-secondary hover:bg-white hover:text-rose-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
          </button>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.tags && recipe.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTagStyles(tag)}`}>
                {tag}
              </span>
            ))}
            {recipe.tags && recipe.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-text-muted border border-border-muted">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-primary transition-colors font-display">
            {recipe.title}
          </h3>
          
          <p className="text-text-secondary text-sm line-clamp-2 mb-4 flex-grow">
            {recipe.description}
          </p>
          
          <div className="pt-4 border-t border-border-muted flex items-center justify-between text-text-muted text-xs mt-auto font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="text-primary">{recipe.ingredients?.length || 0}</span>
              <span>ingredients</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-primary">{recipe.instructions?.length || 0}</span>
              <span>steps</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default RecipeCard;
