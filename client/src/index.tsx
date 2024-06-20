import ReactDOM from "react-dom/client";
import process from "process";
import App from "./App";
import "./index.css";

if (typeof window !== "undefined") {
  window.process = process;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
