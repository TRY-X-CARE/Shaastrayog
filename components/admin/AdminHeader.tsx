import React, { useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

const AdminPanelHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleNavbar = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <nav className="shadow-lg bg-white text-gray-900">
            <div className="container mx-auto px-4 flex items-center justify-between py-3">
                <Link href="/admin" className="font-bold text-lg">Admin Panel</Link>
                <div className="lg:hidden">
                    <button onClick={toggleNavbar} className="p-2 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
                <div className={`flex-col lg:flex-row lg:flex items-center space-y-2 lg:space-y-0 lg:space-x-4 ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
                    <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
                    <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">Users</Link>
                    <Link href="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-100">Settings</Link>
                    <div className="relative ml-2">
                        <button onClick={toggleDropdown} className="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                            <User size={24} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20">
                                <Link href="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                <Link href="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminPanelHeader;
