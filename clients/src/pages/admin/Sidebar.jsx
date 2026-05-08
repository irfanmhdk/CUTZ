import React, {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom'
import assets from '../../assets/assets'
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [user, setUser] = useState(null);
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    }

    useEffect(() => {
        if (hash) {
            const timeout = setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed top-4 z-50 p-2 cursor-pointer bg-primary text-sulfur rounded-md transition-all duration-300 ${isOpen ? 'left-53' : 'left-4'}`}>
                {isOpen ? <HiX size={24}/> : <HiMenuAlt3 size={24}/>}
            </button>

            <aside className={`bg-primary text-sulfur flex flex-col fixed h-full transition-all duration-300 z-40 overflow-hidden ${isOpen ? 'w-64' : 'w-0'}`}>
                <div className='p-6 flex flex-col items-center border-b border-sulfur/20 '>
                    <img src={assets.logo} className='w-20 mb-2' alt="Logo"/>
                </div>

                <nav className='flex-1 p-4 space-y-2 mt-4'>
                    <Link to="/admin"
                          className='block px-4 py-3 rounded-lg border border-sulfur text-sulfur hover:bg-sulfur hover:text-primary font-bold'>
                        Dashboard
                    </Link>
                    <Link to="/admin/bookings" className='block px-4 py-3 rounded-lg hover:bg-sulfur/10 transition-all'>
                        Boooking
                    </Link>
                    <Link to="/admin/jadwal"
                          className='block px-4 py-3 rounded-lg hover:bg-sulfur/10 text-sulfur font-bold'>
                        Schedule
                    </Link>
                    <Link to="/admin/services" className='block px-4 py-3 rounded-lg hover:bg-sulfur/10 transition-all'>
                        Services
                    </Link>
                    <Link to="/admin/barbers" className='block px-4 py-3 rounded-lg hover:bg-sulfur/10 transition-all'>
                        Kapster
                    </Link>
                    <Link to="/admin/user" className='block px-4 py-3 rounded-lg hover:bg-sulfur/10 transition-all'>
                        Users
                    </Link>

                    <Link to="/admin/order"
                          className='block px-4 py-3 rounded-lg bg-sulfur hover:bg-sulfur/80 text-primary font-bold'>Book
                        Now</Link>
                </nav>

                <div className='p-4 border-t border-sulfur/20'>
                    <Link onClick={handleLogout}
                          className='block px-4 py-2 text-center text-sm bg-red-700 hover:bg-red-900 text-white rounded-lg'>
                        Logout
                    </Link>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 sm:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    )
}

export default Sidebar