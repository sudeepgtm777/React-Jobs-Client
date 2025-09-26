import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate, // <-- added
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (res.status === 401) {
          toast.info('Please login to continue', { toastId: 'auth-error' });
          setAuthorized(false);
        } else {
          setAuthorized(res.ok);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!authorized) return <Navigate to='/sign-in' replace />;
  return children;
};
const App = () => {
  const API_BASE = import.meta.env.VITE_REACT_APP_BACKEND_URL
    ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/jobs`
    : 'http://localhost:3000/api/jobs';

  // Add new Job
  const addJob = async (newJob) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newJob),
      });

      if (!res.ok) throw new Error('Failed to add job');
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a Job
  const deleteJob = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete job');
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update a Job
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
      console.error(err);
    }
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

  return <RouterProvider router={router} />;
};

export default App;
