import React, { useState, useEffect, useRef } from 'react'; // 1. Thêm useEffect và useRef
import './App.css';

function App() {
  const chatbotAPI = process.env.REACT_APP_CHATBOT_API

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 2. Tạo một ref để tham chiếu đến div của chat-box
  const chatBoxRef = useRef(null);

  // 3. Sử dụng useEffect để tự động cuộn xuống dưới cùng
  useEffect(() => {
    if (chatBoxRef.current) {
      // Khi messages thay đổi, cuộn đến vị trí cuối cùng của chat-box
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // Hook này sẽ chạy mỗi khi state `messages` được cập nhật

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "Bạn", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(`${chatbotAPI}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { sender: "Bot", text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "Bot", text: "Lỗi kết nối!" }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="App">
      <h2>💬 Chatbot Gemini</h2>
      
      {/* 4. Gán ref vào div của chat-box */}
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.sender === "Bạn" ? "user" : "bot"}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          placeholder="Nhập câu hỏi..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}

export default App;