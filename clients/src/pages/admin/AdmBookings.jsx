import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const AdmBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const BASE_URL = '/api/book';

    const fetchBookings = async () => {
        try {
            const url = BASE_URL;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Could not find Bookings');

            const data = await response.json();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(searchTerm);
    }, [searchTerm]);

    const handleUpdateStatus = async (id, statusBooking, statusBayar) => {
        if (!window.confirm(`Yakin ingin mengubah status booking #${id} menjadi ${statusBooking}?`)) return;

        try {
            const res = await fetch(`/api/book/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Status_bookings: statusBooking,
                    Status_bayar: statusBayar
                })
            });

            if (res.ok) {
                alert("Status berhasil diperbarui!");
                fetchBookings(); // Refresh tabel agar data terbaru muncul
            } else {
                alert("Gagal memperbarui status.");
            }
        } catch (error) {
            console.error("Error update:", error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalBooking = bookings.length;
    const menungguVerifikasi = bookings.filter(b => (b.Status_bayar === 'Sudah Bayar' && b.Status_bookings === 'Success')).length;
    const selesai = bookings.filter(b => b.Status_bookings === 'Completed').length;

    return (
        <>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm'>
                <h1 className='text-xl font-bold text-sulfur'>Ringkasan Bookings</h1>
                <div className='text-sm text-sulfur'>Selamat Datang, Admin</div>
            </header>

            <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary'>
                    <p className='text-gray-500 text-sm'>Total Booking</p>
                    <h3 className='text-2xl font-bold'>{totalBooking}</h3>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-sulfur'>
                    <p className='text-gray-500 text-sm'>Antrian</p>
                    <h3 className='text-2xl font-bold text-orange-500'>{menungguVerifikasi}</h3>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary'>
                    <p className='text-gray-500 text-sm'>Selesai</p>
                    <h3 className='text-2xl font-bold'>{selesai}</h3>
                </div>
            </section>

            {/* Tabel Data Real */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='p-6 border-b flex justify-between items-center'>
                    <h2 className='font-bold text-primary'>Daftar Bookings</h2>
                    <div>
                        <input type="text" value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className="text-xs bg-gray-100 border border-gray-200 rounded mr-1 px-3 py-1" placeholder="🔎︎ | Cari..."/>
                    </div>
                </div>

                <div className='p-6'>
                    {loading ? (
                        <p className="text-center">Memuat data...</p>
                    ) : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                            <tr className='text-gray-400 text-sm uppercase'>
                                <th className='pb-4 border-b'>Kapster</th>
                                <th className='pb-4 border-b'>Customer</th>
                                <th className='pb-4 border-b'>Layanan</th>
                                <th className='pb-4 border-b'>Waktu</th>
                                <th className='pb-4 border-b'>Harga</th>
                                <th className='pb-4 border-b'>Pembayaran</th>
                                <th className='pb-4 border-b'>Bukti</th>
                                <th className='pb-4 border-b'>Status</th>
                                <th className='pb-4 border-b'>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50'>
                                    <td className='py-4 border-b font-medium'>{item.Kapster}</td>
                                    <td className='py-4 border-b font-medium'>{item.Customer}</td>
                                    <td className='py-4 border-b'>{item.Layanan || 'Potong Rambut'}</td>
                                    <td className='py-4 border-b'>
                                        {new Date(item.Waktu_mulai).toLocaleString('id-ID', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }).replace(/\//g, '-')}
                                    </td>
                                    <td className="py-4 border-b">IDR {Number(item.Harga).toLocaleString('id-ID')}</td>
                                    <td className='py-4 border-b'>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    item.Status_bayar === 'Sudah Bayar' ? 'bg-green-100 text-green-700' :
                                                        item.Status_bayar === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {item.Status_bayar}
                                                </span>
                                    </td>
                                    <td className='py-4 border-b'>
                                        {item.Bukti ? (
                                            <a href={`/upload/${item.Bukti}`} target="_blank"
                                               className='text-blue-500 underline text-sm'>Lihat Foto</a>
                                        ) : 'Tidak ada'}
                                    </td>
                                    <td className='py-4 border-b'>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    item.Status_bookings === 'Pending' ? 'bg-blue-200 text-blue-800' :
                                                        item.Status_bookings === 'Success' ? 'bg-green-200 text-green-800' :
                                                            item.Status_bookings === 'Completed' ? 'text-primary' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {item.Status_bookings}
                                                </span>
                                    </td>
                                    <td className='py-4 border-b'>
                                        {item.Status_bookings === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(item.Bookings_id, 'Success', 'Sudah Bayar')}
                                                    className="bg-primary text-sulfur px-3 py-1 mr-2 rounded text-xs font-bold hover:scale-108 cursor-pointer"
                                                >
                                                    Konfirmasi
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item.Bookings_id, 'Gagal', 'Ditolak')}
                                                    className="bg-red-700 text-white px-3 py-1 rounded text-xs font-bold hover:scale-108 cursor-pointer"
                                                >
                                                    Tolak
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- PAGINATION UI --- */}
                <div className='mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg'>
                    <p className='text-xs text-gray-500'>
                        Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, bookings.length)} dari {bookings.length} data
                    </p>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='p-2 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <IoChevronBack />
                        </button>

                        <div className='flex gap-1'>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`px-3 py-1 rounded border text-xs font-medium transition-all ${
                                        currentPage === i + 1
                                            ? 'bg-primary text-sulfur border-primary'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className='p-2 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <IoChevronForward />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdmBookings