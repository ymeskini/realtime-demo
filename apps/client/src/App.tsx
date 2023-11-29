import "./App.css";
import { useState } from "react";
import { Login } from "./Login";
import { Home } from "./Home";

function App() {
  const [username, setUsername] = useState<null | string>(null);

  return username ? (
    <Home username={username} />
  ) : (
    <Login onSubmit={(username) => setUsername(username)} />
  );
}

export default App;
