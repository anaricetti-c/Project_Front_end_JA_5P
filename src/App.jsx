import { Route, Routes, useLocation } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../src/Styles/toaststyles.css";

import Login from "./Pages/Login";
import Mold from "./Pages/Mold";
import Part from "./Pages/Part";
import Operation from "./Pages/Operation";
import Material from "./Pages/Material";
import NavBar from "./Components/NavBar";
import ProtectedRoute from "./Pages/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && <NavBar />}
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
          path="/operation"
          element={<ProtectedRoute targetPage={<Operation />} />}
        />
        <Route
          path="/material"
          element={<ProtectedRoute targetPage={<Material />} />}
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
