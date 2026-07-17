import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const RecipeForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prepTime, setPrepTime] = useState(0);
  const [servings, setServings] = useState(0);

  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [tags, setTags] = useState(['']);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      const recipe = res.data;
      setTitle(recipe.title);
      setDescription(recipe.description);
      setPrepTime(recipe.prepTime || 0);
      setServings(recipe.servings || 0);
      setIngredients(recipe.ingredients.length ? recipe.ingredients : ['']);
      setInstructions(recipe.instructions.length ? recipe.instructions : ['']);
      setTags(recipe.tags && recipe.tags.length ? recipe.tags : ['']);
      setImagePreview(recipe.image);
    } catch (err) {
      setError('Failed to fetch recipe details');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Array Handlers
  const handleArrayChange = (setter, index, value) => {
    setter(prev => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    });
  };

  const handleAddArrayItem = (setter) => {
    setter(prev => [...prev, '']);
  };

  const handleRemoveArrayItem = (setter, index) => {
    setter(prev => {
      if (prev.length === 1) return ['']; // Keep at least one empty field
      return prev.filter((_, i) => i !== index);
    });
  };

  // Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Filter out empty items
    const cleanIngredients = ingredients.filter(i => i.trim() !== '');
    const cleanInstructions = instructions.filter(i => i.trim() !== '');
    const cleanTags = tags.filter(t => t.trim() !== '');

    if (cleanIngredients.length === 0 || cleanInstructions.length === 0) {
      setError('Please provide at least one ingredient and one instruction step.');
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('prepTime', prepTime);
    formData.append('servings', servings);
    formData.append('ingredients', JSON.stringify(cleanIngredients));
    formData.append('instructions', JSON.stringify(cleanInstructions));
    formData.append('tags', JSON.stringify(cleanTags));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (isEditing) {
        await api.put(`/recipes/${id}`, formData);
        navigate(`/recipes/${id}`);
      } else {
        const res = await api.post('/recipes', formData);
        navigate(`/recipes/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/recipes" className="inline-flex items-center text-slate-500 hover:text-emerald-600 transition-colors">
            <ArrowLeft size={18} className="mr-1.5" /> Back to recipes
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-900 text-white">
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
            </h1>
            <p className="text-slate-400 mt-2">
              Fill in the details below to save this recipe to your personal cookbook.
            </p>
          </div>

          <div className="p-6 md:p-10">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8 border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Basic Info Section */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Basic Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recipe Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Spicy Thai Basil Chicken"
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-slate-900 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <textarea
                      required
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A brief description of this dish..."
                      className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-slate-900 bg-slate-50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        value={prepTime}
                        onChange={(e) => setPrepTime(Number(e.target.value))}
                        placeholder="e.g., 30"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-slate-900 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Servings</label>
                      <input
                        type="number"
                        min="0"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        placeholder="e.g., 4"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-slate-900 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recipe Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="space-y-2 text-center">
                        {imagePreview ? (
                          <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-sm">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                            <label htmlFor="file-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                              <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">Change Image</span>
                            </label>
                          </div>
                        ) : (
                          <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                        )}
                        <div className="flex justify-center text-sm text-slate-600 mt-4">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-amber-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-800 px-3 py-1 shadow-sm border border-slate-200"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                        {!imagePreview && <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dynamic Arrays Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Ingredients */}
                <section>
                  <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Ingredients *</h2>
                  <div className="space-y-3">
                    {ingredients.map((ingredient, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => handleArrayChange(setIngredients, idx, e.target.value)}
                          placeholder="e.g., 2 cups flour"
                          className="flex-grow px-4 py-2 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem(setIngredients, idx)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem(setIngredients)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-amber-800 mt-2"
                    >
                      <Plus size={16} /> Add another ingredient
                    </button>
                  </div>
                </section>

                {/* Instructions */}
                <section>
                  <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Instructions *</h2>
                  <div className="space-y-3">
                    {instructions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-medium shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <textarea
                          value={step}
                          onChange={(e) => handleArrayChange(setInstructions, idx, e.target.value)}
                          placeholder="e.g., Preheat oven to 350°F..."
                          rows="2"
                          className="flex-grow px-4 py-2 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-slate-900 resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem(setInstructions, idx)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem(setInstructions)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-amber-800 mt-2 pl-10"
                    >
                      <Plus size={16} /> Add another step
                    </button>
                  </div>
                </section>
              </div>

              {/* Tags Section */}
              <section>
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Tags</h2>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag, idx) => (
                      <div key={idx} className="flex items-center">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleArrayChange(setTags, idx, e.target.value)}
                          placeholder="e.g., Vegan"
                          className="w-32 px-3 py-1.5 border border-slate-200 rounded-l-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-sm text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem(setTags, idx)}
                          className="px-2 py-1.5 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-l-0 border-slate-200 rounded-r-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem(setTags)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-amber-800 mt-2"
                  >
                    <Plus size={16} /> Add a tag
                  </button>
                </div>
              </section>

              {/* Submit */}
              <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                <Link
                  to="/recipes"
                  className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-amber-800 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
                  ) : (
                    <><Save size={18} /> {isEditing ? 'Update Recipe' : 'Save Recipe'}</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeForm;
