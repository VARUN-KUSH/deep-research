"use client"; // This page must be a Client Component

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// --- Your Hardcoded Credentials ---
// ! These are visible in the browser's source code
const ADMIN_USERNAME = "deepresearch@123";
const ADMIN_PASSWORD = "reportscreation@123";
// ----------------------------------

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // 1. Credentials are correct!
            setError('');

            // 2. Set a flag in sessionStorage
            // This "remembers" the login just for this tab
            sessionStorage.setItem('isLoggedIn', 'true');

            // 3. Route to the main tool page
            router.push('/');
        } else {
            // Credentials are wrong
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {/* <h2 className="text-2xl font-bold text-center text-gray-900">
          Noah Research - Login
        </h2> */}
        <div className='flex justify-center mb-4'>
        <img
                    src="/icon.png"
                    width="250"
                    height="250"
                    alt="NOAH Research Logo"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/250x250/e0e7ff/3730a3?text=NOAH'; }} // Fallback placeholder
                />
        </div>
               
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full text-black px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 text-black py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-center text-red-600">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}