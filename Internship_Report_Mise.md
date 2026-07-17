# Front Matter

## Certificate
This is to certify that the summer training report entitled "Mise — A Meal Planning and Cookbook Web Application" has been submitted by [Your Name], Enrollment Number 12402040703002, towards the partial fulfillment of the degree of B.Tech Computer Engineering at Madhuben & Bhanubhai Patel Institute of Technology (MBIT). 

[TO BE FILLED: Internal Guide Signature]
[TO BE FILLED: HOD Signature]
[TO BE FILLED: Principal Signature]

## Declaration
I hereby declare that the summer training project report entitled "Mise" is an authentic record of my own work carried out during my internship at Prelytix Pvt Ltd from 12 May 2026 to 12 June 2026. This project was built solo by me using Antigravity AI as my development tool.

[TO BE FILLED: Student Signature]
Name: Dev Barot
Enrollment Number: 12402040703002

## Acknowledgement
I would like to thank Prelytix Pvt Ltd for giving me the opportunity to work on this project during my summer internship. I want to thank my internal guide, [TO BE FILLED: Internal Guide Name], and my industry mentor, [TO BE FILLED: Industry Mentor Name], for their help and direction. Finally, I thank the faculty at Madhuben & Bhanubhai Patel Institute of Technology (MBIT) for their support.

## Abstract
This report describes my one-month summer internship at Prelytix Pvt Ltd, where I built a project called Mise. Mise is a web application for meal planning and managing a digital cookbook. I chose this project to solve the common problem of organizing recipes and figuring out what groceries to buy. During the internship, I worked solo and used Antigravity AI as a development tool. I built the frontend using React 19, Vite, and Tailwind CSS v4, and the backend using Node.js, Express, and MongoDB. The application allows users to register, save recipes, upload recipe images, scale serving sizes, drag and drop recipes into a weekly planner, and automatically generate a consolidated grocery list. This report covers the technologies I learned, the steps I took to build the project, and how the main features work.

## List of Figures
| Figure Number | Description | Page Number |
|---|---|---|
| [TO BE FILLED] | [TO BE FILLED] | [TO BE FILLED] |

## List of Tables
Note: No tables were needed for this project report.
| Table Number | Description | Page Number |
|---|---|---|
| [TO BE FILLED] | [TO BE FILLED] | [TO BE FILLED] |

## List of Abbreviations
- API: Application Programming Interface
- CRUD: Create, Read, Update, Delete
- CSS: Cascading Style Sheets
- JSON: JavaScript Object Notation
- JWT: JSON Web Token
- UI: User Interface

## Table of Contents
1. Introduction ... [TO BE FILLED]
2. Company Profile ... [TO BE FILLED]
3. Technology Learned ... [TO BE FILLED]
4. Outline of Work done during Internship ... [TO BE FILLED]
5. Implementation and Results ... [TO BE FILLED]
6. Conclusion and Discussion ... [TO BE FILLED]

---

# Chapter 1: Introduction

During the period from 12 May 2026 to 12 June 2026, I completed a one-month summer internship at Prelytix Pvt Ltd. For my internship, I worked on a solo project called Mise. 

Mise is a web application that acts as a digital cookbook and meal planner. It allows a user to save their own recipes, plan what they want to eat for the week using a drag-and-drop interface, and automatically get a grocery list for the week based on those planned meals. 

I chose this project myself because I wanted to build something practical that solves an everyday problem. Managing recipes and manually adding up ingredients for weekly grocery shopping takes time, and I wanted to see if I could automate the math and organization through code.

---

# Chapter 2: Company Profile

[TO BE FILLED: company background, size, what they do]

---

# Chapter 3: Technology Learned

During this project, I used and learned the following technologies:

**React 19**
React is a JavaScript library for building user interfaces. I used it to create the frontend of my application by breaking the pages down into reusable components like buttons, forms, and recipe cards.

**Vite**
Vite is a build tool that serves code during local development very quickly. I used it to set up my React project and to bundle my code for production deployment.

**Tailwind CSS v4**
Tailwind is a utility-first CSS framework. I used it to style my application directly inside my HTML/JSX files without having to write separate CSS files for every component.

**Framer Motion**
Framer Motion is an animation library for React. I used it to add simple animations to my interface, making interactions look better.

**Axios**
Axios is a library used to make HTTP requests from the browser. I used it to send data from my React frontend to my Node.js backend.

**Lucide React**
Lucide is an icon library. I used it to add standard icons like trash cans, plus signs, and hearts into my user interface.

**DnD Kit**
DnD Kit is a library that helps build drag-and-drop features in React. I used it for the weekly meal planner so users can drag recipes onto specific days of the week.

**Node.js**
Node.js allows JavaScript to run on a server. I used it as the foundation for my backend code so my server could handle API requests.

