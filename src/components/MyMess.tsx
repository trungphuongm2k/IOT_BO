import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function MyComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("hello", (data) => {
      setMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>{message}</div>;
}
