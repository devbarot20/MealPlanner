# Project Report: Mise Meal Planner & Cookbook

---

## 1. Executive Summary

This report documents the implementation of major architectural enhancements and a visual revamp for the meal planning application, rebranded as **Mise**. The project scope involved resolving key user-experience friction points (broken cover image uploads), adding core product features (Recipe Favorites, Serving Scalers, and a weekly Grocery List Generator), and executing a premium visual overhaul. 

Mise is now a cohesive, high-contrast, modern cookbook platform designed with an elegant warm-neutral styling system.

---

## 2. Technical Architectures & Schema Changes

### 2.1 Database Models
The Mongoose models were updated to support user personalization. Specifically, a favorites references array was integrated into the User model to support bookmarking without the overhead of a separate schema.

* **User Schema (`server/models/User.js`)**:
  ```javascript
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
  ```

### 2.2 Image Storage Integration
The image upload pipeline was debugged and optimized. Previously, default headers intercepted and forced `application/json` serialization on all requests, stripping boundaries and breaking multipart payloads. Removing hardcoded headers from `client/src/utils/api.js` restored Axios's native boundary formatting when transferring `FormData` payloads.
* File uploads are piped through `server/middleware/uploadMiddleware.js` (using Multer) and stored in Cloudinary via `cloudinary.v2.uploader.upload_stream` for high-availability image delivery.

---

## 3. Algorithmic Implementations & Feature Design

### 3.1 Grocery List Consolidation Algorithm (`client/src/utils/groceryUtils.js`)
The consolidation algorithm automatically crawls all recipes assigned to the selected week's meal plan, parses ingredients, combines duplicates, and normalizes units.

1. **Ingredient Parsing**: 
   A regular expression extracts numerical quantities (decimals, integers, fractions, or mixed numbers) and isolates the remaining string block.
   ```javascript
   const quantityRegex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)\s*(.*)$/;
   ```
2. **Fallback Rule (Unparseable Strings)**:
   If the parser encounters an ambiguous format (e.g. `"salt to taste"`, `"a pinch of cumin"`, `"onion, diced"`), it does **not** force numerical mapping. It returns the raw string unchanged, marked with `isUnscaled: true`.
3. **Normalization & Singularization**:
   Units are mapped to singular abbreviations (e.g., `cups` -> `cup`, `teaspoons` -> `tsp`). Common plural ingredient names are converted to singular forms (e.g., `onions` -> `onion`, `tomatoes` -> `tomato`, `cloves` -> `clove`) to establish matching hash keys.
4. **Consolidation**:
   Parsed items are stored in a map keyed by `${ingredientName}|${normalizedUnit}`. If units match, quantities are summed. If units differ (e.g. `2 cups milk` + `1 gallon milk`), they are listed as separate entries. Unscaled items are listed individually to prevent inaccurate merging or data loss.

### 3.2 Dynamic Serving Scaler
* Handled in `client/src/pages/RecipeDetail.jsx`. 
* Uses the parsing utility to multiply quantities by the scaling ratio (`servings / baseServings`).
* Unparseable ingredients (`isUnscaled: true`) bypass multiplier logic and display unchanged alongside a gray `(unscaled)` warning label instructing the cook to adjust manually.

### 3.3 Favorites System
* CRUD controllers added in `authController.js` and routes mapped to:
  * `POST /api/auth/favorites/:recipeId` — Add recipe to bookmarks.
  * `DELETE /api/auth/favorites/:recipeId` — Remove recipe from bookmarks.
* State is kept in sync globally via `AuthContext.jsx` and updated whenever the profile `/auth/me` is re-fetched or toggled.

---

## 4. Visual Design & Motion System

The visual revamp replaces a generic, low-contrast UI with a premium, warm-neutral light dashboard theme.

### 4.1 Tailwind CSS v4 Theme
All tokens are declared natively in `client/src/index.css` inside the `@theme` block:
* **Background & Surface**: Stone 50 (`#fafaf9`) background for the canvas and Pure White (`#ffffff`) for elevated elements.
* **Borders & Text**: Stone 200 (`#e7e5e4`) border boundaries and Stone 900 (`#1c1917`) high-contrast text.
* **Accent Highlight**: Copper Terracotta (`#b45309`) for primary calls-to-action, focus indicators, and highlights.
* **Typography**: **Outfit** (Display serif-sans) for editorial headers/recipe titles and **Plus Jakarta Sans** (clean, geometric sans) for chrome text.

### 4.2 Loading & Empty States
* **Static Empty States**: Visual cards for empty lists present static Stone 300 vector icons and copy text with zero motion to avoid decorative bloat.
* **Dynamic Skeletons**: Shimmering card grid layouts (`animate-pulse`) represent loading recipe lists and sidebars. They run strictly during active promise fetching and stop instantly on data arrival.

### 4.3 Motion Timings (Framer Motion)
Animations are smooth, linear, and non-elastic:
* **Page Transition**: Opacity fade-in and vertical drift (`y: [8, 0]`, `duration: 0.25s`).
* **Card Interaction**: Lift of `4px` (`y: -4`) and shadow transition to low-elevation alpha layers on hover.
* **Button Click**: Tap scaling of `0.98` for click tactile feedback.

### 4.4 Printing Optimizations
A print-only media stylesheet hides navbars, scrollbars, headers, and action inputs, producing a clean, black-and-white grid-aligned grocery checklist suitable for standard physical paper.

---

## 5. Verification & Validation Summary

1. **Jest Backend Verification**:
   * All 17 unit tests passed, including auth middleware, meal plan endpoints, and the full ingredient parsing suite.
2. **Vite Production Bundler**:
   * Client compiled successfully into clean production assets in `client/dist/`.
   * Reordered CSS `@import` rules to place font imports ahead of Tailwind core to eliminate layout/postcss compiler warnings.
