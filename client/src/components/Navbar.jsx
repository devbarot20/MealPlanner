import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, PlusCircle, Calendar, ShoppingBag, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-surface shadow-low border-b border-border-muted sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-50 overflow-hidden shrink-0 border border-border-muted shadow-sm p-1.5 flex items-center justify-center group-hover:border-primary transition-colors">
                <img src="/logo.png" alt="Mise logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight font-display">Mise</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/recipes"
              className="text-text-secondary hover:text-primary font-medium transition-colors text-sm lg:text-base"
            >
              My Recipes
            </Link>
            <Link
              to="/planner"
              className="flex items-center gap-1.5 text-text-secondary hover:text-primary font-medium transition-colors text-sm lg:text-base"
            >
              <Calendar size={18} />
              <span>Meal Planner</span>
            </Link>
            <Link
              to="/grocery-list"
              className="flex items-center gap-1.5 text-text-secondary hover:text-primary font-medium transition-colors text-sm lg:text-base"
            >
              <ShoppingBag size={18} />
              <span>Grocery List</span>
            </Link>
            <Link
              to="/recipes/new"
              className="flex items-center gap-1.5 bg-primary hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-low active:scale-98 text-sm"
            >
              <PlusCircle size={18} />
              <span>New Recipe</span>
            </Link>

            <div className="h-8 w-px bg-border-muted"></div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-text-muted">
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-primary p-2 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-muted bg-surface px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="px-3 py-2 text-sm text-text-muted border-b border-border-muted mb-2">
            Hi, <span className="font-semibold text-text-primary">{user.name}</span>
          </div>
          <Link
            to="/recipes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-stone-50 font-semibold transition-colors"
          >
            My Recipes
          </Link>
          <Link
            to="/planner"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-stone-50 font-semibold transition-colors"
          >
            <Calendar size={18} />
            <span>Meal Planner</span>
          </Link>
          <Link
            to="/grocery-list"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-text-secondary hover:text-primary hover:bg-stone-50 font-semibold transition-colors"
          >
            <ShoppingBag size={18} />
            <span>Grocery List</span>
          </Link>
          <Link
            to="/recipes/new"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white bg-primary hover:bg-amber-800 font-semibold transition-colors shadow-low"
          >
            <PlusCircle size={18} />
            <span>New Recipe</span>
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors text-left cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
