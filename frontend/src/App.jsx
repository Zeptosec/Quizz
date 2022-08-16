import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import AddNew from './pages/AddNew';
import ViewTasks from './pages/ViewTasks';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/admin/new" element={<AddNew />} />
            <Route path="/admin/view" element={<ViewTasks />} />
            <Route path='/admin' element={<Admin />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
