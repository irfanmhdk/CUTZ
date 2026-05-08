import React, {useRef, useState} from 'react'
import {motion} from 'motion/react'

const BCard = ({bcard, onChoose}) => { // Tambahkan onChoose di sini
    const [position, setPosition] = useState({x: 0, y: 0})
    const [visible, setVisible] = useState(false);
    const divRef = useRef(null)

    const handleMouseMove = (e) => {
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({x: e.clientX - bounds.left, y: e.clientY - bounds.top})
    }

    return (
        <motion.div
            // ... (keep your motion logic)
            className='relative overflow-hidden max-w-lg m-2 sm:m-4 rounded-xl border border-gray-700 shadow-2xl hover:scale-103 transition-all'
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            ref={divRef}
            onMouseMove={handleMouseMove}
        >
            <div className={`pointer-events-none blur-2xl rounded-full bg-linear-to-r from-primary via-yellow-500 to-sulfur w-75 h-75 absolute -z-1
                transition-opacity duration-500 mix-blend-lighten ${visible ? 'opacity-70' : 'opacity-0'}`}
                 style={{top: position.y - 150, left: position.x - 150}}/>
                <div
                    className='flex items-center gap-10 p-8 hover:p-7.5 hover:m-0.5 transition-all rounded-sm bg-olive z-10 relative'>
                    <div className='flex-1'>
                        <h3 className='font-bold text-xl md:text-2xl text-sulfur'>{bcard.Layanan}</h3>
                        <p className='text-xs mt-2 text-sulfur/80 line-clamp-2'>Duration : {bcard.Estimasi} Minute</p>
                        <div className='flex justify-between items-center mt-5'>
                            <p className='text-lg font-black text-trey'>
                                IDR {Number(bcard.Harga).toLocaleString('id-ID')}
                            </p>
                            <button
                                onClick={onChoose} // Trigger fungsi modal
                                className='border-2 border-sulfur px-4 py-1.5 rounded-lg hover:bg-sulfur text-sulfur hover:text-trey transition-all font-bold cursor-pointer'>
                                Choose
                            </button>
                        </div>
                    </div>
                </div>
        </motion.div>
    )
}

export default BCard