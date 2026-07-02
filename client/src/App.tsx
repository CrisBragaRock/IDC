import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import IdeaDetail from './pages/IdeaDetail';
import NewIdea from './pages/NewIdea';
import MyIdeas from './pages/MyIdeas';
import AdminFeatures from './pages/admin/Features';
import AdminAudit from './pages/admin/Audit';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FeatureFlagProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/idea/:ideaSlug" element={<IdeaDetail />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/new" element={<NewIdea />} />
                  <Route path="/mine" element={<MyIdeas />} />
                </Route>

                <Route element={<RoleRoute roles={['admin']} />}>
                  <Route path="/admin/features" element={<AdminFeatures />} />
                  <Route path="/admin/audit" element={<AdminAudit />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </FeatureFlagProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
