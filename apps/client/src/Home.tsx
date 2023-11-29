import { FC, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./Cursor";

const WS_URL = "ws://localhost:5555";
const THROTTLE_MS = 50;
type Users = Record<
  string,
  {
    state: {
      x: number;
      y: number;
    };
  }
>;

const renderCursors = (users: Users) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];

    return <Cursor point={[user.state.x, user.state.y]} />;
  });
};

export const Home: FC<{ username: string }> = ({ username }) => {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<Users>(WS_URL, {
    queryParams: { username },
  });

  const throttledSend = useRef(throttle(sendJsonMessage, THROTTLE_MS));

  const onMouseMove = (e: MouseEvent) => {
    throttledSend.current({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0,
    });
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  if (lastJsonMessage) {
    return <>{renderCursors(lastJsonMessage)}</>;
  }

  return <div>Hello {username}</div>;
};
