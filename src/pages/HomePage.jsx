import React from 'react';
import Hero from '../components/Hero';
import HomeCards from '../components/HomeCards';
import JobsListing from '../components/JobsListing';
import ViweAllJobs from '../components/ViewAllJobs';

const Homepage = () => {
  return (
    <>
      <Hero title='Jobs' subtitle='The place for developers to find job' />
      <HomeCards />
      <JobsListing isHome={true} />
      <ViweAllJobs />
    </>
  );
};

export default Homepage;
