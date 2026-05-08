import React, { useEffect, useState } from 'react';
import BCard from './BCard.jsx';
import OrderForm from './OrderForm.jsx';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Bookings = () => {
    const [services, setServices] = useState([]);
    const [selectedSvc, setSelectedSvc] = useState(null);
    const [myBookings, setMyBookings] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Ambil data user
    const getUserData = () => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            return null;
        }
    };

    const user = getUserData();

    // Fungsi ambil data dari VBookings
    const fetchMyBookings = () => {
        if (!user || !user.Users_id) return;

        const id = user?.Role === 'Barber' ? user.Barbers_id : user.Users_id;

        if (!id) return;

        if (!user?.Users_id) return;
        fetch(`/api/book/${id}?role=${user.Role}`)
            .then(res => res.json())
            .then(data => { setMyBookings(Array.isArray(data) ? data : [])
                setCurrentPage(1);})
            .catch(err => console.error("Error:", err));
    };

    useEffect(() => {
        // Fetch layanan (Services)
        fetch('/api/serv')
            .then(r => {
                if (!r.ok) throw new Error("Gagal connect ke server");
                return r.json();
            })
            .then(d => setServices(d))
            .catch(err => console.error("Gagal mengambil layanan:", err));

        fetchMyBookings();
    }, []);

    // --- LOGIKA PAGINATION ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = myBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(myBookings.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSelesai = (id) => {
        if (!window.confirm("Tandai layanan ini telah selesai?")) return;

        fetch(`/api/book/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Status_bayar: 'Sudah Bayar',
                Status_bookings: 'Completed'
            })
        })
            .then(res => {
                if (res.ok) {
                    fetchMyBookings(); // Refresh tabel
                }
            });
    };

    return (
        <div id='bookings' className="px-4 mb-20 sm:px-12 lg:px-24 xl:px-40 mt-5 text-white">

            {user?.Role !== 'Barber' && (
                <>
                    <div>
                        <h2 className="text-sulfur text-3xl md:text-4xl font-bold uppercase tracking-[0.2em]">
                            Book Now
                        </h2>
                        <p className="text-sulfur/60 mt-2 tracking-widest uppercase text-xs">Services</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                        {services.map((item, index) => (
                            <BCard
                                key={index}
                                bcard={item}
                                index={index}
                                onChoose={() => setSelectedSvc(item)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* 2. SEKSI DAFTAR BOOKINGS (Muncul jika sudah Login) */}
            {user && (
                <div className="mt-16 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 shadow-xl">
                    <div className="mb-6">
                        <h2 className="text-sulfur text-2xl font-bold uppercase tracking-widest">
                            {user.Role === 'Barber' ? 'Duty List' : 'Booking History'}
                        </h2>
                        <div className="h-1 w-20 bg-sulfur mt-2"></div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="text-sulfur/50 uppercase text-[10px] tracking-[0.2em] border-b border-zinc-800">
                                <th className="pb-4 font-medium">Services</th>
                                <th className="pb-4 font-medium">{user.Role === 'Barber' ? 'Customer' : 'Kapster'}</th>
                                <th className="pb-4 font-medium">Schedule</th>
                                <th className="pb-4 font-medium">Price</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                            {currentItems.length > 0 ? currentItems.map((bk) => (
                                <tr key={bk.Bookings_id} className="group hover:bg-zinc-800/30 transition-colors">
                                    <td className="py-4 font-semibold text-sulfur">{bk.Layanan}</td>
                                    <td className="py-4 text-zinc-300">{user.Role === 'Barber' ? bk.Customer : bk.Kapster}</td>
                                    <td className="py-4 text-xs text-zinc-400">
                                        {new Date(bk.Waktu_mulai).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </td>
                                    <td className="py-4 font-semibold">IDR {Number(bk.Harga).toLocaleString('id-ID')}</td>
                                    <td className="py-4">
                                            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${
                                                bk.Status_bookings === 'Selesai'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                                {bk.Status_bookings}
                                            </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        {user.Role === 'Barber' && bk.Status_bookings === 'Success' ? (
                                            <button
                                                onClick={() => handleSelesai(bk.Bookings_id)}
                                                className="bg-sulfur text-black text-[10px] font-black px-4 py-2 rounded hover:bg-white transition-all active:scale-95"
                                            >
                                                SELESAI
                                            </button>
                                        ) : (
                                            <span className="text-zinc-600 text-[10px] uppercase italic">No Action</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-zinc-500 text-sm">
                                        Belum ada data antrean ditemukan.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION CONTROLS --- */}
                    {myBookings.length > itemsPerPage && (
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 border border-zinc-700 rounded hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                <IoChevronBack size={18} className="text-sulfur" />
                            </button>

                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`w-8 h-8 text-xs font-bold rounded transition-all ${currentPage === i + 1 ? 'bg-sulfur text-black' : 'border border-zinc-700 text-zinc-500 hover:text-white'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-zinc-700 rounded hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                <IoChevronForward size={18} className="text-sulfur" />
                            </button>
                        </div>
                    )}

                </div>
            )}

            {selectedSvc && (
                <OrderForm
                    service={selectedSvc}
                    onClose={() => {
                        setSelectedSvc(null);
                        fetchMyBookings(); // Ambil data baru jika user baru saja order
                    }}
                />
            )}
        </div>
    );
};

export default Bookings;