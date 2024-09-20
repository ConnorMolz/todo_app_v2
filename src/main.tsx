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

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path:"/Home",
        element: <Home />,
    },
    {
        path:"/Home/all",
        element: <AllTodos />
    },
    {
        path: "/create",
        element: <CreateTodo />,
    },
    {
        path: "/edit/:todo_id",
        element: <EditTodo />,
    }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);
