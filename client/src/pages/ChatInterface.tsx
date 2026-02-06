import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setConnections, setActiveConnection } from '../slices/dbSlice';
import axios from 'axios';
import { Send, Bot, User, Database, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { connections, activeConnection } = useSelector((state: RootState) => state.db);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (connections.length === 0) {
      axios.get('http://127.0.0.1:5001/api/db', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        dispatch(setConnections(res.data));
        if (res.data.length > 0) dispatch(setActiveConnection(res.data[0]));
      });
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConnection) return;

    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5001/api/db/query', {
        connectionId: activeConnection.id,
        query: input
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const botMsg = { 
        role: 'bot', 
        content: `I found some data for you. Here is the SQL I used: \`${res.data.sql}\``,
        results: res.data.results 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I ran into an error: ' + msg }]);
      toast.error('Query failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container container fade-in">
      <aside className="chat-sidebar glass-card">
        <h3>Databases</h3>
        <div className="db-selector">
          {connections.map(conn => (
            <button 
              key={conn.id} 
              className={`db-item ${activeConnection?.id === conn.id ? 'active' : ''}`}
              onClick={() => dispatch(setActiveConnection(conn))}
            >
              <Database size={18} />
              <span>{conn.name}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="chat-main glass-card">
        <header className="chat-header">
          <Bot size={24} />
          <div>
            <h3>SQL Assistant</h3>
            <p>Ask anything about your data</p>
          </div>
        </header>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="welcome-msg">
              <Bot size={48} />
              <h2>How can I help you today?</h2>
              <p>Try: "How many users are there?" or "Show me the top 5 products by price."</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message-bubble ${msg.role}`}>
              <div className="msg-icon">
                {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="msg-content">
                <p>{msg.content}</p>
                {msg.results && msg.results.length > 0 && (
                  <div className="results-table-wrapper">
                    <table className="results-table">
                      <thead>
                        <tr>
                          {Object.keys(msg.results[0]).map(key => <th key={key}>{key}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.results.map((row: any, i: number) => (
                          <tr key={i}>
                            {Object.values(row).map((val: any, j: number) => <td key={j}>{String(val)}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {msg.results && msg.results.length === 0 && (
                  <div className="no-results">No data found for this query.</div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="message-bubble bot"><Loader2 className="animate-spin" /></div>}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-area">
          <input 
            placeholder="Ask a question about your data..." 
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !activeConnection}>
            <Send size={20} />
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatInterface;
