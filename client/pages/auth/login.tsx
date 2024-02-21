'use client'
// Import necessary dependencies and components
import useAuthStore from '@/zustand/auth.zustand';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';
import { ColorRing } from 'react-loader-spinner';

const Login: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { isLoggedin } = useAuthStore()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    let isLoggedin: any = localStorage.getItem('Auth');
    isLoggedin = JSON.parse(isLoggedin);
    isLoggedin = isLoggedin?.state?.isLoggedin;
    if (isLoggedin) {
      router.push('/')
    } else {
      router.push('/auth/login')
    }
  }, [])

  const { login } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async () => {
    let valid = true;
    const errorsCopy = { ...errors };

    // Email validation
    if (!loginData.email.trim()) {
      errorsCopy.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(loginData.email)) {
      errorsCopy.email = 'Invalid email address';
      valid = false;
    } else {
      errorsCopy.email = '';
    }

    // Password validation
    if (!loginData.password.trim()) {
      errorsCopy.password = 'Password is required';
      valid = false;
    } else {
      errorsCopy.password = '';
    }

    setErrors(errorsCopy);

    if (valid) {
      try {
        setLoading(true);
        await Promise.all([login(loginData)]);
        setLoading(false)
        if (isLoggedin) {
          router.push('/');
        } else {
          router.push('/auth/login')
        }
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  // Regular expression for email validation
  const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(String(email).toLowerCase());
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Sign in
        </h1>
        <div className="mt-6">
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 ${errors.email && 'border-red-500'}`}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : "password"}
                id="password"
                name="password"
                className={`block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 ${errors.password && 'border-red-500'}`}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-purple-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <Link
            href="/auth/forget-password"
            className="text-xs text-purple-600 hover:underline"
          >
            Forget Password?
          </Link>
          <div className="mt-6" onClick={handleSubmit}>
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600 flex justify-center items-center">
              {loading ? (
                <span className='flex gap-3'>
                  <ColorRing
                    visible={true}
                    height="25"
                    width="25"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                  />
                  <span>Logging...</span>
                </span>
              ) : 'Login'}
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-purple-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
