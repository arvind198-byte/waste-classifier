import { useEffect, useState } from 'react';

const API = 'http://127.0.0.1:8000';
const iconFor = { cardboard: '📦', glass: '🫙', metal: '🥫', paper: '📄', plastic: '🧴', trash: '🗑️' };
const pretty = (s) => s ? s[0].toUpperCase() + s.slice(1) : '';

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(next) {
    setError(''); setResult(null);
    if (!next) { setFile(null); return; }
    if (!next.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (next.size > 10 * 1024 * 1024) { setError('Please choose an image under 10 MB.'); return; }
    setFile(next);
  }

  async function classify() {
    if (!file) { setError('Choose a waste image first.'); return; }
    setLoading(true); setError(''); setResult(null);
    const body = new FormData(); body.append('file', file);
    try {
      const response = await fetch(`${API}/predict`, { method: 'POST', body });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail || 'Prediction failed.');
      setResult(payload);
    } catch (e) {
      setError(`${e.message}. Make sure the FastAPI server is running at ${API}.`);
    } finally { setLoading(false); }
  }

  return (
    <main className="page">
      <nav className="nav"><div className="brand-mark">↻</div><span className="brand">WasteWise</span><span className="nav-tag">ENVIRONMENT · AI</span></nav>
      <section className="hero">
        <div className="eyebrow"><span className="pulse"/> AI-POWERED WASTE SEGREGATION</div>
        <h1>Waste less.<br/><span>Sort smarter.</span></h1>
        <p className="subtitle">Upload a photo of waste. Our pretrained image classifier predicts its category and suggests a responsible next step.</p>
      </section>

      <section className="workspace">
        <div className="upload-card">
          <div className="card-head"><div><span className="step">01</span><h2>Upload an item</h2></div><span className="format">JPG · PNG · WEBP</span></div>
          <label className={`dropzone ${preview ? 'has-image' : ''}`} htmlFor="image-input">
            {preview ? <img className="preview" src={preview} alt="Selected waste"/> : <div className="upload-placeholder"><div className="upload-icon">↑</div><strong>Drop an image here</strong><span>or click to browse your files</span></div>}
            <input id="image-input" type="file" accept="image/*" onChange={(e) => chooseFile(e.target.files?.[0])}/>
          </label>
          {file && <div className="file-row"><span className="file-dot"/>{file.name}<button className="text-button" onClick={() => { setFile(null); setResult(null); }}>Remove</button></div>}
          <button className="primary-button" disabled={!file || loading} onClick={classify}>{loading ? <><span className="spinner"/> Analysing image…</> : <>Identify waste <span>↗</span></>}</button>
          <p className="privacy-note">Image is processed by the local Python backend in this prototype.</p>
        </div>

        <div className="result-card">
          <div className="card-head"><div><span className="step">02</span><h2>Classification</h2></div><span className="live-label"><span/> MODEL OUTPUT</span></div>
          {!result && !error && <div className="empty-state"><div className="empty-illustration"><span>♻</span></div><h3>Your result will appear here</h3><p>Upload a clear image with one main item, preferably against a plain background.</p><div className="class-chips">{['Plastic','Paper','Glass','Metal','Cardboard','Trash'].map((x) => <span key={x}>{x}</span>)}</div></div>}
          {error && <div className="error-box"><strong>Couldn't classify this image</strong><p>{error}</p></div>}
          {result && <div className="result-content">
            <div className="predicted"><div className="category-icon">{iconFor[result.category] || '♻️'}</div><div><span className="result-overline">PREDICTED CATEGORY</span><h3>{pretty(result.category)}</h3></div><div className="confidence"><strong>{result.confidence_percent}%</strong><span>model score</span></div></div>
            {result.low_confidence && <div className="warning">Low score: try another, clearer image. Treat this prediction as uncertain.</div>}
            <div className="score-title">CATEGORY SCORES <span>MODEL ESTIMATES</span></div>
            <div className="scores">{Object.entries(result.scores).sort((a,b) => b[1]-a[1]).map(([name, score]) => <div className="score-row" key={name}><span>{pretty(name)}</span><div className="track"><div className={`fill ${name === result.category ? 'active' : ''}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }}/></div><b>{score.toFixed(1)}%</b></div>)}</div>
            <div className="guidance"><div className="guidance-icon">✓</div><div><span className="result-overline">DISPOSAL GUIDANCE</span><p>{result.guidance}</p></div></div>
            <p className="disclaimer">{result.note}</p>
          </div>}
        </div>
      </section>
      <section className="bottom-note"><div className="leaf">✳</div><div><strong>A small action makes a difference.</strong><p>Correct segregation can improve recycling and help keep recoverable materials out of landfills.</p></div></section>
      <footer><span>WASTEWISE / BCS508 ENVIRONMENTAL STUDIES</span><span>STUDENT PROTOTYPE · NOT A MUNICIPAL SERVICE</span></footer>
    </main>
  );
}
