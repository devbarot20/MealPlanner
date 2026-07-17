import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, ArrowRight, Printer, Clipboard, CheckCircle, Circle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { consolidateGroceryList, formatConsolidatedItem } from '../utils/groceryUtils';

// Helper to get client's start of the week (Monday) in YYYY-MM-DD format
const getClientStartOfWeek = (d = new Date()) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(date.setDate(diff));
  return startOfWeek.toISOString().split('T')[0];
};

const GroceryList = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(getClientStartOfWeek());
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [groceryItems, setGroceryItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({}); // maps item.key -> boolean
  const [copied, setCopied] = useState(false);

  const getWeekRangeLabel = (startStr) => {
    const start = new Date(startStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const formatOption = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', formatOption)} - ${end.toLocaleDateString('en-US', formatOption)}`;
  };

  const handlePrevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(getClientStartOfWeek(d));
  };

  const handleNextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(getClientStartOfWeek(d));
  };

  const handleCurrentWeek = () => {
    setCurrentWeekStart(getClientStartOfWeek());
  };

  useEffect(() => {
    fetchMealPlan();
  }, [currentWeekStart]);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/mealplan?date=${currentWeekStart}`);
      setPlan(res.data);
      
      if (res.data && res.data.plan) {
        // Collect all ingredient strings from all recipes in the plan
        const allIngredients = [];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        days.forEach(day => {
          const recipes = res.data.plan[day];
          if (Array.isArray(recipes)) {
            recipes.forEach(recipe => {
              if (Array.isArray(recipe.ingredients)) {
                allIngredients.push(...recipe.ingredients);
              }
            });
          }
        });

        // Consolidate the list
        const consolidated = consolidateGroceryList(allIngredients);
        setGroceryItems(consolidated);
        // Clear checked items state for new week
        setCheckedItems({});
      } else {
        setGroceryItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch meal plan for grocery list:', err);
      setGroceryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (key) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const listText = groceryItems
      .map(item => {
        const text = formatConsolidatedItem(item);
        const prefix = checkedItems[item.key] ? '[x]' : '[ ]';
        const suffix = item.isUnscaled ? ' (manual adjustment needed)' : '';
        return `${prefix} ${text}${suffix}`;
      })
      .join('\n');

    navigator.clipboard.writeText(listText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy list:', err);
      });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-bg-base pb-20"
    >
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">Grocery Shopping List</h1>
            <p className="text-text-secondary text-sm mt-1">
              Consolidated ingredients from your weekly meal plan.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            <button 
              onClick={handlePrint}
              disabled={groceryItems.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-muted rounded-lg text-text-secondary bg-surface hover:bg-stone-50 text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={16} /> Print
            </button>
            <button 
              onClick={handleCopy}
              disabled={groceryItems.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-muted rounded-lg text-text-secondary bg-surface hover:bg-stone-50 text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clipboard size={16} /> {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border-muted p-4 md:p-6 mb-8 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 print:hidden">
              <button 
                onClick={handlePrevWeek}
                className="p-2 border border-border-muted hover:bg-stone-50 rounded-lg transition-colors cursor-pointer text-text-secondary active:scale-95"
                title="Previous Week"
              >
                <ArrowLeft size={16} />
              </button>
              <button 
                onClick={handleCurrentWeek}
                className="px-3 py-1.5 border border-border-muted hover:bg-stone-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors cursor-pointer active:scale-95"
              >
                Current Week
              </button>
              <button 
                onClick={handleNextWeek}
                className="p-2 border border-border-muted hover:bg-stone-50 rounded-lg transition-colors cursor-pointer text-text-secondary active:scale-95"
                title="Next Week"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="text-center sm:text-right font-bold text-text-primary text-sm sm:text-base print:text-left print:text-lg font-display">
              Week of {getWeekRangeLabel(currentWeekStart)}
            </div>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="animate-spin text-primary h-10 w-10 mb-4" />
            <p className="text-text-secondary font-semibold">Consolidating list...</p>
          </div>
        ) : groceryItems.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-dashed border-border-muted p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-100 text-primary mb-4 border border-border-muted shadow-xs">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-lg font-bold text-text-primary font-display">Your Shopping List is Empty</h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
              Add some recipes to your <Link to="/planner" className="text-primary hover:underline font-semibold">Meal Planner</Link> for this week, and we will automatically generate your consolidated shopping list here!
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl shadow-sm border border-border-muted overflow-hidden print:border-none print:shadow-none">
            <div className="p-5 border-b border-border-muted bg-text-primary text-surface flex justify-between items-center print:bg-white print:text-text-primary print:px-0 print:border-b-2 print:border-text-primary">
              <div>
                <h2 className="text-lg font-bold font-display">Shopping Items</h2>
                <p className="text-xs text-stone-300 mt-0.5 print:hidden">
                  Check items off as you shop. Duplicate items have been automatically combined.
                </p>
              </div>
              <span className="text-xs font-semibold bg-stone-800 text-stone-200 px-2.5 py-1 rounded-full border border-stone-700 print:border-border-muted print:text-text-primary print:bg-stone-100 shadow-xs">
                {groceryItems.length} {groceryItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="divide-y divide-border-muted print:divide-stone-200">
              {groceryItems.map((item) => {
                const isChecked = !!checkedItems[item.key];
                return (
                  <div 
                    key={item.key} 
                    onClick={() => toggleCheck(item.key)}
                    className={`flex items-start gap-4 p-4 transition-all duration-150 cursor-pointer select-none ${
                      isChecked ? 'bg-stone-50/50' : 'hover:bg-stone-50'
                    } print:cursor-default print:hover:bg-transparent print:py-2.5`}
                  >
                    <button 
                      type="button"
                      className="shrink-0 text-text-muted hover:text-primary transition-colors mt-0.5 print:hidden"
                    >
                      {isChecked ? (
                        <CheckCircle size={20} className="text-primary fill-stone-100" />
                      ) : (
                        <Circle size={20} className="text-border-active hover:border-primary" />
                      )}
                    </button>
                    
                    <div className="flex-grow min-w-0">
                      <span className={`text-base font-semibold transition-all ${
                        isChecked 
                          ? 'line-through text-text-muted decoration-stone-300' 
                          : 'text-text-primary'
                      }`}>
                        {formatConsolidatedItem(item)}
                      </span>
                      
                      {item.isUnscaled && (
                        <div className="flex items-center gap-1 mt-1 text-text-muted italic text-xs font-normal">
                          <HelpCircle size={12} className="shrink-0" />
                          <span>Requires manual sizing (unscaleable text format)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
};

const ShoppingBag = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default GroceryList;
