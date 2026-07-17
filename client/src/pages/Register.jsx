import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsSubmitting(true);
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex items-center justify-center bg-bg-base p-4"
    >
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-high border border-border-muted overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-stone-50 overflow-hidden shrink-0 border border-border-muted shadow-sm p-2.5 flex items-center justify-center">
              <img src="/logo.png" alt="Mise logo" className="w-full h-full object-contain" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-text-primary mb-2 font-display">Join Mise</h2>
          <p className="text-center text-text-secondary text-sm mb-8">Create an account to start planning your meals.</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-text-muted" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border-muted rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary bg-stone-50/50"
                  placeholder="Master Chef"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-text-muted" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-border-muted rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary bg-stone-50/50"
                  placeholder="chef@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-muted" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="block w-full pl-10 pr-3 py-2 border border-border-muted rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary bg-stone-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-muted" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="block w-full pl-10 pr-3 py-2 border border-border-muted rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-text-primary bg-stone-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-low text-sm font-semibold text-white bg-primary hover:bg-amber-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-amber-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
