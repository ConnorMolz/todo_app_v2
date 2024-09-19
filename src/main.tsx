import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import CreateTodo from "./Pages/CreateTodo.tsx";
import EditTodo from "./Pages/EditTodo.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
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
