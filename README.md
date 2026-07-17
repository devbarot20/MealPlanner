# Mise — Premium Meal Planning & Cookbook

Mise (inspired by *"Mise en place"*, meaning "everything in its place") is a modern, high-contrast, SaaS-quality recipe management, weekly meal planning, and shopping list consolidation web application.

Designed with a premium warm-neutral stone aesthetic, high editorial Outfit typography, and terracotta branding, Mise makes it easy to drag-and-drop recipes onto a weekly planner, dynamically scale serving sizes, and output a paper-ready printable grocery shopping checklist.

---

## Key Features

1. **Interactive Weekly Planner**: Drag recipes from your personal cookbook onto the days of the week, with automatic layout synchronization and instant saving.
2. **Consolidated Grocery List**: Instantly aggregates ingredients from all meals in your current week's plan, combining duplicate items, handling unit conversions, and separating unparseable items to avoid list pollution.
3. **Dynamic Serving size Scaler**: Adjust servings on any recipe page to automatically scale ingredient quantities proportionally, with clear indicators for unscaleable ingredients (e.g. *"salt to taste"*).
4. **Recipe Bookmarks & Favorites**: Easily bookmark your favorite recipes using the Heart overlay triggers and filter your cookbook view to access your favorited recipes instantly.
5. **Robust Image Uploads**: Upload recipe covers directly to Cloudinary with secure form boundaries.

---

## Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Axios, Lucide React, DnD Kit (Drag & Drop).
* **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary (Image storage), JSON Web Tokens (Authentication), Jest (Testing).

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cluster connection)
* [Cloudinary Account](https://cloudinary.com/) (For image uploads)

### Setup Instructions

1. **Clone the Repository** and navigate to the project directory:
   ```bash
   cd MealPlanner
   ```

2. **Backend Configuration**:
   Navigate to the `server/` directory:
   ```bash
   cd server
   ```
   Create a `.env` file based on the environment variables requirements:
   ```env
   PORT=8080
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mealplanner
   JWT_SECRET=your_jwt_secret_token
   CLOUDINARY_CLOUD_NAME=dqsjnjeky
   CLOUDINARY_API_KEY=282129934291879
   CLOUDINARY_API_SECRET=ZKypYCkOyss77khlZKXRcv95yhc
   CLOUDINARY_URL=cloudinary://282129934291879:ZKypYCkOyss77khlZKXRcv95yhc@dqsjnjeky
   ```
   Install backend dependencies:
   ```bash
   npm install
   ```

3. **Frontend Configuration**:
   Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
   Install frontend dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

### 1. Start the Backend Server
From the `server/` folder, run:
```bash
npm run dev
```
The server will start on port `8080` (or the port defined in `.env`).

### 2. Start the Frontend Client
From the `client/` folder, run:
```bash
npm run dev
```
The Vite development server will run locally (typically at `http://localhost:5173`). Vite is configured to proxy api requests directly to `http://localhost:8080/api`.

---

## Running Tests

Verify the backend schemas, authentication, and parsing utilities using Jest. From the `server/` folder, run:
```bash
npm run test
```

## Production Build

To build the client codebase for production deployment, navigate to the `client/` folder and run:
```bash
npm run build
```
This generates optimized HTML, CSS (Tailwind v4), and JS bundle assets in the `dist/` directory.
