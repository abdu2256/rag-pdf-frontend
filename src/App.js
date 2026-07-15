import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Salam! PDF upload karo ya seedha poochho!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("Abdullah_Basit_CV-3.pdf");

  const uploadPDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setFileName(file.name);
      setMessages([{ role: "ai", text: `✅ ${file.name} upload ho gaya! Ab poochho!` }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "❌ Upload failed!" }]);
    }
    setUploading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "❌ Backend chal raha hai?" }]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>🤖 RAG PDF Chatbot</h2>
        <p style={{ margin: "4px 0 12px", opacity: 0.7, fontSize: "13px" }}>
          Koi bhi PDF upload karo aur sawaal poochho!
        </p>
        {/* Upload Button */}
        <label style={styles.uploadBtn}>
          {uploading ? "⏳ Uploading..." : "📄 PDF Upload Karo"}
          <input
            type="file"
            accept=".pdf"
            onChange={uploadPDF}
            style={{ display: "none" }}
          />
        </label>
        {fileName && (
          <p style={{ margin: "8px 0 0", fontSize: "12px", opacity: 0.6 }}>
            📎 Active: {fileName}
          </p>
        )}
      </div>

      {/* Chat */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.message,
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            background: msg.role === "user" ? "#1A5276" : "#1E8449",
          }}>
            <span>{msg.role === "user" ? "👤" : "🤖"}</span>
            <p style={styles.msgText}>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, background: "#333", alignSelf: "flex-start" }}>
            <p style={styles.msgText}>⏳ Soch raha hun...</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Kuch poochho... (Enter dabao)"
        />
        <button style={styles.btn} onClick={sendMessage}>
          Send 🚀
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", flexDirection: "column",
    height: "100vh", background: "#0D1117", color: "white",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    background: "#161B22", padding: "16px 24px",
    borderBottom: "1px solid #30363D", textAlign: "center"
  },
  uploadBtn: {
    display: "inline-block", padding: "8px 20px",
    background: "#1A5276", borderRadius: "6px",
    cursor: "pointer", fontSize: "13px",
    border: "1px solid #2E86C1"
  },
  chatBox: {
    flex: 1, overflowY: "auto", padding: "20px",
    display: "flex", flexDirection: "column", gap: "12px"
  },
  message: {
    display: "flex", gap: "10px", alignItems: "flex-start",
    maxWidth: "70%", padding: "12px 16px", borderRadius: "12px"
  },
  msgText: { margin: 0, lineHeight: "1.5", fontSize: "14px" },
  inputArea: {
    display: "flex", gap: "10px", padding: "16px",
    background: "#161B22", borderTop: "1px solid #30363D"
  },
  input: {
    flex: 1, padding: "12px 16px", borderRadius: "8px",
    border: "1px solid #30363D", background: "#0D1117",
    color: "white", fontSize: "14px", outline: "none"
  },
  btn: {
    padding: "12px 24px", background: "#1A5276",
    color: "white", border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "14px", fontWeight: "bold"
  }
};

export default App;