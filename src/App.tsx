import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import TestPage from "./pages/TestPage";
import ContactUs from "./pages/ContactUs";
import AboutPage from "./pages/AboutPage";
import Homepage from "./pages/Homepage";

function App() {
  return (
<>
<Navbar title="Todo App" />
  <Routes>
    <Route path="/" element={<Homepage/>} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/contact" element={<ContactUs/>} />
      <Route path="/about" element={<AboutPage/>} />
    </Routes>
 </>
  );
 

  
}

export default App;
