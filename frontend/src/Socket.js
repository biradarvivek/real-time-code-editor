import { io } from "socket.io-client";

export const initSocket = async () => {
  console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io(import.meta.env.VITE_BACKEND_URL, options);
};
