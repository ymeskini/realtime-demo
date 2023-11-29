import { FC, useState } from "react";

export const Login: FC<{ onSubmit: (username: string) => void }> = ({
  onSubmit,
}) => {
  const [username, setUsername] = useState("");

  return (
    <div className="login">
      <h1>Login</h1>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(username);
        }}
      >
        <input
          type="text"
          value={username}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
