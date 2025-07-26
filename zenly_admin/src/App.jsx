import { Route, Routes } from "react-router-dom";
import Login from "./Layouts/Authentication/Login";
import Register from "./Layouts/Authentication/Register";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
