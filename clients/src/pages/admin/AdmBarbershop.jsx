import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

const AdmBarbershop = () => {
    const [bars, setBars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBars = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/barbershop'); // Sesuaikan URL API Anda
            const data = await response.json();
            setBars(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBars();
    }, []);

    return (
        <>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm'>
                <h1 className='text-xl font-bold text-sulfur'>Ringkasan Barbershop</h1>
                <div className='text-sm text-sulfur'>Selamat Datang, Admin</div>
            </header>

            {/* Tabel Data Real */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='p-6 border-b flex justify-between items-center'>
                    <h2 className='font-bold text-primary'>Daftar Barbershop</h2>
                </div>

                <div className='p-6'>
                    {loading ? (
                        <p className="text-center">Memuat data...</p>
                    ) : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                            <tr className='text-gray-400 text-sm uppercase'>
                                <th className='pb-4 border-b'>Barbershop</th>
                                <th className='pb-4 border-b'>Owner</th>
                                <th className='pb-4 border-b'>Telephone</th>
                                <th className='pb-4 border-b'>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bars.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50'>
                                    <td className='py-4 border-b font-medium'>{item.Barbershop}</td>
                                    <td className='py-4 border-b'>{item.Owner}</td>
                                    <td className='py-4 border-b font-medium'>{item.Telepon}</td>
                                    <td className='py-4 border-b font-medium'>{item.Alamat}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdmBarbershop