'use client'
// Import necessary dependencies and components
import useAuthStore from '@/zustand/auth.zustand';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

const Signup: FC = () => {
  const router = useRouter();
  const { signUp, isLoggedin } = useAuthStore();

  const [signupData, setSignupData] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
    file?: File | null;
  }>({
    name: '',
    email: '',
    password: '',
    role: '',
    file: null,
  });

  // State variables for validation errors
  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
  }>({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  // State variable for password visibility
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedin) {
      router.push('/');
    }
  }, [isLoggedin]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    // Reset validation errors
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSignupData({ ...signupData, file: file });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    // Validate form data before submission
    const isValid = validateForm();
    if (isValid) {
      try {
        await Promise.all([signUp(signupData)]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setErrors({
      name: '',
      email: '',
      password: '',
      role: '',
    });

    // Validate name
    if (!signupData.name.trim()) {
      setErrors((prevState) => ({ ...prevState, name: 'Name is required' }));
      isValid = false;
    }

    // Validate email
    if (!signupData.email.trim()) {
      setErrors((prevState) => ({ ...prevState, email: 'Email is required' }));
      isValid = false;
    } else if (!isValidEmail(signupData.email)) {
      setErrors((prevState) => ({ ...prevState, email: 'Invalid email format' }));
      isValid = false;
    }

    // Validate password
    if (!signupData.password.trim()) {
      setErrors((prevState) => ({ ...prevState, password: 'Password is required' }));
      isValid = false;
    } else if (!isValidPassword(signupData.password)) {
      setErrors((prevState) => ({ ...prevState, password: 'Password must be at least 8 characters long' }));
      isValid = false;
    }

    // Validate role
    if (!signupData.role.trim()) {
      setErrors((prevState) => ({ ...prevState, role: 'Role is required' }));
      isValid = false;
    }

    return isValid;
  };

  // Function to validate email format
  const isValidEmail = (email: string): boolean => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to check password strength
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Registration
        </h1>
        <div className="mt-6">
          <div className="mb-2 relative rounded-full overflow-hidden w-24 h-24 mx-auto">
            <img src={signupData.file ? URL.createObjectURL(signupData.file) : '/default-avatar.png'} alt="Selected Image" className="object-cover w-full h-full" />
          </div>
          <div className="mb-2">
            <label htmlFor="profileImage" className="block text-sm font-semibold text-gray-800">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={handleFileInputChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={handleInputChange}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-purple-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-800">
              Role
            </label>
            <select
              name="role"
              id="role"
              className="border border-purple-700 rounded-md p-2 outline-purple-700"
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="user">Reader</option>
              <option value="writer">Writer</option>
            </select>
            {errors.role && <p className="text-red-500">{errors.role}</p>}
          </div>
          <div className="mt-6" onClick={handleSubmit}>
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
              Signup
            </button>
          </div>
        </div>
        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-purple-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
