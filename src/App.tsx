import { useState } from "preact/hooks";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Electro (Preact Edition)</h1>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)} type={"button"}>Increment</button>
    </div>
  );
}
