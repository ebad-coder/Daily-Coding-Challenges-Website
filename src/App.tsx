import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChallengeWorkspace from './components/ChallengeWorkspace';
import AdminPanel from './components/AdminPanel';
import { supabaseConfigError } from './lib/supabase';

function App() {
  if (supabaseConfigError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-gray-800 border border-red-700/60 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-red-400 mb-3">Configuration Error</h1>
          <p className="text-gray-200 mb-4">{supabaseConfigError}</p>
          <p className="text-gray-400 text-sm">
            Create a <code className="text-gray-200">.env</code> file from{' '}
            <code className="text-gray-200">.env.example</code>, then restart the Vite dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChallengeWorkspace />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
