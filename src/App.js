import logo from './logo.svg';
import './App.css';
import Reader from "./components/Reader";
import {HashRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
      /**
    <div className="App">

        <HashRouter>
          <Routes>
              <Route path="/hdtv" element={<Reader/>}/>
              <Route path="/" element={<p>John Schultz's Website</p>}/>
          </Routes>
      </HashRouter>
    </div>
        **/
      <div className="App">
          <Reader />
      </div>
  );
}

export default App;
