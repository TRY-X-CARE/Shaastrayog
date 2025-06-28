import React, { useState } from 'react';
import Link from 'next/link';
import { CNavbar, CContainer, CNavbarBrand, CNavbarToggler, CCollapse, CNav, CNavItem, CNavLink, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import { Sun, Moon, User } from 'lucide-react';

const AdminPanelHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleNavbar = () => setIsOpen(!isOpen);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <CNavbar expand="lg" className={`shadow-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <CContainer fluid>
                <CNavbarBrand href="/admin">Admin Panel</CNavbarBrand>
                <CNavbarToggler onClick={toggleNavbar} />
                <CCollapse className="lg:flex flex-grow items-center" visible={isOpen}>
                    <CNav className="ml-auto flex items-center space-x-4">
                        <CNavItem>
                            <CNavLink href="/admin/dashboard">Dashboard</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink href="/admin/users">Users</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink href="/admin/settings">Settings</CNavLink>
                        </CNavItem>
                        <button onClick={toggleTheme} className="p-2 rounded-full transition-colors">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <CDropdown>
                            <CDropdownToggle color="transparent" className="flex items-center">
                                <User size={24} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem href="/admin/profile">Profile</CDropdownItem>
                                <CDropdownItem href="/logout">Logout</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </CNav>
                </CCollapse>
            </CContainer>
        </CNavbar>
    );
};

export default AdminPanelHeader;
