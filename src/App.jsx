import { Route, Routes, useLocation } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../src/styles/toaststyles.css";

import Login from "./pages/Login";
import Mold from "./pages/Mold";
import Part from "./pages/Part";
import Operation from "./pages/Operation";
import Material from "./pages/Material";
import Machine from "./pages/Machine";
import CustomNavBar from "./components/CustomNavBar";
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && <CustomNavBar/>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/molds"
          element={<ProtectedRoute targetPage={<Mold />} />}
        />
        <Route
          path="/parts"
          element={<ProtectedRoute targetPage={<Part />} />}
        />
        <Route
          path="/operations"
          element={<ProtectedRoute targetPage={<Operation />} />}
        />
        <Route
          path="/materials"
          element={<ProtectedRoute targetPage={<Material />} />}
        />
        <Route
          path="/machines"
          element={<ProtectedRoute targetPage={<Machine />} />}
        />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
