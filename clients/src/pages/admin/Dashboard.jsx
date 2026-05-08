import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

const Dashboard = () => {
    // 1. State untuk menyimpan data booking
    const [bookings, setBookings] = useState([]);
    const [service, setServ] = useState([]);
    const [kaps, setKaps] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Fungsi untuk mengambil data dari backend
    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/book'); // Sesuaikan URL API Anda
            const data = await response.json();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    const fetchServ = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/serv'); // Sesuaikan URL API Anda
            const data = await response.json();
            setServ(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    const fetchKaps = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/barbers'); // Sesuaikan URL API Anda
            const data = await response.json();
            setKaps(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    // 3. Jalankan fungsi saat halaman pertama kali dibuka
    useEffect(() => {
        fetchBookings();
        fetchServ();
        fetchKaps();
    }, []);

    const latestBookings = [...bookings].reverse().slice(0, 10);
    const totalBooking = bookings.length;
    const countStatus = (status) => bookings.filter(b => b.Status_bookings === status).length;

    const pendingCount = countStatus('Pending');
    const successCount = countStatus('Success');
    const completedCount = countStatus('Completed');

    const getWidth = (count) => totalBooking > 0 ? (count / totalBooking) * 100 : 0;

    const estimasiPendapatan = bookings
        .filter(item => item.Status_bayar === 'Sudah Bayar')
        .reduce((total, item) => {
            // Konversi ke angka, jika gagal/kosong gunakan 0
            const hargaNetto = Number(item.Harga) || 0;
            return total + hargaNetto;
        }, 0);

    const antreanHariIni = bookings.filter(item => {
        const today = new Date().toLocaleDateString('en-CA'); // Format YYYY-MM-DD
        const bookingDate = new Date(item.Waktu_mulai).toLocaleDateString('en-CA');
        return bookingDate === today;
    }).length;

    const totalPelangganUnik = [...new Set(bookings.map(item => item.Customer))].length;

    return (
        <>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm'>
                <h1 className='text-xl font-bold text-sulfur'>Ringkasan</h1>
                <div className='text-sm text-sulfur'>Selamat Datang, Admin</div>
            </header>


            <section className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                {/* Laporan Verifikasi Pembayaran */}
                <div className='bg-white p-6 rounded-xl shadow-sm'>
                    <h3 className='font-bold text-gray-700 mb-4 flex items-center gap-2'>
                        <span className="w-2 h-4 bg-orange-500 rounded-full"></span>
                        Perlu Tindakan Admin
                    </h3>
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center p-3 bg-orange-50 rounded-lg'>
                            <div>
                                <p className='text-sm font-medium text-orange-800'>Verifikasi Pembayaran</p>
                                <p className='text-[11px] text-orange-600'>Bukti transfer yang belum diperiksa</p>
                            </div>
                            <span className='text-xl font-bold text-orange-800'>
                                {bookings.filter(b => b.Status_bayar === 'Menunggu Verifikasi').length}
                            </span>
                        </div>

                        <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                            <div>
                                <p className='text-sm font-medium text-green-800'>Siap Dilayani</p>
                                <p className='text-[11px] text-green-600'>Sudah bayar, menunggu giliran kapster</p>
                            </div>
                            <div className='text-right'>
                            <span className='text-xl font-bold text-green-800'>
                                {bookings.filter(b => b.Status_bookings === 'Success').length}
                            </span>
                                <p className='text-[9px] uppercase font-bold text-gray-400'>Orang</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. RINGKASAN AKTIVITAS HARI INI */}
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <h3 className='font-bold text-gray-700 mb-4 flex items-center gap-2'>
                        <span className="w-2 h-4 bg-blue-500 rounded-full"></span>
                        Aktivitas Barbershop
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-3 bg-blue-50 rounded-lg'>
                            <p className='text-[10px] text-blue-600 font-bold uppercase'>Total Layanan</p>
                            <p className='text-xl font-bold text-blue-900'>{service.length}</p>
                            <p className='text-[10px] text-blue-400'>Aktif di Menu</p>
                        </div>
                        <div className='p-3 bg-purple-50 rounded-lg'>
                            <p className='text-[10px] text-purple-600 font-bold uppercase'>Total Kapster</p>
                            <p className='text-xl font-bold text-purple-900'>{kaps.length}</p>
                            <p className='text-[10px] text-purple-400'>Siap Melayani</p>
                        </div>
                        <div className='p-3 bg-green-50 rounded-lg col-span-2 flex justify-between items-center'>
                            <div>
                                <p className='text-[10px] text-green-600 font-bold uppercase'>Rasio Kapster : Pesanan</p>
                                <p className='text-sm font-medium text-green-900'>
                                    1 Kapster melayani rata-rata {kaps.length > 0 ? (bookings.length / kaps.length).toFixed(1) : 0} pesanan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                {/* Card Pendapatan */}
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary'>
                    <p className='text-gray-500 text-sm'>Estimasi Pendapatan</p>
                    <h3 className='text-2xl font-bold text-sulfur'>{new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                    }).format(estimasiPendapatan)}</h3>
                    <p className='text-[10px] text-gray-400 mt-1'>*Bulan ini</p>
                </div>

                {/* Card Booking Hari Ini */}
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-sulfur'>
                    <p className='text-gray-500 text-sm'>Antrean Hari Ini</p>
                    <h3 className='text-2xl font-bold text-primary'>{antreanHariIni} Orang</h3>
                </div>

                {/* Card Total Customer Terdaftar */}
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary'>
                    <p className='text-gray-500 text-sm'>Total Pelanggan</p>
                    <h3 className='text-2xl font-bold text-sulfur'>{totalPelangganUnik}</h3>
                </div>
            </section>

            <section className='bg-white p-6 rounded-xl shadow-sm mb-8'>
                <div className='flex justify-between items-end mb-2'>
                    <h2 className='text-sm font-bold text-gray-600'>Status Distribusi Booking</h2>
                    <span className='text-xs text-gray-400'>{totalBooking} Total Pesanan</span>
                </div>

                {/* Bar Container */}
                <div className='w-full h-4 bg-gray-100 rounded-full overflow-hidden flex'>
                    <div
                        style={{ width: `${getWidth(pendingCount)}%` }}
                        className='bg-blue-400 h-full transition-all duration-500'
                        title={`Pending: ${pendingCount}`}
                    />
                    <div
                        style={{ width: `${getWidth(successCount)}%` }}
                        className='bg-green-500 h-full transition-all duration-500'
                        title={`Success: ${successCount}`}
                    />
                    <div
                        style={{ width: `${getWidth(completedCount)}%` }}
                        className='bg-primary h-full transition-all duration-500'
                        title={`Completed: ${completedCount}`}
                    />
                </div>

                {/* Legend / Keterangan */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-50'>
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 bg-blue-400 rounded-full'></div>
                            <span className='text-xs font-bold text-gray-700'>Pending ({pendingCount})</span>
                        </div>
                        <p className='text-[11px] text-gray-500 ml-5'>Menunggu verifikasi pembayaran atau konfirmasi admin.</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                            <span className='text-xs font-bold text-gray-700'>Success ({successCount})</span>
                        </div>
                        <p className='text-[11px] text-gray-500 ml-5'>Pembayaran tervalidasi, pelanggan menunggu giliran pelayanan.</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 bg-primary rounded-full'></div>
                            <span className='text-xs font-bold text-gray-700'>Completed ({completedCount})</span>
                        </div>
                        <p className='text-[11px] text-gray-500 ml-5'>Transaksi selesai dan layanan telah diberikan sepenuhnya.</p>
                    </div>
                </div>
            </section>

            {/* Tabel Data Real */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='p-6 border-b flex justify-between items-center'>
                    <h2 className='font-bold text-primary'>Daftar Pesanan Terbaru</h2>

                    <Link to="/admin/bookings">
                        <button onClick={fetchBookings}
                                className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Lihat
                        </button>
                    </Link>
                </div>

                <div className='p-6'>
                    {loading ? (
                        <p className="text-center">Memuat data...</p>
                    ) : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                            <tr className='text-gray-400 text-sm uppercase'>
                                <th className='pb-4 border-b'>Customer</th>
                                <th className='pb-4 border-b'>Layanan</th>
                                <th className='pb-4 border-b'>Waktu</th>
                                <th className='pb-4 border-b'>Pembayaran</th>
                                <th className='pb-4 border-b'>Bukti</th>
                                <th className='pb-4 border-b'>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {latestBookings.length > 0 ? latestBookings.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50'>
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
                                            <a href={`http://localhost:4000/upload/${item.Bukti}`} target="_blank"
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
                                </tr>
                                )
                            ) : (
                                    // Kondisi FALSE: Titik dua (:) yang tadi hilang harus ada di sini
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-gray-400">
                                        Belum ada pesanan terbaru.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )
}

export default Dashboard