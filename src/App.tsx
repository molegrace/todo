import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import TestPage from "./pages/TestPage";

function App() {
  return (
<>
<Navbar title="Todo App" />
  <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/test" element={<TestPage />} /> 
    </Routes>
 </>
  );
 

  
}

export default App;
