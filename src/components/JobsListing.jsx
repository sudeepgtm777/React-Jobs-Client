import React from 'react';
import { useState, useEffect } from 'react';
import JobListing from './JobListing';
import Spinner from './spinners';

const BACKEND_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:3000';
// const BACKEND_URL = 'http://localhost:3000';

const JobsListing = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = isHome
        ? `${BACKEND_URL}/api/jobs?_limit=3`
        : `${BACKEND_URL}/api/jobs`;
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setJobs(data.data.jobs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>

        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {isHome
              ? jobs
                  .slice(0, 3)
                  .map((job) => <JobListing key={job._id} job={job} />)
              : jobs.map((job) => <JobListing key={job._id} job={job} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsListing;
