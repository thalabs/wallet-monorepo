import { Connect } from "@stacks/connect-react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { authOptions } from "./stacks/auth";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/__root";
import { Suspense } from "react";
export function App(): JSX.Element {
  return (
    <Connect authOptions={authOptions}>
      <Provider store={store}>
        <Suspense>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </Connect>
  );
}
