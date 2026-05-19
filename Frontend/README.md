BlogApp Frontend

frontend for the BlogApp project, styled with **TailwindCSS** and powered by **Zustand** for state management. It integrates with the backend APIs to provide a seamless blogging experience.

---

Features
- Fast development with **Vite**
- Styling with **TailwindCSS**
- Routing using **React Router**
- API calls with **Axios**
- Form handling via **React Hook Form**
- Notifications with **React Hot Toast**
- State management using **Zustand**
- Linting with **ESLint**

---

Installation Guide:

npm install

react, react-dom → UI framework

react-router-dom → routing

axios → API requests

zustand → state management

react-hook-form → form handling

react-hot-toast → notifications

tailwindcss + @tailwindcss/vite → styling

```
Frontend/
│── src/
│   ├── Components/
│   │   ├── Admin.jsx
│   │   ├── AdminProfile.jsx
│   │   ├── ArticleByID.jsx
│   │   ├── Author.jsx
│   │   ├── AuthorArticles.jsx
│   │   ├── EditArticle.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Register.jsx
│   │   ├── RootLayout.jsx
│   │   ├── Unauthorized.jsx
│   │   ├── UserProfile.jsx
│   │   └── WriteArticles.jsx
│   ├── store/
│   │   └── authStore.js
│   ├── styles/
│   │   └── common.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│── .env
│── .gitignore
│── README.md
│── eslint.config.js
│── index.html
│── package-lock.json
│── package.json
│── vite.config.js
```
Start development server:
npm run dev       
