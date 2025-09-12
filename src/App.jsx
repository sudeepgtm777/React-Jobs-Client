import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage, { jobLoader } from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import SignUp from './pages/SignupPage';
import Login from './pages/LoginPage';

const App = () => {
  const API_BASE = '/api/jobs'; // Backend base URL

  // Add new Job
  const addJob = async (newJob) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
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
        method: 'PATCH', // PATCH to match backend
        headers: { 'Content-Type': 'application/json' },
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
        <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob} />} />
        <Route
          path='/edit-job/:id'
          element={<EditJobPage updateJobSubmit={updateJob} />}
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
