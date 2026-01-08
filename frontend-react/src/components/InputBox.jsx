import { useState } from 'react';

const SAMPLE_TEXT = `Recent studies by Johnson et al. (2024) in the Journal of Advanced AI suggest that neural networks consume 50% less energy when trained on quantum hardware. This breakthrough, known as the 'Quantum Leap Protocol', was validated by Google DeepMind in their 2023 annual report. Meanwhile, the moon is made of green cheese, a fact confirmed by NASA in 1969. The Transformer architecture was introduced by Vaswani et al. in their 2017 paper "Attention Is All You Need".`;

function InputBox({ onSubmit, loading }) {
  const [text, setText] = useState(SAMPLE_TEXT);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="input-box">
      <textarea
        className="input-textarea"
        placeholder="Paste AI-generated text here to analyze for hallucinations..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={loading}
      />
      <div className="input-footer">
        <span className="input-hint">Press Ctrl+Enter to analyze</span>
        <button 
          className="send-btn" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="btn-spinner"></div>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default InputBox;
