import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Calendar, ShoppingCart, ArrowRight, Sparkles, Clock, Users, Heart, BookOpen, Utensils } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-8%] left-[-8%] w-[35%] h-[35%] rounded-full bg-orange-100 opacity-50 blur-3xl"></div>
        <div className="absolute top-[15%] right-[-5%] w-[25%] h-[25%] rounded-full bg-amber-50 opacity-60 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[20%] h-[20%] rounded-full bg-orange-50 opacity-40 blur-3xl"></div>
      </div>

      {/* ─── Navbar ─── */}
      <nav className="w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 flex justify-between items-center z-10 gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-primary font-display font-bold text-xl sm:text-2xl shrink-0">
          <ChefHat className="w-6 h-6 sm:w-8 sm:h-8" />
          <span>MealPlanner</span>
        </div>
        <div className="flex gap-1 sm:gap-3 items-center">
          <Link to="/login" className="px-3 py-2 sm:px-5 sm:py-2.5 font-semibold text-text-secondary hover:text-primary transition-colors text-sm sm:text-base">
            Log in
          </Link>
          <Link to="/register" className="px-4 py-2 sm:px-6 sm:py-2.5 font-semibold bg-primary text-white rounded-full hover:bg-amber-700 transition-all shadow-low hover:shadow-high hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="flex-shrink-0 z-10 px-6 pt-12 md:pt-20 pb-16 md:pb-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-orange-50 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-orange-100">
              <Sparkles size={16} />
              Your personal kitchen companion
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-text-primary mb-6"
              variants={itemVariants}
            >
              Master Your Meals, <br />
              <span className="text-primary">Simplify Your Life.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-text-secondary max-w-lg mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Organize recipes, plan your weekly meals effortlessly, and automatically generate grocery lists — all in one beautiful app.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
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
                I have an account
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={itemVariants} className="flex gap-8 mt-10 pt-8 border-t border-border-muted">
              <div>
                <p className="text-3xl font-bold font-display text-text-primary">500+</p>
                <p className="text-sm text-text-muted mt-0.5">Recipes saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display text-text-primary">1k+</p>
                <p className="text-sm text-text-muted mt-0.5">Meals planned</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display text-text-primary">100%</p>
                <p className="text-sm text-text-muted mt-0.5">Free to use</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-high border border-border-muted">
              <img
                src="/hero-meal.png"
                alt="Beautiful meal prep spread with fresh salads, grilled chicken, and roasted vegetables"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-surface rounded-2xl shadow-high border border-border-muted px-5 py-4 flex items-center gap-3"
            >
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <Heart size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm">Healthy & Delicious</p>
                <p className="text-xs text-text-muted">Plan meals you actually love</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="bg-surface py-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.p variants={itemVariants} className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Features</motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold font-display text-text-primary mb-4">Everything you need to eat well</motion.h2>
            <motion.p variants={itemVariants} className="text-text-secondary max-w-2xl mx-auto text-lg">Designed to take the stress out of cooking, giving you more time to enjoy your food.</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ChefHat size={36} className="text-primary" />}
              title="Recipe Management"
              description="Save, organize, and tweak your favorite recipes all in one beautiful, searchable personal cookbook."
              delay={0.1}
            />
            <FeatureCard
              icon={<Calendar size={36} className="text-primary" />}
              title="Weekly Meal Planning"
              description="Drag and drop your recipes into a weekly calendar. Say goodbye to the daily 'what's for dinner?' panic."
              delay={0.2}
            />
            <FeatureCard
              icon={<ShoppingCart size={36} className="text-primary" />}
              title="Smart Grocery Lists"
              description="Automatically generate organized shopping lists based on your planned meals. Never forget an ingredient again."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── How It Works Section ─── */}
      <section className="py-24 z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.p variants={itemVariants} className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">How it works</motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold font-display text-text-primary mb-4">Three steps to stress-free meals</motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            <StepCard
              step="01"
              icon={<BookOpen size={28} className="text-primary" />}
              title="Add Your Recipes"
              description="Upload your own recipes or browse and save new favorites to your personal cookbook with photos, ingredients, and instructions."
              delay={0.1}
            />
            <StepCard
              step="02"
              icon={<Calendar size={28} className="text-primary" />}
              title="Plan Your Week"
              description="Drag and drop recipes onto your weekly planner. Assign meals to breakfast, lunch, or dinner for every day of the week."
              delay={0.25}
            />
            <StepCard
              step="03"
              icon={<ShoppingCart size={28} className="text-primary" />}
              title="Shop with Ease"
              description="Instantly generate a smart grocery list from your meal plan. Check off items as you shop — it's that simple."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* ─── Visual Showcase Section ─── */}
      <section className="bg-surface py-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Row 1: Image left, text right */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-24"
          >
            <motion.div variants={fadeInUp} className="rounded-3xl overflow-hidden shadow-high border border-border-muted">
              <img
                src="/meal-planning.png"
                alt="Person planning meals with fresh vegetables"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </motion.div>
            <motion.div variants={containerVariants}>
              <motion.p variants={itemVariants} className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Plan smarter</motion.p>
              <motion.h3 variants={itemVariants} className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-5">Your Week, Your Way</motion.h3>
              <motion.p variants={itemVariants} className="text-text-secondary text-lg leading-relaxed mb-6">
                No more scrambling at 6 PM wondering what to cook. Plan your entire week in minutes with an intuitive drag-and-drop calendar that makes meal prep feel effortless.
              </motion.p>
              <motion.ul variants={containerVariants} className="space-y-4">
                <HighlightItem icon={<Clock size={20} />} text="Save hours of decision-making every week" />
                <HighlightItem icon={<Users size={20} />} text="Plan meals for the whole family" />
                <HighlightItem icon={<Heart size={20} />} text="Save favorite recipes for quick access" />
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* Row 2: Text left, image right */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
          >
            <motion.div variants={containerVariants} className="order-2 md:order-1">
              <motion.p variants={itemVariants} className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Cook with confidence</motion.p>
              <motion.h3 variants={itemVariants} className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-5">Every Recipe, One Place</motion.h3>
              <motion.p variants={itemVariants} className="text-text-secondary text-lg leading-relaxed mb-6">
                Your personal digital cookbook. Save recipes with photos, detailed instructions, prep times, and servings. Search and filter in seconds, and never lose a recipe again.
              </motion.p>
              <motion.ul variants={containerVariants} className="space-y-4">
                <HighlightItem icon={<Utensils size={20} />} text="Add photos and detailed instructions" />
                <HighlightItem icon={<BookOpen size={20} />} text="Search and filter your entire collection" />
                <HighlightItem icon={<Sparkles size={20} />} text="Tag recipes by cuisine, diet, or mood" />
              </motion.ul>
            </motion.div>
            <motion.div variants={fadeInUp} className="rounded-3xl overflow-hidden shadow-high border border-border-muted order-1 md:order-2">
              <img
                src="/recipe-showcase.png"
                alt="Recipe app with beautifully plated pasta dish"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 z-10 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 rounded-[2rem] p-12 md:p-16 border border-orange-100 relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-200 opacity-30 blur-3xl pointer-events-none"></div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold font-display text-text-primary mb-5 relative">
            Ready to transform your <span className="text-primary">meal routine</span>?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-text-secondary text-lg max-w-xl mx-auto mb-8 relative">
            Join MealPlanner today — it&apos;s free, it&apos;s simple, and your future self will thank you.
          </motion.p>
          <motion.div variants={itemVariants} className="relative">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition-all shadow-high hover:-translate-y-1"
            >
              Start Planning Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-bg-base py-10 border-t border-border-muted text-text-muted mt-auto z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-primary mb-4 md:mb-0">
            <ChefHat size={24} />
            <span>MealPlanner</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} MealPlanner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

/* ──────────────── Sub-components ──────────────── */

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
      <h3 className="text-xl font-bold font-display text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
};

const StepCard = ({ step, icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="text-center group"
    >
      <div className="relative mb-6 inline-flex items-center justify-center">
        <div className="bg-orange-50 border border-orange-100 w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform">
          {icon}
        </div>
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-low">{step}</span>
      </div>
      <h3 className="text-xl font-bold font-display text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">{description}</p>
    </motion.div>
  );
};

const HighlightItem = ({ icon, text }) => {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
      }}
      className="flex items-center gap-3 text-text-secondary"
    >
      <span className="flex-shrink-0 bg-orange-50 text-primary w-9 h-9 rounded-xl flex items-center justify-center">
        {icon}
      </span>
      <span>{text}</span>
    </motion.li>
  );
};

export default Landing;
