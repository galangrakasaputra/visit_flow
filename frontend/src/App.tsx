import { BrowserRouter, Routes, Route } from "react-router";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Entitas from "./pages/Entitas";
// import Kunjungan from "./pages/Kunjungan";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/Dashboard/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman yang membutuhkan autentikasi */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/entitas" element={<Entitas />} />
            {/* <Route path="/kunjungan" element={<Kunjungan />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;