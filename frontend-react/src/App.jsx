import { useState, useEffect } from 'react';
import './App.css';
import { verifyText } from './api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InputBox from './components/InputBox';
import ClaimCard from './components/ClaimCard';
import Stats from './components/Stats';
import CorrectedTextModal from './components/CorrectedTextModal';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCorrectedModal, setShowCorrectedModal] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Load saved API key on mount
    const savedApiKey = localStorage.getItem('hallucinatecheck-api-key') || '';
    setApiKey(savedApiKey);
  }, []);

  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey);
  };

  const handleAnalyze = async (text) => {
    if (!apiKey.trim()) {
      setError('Please configure your API key first. Click the "Connect API" button.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setCurrentText(text);

    try {
      const result = await verifyText(text, apiKey);
      setReport(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to HallucinateCheck API. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = () => {
    if (!report?.claims) return;

    let fixedText = currentText;
    report.claims.forEach(claim => {
      if (claim.status === 'HALLUCINATION' && claim.correction) {
        fixedText = fixedText.replace(claim.original_text, claim.correction);
      }
    });
    setCorrectedText(fixedText);
    setShowCorrectedModal(true);
  };

  const handleApplyCorrectedText = () => {
    setShowCorrectedModal(false);
    setReport(null);
  };

  const getStats = () => {
    if (!report?.claims) return { verified: 0, hallucinations: 0, suspicious: 0, total: 0 };
    
    const stats = {
      verified: 0,
      hallucinations: 0,
      suspicious: 0,
      total: report.claims.length
    };

    report.claims.forEach(claim => {
      if (claim.status === 'VERIFIED') stats.verified++;
      else if (claim.status === 'HALLUCINATION') stats.hallucinations++;
      else if (claim.status === 'SUSPICIOUS') stats.suspicious++;
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="app">
      <div className="gradient-orb"></div>
      
      <Navbar onApiKeyChange={handleApiKeyChange} apiKey={apiKey} />
      
      <main className="main-content">
        <Hero />
        
        <div className="input-container">
          <InputBox onSubmit={handleAnalyze} loading={loading} />
          
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Analyzing for hallucinations...</p>
          </div>
        )}

        {report && !loading && (
          <div className="results-container">
            <Stats stats={stats} />
            
            <div className="results-header">
              <h2>Analysis Results</h2>
              {stats.hallucinations > 0 && (
                <button className="auto-fix-btn" onClick={handleAutoFix}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <polyline points="7 23 3 19 7 15"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                  Auto-Fix All
                </button>
              )}
            </div>

            <div className="claims-grid">
              {report.claims.map((claim, index) => (
                <ClaimCard key={index} claim={claim} index={index} />
              ))}
            </div>
          </div>
        )}

        {showCorrectedModal && (
          <CorrectedTextModal
            originalText={currentText}
            correctedText={correctedText}
            onApply={handleApplyCorrectedText}
            onClose={() => setShowCorrectedModal(false)}
          />
        )}
      </main>

      <footer className="footer">
        <p>Powered by Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
}

export default App;
