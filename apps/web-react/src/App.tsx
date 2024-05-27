import { Connect } from "@stacks/connect-react";
import "./App.css";
import { authOptions } from "./stacks/auth";
import Home from "./features/Home/Home";
import { store } from "./store";
import { Provider } from "react-redux";
function App() {
  return (
    <Connect authOptions={authOptions}>
      <Provider store={store}>
        <Home />
      </Provider>
    </Connect>
  );
}

export default App;
