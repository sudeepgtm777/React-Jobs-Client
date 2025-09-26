import React, { useState } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from './context/UserContext';

import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage, { jobLoader } from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import SignUp from './pages/SignupPage';
import Login from './pages/LoginPage';

const BACKEND_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:3000';

const App = () => {
  const [user, setUser] = useState(null); // ✅ user context state

  const API_BASE = `${BACKEND_URL}/api/jobs`;

  // Add Job
  const addJob = async (newJob) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // include httpOnly cookies
        body: JSON.stringify(newJob),
      });

      if (!res.ok) throw new Error('Failed to add job');
      return await res.json();
    } catch (err) {
      toast.error(err.message || 'Error adding job');
      console.error(err);
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete job');
      return true;
    } catch (err) {
      toast.error(err.message || 'Error deleting job');
      console.error(err);
      return false;
    }
  };

  // Update Job
  const updateJob = async (job) => {
    try {
      const res = await fetch(`${API_BASE}/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error('Failed to update job');
      return await res.json();
    } catch (err) {
      toast.error(err.message || 'Error updating job');
      console.error(err);
    }
  };

  // ✅ ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    React.useEffect(() => {
      if (!user) {
        toast.info('Please login to continue', { toastId: 'auth-error' });
      }
    }, [user]);

    if (!user) {
      return <Navigate to='/sign-in' replace />;
    }

    return children;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/jobs' element={<JobsPage />} />

        <Route
          path='/add-job'
          element={
            <ProtectedRoute>
              <AddJobPage addJobSubmit={addJob} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/edit-job/:id'
          element={
            <ProtectedRoute>
              <EditJobPage updateJobSubmit={updateJob} />
            </ProtectedRoute>
          }
          loader={jobLoader}
        />
        <Route
          path='/jobs/:id'
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoader}
        />

        <Route path='*' element={<NotFoundPage />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<Login />} />
      </Route>
    )
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
};

export default App;
