import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import App from './App.tsx';
import { loadStorage } from './services/storage';
import './index.css';

function Site() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const load = async () => {
    setError(false);
    try { await loadStorage(); setReady(true); } catch { setError(true); }
  };
  useEffect(() => {
    void load();
    const onStatus = (event: Event) => setSaveStatus((event as CustomEvent<string>).detail);
    window.addEventListener('dhco-storage-status', onStatus);
    return () => window.removeEventListener('dhco-storage-status', onStatus);
  }, []);
  if (!ready) return <main className="min-h-screen flex items-center justify-center p-8"><div className="max-w-md w-full space-y-6 text-center"><h1 className="font-display text-3xl text-brand-gold">DH&amp;Co</h1>{error ? <><p role="alert">Your demo session could not be loaded. Please try again.</p><button onClick={load} className="bg-brand-darkred border border-brand-gold rounded-xl px-6 py-3">Try again</button></> : <><p role="status">Opening Daily Heaven &amp; Company…</p><div className="h-32 rounded-2xl bg-white/5 animate-pulse" /></>}</div></main>;
  return <><div className="bg-[#211b10] text-[#E1C574] text-center text-xs px-4 py-2" role="status">Demo marketplace · Sample products and orders · No real payments or fulfillment.{saveStatus === 'saving' && ' Saving changes…'}{saveStatus === 'error' && ' Changes could not be saved. Retrying…'}</div><App /></>;
}

createRoot(document.getElementById('root')!).render(<Site />);
