import 'antd/dist/antd.min.css';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import { CartPage } from './pages/CartPage';
import HomePage from './pages/HomePage';
import ItemPage from './pages/ItemPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerPage from './pages/CustomerPage';
import BillsPage from './pages/BillsPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }/>
          <Route path="/items" element={
              <ProtectedRoute>
                <ItemPage />
              </ProtectedRoute>
            }/>
          <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }/>
            <Route path="/bills" element={
              <ProtectedRoute>
                <BillsPage />
              </ProtectedRoute>
            }/>
            <Route path="/customers" element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            }/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
