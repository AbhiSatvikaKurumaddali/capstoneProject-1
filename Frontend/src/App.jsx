import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./Components/RootLayout.jsx";
import Home from "./Components/Home.jsx";
import Register from "./Components/Register.jsx";
import Login from "./Components/Login.jsx";
import UserProfile from "./Components/UserProfile.jsx";
import Author from "./Components/Author.jsx";
import AuthorArticles from "./Components/AuthorArticles.jsx";
import EditArticle from "./Components/EditArticle.jsx";
import WriteArticles from "./Components/WriteArticles.jsx";
import ArticleByID from "./Components/ArticleByID.jsx";
import { Toaster } from "react-hot-toast";
import Unauthorized from "./Components/Unauthorized.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import AdminProfile from "./Components/AdminProfile.jsx";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "Register",
          element: <Register />,
        },
        {
          path: "Login",
          element: <Login />,
        },
        {
          path: "UserProfile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "AdminProfile",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "Author",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <Author />
            </ProtectedRoute>
          ),

          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "WriteArticles",
              element: <WriteArticles />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path: "edit-article",
          element: <EditArticle />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;
