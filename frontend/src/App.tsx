import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const WEBSOCKET_URL = "ws://localhost:8080";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const websocket = new WebSocket(WEBSOCKET_URL);
    websocket.onopen = () => {
      console.log("Connected to server");

      // Automatically start the timer when the component is rendered
      websocket.send(
        JSON.stringify({
          type: "start-timer",
          id: "testTimer", // Use a unique ID for the timer
        })
      );
    };

    websocket.onclose = () => {
      console.log("Disconnected from server");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
