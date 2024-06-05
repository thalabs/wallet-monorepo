import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Home = lazy(() => import("./Home"));
export const router = createBrowserRouter([
  {
    element: <Home />,
    path: "/",
  },
  {
    element: <Home />,
    path: "*",
  },
]);
