import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        username: username,
        message: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="app">
      {!showChat ? (
        <div className="chat-container">
          <div className="chat-header">
            <h2>Join Chat</h2>
          </div>

          <div style={{ padding: "20px", textAlign: "center" }}>
            <input
              type="text"
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              onClick={() => {
                if (username.trim() !== "") {
                  setShowChat(true);
                } else {
                  alert("Please enter your name");
                }
              }}
            >
              Join Chat
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h2>Real-Time Chat App</h2>
            <p>Welcome, {username} 👋</p>
          </div>

          <div className="chat-body">
            {messageList.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.username}</strong>

                <span
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    marginLeft: "10px",
                  }}
                >
                  {msg.time}
                </span>

                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
