import { render } from "preact";
import App from "./App";
import React from "preact/compat";

render(<App />, document.getElementById("app") as HTMLElement);
