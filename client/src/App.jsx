import { useState } from 'react';
import './App.css';

function App() {
  const [role, setRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [years, setYears] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [bullets, setBullets] = useState([]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const isFormIncomplete =
    !role.trim() ||
    !techStack.trim() ||
    !years ||
    !experienceDescription.trim();

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setBullets([]);
    setSummary('');

    try {
      const res = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          techStack,
          years: Number(years),
          experienceDescription
        })
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      setBullets(data.bullets || []);
      setSummary(data.summary || '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="card">
        <header className="card-header">
          <div>
            <h1>TailorCV</h1>
            <p className="subtitle">
              Generate tailored CV bullets and a short summary from your experience.
            </p>
          </div>
          <span className="badge">GenAI · React · Gemini</span>
        </header>

        <div className="form-grid">
          <label>
            Target role
            <input
              placeholder="e.g. Frontend Developer"
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </label>

          <label>
            Tech stack
            <input
              placeholder="e.g. React, Node.js, AWS"
              value={techStack}
              onChange={e => setTechStack(e.target.value)}
            />
          </label>

          <label>
            Years of experience
            <input
              type="number"
              min="0"
              placeholder="e.g. 2"
              value={years}
              onChange={e => setYears(e.target.value)}
            />
          </label>

          <label className="full-width">
            What did you do?
            <textarea
              rows={5}
              placeholder="Describe what you did in this role…"
              value={experienceDescription}
              onChange={e => setExperienceDescription(e.target.value)}
            />
          </label>
        </div>

        <button
          className="primary-btn"
          onClick={handleGenerate}
          disabled={loading || isFormIncomplete}
        >
          {loading ? 'Generating…' : 'Generate bullets'}
        </button>

        <p className="helper-text">
          AI suggestions are a starting point—always review and edit before using in real applications.
        </p>

        {error && <p className="error">{error}</p>}

        {(summary || bullets.length > 0) && (
          <div className="output">
            {summary && (
              <>
                <h2>Summary</h2>
                <p>{summary}</p>
              </>
            )}

            {bullets.length > 0 && (
              <>
                <h2>Bullet points</h2>
                <ul>
                  {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <footer className="card-footer">
          <span className="version">TailorCV · v1.0.0</span>
          <span className="credit">Built with React, Node.js &amp; Google Gemini</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
