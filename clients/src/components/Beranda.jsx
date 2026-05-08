import React from 'react'
import assets from '../assets/assets'
import {motion} from 'motion/react'
import {Link} from 'react-router-dom';

const Beranda = () => {
    return (
        <section id='beranda' className='relative w-full h-screen overflow-hidden flex items-center justify-center'>

            <img src={assets.hero_img} className='absolute top-0 left-0 w-full h-full object-cover z-0'/>

            <div className='absolute top-0 left-0 w-full h-full bg-black/50 z-10'></div>

            {/* 3. Konten Teks */}
            <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                className='relative z-20 text-center text-white px-4'
            >
                <img src={assets.bgImage1} className='lg:w-6/12 sm:w-full mx-auto'/>
                <Link to="/bookings">
                    <button
                        className='mt-8 px-8 py-3 border-2 border-sulfur hover:bg-sulfur text-sulfur hover:text-primary hover:scale-103 rounded-full hover:bg-sulfur/90 transition-all duration-300'>
                        Book Now
                    </button>
                </Link>
            </motion.div>
        </section>
    )
}

export default Beranda
