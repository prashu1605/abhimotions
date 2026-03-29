import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import MyOrders from "./pages/MyOrders";
import Suggest from "./pages/Suggest";

function App() {
  return (
    <Routes>
       <Route path="/" element={<Landing />} />   {/* Landing page */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Landing />} />
      <Route path="/projects" element={<Projects />} />

      <Route path="/admin/orders" element={<AdminRoute> <AdminOrders /> </AdminRoute>} />
      <Route path="/my-orders" element={<MyOrders />} />
       <Route path="/suggest" element={<Suggest />} />
    </Routes>
  );
}

export default App;
