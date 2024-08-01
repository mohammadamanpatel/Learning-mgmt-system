import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeLayout } from '../layouts/HomeLayout';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../redux/slices/authSlice';


export const Login = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setLoginDetails({
      ...loginDetails,
      [name]: value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!loginDetails.email || !loginDetails.password) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      const actionResult = await dispatch(login(loginDetails));
      const { payload } = actionResult;

      if (payload) {
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error(payload?.message || 'Login failed');
      }
    } catch (error) {
      console.log('Error during login:', error);
      toast.error('Login failed');
    }

    setLoginDetails({
      email: '',
      password: '',
    });
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-screen">
        <form
          noValidate
          onSubmit={handleLogin}
          className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg text-white w-80 md:w-96 lg:w-[30vw]"
        >
          <h1 className="text-2xl font-bold text-center">Login Page</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              onChange={handleUserInput}
              value={loginDetails.email}
              required
              type="email"
              name="email"
              className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700"
              placeholder="Enter your Email..."
              id="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              onChange={handleUserInput}
              value={loginDetails.password}
              required
              type="password"
              name="password"
              className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700"
              placeholder="Enter your Password..."
              id="password"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-800 hover:bg-yellow-500 transition-all ease-in-out duration-300 py-2 font-semibold text-lg rounded-md"
          >
            Login
          </button>
          <p className="text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};
