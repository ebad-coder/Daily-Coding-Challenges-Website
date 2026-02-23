import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChallengeWorkspace from './components/ChallengeWorkspace';
import AdminPanel from './components/AdminPanel';

function App() {
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
