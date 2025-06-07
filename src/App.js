import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Post/Signup";
import Login from "./Post/Login";
import Posts from "./Post/Posts";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='login' element={<Login/>} />
          <Route path='posts' element={<Posts />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
