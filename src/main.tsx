import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import CreateTodo from "./Pages/CreateTodo.tsx";
import EditTodo from "./Pages/EditTodo.tsx";
import Home from "./Pages/Home.tsx";
import AllTodos from "./Pages/AllTodos.tsx";
import SignUp from "./Pages/UserManagment/SignUp.tsx";
import ForgotPassword from "./Pages/UserManagment/ForgotPassword.tsx";
import Settings from "./Pages/UserManagment/Settings.tsx";

const router = createBrowserRouter([
    // All paths which are used in the app
    //Index
    {
        path: "/",
        element: <App />,
    },
    // Main pages prefix /Home/<page>
    {
        path:"/Home",
        element: <Home />,
    },
    {
        path:"/Home/all",
        element: <AllTodos />
    },
    // Create and edit
    {
        path: "/create",
        element: <CreateTodo />,
    },
    {
        path: "/edit/:todo_id",
        element: <EditTodo />,
    },
    // User Management and SignUp + Validations
    {
        path: "/signUp",
        element: <SignUp />,
    },
    {
        path:"/user/forgotPassword",
        element: <ForgotPassword />,
    },
    {
        path: "/settings",
        element: <Settings />,
    },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);
