import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userLogo from '../../src/img/user.png';
import applogo from '../../src/img/iloilosupermart.png'
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../V2View/component/NotificationBell';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const TopNavigation = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTicketEntryOpen, setIsTicketEntryOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);

    const toggleManagementDropdown = () => {
        setIsManagementDropdownOpen(!isDropdownOpen);
    };
    const closeManagementDropdown = () => {
        setIsManagementDropdownOpen(false);
    };
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const openTicketEntry = () => {
        setIsTicketEntryOpen(true);
    };

    const closeTicketEntry = () => {
        setIsTicketEntryOpen(false);
    };

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setIsManagementDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <nav className="bg-slate-300 text-white p-2 fixed top-0 left-0 w-full z-10">
            <div className="mx-auto flex justify-between items-center pl-12 pr-12">
                <div className="flex items-center space-x-12">
                    <Link to="/">
                        <img src={applogo} alt="Logo" className="w-auto h-12 cursor-pointer mt-2" />
                    </Link>
                 
                    {/* <Link to="/home" className="text-black font-bold no-underline transition duration-300 hover:text-blue-500">HOME</Link> */}

                    <div className="relative">
                        <span
                            onClick={toggleManagementDropdown}
                            className="text-black font-bold no-underline transition duration-300 hover:text-blue-500 cursor-pointer"
                        >
                            MANAGEMENT
                        </span>
                        {isManagementDropdownOpen && (
                            <div ref={dropdownRef} className="absolute left-0 mt-2 space-y-1 flex flex-col bg-white shadow-md p-3 rounded w-48 text-left">
                                <Link onClick={closeManagementDropdown} to="/assets" className="p-2 text-black font-bold no-underline transition duration-300 hover:text-blue-500">ASSETS</Link>
                                {/* <Link onClick={closeManagementDropdown} to="/documenttype" className="p-2 text-black font-bold no-underline transition duration-300 hover:text-blue-500">DOCUMENT TYPE</Link> */}
                                <Link onClick={closeManagementDropdown} to="/users" className="p-2 text-black font-bold no-underline transition duration-300 hover:text-blue-500">USERS</Link>
                                <Link onClick={closeManagementDropdown} to="/branches" className="p-2 text-black font-bold no-underline transition duration-300 hover:text-blue-500">BRANCHES</Link>
                            </div>
                        )}
                    </div>
                    <Link to="/" className="text-black font-bold no-underline transition duration-300 hover:text-blue-500">TICKETS</Link>
                    {/* <Link to="/" className="text-black font-bold no-underline transition duration-300 hover:text-blue-500">TICKETS</Link> */}
                    <Link to="/ticketentry" className="text-black font-bold no-underline transition duration-300 hover:text-blue-500">CREATE TICKET</Link>
                </div>
                <div className="relative flex items-center">
                    <span className="mr-4 text-black font-bold">Hi {localStorage.getItem('fullname')}</span>
                    <button onClick={toggleDropdown} className="focus:outline-none flex items-center text-black">
                        <img src={userLogo} alt="User" className="w-10 h-10 rounded-full cursor-pointer" />
                    </button>
                    <NotificationBell />
                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute top-full right-18 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition-transform duration-300 transform translate-y-1"
                        >
                            <div className="py-1">
                                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={closeDropdown}>
                                    Profile
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={closeDropdown}>
                                    Settings
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-red-500 font-bold" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default TopNavigation;
