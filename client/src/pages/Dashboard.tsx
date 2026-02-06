import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { setConnections, setLoading, setError } from '../slices/dbSlice';
import axios from 'axios';
import { Plus, Database, Server, Trash2, Loader2, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'sqlite', connectionString: '' });
  const { connections, loading } = useSelector((state: RootState) => state.db);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/db', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setConnections(res.data));
    } catch (err: any) {
      dispatch(setError('Failed to fetch connections'));
      toast.error('Failed to fetch connections');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      await axios.post('http://127.0.0.1:5001/api/db', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAdd(false);
      setFormData({ name: '', type: 'sqlite', connectionString: '' });
      toast.success('Connection added successfully!');
      fetchConnections();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add connection';
      dispatch(setError(msg));
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this connection?')) return;
    
    dispatch(setLoading(true));
    try {
      await axios.delete(`http://127.0.0.1:5001/api/db/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Connection deleted');
      fetchConnections();
    } catch (err: any) {
      toast.error('Failed to delete connection');
      dispatch(setError('Failed to delete connection'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="dashboard container fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Your Databases</h1>
          <p>Manage your connected SQL instances</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary">
          <Plus size={20} /> Connect New DB
        </button>
      </header>

      {showAdd && (
        <div className="glass-card add-connection-card fade-in">
          <h3>Connect Database</h3>
          <form onSubmit={handleAdd} className="connection-form">
            <div className="form-group">
              <label>Connection Name</label>
              <input 
                placeholder="e.g. Production MySQL" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Database Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="select-input"
              >
                <option value="sqlite">SQLite</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
              </select>
            </div>
            <div className="form-group">
              <label>Connection String</label>
              <input 
                placeholder="e.g. mysql://user:pass@host:port/db" 
                value={formData.connectionString}
                onChange={e => setFormData({...formData, connectionString: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowAdd(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Connect'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="connection-grid">
        {connections.length === 0 ? (
          <div className="empty-state glass-card">
            <Database size={48} />
            <p>No databases connected yet.</p>
          </div>
        ) : (
          connections.map(conn => (
            <div key={conn.id} className="connection-card glass-card">
              <div className="conn-info">
                <Server size={32} className="conn-icon" />
                <div>
                  <h4>{conn.name}</h4>
                  <span className="badge">{conn.type}</span>
                </div>
              </div>
              <div className="conn-actions">
                <button className="btn btn-icon"><LinkIcon size={18} /></button>
                <button 
                  className="btn btn-icon danger" 
                  onClick={() => handleDelete(conn.id)}
                  title="Delete Connection"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
