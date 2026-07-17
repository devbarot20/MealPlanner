import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import MealPlanner from './pages/MealPlanner';
import GroceryList from './pages/GroceryList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/planner" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={<Navigate to="/planner" replace />} 
          />
          <Route 
            path="/recipes" 
            element={<ProtectedRoute><RecipeList /></ProtectedRoute>} 
          />
          <Route 
            path="/recipes/new" 
            element={<ProtectedRoute><RecipeForm /></ProtectedRoute>} 
          />
          <Route 
            path="/recipes/:id" 
            element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} 
          />
          <Route 
            path="/recipes/edit/:id" 
            element={<ProtectedRoute><RecipeForm /></ProtectedRoute>} 
          />
          <Route 
            path="/planner" 
            element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} 
          />
          <Route 
            path="/grocery-list" 
            element={<ProtectedRoute><GroceryList /></ProtectedRoute>} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
