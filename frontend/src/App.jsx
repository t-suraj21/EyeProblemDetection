import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResultProvider } from './context/ResultContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import SuggestionsPage from './pages/SuggestionsPage';
import DoctorsPage from './pages/DoctorsPage';
import './App.css';

function App() {
  return (
    <ResultProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/result/:scanId" element={<ResultPage />} />
              <Route path="/suggestions/:problem" element={<SuggestionsPage />} />
              <Route path="/doctors/:city" element={<DoctorsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ResultProvider>
  );
}

export default App;
