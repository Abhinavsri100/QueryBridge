import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Database, Zap, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="container">
          <h1 className="fade-in">Talk to your <span className="gradient-text">Database</span></h1>
          <p className="fade-in" style={{ animationDelay: '0.1s' }}>
            The AI-powered SQL interface for non-technical teams. Query your data using natural language, no coding required.
          </p>
          <div className="hero-btns fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Building <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">View Demo</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card glass-card">
              <MessageSquare className="icon" />
              <h3>NL to SQL</h3>
              <p>Just ask a question. Our AI handles the complexes SQL queries for you.</p>
            </div>
            <div className="feature-card glass-card">
              <Database className="icon" />
              <h3>Multi-DB Support</h3>
              <p>Connect to PostgreSQL, MySQL, SQLite and more in seconds.</p>
            </div>
            <div className="feature-card glass-card">
              <ShieldCheck className="icon" />
              <h3>Secure Access</h3>
              <p>Read-only by design. Your data remains in your control at all times.</p>
            </div>
            <div className="feature-card glass-card">
              <Zap className="icon" />
              <h3>Instant Results</h3>
              <p>Get results in a beautiful tabular format instantly after querying.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
