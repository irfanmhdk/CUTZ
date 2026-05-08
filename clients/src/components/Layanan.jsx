import React, {useState, useEffect} from 'react'
import assets from '../assets/assets'
import BCard from './BCard.jsx'
import { motion } from 'motion/react'

const Layanan = () => {

    const [services, setServices] = useState([]);
    const [selectedSvc, setSelectedSvc] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/api/serv').then(r => r.json()).then(d => setServices(d));
    }, []);

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            transition={{staggerChildren: 0.2}}
            viewport={{once: true}}

            id='servis' className="relative flex  flex-col gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30">

            <div>
                <h2 className="text-sulfur text-3xl md:text-4xl font-bold uppercase tracking-[0.2em]">
                    Services
                </h2>
                <p className="text-sulfur/60 mt-2 tracking-widest uppercase text-xs">Book Now</p>
            </div>

            <div className="flex flex-col md:grid grid-cols-3 text-trey">
                {services.map((bcard, index)=>(
                    <BCard key={index} bcard={bcard} index={index} />
                ))}
            </div>

        </motion.section>
    )
}

export default Layanan