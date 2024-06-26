import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FiMenu } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/Footer';
import { logout } from '../redux/slices/authSlice';

export const HomeLayout = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);
  const navigate = useNavigate();

  const changeWidth = () => {
    const drawerSide = document.querySelector('.drawer-side');
    if (drawerSide) {
      drawerSide.style.width = 'auto';
    }
  };

  const hideDrawer = () => {
    const drawerToggle = document.querySelector('.drawer-toggle');
    const drawerSide = document.querySelector('.drawer-side');
    if (drawerToggle) {
      drawerToggle.checked = false;
    }
    if (drawerSide) {
      drawerSide.style.width = '0';
    }
  };

  const onLogout = (e) => {
    e.preventDefault();
    if (dispatch(logout())) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="drawer absolute left-0 z-50 w-full">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center justify-between p-4  text-white">
          <label htmlFor="my-drawer" className="cursor-pointer">
            <FiMenu onClick={changeWidth} size="32px" className="text-white" />
          </label>
        </div>
        <div className="drawer-side w-0 md:w-64">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 bg-gray-800 text-white flex flex-col justify-between h-full">
            <div>
              <li className="w-full flex justify-end mb-4">
                <button onClick={hideDrawer}>
                  <AiFillCloseCircle size={24} />
                </button>
              </li>
              <li>
                <Link to="/" onClick={hideDrawer}>Home</Link>
              </li>
              {isLoggedIn && role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/Admin/Dashboard" onClick={hideDrawer}>Admin Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/course/create" onClick={hideDrawer}>Create Course</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/about" onClick={hideDrawer}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" onClick={hideDrawer}>Contact Us</Link>
              </li>
              <li>
                <Link to="/courses" onClick={hideDrawer}>All Courses</Link>
              </li>
            </div>
            <div className="flex flex-col space-y-2">
              {!isLoggedIn ? (
                <>
                  <button className="btn btn-primary w-full">
                    <Link to="/login">Log In</Link>
                  </button>
                  <button className="btn btn-primary w-full">
                    <Link to="/signup">Sign Up</Link>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline btn-accent w-full">
                    <Link to="/user/profile">Profile</Link>
                  </button>
                  <button className="btn btn-outline btn-accent w-full" onClick={onLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};
