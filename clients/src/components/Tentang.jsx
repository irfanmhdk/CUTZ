import React from 'react'
import assets from '../assets/assets'
import { motion } from 'motion/react'

const Tentang = () => {

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            id='tentang' className="relative flex  flex-col gap-7 px-4 sm:px-12 lg:px-24 xl:px-100 pt-30">

            <h2 className="text-sulfur text-3xl md:text-4xl font-bold uppercase tracking-[0.2em]">
                ABOUT US
            </h2>

            <img src={assets.bgImage2} alt='' className='rounded-4xl shadow-xl hover:scale-101 transition-transform duration-700 shadow-olive-800 lg:grayscale-90 hover:grayscale-0'/>

            <motion.h1
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             viewport={{ once: true }}
                className='text-3xl sm:text-5xl font-medium text-center text-trey rounded-2xl pl-5'>
                Heritage in every cut.
            </motion.h1>

            <motion.p
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             viewport={{ once: true }}
             className='text-trey lg:text-xl'>
                CUTZ started with a simple hustle one chair, one client, and one mission: to deliver a cut that speaks
                for itself.

                Founded by 𝖒𝖆𝖍𝖆𝖗, this brand was forged from years of grinding in the barbering world. After
                soaking up techniques from the streets of Japan, Korea, and the UK, 𝖒𝖆𝖍𝖆𝖗 refined those global skills to
                create a new standard specifically for the Indonesian scene.

                Over time, CUTZ evolved from a single spot into a multi-location powerhouse. But we aren't just chasing
                numbers; we’re obsessed with the system, the talent, and the consistency. It’s never been about just
                "expanding" it’s about leveling up.<br/><br/>

                We aren’t just building barbershops; we’re building an ecosystem: </motion.p>
            <motion.ul
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             viewport={{ once: true }}
             className='text-trey lg:text-xl'>
                <li>✦ A place where clients get that premium service.</li>
                <li>✦ A place where barbers sharpen their craft into true professionals.</li>
                <li>✦ A place where the industry standard gets pushed higher every single day.</li>
            </motion.ul>

            <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='text-trey lg:text-xl'>
                Today, CUTZ is more than just a haircut.<br/>
                It’s about the experience, the trust, and the tradition built into every piece.
            </motion.p>

        </motion.section>
    )
}

export default Tentang