import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  const iconRef = useRef(null);
  const chatRef = useRef(null);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000); // 2000ms = 2 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    gsap.to(iconRef.current, {
      y: isOpen ? 0 : -10,
      duration: 0.2,
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const sessionId = localStorage.getItem("df_session_id") || (() => {
      const id = crypto.randomUUID(); // or uuidv4()
      localStorage.setItem("df_session_id", id);
      return id;
    })();

    try {
      const res = await fetch(
        `https://dialogflow.googleapis.com/v2/projects/YOUR_PROJECT_ID/agent/sessions/${sessionId}:detectIntent`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer YOUR_SERVICE_ACCOUNT_TOKEN`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryInput: {
              text: {
                text: input,
                languageCode: "en", // Or "hi", "ta", etc.
              },
            },
          }),
        }
      );

      const data = await res.json();
      const botMessage = {
        from: "bot",
        text: data.queryResult?.fulfillmentText || "🤖 Sorry, I didn't get that.",
      };

      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    } catch (error) {
      console.error("Dialogflow Error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Failed to reach assistant." },
      ]);
    }
  };

  return (
    <>
      {/* Chat Icon Button */}
      {show ? (
        <>
        
      
      <button
  ref={iconRef}
  className="fixed bottom-6 right-6 z-50 w-24 h-24 bg-transparent flex flex-col items-center justify-center group"
  onClick={toggleChat}
  aria-label="Open Chatbot"
>
 
  <div 
    className="mb-4 text-sm text-amber-950 font-bold font-merriweather bg-colour1 px-1 py-1 rounded translate-y-20 shadow-md
               transition-all duration-500 ease-in-out transform opacity-100 
               group-hover:opacity-0 group-hover:-translate-y-2"
  >
    Chat with us!
  </div>

  <img
    src="./mas1.png"
    alt="Chat icon"
    className="transition-transform translate-y-20 duration-300 ease-in-out  group-hover:-translate-y-0 group-hover:scale-110"
  />
</button>

      {isOpen && (
        <div
          
          className="fixed bottom-28 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-40"
        >
          <div className="bg-colour1 text-white p-4 text-lg font-semibold">
            🤖 FoodLoop AI Chat
          </div>
          
          {/* Messages display area - replaced static content with dynamic messages */}
          <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs ${
                    msg.from === "user" ? "bg-amber-100 text-right" : "bg-gray-100 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-2 border-t flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-l-md outline-none text-sm"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-amber-500 hover:bg-amber-700 px-4 text-white rounded-r-md text-sm transition-all duration-75"
            >
              Send
            </button>
          </div>
        </div>
      )}
      </>
    ) : null}
    </>
  );
};

export default ChatbotWidget;