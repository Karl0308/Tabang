import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import applogo from '../img/iloilosupermart.png';
// import LoadPage from './components/LoadPage';
import axios from 'axios';
import { APIURLS } from '../APIURLS';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    // const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = () => {

        if (username.length > 0 || password.length > 0) {
            // Redirect to dashboard if login successful
            // localStorage.setItem('login','login');
            // navigate('/');

            setIsLoading(true);
            // axios.post(APIURLS.user.login, {
            //     username,
            //     password,
            // })
            //     .then(res => {
            //         setIsLoading(false);
            //         localStorage.setItem('token', res.data.token);
            //         localStorage.setItem('fullname', res.data.fullName);
            //         localStorage.setItem('roletext', res.data.roleText);
            //         localStorage.setItem('role', res.data.role);
            //         localStorage.setItem('id', res.data.id);
            //         window.location.href = '/home';

            //     }).catch(function (error) {
            //         setError('Invalid username or password');
            //     });
            const login = axios.post(APIURLS.user.login, {
                username,
                password,
            })
                .then(res => {
                    setIsLoading(false);
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('fullname', res.data.fullName);
                    localStorage.setItem('roletext', res.data.roleText);
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('id', res.data.id);
                    localStorage.setItem('departmentbase', res.data.departmentBase);
                    window.location.href = '/istest';
                });

            toast.promise(
                login,
                {
                    pending: "Logging In...",
                    success: "Successfully Login!",
                    error: "Invalid username or Password"
                },
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light"
                }
            );

        } else {
            setError('Please fill Username or Password');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300">
            <div className="max-w-2xl w-full bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
                <div className="text-center my-4">
                    <img src={applogo} alt="Logo" className="inline-block cursor-pointer" width={400} />
                </div>
                <h1 className="text-center text-3xl font-extrabold text-black mb-8">ILOILO SUPERMART TICKET SYSTEM</h1>
                <form
                    className="space-y-6"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Prevents default form submission behavior
                            handleLogin();
                        }
                    }}
                >
                    <div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-400 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-slate-400 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                            placeholder="Password"
                        />
                    </div>
                    <div className="text-red-500">{error}</div>
                    <div className="flex justify-between items-center">
                        <div>
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-600 rounded transition-all duration-300"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-gray-900">Remember me</label>
                        </div>
                        <a href="#" className="text-blue-600 hover:text-blue-400 transition-colors duration-300">Forgot your password?</a>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                    >
                        Sign in
                    </button>
                </form>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>

    );
};

export default Login;
