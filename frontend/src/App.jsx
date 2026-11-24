import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import PublicRoutes from '../components/routes/publicRoutes'
import ProtectedRoutes from '../components/routes/protectedRoutes'
import Home from '../pages/HomePage'
import { useConnectionSocket } from './hooks/useConnectionSocket'
import './App.css'

function App() {
  useConnectionSocket()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App