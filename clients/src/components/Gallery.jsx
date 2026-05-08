import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import assets from '../assets/assets';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

const galleryImages = [
    { id: 1, src: assets.c6 },
    { id: 2, src: assets.c1 },
    { id: 3, src: assets.c5 },
    { id: 4, src: assets.c2 },
    { id: 5, src: assets.c4 },
    { id: 6, src: assets.c3 },
];

const Gallery = () => {
    return (
        <section className="py-20 bg-primary overflow-hidden">
            <div className="px-4 sm:px-12 lg:px-40 mb-10">
                <h2 className="text-sulfur text-3xl md:text-4xl font-bold uppercase tracking-[0.2em]">
                    Inside Look at Our Barber
                </h2>
                <p className="text-sulfur/60 mt-2 tracking-widest uppercase text-xs">Photo Gallery</p>
            </div>

            <Swiper
                slidesPerView={1.5}
                spaceBetween={20}
                freeMode={true}
                loop={true}
                speed={3000}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: { slidesPerView: 2.5 },
                    1024: { slidesPerView: 3.5 },
                    1440: { slidesPerView: 4.5 },
                }}
                modules={[Autoplay, FreeMode]}
                className="mySwiper"
            >
                {galleryImages.map((img) => (
                    <SwiperSlide key={img.id}>
                        <div className="relative h-[400px] md:h-[500px] overflow-hidden group rounded-sm">
                            <img
                                src={img.src}
                                alt="Gallery"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay Hitam saat Hover */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Gallery;