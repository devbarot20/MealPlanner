import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Loader2, Search, Trash2, ChevronUp, ChevronDown, GripVertical, CalendarPlus } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Navbar from '../components/Navbar';

// --- Draggable Recipe Item for Sidebar ---
const DraggableRecipe = ({ recipe, onAddRecipe }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `recipe-${recipe._id}`,
    data: { type: 'Recipe', recipe }
  });

  const [showDaySelector, setShowDaySelector] = useState(false);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.4 : 1,
    zIndex: 50,
  } : undefined;

  const daysShort = [
    { id: 'monday', label: 'M' },
    { id: 'tuesday', label: 'T' },
    { id: 'wednesday', label: 'W' },
    { id: 'thursday', label: 'T' },
    { id: 'friday', label: 'F' },
    { id: 'saturday', label: 'S' },
    { id: 'sunday', label: 'S' },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface border border-border-muted hover:border-primary p-3 rounded-xl shadow-sm hover:shadow-low transition-all duration-200 flex flex-col gap-2 hover:scale-[1.01]"
    >
      <div className="flex items-center gap-2">
        {/* Grip Handle for Dragging */}
        <div
          {...listeners}
          {...attributes}
          className="text-text-muted hover:text-primary cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-stone-50 shrink-0 touch-none"
          title="Drag to schedule"
        >
          <GripVertical size={18} />
        </div>

        {/* Recipe details */}
        <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-border-muted">
          <img 
            src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&q=80'} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-grow">
          <h4 className="font-bold text-text-primary text-sm line-clamp-1 font-display">{recipe.title}</h4>
          <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{recipe.description}</p>
        </div>

        {/* Quick Add Toggle Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDaySelector(!showDaySelector);
          }}
          className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
            showDaySelector 
              ? 'bg-primary text-white hover:bg-amber-800' 
              : 'text-text-muted hover:text-primary hover:bg-stone-50'
          }`}
          title="Add to meal plan"
        >
          <CalendarPlus size={18} />
        </button>
      </div>

      {/* Day Selector Tray */}
      {showDaySelector && (
        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-border-muted/50 animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="text-[10px] uppercase font-bold text-text-muted shrink-0 mr-1">Add to:</span>
          <div className="flex gap-1 flex-grow justify-around">
            {daysShort.map((day) => (
              <button
                key={day.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddRecipe(recipe, day.id);
                  setShowDaySelector(false);
                }}
                className="w-6 h-6 rounded-full bg-stone-50 hover:bg-primary/10 text-text-secondary hover:text-primary text-[10px] font-extrabold flex items-center justify-center border border-border-muted transition-colors cursor-pointer animate-none"
                title={`Add to ${day.id.charAt(0).toUpperCase() + day.id.slice(1)}`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Droppable Day Column ---
const DroppableDay = ({ id, dayName, recipes, onRemove }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { type: 'Day', dayId: id }
  });

  return (
    <div className="flex flex-col h-full group/day transition-all duration-300 hover:shadow-low rounded-xl overflow-hidden border border-border-muted bg-surface">
      <div className="bg-text-primary text-surface py-3 px-4 font-bold text-center uppercase tracking-wider text-xs border-b border-border-muted font-display">
        {dayName}
      </div>
      <div 
        ref={setNodeRef}
        className={`flex-grow p-3 flex flex-col gap-3 min-h-[250px] transition-all duration-300 ${
          isOver 
            ? 'bg-[#b45309]/5 border-2 border-dashed border-primary shadow-inner' 
            : 'bg-surface border-t border-stone-50'
        }`}
      >
        {recipes.map((recipe, index) => (
          <div 
            key={`${recipe._id}-${index}`} 
            className="relative group bg-stone-50 hover:bg-stone-100 border border-border-muted hover:border-primary/30 p-2.5 rounded-xl flex items-center gap-2.5 shadow-xs transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden bg-stone-100 border border-border-muted">
              <img 
                src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&q=80'} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{recipe.title}</p>
            </div>
            <button 
              onClick={() => onRemove(id, index)}
              className="text-text-muted hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
              title="Remove recipe"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {recipes.length === 0 && (
          <div className={`flex-grow flex items-center justify-center border-2 border-dashed rounded-xl text-xs font-semibold p-4 text-center transition-all duration-300 ${
            isOver 
              ? 'border-transparent text-primary' 
              : 'border-border-muted text-text-muted group-hover/day:border-border-active'
          }`}>
            Drop recipe here
          </div>
        )}
      </div>
    </div>
  );
};

// Helper to get client's start of the week (Monday) in YYYY-MM-DD format
const getClientStartOfWeek = (d = new Date()) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const startOfWeek = new Date(date.setDate(diff));
  return startOfWeek.toISOString().split('T')[0];
};

const RecipeItemSkeleton = () => (
  <div className="bg-surface border border-border-muted p-3 rounded-xl shadow-xs flex items-center gap-3.5 animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-stone-200 shrink-0"></div>
    <div className="flex-grow">
      <div className="h-3.5 bg-stone-200 rounded w-2/3"></div>
      <div className="h-3 bg-stone-200 rounded w-1/2 mt-2"></div>
    </div>
  </div>
);

// --- Main Meal Planner Page ---
const MealPlanner = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialPlan = {
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
  };
  const [plan, setPlan] = useState(initialPlan);
  const [currentWeekStart, setCurrentWeekStart] = useState(getClientStartOfWeek());
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [isCookbookExpanded, setIsCookbookExpanded] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag
      },
    })
  );

  const renderWeekRangeLabel = (startStr) => {
    const start = new Date(startStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const startYear = start.getFullYear();
    
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const endYear = end.getFullYear();
    
    return (
      <span>
        {startMonth} {startDay}
        <span className="hidden sm:inline">, {startYear}</span>
        {` - `}
        {startMonth !== endMonth ? `${endMonth} ` : ''}{endDay}
        <span className="hidden sm:inline">, {endYear}</span>
      </span>
    );
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
    fetchData();
  }, [currentWeekStart]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recipesRes, planRes] = await Promise.all([
        api.get('/recipes'),
        api.get(`/mealplan?date=${currentWeekStart}`)
      ]);
      setRecipes(recipesRes.data);
      if (planRes.data && planRes.data.plan) {
        setPlan(planRes.data.plan);
      } else {
        setPlan(initialPlan);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current?.type === 'Recipe') {
      setActiveDragItem(active.data.current.recipe);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return; // Dropped outside a valid droppable area

    if (active.data.current?.type === 'Recipe' && over.data.current?.type === 'Day') {
      const recipe = active.data.current.recipe;
      const dayId = over.data.current.dayId; // e.g., 'monday'

      // Update local state immediately for snappy UI
      const updatedPlan = {
        ...plan,
        [dayId]: [...plan[dayId], recipe]
      };
      setPlan(updatedPlan);

      // Persist to backend
      savePlanToBackend(updatedPlan);
    }
  };

  const handleRemoveRecipe = (dayId, index) => {
    const updatedPlan = {
      ...plan,
      [dayId]: plan[dayId].filter((_, i) => i !== index)
    };
    setPlan(updatedPlan);
    savePlanToBackend(updatedPlan);
  };

  const handleAddRecipeToDay = (recipe, dayId) => {
    const updatedPlan = {
      ...plan,
      [dayId]: [...plan[dayId], recipe]
    };
    setPlan(updatedPlan);
    savePlanToBackend(updatedPlan);
  };

  const savePlanToBackend = async (newPlan) => {
    try {
      setSaving(true);
      // Map full recipe objects back to just their IDs for the backend
      const planPayload = {
        monday: newPlan.monday.map(r => r._id),
        tuesday: newPlan.tuesday.map(r => r._id),
        wednesday: newPlan.wednesday.map(r => r._id),
        thursday: newPlan.thursday.map(r => r._id),
        friday: newPlan.friday.map(r => r._id),
        saturday: newPlan.saturday.map(r => r._id),
        sunday: newPlan.sunday.map(r => r._id),
      };
      await api.put('/mealplan', { startDate: currentWeekStart, plan: planPayload });
    } catch (err) {
      console.error('Failed to save meal plan', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-bg-base flex flex-col"
    >
      <Navbar />
      
      <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          {/* Main Content Area (Calendar View) */}
          <div className="flex-grow p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text-primary font-display">Weekly Meal Planner</h1>
                <p className="text-text-secondary text-sm">Drag recipes from your cookbook to plan your week.</p>
              </div>

              {/* Week Navigation Controls */}
              <div className="flex items-center gap-2 bg-surface border border-border-muted rounded-xl p-1.5 shadow-sm">
                <button
                  onClick={handlePrevWeek}
                  className="px-3 py-1.5 hover:bg-stone-50 text-text-secondary hover:text-primary rounded-lg transition-colors text-sm font-semibold cursor-pointer active:scale-95"
                  title="Previous Week"
                >
                  &larr; Prev
                </button>
                <button
                  onClick={handleCurrentWeek}
                  className="px-3 py-1.5 hover:bg-stone-50 text-text-secondary hover:text-primary rounded-lg transition-colors text-sm font-semibold cursor-pointer active:scale-95"
                >
                  Today
                </button>
                <span className="text-sm font-semibold text-text-primary px-3 py-1 border-x border-border-muted font-display">
                  {renderWeekRangeLabel(currentWeekStart)}
                </span>
                <button
                  onClick={handleNextWeek}
                  className="px-3 py-1.5 hover:bg-stone-50 text-text-secondary hover:text-primary rounded-lg transition-colors text-sm font-semibold cursor-pointer active:scale-95"
                  title="Next Week"
                >
                  Next &rarr;
                </button>
              </div>

              <div className="flex items-center gap-3">
                {saving && (
                  <span className="text-xs font-semibold text-primary bg-stone-100 border border-border-muted px-3 py-1 rounded-full flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" /> Saving...
                  </span>
                )}
              </div>
            </div>

            {/* Horizontal scroll container for smaller screens, full grid for large desktops */}
            <div className="flex xl:grid xl:grid-cols-7 gap-4 overflow-x-auto xl:overflow-x-visible pb-4 hide-scrollbar snap-x xl:w-full">
              {days.map((day) => (
                <div key={day} className="w-72 xl:w-auto shrink-0 xl:shrink snap-start">
                  <DroppableDay 
                    id={day} 
                    dayName={day} 
                    recipes={plan[day]} 
                    onRemove={handleRemoveRecipe}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar for Recipes */}
          <div className={`fixed md:relative bottom-0 left-0 right-0 md:w-80 bg-surface border-t md:border-l md:border-t-0 border-border-muted flex flex-col transition-all duration-300 z-20 shadow-2xl md:shadow-none shrink-0 ${
            isCookbookExpanded ? 'h-1/2' : 'h-[52px] md:h-full'
          }`}>
            <button 
              onClick={() => setIsCookbookExpanded(!isCookbookExpanded)}
              className="md:hidden w-full py-3.5 flex items-center justify-center gap-1.5 border-b border-border-muted bg-stone-50 hover:bg-stone-100 text-text-secondary hover:text-primary font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isCookbookExpanded ? (
                <>
                  <ChevronDown size={15} />
                  <span>Hide Cookbook</span>
                </>
              ) : (
                <>
                  <ChevronUp size={15} />
                  <span>Show Cookbook ({filteredRecipes.length})</span>
                </>
              )}
            </button>
            <div className={`p-4 border-b border-border-muted shrink-0 ${!isCookbookExpanded ? 'hidden md:block' : ''}`}>
              <h2 className="font-bold text-text-primary mb-3 font-display">Your Cookbook</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-text-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Search to add..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-border-muted rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-stone-50/50 text-text-primary"
                />
              </div>
            </div>
            
            <div className={`flex-grow overflow-y-auto p-4 flex flex-col gap-3 bg-stone-50/20 ${!isCookbookExpanded ? 'hidden md:flex' : ''}`}>
              {loading ? (
                [...Array(5)].map((_, i) => <RecipeItemSkeleton key={i} />)
              ) : (
                filteredRecipes.length > 0 ? (
                  filteredRecipes.map(recipe => (
                    <DraggableRecipe key={recipe._id} recipe={recipe} onAddRecipe={handleAddRecipeToDay} />
                  ))
                ) : (
                  <p className="text-center text-text-muted text-sm py-8 font-medium">
                    No recipes found.
                  </p>
                )
              )}
            </div>
          </div>

          {/* Drag Overlay for smooth dragging visual */}
          <DragOverlay>
            {activeDragItem ? (
              <div className="bg-surface border-2 border-primary p-3 rounded-lg shadow-high flex items-center gap-3 opacity-90 scale-105 rotate-2 text-text-primary">
                 <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-border-muted">
                  <img src={activeDragItem.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&q=80'} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm font-display">{activeDragItem.title}</h4>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </motion.div>
  );
};

export default MealPlanner;
