import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardP from "./pages/DashboardP";
import LoginP from "./pages/LoginP";
import NotFoundP from "./pages/NotFoundP";
import LayoutAdmin from "./components/layout";
import StudentsP from "./pages/StudentsP";
import TeachersP from "./pages/TeachersP";

function App() {
  const isAuth = true;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuth ? <Navigate to="/dashboard" /> : <Navigate to="login" />
          }
        />
        <Route path="/" element={<LayoutAdmin />}>
          <Route path="dashboard" element={<DashboardP />} />
          <Route path="students" element={<StudentsP />} />
          <Route path="teachers" element={<TeachersP />} />
        </Route>
        <Route path="/login" element={<LoginP />} />
        <Route path="*" element={<NotFoundP />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
