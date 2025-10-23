import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainMenu } from './pages/MainMenu';
import { Game } from './pages/Game';
import { Stats } from './pages/Stats';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game/:levelId" element={<Game />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
