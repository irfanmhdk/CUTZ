import React from 'react'
import { motion } from 'motion/react'
import { IoClose } from "react-icons/io5";

const Login = ({ setShowLogin }) => {
    return (
        <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-primary border-2 border-sulfur p-8 rounded-lg w-full max-w-md relative mx-4'
            >
                <IoClose
                    className='absolute top-4 right-4 text-sulfur text-2xl cursor-pointer'
                    onClick={() => setShowLogin(false)}
                />

                <h2 className='text-3xl font-bold text-sulfur mb-6 text-center uppercase tracking-tighter'>
                    Cutz Access
                </h2>

                <form className='flex flex-col gap-4'>
                    <input
                        type="email"
                        placeholder="EMAIL"
                        className='bg-transparent border border-sulfur/30 p-3 text-white focus:border-sulfur outline-none transition-all'
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        className='bg-transparent border border-sulfur/30 p-3 text-white focus:border-sulfur outline-none transition-all'
                    />

                    <button className='bg-sulfur text-primary font-bold py-3 mt-2 hover:bg-white transition-all uppercase'>
                        Get In
                    </button>
                </form>

                <p className='text-xs text-sulfur/50 mt-4 text-center'>
                    FORGOT PASSWORD? CONTACT COMMAND CENTER.
                </p>
            </motion.div>
        </div>
    )
}

export default Login