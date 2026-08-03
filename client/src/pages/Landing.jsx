import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Calendar, ShoppingCart, ArrowRight } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100 opacity-50 blur-3xl"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-amber-50 opacity-60 blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-primary font-display font-bold text-2xl">
          <ChefHat size={32} />
          <span>MealPlanner</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 font-medium text-text-secondary hover:text-primary transition-colors">
            Log in
          </Link>
          <Link to="/register" className="px-5 py-2 font-medium bg-primary text-white rounded-full hover:bg-amber-700 transition-colors shadow-low hover:shadow-high">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 mt-12 md:mt-24 mb-20 text-center z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold font-display leading-tight tracking-tight text-text-primary mb-6"
            variants={itemVariants}
          >
            Master Your Meals, <br className="hidden md:block" />
            <span className="text-primary">Simplify Your Life.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
            variants={itemVariants}
          >
            The all-in-one platform to organize your favorite recipes, plan your weekly meals effortlessly, and automatically generate your grocery list.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition-all shadow-high hover:-translate-y-1"
            >
              Get Started for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="flex items-center justify-center px-8 py-4 rounded-full font-bold text-lg border-2 border-border-muted hover:border-border-active bg-surface text-text-primary transition-all shadow-low hover:shadow-high"
            >
              Already have an account?
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-surface py-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">Everything you need to eat well</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Designed to take the stress out of cooking, giving you more time to enjoy your food.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ChefHat size={40} className="text-primary" />}
              title="Recipe Management"
              description="Save, organize, and tweak your favorite recipes all in one beautiful, searchable personal cookbook."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Calendar size={40} className="text-primary" />}
              title="Weekly Meal Planning"
              description="Drag and drop your recipes into a weekly calendar. Say goodbye to the daily 'what's for dinner?' panic."
              delay={0.2}
            />
            <FeatureCard 
              icon={<ShoppingCart size={40} className="text-primary" />}
              title="Smart Grocery Lists"
              description="Automatically generate organized shopping lists based on your planned meals. Never forget an ingredient again."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-base py-10 border-t border-border-muted text-center text-text-muted mt-auto z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-primary mb-4 md:mb-0">
            <ChefHat size={24} />
            <span>MealPlanner</span>
          </div>
          <p>© {new Date().getFullYear()} MealPlanner. All rights reserved.</p>
        </div>
      </footer>
      
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-bg-base rounded-3xl p-8 border border-border-muted hover:border-primary/30 hover:shadow-high transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold font-display text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default Landing;
