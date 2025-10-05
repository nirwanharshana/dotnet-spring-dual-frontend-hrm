import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Layout } from "./components/Layout";
import { ProjectList } from "./pages/ProjectList";
import { DepartmentList } from "./pages/DepartmentList";
import { EmployeeList } from "./pages/EmployeeList";

function App() {
  return (
    <BrowserRouter>
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
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="employees" element={<EmployeeList />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="projects" element={<ProjectList />} />
          <Route index element={<Navigate to="/employees" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
