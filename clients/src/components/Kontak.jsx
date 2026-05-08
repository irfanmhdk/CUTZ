import React from 'react'
import assets from '../assets/assets'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
import {FaPhoneAlt, FaMapMarker} from "react-icons/fa";
import {TfiEmail, TfiInstagram} from "react-icons/tfi";

const Kontak = () => {

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{staggerChildren: 0.5}}
            viewport={{once: true}}

            id='kontak' className='relative flex z-1 flex-col items-center
            text-trey overflow-x-hidden mt-20'>

            <div
                className='grid grid-cols-1 lg:grid-cols-2 w-full max-w-full pt-10 items-center justify-center'>

                <div className="flex w-full items-center text-center h-full justify-center bg-olive p-10">

                    <h2 className="text-sulfur text-3xl md:text-8xl font-bold uppercase tracking-[0.2em]">
                        FIND US
                    </h2>

                </div>

                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-75 lg:h-full overflow-hidden h-6/12">
                        <img
                            src={assets.sun_icon}
                            className='w-full h-full object-cover border-0 lg:grayscale-90 hover:grayscale-0 hover:scale-105 transition-transform duration-700'
                            alt="Barber Shop"
                        />
                    </div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.5}}
                        viewport={{once: true}}

                        className="bg-trey text-primary p-6 grid grid-cols-2 gap-4 h-10/12">
                        <div>
                            <h4 className="font-bold border-b border-primary/20 mb-2">Opening Hours</h4>
                            <p className="text-sm">Mon - Sat: 09:00 - 21:00</p>
                            <p className="text-sm">Sunday: Closed</p>
                        </div>
                        <div>
                            <h4 className="font-bold border-b border-primary/20 mb-2">Service Area</h4>
                            <p className="text-sm">Central London</p>
                            <p className="text-sm">Soho & Mayfair</p>
                        </div>

                        <ul>
                            <li className='p-2 flex items-center gap-2'>
                                <FaPhoneAlt/>
                                <span>: +62 812 3456 789</span>
                            </li>
                            <li className='p-2 flex items-center gap-2'>
                                <TfiEmail/>
                                <span>: info@cutz.com</span>
                            </li>
                            <li className='p-2 flex items-center gap-2'>
                                <TfiInstagram/>
                                <span>: @cutz.barber</span>
                            </li>
                        </ul>

                        <div className='bg-olive text-trey p-5 rounded-2xl h-fit'>
                            <FaMapMarker/>
                            <p className='mt-3'>Thom Sweeney Townhouse, 24c Old Burlington St, London W1S 3AU, United Kingdom</p>
                        </div>
                    </motion.div>
                </div>

            </div>

            <iframe
                src="https://maps.google.com/maps?q=Thom%20Sweeney%20Townhouse,%20London&t=k&z=19&ie=UTF8&iwloc=&output=embed"
                className='w-full h-full min-h-100 border-0 lg:grayscale-90 hover:grayscale-0' allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>

        </motion.div>
    )
}

export default Kontak
