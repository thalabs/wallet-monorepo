import { Connect } from "@stacks/connect-react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "@repo/stacks";
import { authOptions } from "./stacks/auth";
import { Home } from "./features/Home/Home";

export function App(): JSX.Element {
  return (
    <Connect authOptions={authOptions}>
      <Provider store={store}>
        <Home />
      </Provider>
    </Connect>
  );
}
