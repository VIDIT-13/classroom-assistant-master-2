import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Colors
  const colors = {
    primary: "#C547FF", // pink
    secondary: "#9747FF", // purple
    accent: "#E3BFFF",
    dark: "#AB04B7"
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Initial greeting
  useEffect(() => {
    setChat([{ 
      sender: "bot", 
      text: "Hello! I'm Autograd Assistant. How can I help you today?" 
    }]);
  }, []);

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
    <div style={{ 
      maxWidth: 600, 
      margin: "0 auto", 
      fontFamily: "Arial, sans-serif",
      borderRadius: "8px",
      boxShadow: "0 0 15px rgba(197, 71, 255, 0.2)",
      padding: "20px",
      backgroundColor: "#fafafa"
    }}>
      <h2 style={{ 
        color: colors.dark, 
        textAlign: "center",
        borderBottom: `2px solid ${colors.primary}`,
        paddingBottom: "10px",
        marginBottom: "20px"
      }}>Autograd Assistant</h2>
      
      <div 
        ref={chatContainerRef}
        style={{ 
          border: `1px solid ${colors.accent}`, 
          minHeight: 300, 
          maxHeight: 400,
          padding: 15, 
          marginBottom: 15,
          borderRadius: "8px",
          overflowY: "auto",
          backgroundColor: "white"
        }}
      >
        {chat.map((msg, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px"
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === "user" ? colors.primary : colors.secondary,
                color: "white",
                padding: "10px 15px",
                borderRadius: msg.sender === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
                maxWidth: "80%",
                wordBreak: "break-word"
              }}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            <small 
              style={{ 
                color: "#666", 
                marginTop: "4px", 
                fontSize: "12px" 
              }}
            >
              {msg.sender === "user" ? "You" : "Autograd Assistant"}
            </small>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
            <div style={{ 
              backgroundColor: colors.secondary,
              color: "white",
              padding: "10px 15px",
              borderRadius: "18px 18px 18px 0",
              display: "flex",
              alignItems: "center"
            }}>
              <div className="typing-indicator">
                <span style={{ 
                  height: "8px", 
                  width: "8px", 
                  margin: "0 2px", 
                  backgroundColor: "white", 
                  borderRadius: "50%", 
                  display: "inline-block",
                  animation: "typing 1.4s infinite both",
                  animationDelay: "0s" 
                }}></span>
                <span style={{ 
                  height: "8px", 
                  width: "8px", 
                  margin: "0 2px", 
                  backgroundColor: "white", 
                  borderRadius: "50%", 
                  display: "inline-block",
                  animation: "typing 1.4s infinite both",
                  animationDelay: "0.2s" 
                }}></span>
                <span style={{ 
                  height: "8px", 
                  width: "8px", 
                  margin: "0 2px", 
                  backgroundColor: "white", 
                  borderRadius: "50%", 
                  display: "inline-block",
                  animation: "typing 1.4s infinite both",
                  animationDelay: "0.4s" 
                }}></span>
              </div>
            </div>
            <small style={{ color: "#666", marginLeft: "10px", fontSize: "12px" }}>
              Autograd Assistant is typing...
            </small>
          </div>
        )}
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center",
        borderRadius: "25px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(171, 4, 183, 0.2)",
        border: `1px solid ${colors.accent}`
      }}>
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{ 
            width: "100%", 
            padding: "12px 15px",
            border: "none",
            outline: "none",
            fontSize: "16px"
          }}
        />
        <button 
          onClick={handleSend} 
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            color: "white",
            border: "none",
            padding: "12px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
            opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = colors.dark;
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = colors.primary;
          }}
        >
          Send
        </button>
      </div>

      <style jsx>{`
        @keyframes typing {
          0% { transform: translateY(0px); }
          28% { transform: translateY(-5px); }
          44% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;