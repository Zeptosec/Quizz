import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Test from './pages/Test';
import Leaderboard from './pages/Leaderboard';
import { useRef } from 'react';

function App() {
  const { user } = useAuthContext();
  const tref = useRef();

  window.addEventListener('resize', function () {
    if(!tref.current) return;
    tref.current.style.maxHeight = `${window.innerHeight - 145}px`;
  })

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div ref={tref} className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            {/* <Route path='/test' element={!user ? <Navigate to="/login" /> : <Test />} /> */}
            <Route path='/test' element={<Test />} />
            <Route path='/admin' element={(user !== null && user.email === "virgil@gmail.com") ? <Admin /> : <Navigate to="/" />} />
            <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path='/signup' element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
