import React, { useState } from "react";
import Chatbot from "./Chatbot"; // Your existing chatbot code

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  // Colors for the button (reuse your palette)
  const colors = {
    primary: "#C547FF",
    dark: "#AB04B7"
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 1000,
            background: colors.primary,
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 60,
            height: 60,
            boxShadow: "0 4px 16px rgba(197, 71, 255, 0.3)",
            fontSize: 28,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          title="Open Autograd Assistant"
          onMouseOver={e => e.currentTarget.style.background = colors.dark}
          onMouseOut={e => e.currentTarget.style.background = colors.primary}
        >
          {/* You can use an icon here */}
          💬
        </button>
      )}

      {/* Chatbot Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 1001,
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(171, 4, 183, 0.25)",
            width: 370,
            maxWidth: "95vw",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "none",
              color: "#888",
              fontSize: 22,
              cursor: "pointer",
              margin: "8px 8px 0 0"
            }}
            title="Close"
          >
            ×
          </button>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Chatbot />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
