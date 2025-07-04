import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import CreateBlog from "./components/CreateBlog";
import { Toaster } from "react-hot-toast";
import BlogList from "./components/BlogList";
import BlogHome from "./components/BlogHome";
import BlogDetail from "./components/BlogDetail";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        {/* <Route path="/" element={<Index />} /> */}
          <Route path="/" element={<BlogHome />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/admin/login" element={<Login />} />
        {/* <Route path="/admin/signup" element={<Signup />} /> */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
        <Route
          path="admin/create-blog"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CreateBlog />} />
        </Route>
        <Route
          path="admin/blog-list"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BlogList />} />
        </Route>
        <Route
          path="admin/blog-edit/:id"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CreateBlog />} />
        </Route>
        {/* <Route path="/settings" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            
            <Route index element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
