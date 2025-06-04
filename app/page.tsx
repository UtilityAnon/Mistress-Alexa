// Paste this entire code into app/page.tsx

import React, { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'You' }]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: '1rem', backgroundColor: '#222', color: 'white', fontSize: '1.5rem' }}>
        Mistress Alexa
      </header>

      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <footer style={{ display: 'flex', padding: '0.5rem', borderTop: '1px solid #ccc' }}>
        <button style={{ marginRight: '0.5rem' }}>📎</button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, marginRight: '0.5rem' }}
          placeholder="Type your command, slave..."
        />
        <button onClick={sendMessage}>Send</button>
      </footer>
    </div>
  );
}
