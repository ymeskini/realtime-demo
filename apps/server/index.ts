import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { parse } from "node:url";
import { WebSocketServer, WebSocket } from "ws";

const log = console.log.bind(console);

const server = createServer();
const wss = new WebSocketServer({ server });
const port = 5555;

const connections = new Map<string, WebSocket>();
const users: Record<
  string,
  {
    uuid: string;
    state: { x: number; y: number };
    username: string;
  }
> = {};

const broadcast = () => {
  const sockets = Array.from(connections.values());
  sockets.forEach((socket) => {
    const message = JSON.stringify(users);
    socket.send(message);
  });
};

const handleMessage = (
  buffer: Buffer | ArrayBuffer | Buffer[],
  uuid: string
) => {
  const message = JSON.parse(buffer.toString());
  const user = users[uuid];
  if (user) {
    user.state = message;
  }

  broadcast();
};

const handleClose = (uuid: string) => {
  log(`User ${uuid} disconnected`);
  connections.delete(uuid);
  delete users[uuid];
  broadcast();
};

wss.on("connection", (socket, req) => {
  const { username } = parse(req.url || "", true).query;

  if (typeof username !== "string") {
    socket.close();
    return;
  }

  const uuid = randomUUID();

  connections.set(uuid, socket);
  users[uuid] = { uuid, state: { x: 0, y: 0 }, username };

  socket.on("message", (rawData) => handleMessage(rawData, uuid));
  socket.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
