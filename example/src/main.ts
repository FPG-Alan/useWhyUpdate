import { sum } from "lib";

import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
  <p>The sum of 1 and 2 is ${sum(1, 2)}</p>
`;
