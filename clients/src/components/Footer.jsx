import React from 'react'
import assets from '../assets/assets'
import {motion} from 'motion/react'
import {Link} from "react-router-dom";

const Footer = ({theme}) => {
    return (
        <div
            className='relative bg-olive pt-10 sm-pt-10 px-4 sm:px-10 lg:px-24 xl:px-40 z-1 overflow-hidden  text-trey'>
            <div className="flex justify-between lg:items-center max-lg:flex-col gap-10">
                <motion.div
                    initial={{opacity: 0, x: -30}}
                    whileInView={{opacity: 1, x: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}

                    className="space-y-5 text-sm">
                    <img src={theme === 'dark' ? assets.logo_dark : assets.logo} alt="" className="w-20 sm:w-20"/>
                    <p className="max-w-md">Thom Sweeney Townhouse, 24c Old Burlington St, London W1S 3AU, United
                        Kingdom</p>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        <li><Link to="/#beranda" className='sm:hover:border-b-trey hover:border-b'
                                  onClick={() => setSidebarOpen(false)}>Home</Link></li>
                        <li><Link to="/#servis" className='sm:hover:border-b-trey hover:border-b'
                                  onClick={() => setSidebarOpen(false)}>Services</Link></li>
                        <li><Link to="/#tentang" className='sm:hover:border-b-trey hover:border-b'
                                  onClick={() => setSidebarOpen(false)}>About</Link></li>
                        <li><Link to="/#kontak" className='sm:hover:border-b-trey hover:border-b'
                                  onClick={() => setSidebarOpen(false)}>Find Us</Link></li>
                        <li><Link to="/bookings" className='sm:hover:border-b-sulfur text-sulfur hover:border-b'
                                  onClick={() => setSidebarOpen(false)}>Boook Now</Link></li>
                    </ul>
                </motion.div>

                <div className="p-6 grid grid-cols-2 gap-15 h-10/12">
                    <div>
                        <h4 className="font-bold border-b border-trey/50 mb-2">Opening Hours</h4>
                        <p className="text-sm">Mon - Thu: 09:00 - 17:00</p>
                        <p className="text-sm">Fri: 12:30 - 20:00</p>
                        <p className="text-sm">Sat: 08:00 - 14:00</p>
                        <p className="text-sm">Close</p>
                    </div>
                    <div>
                        <h4 className="font-bold border-b border-trey/50 mb-2">Service Area</h4>
                        <p className="text-sm">Thom Sweeney Townhouse</p>
                    </div>
                </div>
            </div>
            <hr className="my-6 text-trey/50"/>

            <div className="pb-6 text-sm flex justify-center sm:justify-between gap-4 flex-wrap">
                <motion.p
                    initial={{opacity: 0, y: -30}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}

                >© 2026 PBL by 𝖒𝖆𝖍𝖆𝖗
                </motion.p>
                <motion.div
                    initial={{opacity: 0, y: -30}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    viewport={{once: true}}

                    className="flex items-center justify-between gap-4">
                    <img src={assets.facebook_icon} alt=""/>
                    <img src={assets.twitter_icon} alt=""/>
                    <img src={assets.instagram_icon} alt=""/>
                    <img src={assets.linkedin_icon} alt=""/>
                </motion.div>
            </div>
        </div>
    )
}

export default Footer