import { useState, useEffect } from 'react';

function Navbar({ onApiKeyChange, apiKey }) {
  const [showApiModal, setShowApiModal] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('hallucinatecheck-api-key') || '';
    setInputApiKey(savedApiKey);
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('hallucinatecheck-api-key', inputApiKey);
    onApiKeyChange(inputApiKey);
    setShowApiModal(false);
  };

  const handleClearApiKey = () => {
    setInputApiKey('');
    localStorage.removeItem('hallucinatecheck-api-key');
    onApiKeyChange('');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">HALLUCINATECHECK</div>
          <button 
            className={`api-status-btn ${apiKey ? 'connected' : ''}`}
            onClick={() => setShowApiModal(true)}
          >
            <span className="status-dot"></span>
            {apiKey ? 'API Connected' : 'Connect API'}
          </button>
        </div>
      </nav>

      {/* API Key Modal */}
      {showApiModal && (
        <div className="modal-overlay" onClick={() => setShowApiModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>API Configuration</h3>
              <button className="modal-close" onClick={() => setShowApiModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <label className="input-label">Google Gemini API Key</label>
              <input
                type="password"
                className="modal-input"
                placeholder="Enter your API key..."
                value={inputApiKey}
                onChange={(e) => setInputApiKey(e.target.value)}
              />
              <p className="modal-hint">
                Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleClearApiKey}>Clear</button>
              <button className="btn-primary" onClick={handleSaveApiKey}>Save Key</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
