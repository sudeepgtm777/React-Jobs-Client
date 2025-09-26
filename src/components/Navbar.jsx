import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import UserContext from '../context/UserContext';

const BACKEND_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:3000';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  // Check login state on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/users/isLoggedIn`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok && data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkLogin();
  }, [setUser]);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${BACKEND_URL}/api/v1/users/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);
      setLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const LinkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <nav className='bg-indigo-700 border-b border-indigo-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/'>
              <img className='h-10 w-auto' src={logo} alt='React Jobs' />
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                Jobs
              </span>
            </NavLink>
            <div className='md:ml-auto'>
              <div className='flex space-x-2'>
                <NavLink to='/' className={LinkClass}>
                  Home
                </NavLink>
                <NavLink to='/jobs' className={LinkClass}>
                  Jobs
                </NavLink>
                <NavLink to='/add-job' className={LinkClass}>
                  Add Job
                </NavLink>

                {user ? (
                  <>
                    <span className='bg-green-500 hover:bg-green-700 text-white rounded-md px-3 py-2 cursor-pointer'>
                      {user.name.split(' ')[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      className={LinkClass({ isActive: false })}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to='/sign-up' className={LinkClass}>
                      Sign Up
                    </NavLink>
                    <NavLink to='/sign-in' className={LinkClass}>
                      Login
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
