import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './layouts/auth/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
