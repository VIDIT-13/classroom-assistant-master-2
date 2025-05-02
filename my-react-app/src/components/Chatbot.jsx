// client/src/components/Chatbot.jsx
import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setChat([...chat, { sender: "user", text: userInput }]);
    try {
      const res = await axios.post("http://localhost:5000/api/chat", { prompt: userInput });
      setChat((prev) => [...prev, { sender: "bot", text: res.data.response }]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: "bot", text: "Error: Unable to get response." }]);
    }
    setUserInput("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Gemini Chatbot</h2>
      <div style={{ border: "1px solid #ccc", minHeight: 300, padding: 10, marginBottom: 10 }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender === "user" ? "You" : "Gemini"}:</strong>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {loading && <div>Gemini is typing...</div>}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        style={{ width: "80%" }}
      />
      <button onClick={handleSend} disabled={loading}>Send</button>
    </div>
  );
};

export default Chatbot;
