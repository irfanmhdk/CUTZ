import React, {useEffect, useState} from 'react';
import {IoChevronBack, IoChevronForward} from "react-icons/io5";

const AdmOrderBook = () => {
    // --- STATE ---
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [, setOperatingHours] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);

    const [formData, setFormData] = useState({
        userId: '',
        serviceId: '',
        barberId: '',
        date: '',
        time: '',
        file: null
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resUser, resSvc, resBook] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/serv'),
                fetch('/api/book')
            ]);
            setUsers(await resUser.json());
            setServices(await resSvc.json());
            setBookings(await resBook.json());
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    // --- HANDLERS ---
    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const hariInput = days[new Date(selectedDate).getDay()];
        setFormData(prev => ({...prev, date: selectedDate, time: ''}));

        try {
            const res = await fetch(`/api/jadwal?hari=${hariInput}`);
            const data = await res.json();
            const jadwal = Array.isArray(data) ? data.find(i => i.Hari === hariInput) : data;

            if (jadwal && jadwal.Jam_buka && (jadwal.Is_tutup == 0)) {
                setOperatingHours(jadwal);
                const start = parseInt(jadwal.Jam_buka);
                const end = parseInt(jadwal.Jam_tutup);
                const slots = [];
                for (let i = start; i < end; i++) slots.push(`${i.toString().padStart(2, '0')}:00`);
                setAvailableSlots(slots);
            } else {
                setOperatingHours(null);
                setAvailableSlots([]);
                alert(`Barbershop tutup pada hari ${hariInput}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!formData.file) return alert("Wajib upload bukti transfer!");

        setBtnLoading(true);
        const bodyData = new FormData();
        bodyData.append('Users_id', formData.userId);
        bodyData.append('Barbers_id', formData.barberId);
        bodyData.append('Services_id', formData.serviceId);
        bodyData.append('Start_time', `${formData.date} ${formData.time}:00`);

        const svc = services.find(s => s.Services_id === parseInt(formData.serviceId));
        bodyData.append('Total_harga', svc ? svc.Harga : 0);
        bodyData.append('bukti', formData.file);

        try {
            const res = await fetch('/api/book', {method: 'POST', body: bodyData});
            if (res.ok) {
                alert("Booking Berhasil!");
                setFormData({userId: '', serviceId: '', barberId: '', date: '', time: '', file: null});
                fetchData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBtnLoading(false);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Helper untuk mencari teks yang dipilih
    const selectedUser = users.find(u => u.Users_id === parseInt(formData.userId));
    const selectedSvc = services.find(s => s.Services_id === parseInt(formData.serviceId));
    const selectedBarber = barbers.find(b => b.Barbers_id === parseInt(formData.barberId));

    return (
        <>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm text-sulfur'>
                <h1 className='text-xl font-bold'>Order Bookings</h1>
                <div className='text-sm'>Panel Admin</div>
            </header>

            <div className='bg-white p-6 rounded-xl shadow-sm mb-8 border-gray-200 border-l-4 border-r-4 border-primary'>
                <h2 className='font-bold text-lg mb-4 text-gray-800 border-b pb-2'>Buat Order</h2>

                <form onSubmit={handleSubmitOrder}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* INPUT 1: CUSTOMER */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">1. Pilih Customer</label>
                            <select className="w-full border rounded-lg p-2 outline-none" required
                                    value={formData.userId} onChange={(e) => setFormData({
                                ...formData,
                                userId: e.target.value,
                                serviceId: '',
                                barberId: '',
                                date: '',
                                time: ''
                            })}>
                                <option value="">-- Pilih --</option>
                                {users.map(u => <option key={u.Users_id} value={u.Users_id}>{u.Nama}</option>)}
                            </select>
                        </div>

                        {/* INPUT 2: LAYANAN */}
                        {formData.userId && (
                            <div>
                                <label className="block text-sm font-semibold mb-1">2. Pilih Layanan</label>
                                <select className="w-full border rounded-lg p-2 outline-none" required
                                        value={formData.serviceId} onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        serviceId: e.target.value,
                                        barberId: '',
                                        date: '',
                                        time: ''
                                    });
                                    fetch('/api/barbers').then(r => r.json()).then(d => setBarbers(d));
                                }}>
                                    <option value="">-- Pilih --</option>
                                    {services.map(s => <option key={s.Services_id}
                                                               value={s.Services_id}>{s.Layanan}</option>)}
                                </select>
                            </div>
                        )}

                        {/* INPUT 3: KAPSTER */}
                        {formData.serviceId && (
                            <div>
                                <label className="block text-sm font-semibold mb-1">3. Pilih Kapster</label>
                                <select className="w-full border rounded-lg p-2 outline-none" required
                                        value={formData.barberId}
                                        onChange={(e) => setFormData({...formData, barberId: e.target.value})}>
                                    <option value="">-- Pilih --</option>
                                    {barbers.map(b => <option key={b.Barbers_id}
                                                              value={b.Barbers_id}>{b.Kapster}</option>)}
                                </select>
                            </div>
                        )}

                        {/* INPUT 4: JADWAL */}
                        {formData.barberId && (
                            <div>
                                <label className="block text-sm font-semibold mb-1">4. Pilih Jadwal</label>
                                <div className="flex gap-2">
                                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-1/2 border rounded-lg p-2 text-sm" required
                                           value={formData.date} onChange={handleDateChange}/>
                                    <select className="w-1/2 border rounded-lg p-2 text-sm" required
                                            value={formData.time}
                                            onChange={(e) => setFormData({...formData, time: e.target.value})}>
                                        <option value="">-- Jam --</option>
                                        {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- RINGKASAN & PEMBAYARAN --- */}
                    {formData.time && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-gray-100 p-5 rounded-xl border border-gray-300">
                                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <span
                                        className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">!</span>
                                    Ringkasan Reservasi & Pembayaran
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Data Detail (Persis seperti modal tadi) */}
                                    <div className="space-y-2 text-sm border-r border-gray-200 pr-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Customer:</span>
                                            <span className="font-bold">{selectedUser?.Nama}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Layanan:</span>
                                            <span className="font-bold">{selectedSvc?.Layanan}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Kapster:</span>
                                            <span className="font-bold">{selectedBarber?.Kapster}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tanggal:</span>
                                            <span className="font-bold">{formData.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Pukul:</span>
                                            <span className="font-bold">{formData.time}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-300 flex justify-between text-lg">
                                            <span className="font-bold text-primary">Total:</span>
                                            <span className="font-black text-primary">
                                              {new Intl.NumberFormat('id-ID', {
                                                  style: 'currency',
                                                  currency: 'IDR',
                                                  minimumFractionDigits: 0
                                              }).format(selectedSvc?.Harga || 0)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bagian Upload Bukti */}
                                    <div className="flex flex-col justify-center">
                                        <label className="block text-sm font-bold mb-2">Upload Bukti Transfer:</label>
                                        <input
                                            className="bg-white border border-gray-300 rounded-lg shadow-sm p-2"
                                            type="file"
                                            accept=".jpg, .jpeg, .png" // Membatasi pilihan file di folder komputer
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    // Validasi tipe file secara manual di JS
                                                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                                                    if (!allowedTypes.includes(file.type)) {
                                                        alert("Format file salah! Harap gunakan JPG, JPEG, atau PNG.");
                                                        e.target.value = ""; // Kosongkan input lagi
                                                        return;
                                                    }
                                                    setFormData({...formData, file: file});
                                                }
                                            }}
                                        />
                                        <p className="mt-2 text-[10px] text-gray-400 font-medium">*Pastikan gambar
                                            terlihat jelas untuk verifikasi admin.</p>
                                    </div>
                                </div>

                                {/* Tombol Simpan */}
                                <button type="submit" disabled={btnLoading}
                                        className="mt-6 w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition active:scale-95 shadow-md">
                                    {btnLoading ? 'Sedang Menyimpan...' : 'KONFIRMASI & SIMPAN RESERVASI'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* TABEL DATA (Tetap di bawah) */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='p-6 border-b flex justify-between items-center'>
                    <h2 className='font-bold text-primary'>Daftar Bookings</h2>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="text-gray-400 text-sm uppercase">
                            <th className="pb-4 border-b">ID</th>
                            <th className="pb-4 border-b">Customer</th>
                            <th className="pb-4 border-b">Layanan</th>
                            <th className="pb-4 border-b">Tanggal</th>
                            <th className="pb-4 border-b">Pukul</th>
                            <th className="pb-4 border-b text-center">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map(b => (
                            <tr key={b.Bookings_id} className="border-b hover:bg-gray-50">
                                <td className="py-4 font-mono">#{b.Bookings_id}</td>
                                <td className="py-4 font-semibold">{b.Customer}</td>
                                <td className="py-4">{b.Layanan}</td>
                                <td className="py-4">{new Date(b.Waktu_mulai).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}</td>
                                <td className="py-4">{new Date(b.Waktu_mulai).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })} WIB
                                </td>
                                <td className="py-4 text-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-[10px] font-bold ${b.Status_bookings === 'Pending' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                            {b.Status_bookings}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
    );
};

export default AdmOrderBook;