**Express**
Express is a framework for Node.js. I used it to set up my server routes and to handle incoming requests and outgoing responses.

**MongoDB with Mongoose**
MongoDB is a database that stores data in document format, and Mongoose is a tool that connects Node.js to MongoDB. I used them to store my user accounts, recipes, and meal plans.

**Cloudinary**
Cloudinary is a cloud service for storing images. I used it to save the cover images that users upload for their recipes.

**JSON Web Tokens (JWT)**
JWT is a standard for securely transmitting information. I used it for user authentication, so that after a user logs in, they receive a token that proves their identity for future requests.

**Jest**
Jest is a testing framework for JavaScript. I used it to write tests for my backend code to make sure my functions worked correctly.

---

# Chapter 4: Outline of Work done during Internship

[TO BE FILLED: exact week-by-week split]

Here is the general sequence of how I built the project over the month:
1. **Planning:** Figured out what features I wanted to build and how the database should look.
2. **Setting up the backend:** Created the Node.js and Express server and connected it to MongoDB.
3. **Setting up the frontend:** Initialized the React project using Vite and configured Tailwind CSS.
4. **Building Auth:** Wrote the registration and login logic on both the server and client using JWT.
5. **Building Recipe/Cookbook features:** Added the ability to create, view, edit, and delete recipes, and set up Cloudinary so users could upload images. Also added the ability to bookmark recipes as favorites.
6. **Building the Weekly Planner:** Implemented the DnD Kit library so users could drag recipes from their cookbook into a weekly calendar layout.
7. **Building the Grocery List logic:** Wrote code to combine all ingredients from the planned recipes, merge identical items, and convert their units.
8. **Building the Serving Scaler:** Added math logic so users can change the number of servings on a recipe and see the ingredient amounts update automatically.
9. **Testing:** Wrote tests using Jest for my backend routes.
10. **Deployment:** Deployed the frontend and backend to the internet so the app is live.

---

# Chapter 5: Implementation and Results

In this section, I explain how the main features of the project were implemented.

**User Authentication Flow**
Users can register and log in to the application. When they log in, the backend verifies their password and generates a JSON Web Token (JWT). This token is sent to the frontend and stored. For every action the user takes (like saving a recipe), the frontend sends this token back to the server to prove the user is logged in.
[SCREENSHOT: Register Page]
[SCREENSHOT: Login Page]

**Recipe Bookmarking and Image Upload**
Users can mark a recipe as a favorite by clicking a heart icon. This updates a boolean flag in the database, and the frontend can then filter to show only favorites. When creating a recipe, users can select an image file from their computer. The backend sends this file directly to Cloudinary for storage, and Cloudinary returns a URL that gets saved in the MongoDB database.
[SCREENSHOT: Recipe Form with Image Upload]

**Weekly Meal Planner (Drag and Drop)**
The planner uses the DnD Kit library. I set up the recipes as draggable items and the days of the week as droppable areas. When a user drags a recipe onto a day, the React state updates to place that recipe object into an array for that specific day, and this layout is saved automatically to the database.
[SCREENSHOT: Weekly Planner]

**Grocery List Merging Logic**
To generate the grocery list, the app takes all the recipes scheduled for the week. It looks at the text for each ingredient, splits the number from the unit and the ingredient name, and adds them up. If it sees "1 cup flour" and "2 cups flour", it combines them to "3 cups flour". If it encounters an ingredient string it cannot format or understand, it puts it in a separate "unparsed" section so the main list stays clean.
[SCREENSHOT: Grocery List]

**Serving Size Scaler Logic**
When viewing a recipe, the user can change the serving size. I wrote a function that calculates the ratio between the new serving size and the original serving size. It then multiplies every ingredient quantity by this ratio. Things that do not have exact measurements, like "salt to taste", are ignored by the math so they do not show up as weird numbers.
[SCREENSHOT: Recipe Detail with Serving Scaler]

**Results**
The project was successfully built and works as intended. I wrote tests for the backend logic using Jest to make sure it was reliable. The project is currently deployed and live on the internet. 

- **Live URL:** https://meal-planner-virid-nu.vercel.app/register
- **GitHub Repository:** https://github.com/devbarot20/MealPlanner

---

# Chapter 6: Conclusion and Discussion

This project was a great learning experience. I successfully built a full-stack web application completely solo. I learned how to connect a React frontend to an Express backend and how to safely store data in MongoDB. I also gained practical experience with tools like Tailwind CSS and Cloudinary.

What worked well was the component-based structure of React, which made it easy to reuse parts of the interface like recipe cards. I also found that using Antigravity AI as a development tool helped me move faster and understand the code better.

There were some challenging parts to the project. [TO BE FILLED: specific challenges/bugs]. Overall, I am proud of the application I built, and I now have a solid understanding of how modern web applications are put together from start to finish.
