import { useState, useEffect, useRef } from "react";
import "./ChatWidget.scss";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatBodyRef = useRef(null);

  const webhookUrl = "https://n8n.pupuia.com/webhook/7fcb9493-21b2-45a6-b683-892faf539a89";

  useEffect(() => {
    let existing = localStorage.getItem("chat_session_id");
    if (!existing) {
      existing = crypto.randomUUID();
      localStorage.setItem("chat_session_id", existing);
    }
    setSessionId(existing);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMsg = { 
      sender: "user", 
      content: input,
      timestamp: getFormattedTime()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          session_id: sessionId,
        }),
      });

      const htmlResponse = await response.text();

      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          content: htmlResponse,
          timestamp: getFormattedTime()
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content: "<p>Error al conectar con la IA.</p>",
          timestamp: getFormattedTime()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {!open && (
        <button className="chat-button" onClick={() => setOpen(true)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      {open && (
        <div className={`chat-box ${isClosing ? 'closing' : ''}`}>
          <div className="chat-header">
            <div className="header-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <div>
                <h3>Asistente Virtual</h3>
                <span className="status">
                  <span className="status-dot"></span>
                  En línea
                </span>
              </div>
            </div>
            <button className="close-btn" onClick={handleClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>Hola, soy tu asistente virtual del Club Náutico.</p>
                <p>¿En qué puedo ayudarte?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`msg-container ${msg.sender}`}>
                <div
                  className={`msg ${msg.sender}`}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                <span className="timestamp">{msg.timestamp}</span>
              </div>
            ))}
            {loading && (
              <div className="msg-container bot">
                <div className="msg bot">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Escribí tu mensaje..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
