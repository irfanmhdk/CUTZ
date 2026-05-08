import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import { motion } from 'motion/react'
import { GiPadlock, GiPowerButton } from "react-icons/gi"; // Tambah icon power untuk logout
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState(null); // State untuk menyimpan data login
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
        <motion.div
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, ease: 'easeOut'}}
            className='relative flex justify-between text-trey items-center py-5 px-4 sm:px-12 lg:px-24 xl:px-40 sticky top-0 z-50 backdrop-blur-xl font-medium bg-primary/50'
        >

            <div className='flex-1 flex justify-start'>
                <Link to="/">
                    <img src={assets.logo} className='max-w-23 max-h-23'/>
                </Link>
            </div>

            <div className={`sm:text-sm ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-60 max-sm:pl-10'} max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-primary max-sm:text-sulfur max-sm:pt-20 flex sm:items-center gap-10 transition-all`}>

                <img src={assets.close_icon} alt="" className="w-5 absolute right-4 top-4 sm:hidden" onClick={() => setSidebarOpen(false)}/>

                <Link to="/#beranda" className='hover:text-sulfur transition-colors' onClick={() => setSidebarOpen(false)}>Home</Link>
                <Link to="/#servis" className='hover:text-sulfur transition-colors' onClick={() => setSidebarOpen(false)}>Services</Link>
                <Link to="/#tentang" className='hover:text-sulfur transition-colors' onClick={() => setSidebarOpen(false)}>About</Link>
                <Link to="/#kontak" className='hover:text-sulfur transition-colors' onClick={() => setSidebarOpen(false)}>Find Us</Link>

                <div className='text-sm sm:hidden flex flex-col gap-4'>
                    <Link to="/bookings" onClick={() => setSidebarOpen(false)} className='text-primary px-5 py-3 rounded-full w-fit bg-sulfur font-bold'>Book Now</Link>

                    {/* Logika Tombol Mobile */}
                    {!user ? (
                        <button onClick={() => { setShowLogin(true); setSidebarOpen(false); }} className="flex items-center justify-center gap-2 text-primary px-5 py-3 rounded-full w-fit bg-sulfur font-bold">
                            Login <GiPadlock/>
                        </button>
                    ) : (
                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-white px-5 py-3 rounded-full w-fit bg-red-600 font-bold">
                            Logout <GiPowerButton/>
                        </button>
                    )}
                </div>
            </div>

            <div className='flex-1 flex justify-end items-center gap-4'>
                <div className='flex items-center gap-2 sm:gap-4'>
                    <img src={assets.menu_icon_dark} alt="" onClick={() => setSidebarOpen(true)} className='w-8 sm:hidden'/>
                </div>

                <Link to="/Bookings" className='flex max-sm:hidden text-primary px-6 py-2 rounded-full w-fit cursor-pointer hover:scale-105 transition-all bg-sulfur hover:bg-sulfur/80'>Book Now</Link>

                {/* --- LOGIKA TOMBOL LOGIN DESKTOP --- */}
                {!user ? (
                    <button onClick={() => setShowLogin(true)} className="text-sm max-sm:hidden flex items-center gap-1 text-sulfur px-6 py-2 rounded-full border border-sulfur hover:bg-sulfur hover:text-primary transition-all">
                        Login <GiPadlock/>
                    </button>
                ) : (
                    <div className='flex items-center gap-3 max-sm:hidden'>
                        <button onClick={handleLogout} className="flex py-3 bg-red-500/20 text-red-500 rounded-full px-6 hover:bg-red-500 hover:text-white transition-all">
                            Logout
                        </button>

                        <span className='text-sulfur text-sm font-bold tracking-widest'>
                            Halo, {user.Nama.split(' ')[0]}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default Navbar