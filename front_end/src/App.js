
import './App.css';
import {Route,Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
       <Routes>
          <Route path="/login" element={< LoginPage />}/>
          
          <Route path="/" element={<ChatPage />} />
       
      </Routes>
     
    </div>
  );
}

export default App;
