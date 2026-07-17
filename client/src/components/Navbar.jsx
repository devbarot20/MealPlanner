import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, PlusCircle, Calendar, ShoppingBag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-surface shadow-low border-b border-border-muted sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-stone-50 overflow-hidden shrink-0 border border-border-muted shadow-sm p-1.5 flex items-center justify-center group-hover:border-primary transition-colors">
                <img src="/logo.png" alt="Mise logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-2xl text-text-primary tracking-tight font-display">Mise</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              to="/recipes"
              className="text-text-secondary hover:text-primary font-medium transition-colors"
            >
              My Recipes
            </Link>
            <Link
              to="/planner"
              className="flex items-center gap-1.5 text-text-secondary hover:text-primary font-medium transition-colors"
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Meal Planner</span>
            </Link>
            <Link
              to="/grocery-list"
              className="flex items-center gap-1.5 text-text-secondary hover:text-primary font-medium transition-colors"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Grocery List</span>
            </Link>
            <Link
              to="/recipes/new"
              className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-low active:scale-98"
            >
              <PlusCircle size={18} />
              <span>New Recipe</span>
            </Link>

            <div className="h-8 w-px bg-border-muted hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-sm text-text-muted">
                Hi, <span className="font-semibold text-text-primary">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-text-muted hover:text-red-600 transition-colors p-2 cursor-pointer active:scale-95"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
