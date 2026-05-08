import React, { useState, useEffect } from 'react';

const OrderForm = ({ service, onClose }) => {
    // service di sini berisi data dari database (Layanan, Harga, Deskripsi, dll.)
    const [barbers, setBarbers] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false);
    const [formData, setFormData] = useState({ barberId: '', date: '', time: '', file: null });

    // Ambil data user dari session/localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetch('http://localhost:4000/api/barbers').then(r => r.json()).then(d => setBarbers(d));
    }, []);

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const hariInput = days[new Date(selectedDate).getDay()];
        setFormData(prev => ({...prev, date: selectedDate, time: ''}));

        try {
            const res = await fetch(`http://localhost:4000/api/jadwal?hari=${hariInput}`);
            const data = await res.json();
            const jadwal = Array.isArray(data) ? data.find(i => i.Hari === hariInput) : data;

            if (jadwal && (jadwal.Is_tutup == 0)) {
                const start = parseInt(jadwal.Jam_buka);
                const end = parseInt(jadwal.Jam_tutup);
                const slots = [];
                for (let i = start; i < end; i++) slots.push(`${i.toString().padStart(2, '0')}:00`);
                setAvailableSlots(slots);
            } else {
                setAvailableSlots([]);
                alert(`Barbershop tutup pada hari ${hariInput}`);
            }
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.file) {
            return alert("Silahkan upload bukti transfer terlebih dahulu!");
        }

        // Ambil ID user dari localStorage
        const userId = currentUser?.Users_id || currentUser?.id;
        if (!userId) {
            return alert("Sesi login berakhir, silahkan login ulang.");
        }

        setBtnLoading(true);

        const bodyData = new FormData();
        bodyData.append('Users_id', userId);
        bodyData.append('Barbers_id', formData.barberId);
        bodyData.append('Services_id', service.Services_id);

        bodyData.append('Start_time', `${formData.date} ${formData.time}:00`);

        bodyData.append('Total_harga', service.Harga);
        bodyData.append('bukti', formData.file);

        try {
            const res = await fetch('http://localhost:4000/api/book', {
                method: 'POST',
                body: bodyData,
            });

            const data = await res.json();

            if (res.ok) {
                alert("Booking Berhasil! Silahkan tunggu verifikasi admin.");
                onClose();
                window.location.reload();
            } else {
                alert(data.pesan || "Terjadi kesalahan saat booking.");
            }
        } catch (error) {
            console.error("Error submit booking:", error);
            alert("Koneksi ke server gagal!");
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-black/30 items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-olive rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in border border-zinc-800 duration-300">

                <div className="bg-primary p-6 text-sulfur relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-2xl hover:scale-125 transition-all">&times;</button>
                    <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Anda memilih layanan:</p>
                    <h2 className="text-2xl font-black uppercase italic">{service.Layanan}</h2>
                    <p className="text-xs mt-1 opacity-80">{service.Deskripsi || 'Professional treatment for your style.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 text-trey">

                    {/* INFO USER */}
                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg bg-zinc-800">
                        <div>
                            <p className="text-[10px] text-gray-400 leading-none">Booking atas nama:</p>
                            <p className="font-bold text-trey text-sm">{currentUser?.Nama || 'Guest User'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* INPUT KAPSTER */}
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-400">Pilih Kapster</label>
                            <select className="w-full text-trey border-b-2 border-trey py-2 outline-none focus:border-primary transition-all bg-transparent" required
                                    value={formData.barberId} onChange={e => setFormData({...formData, barberId: e.target.value})}>
                                <option className="bg-zinc-800 text-gray-400" value="">-- Kapster Tersedia --</option>
                                {barbers
                                    .filter(b => b.Status === 'Aktif') // Filter Kapster di sini
                                    .map(b => (
                                        <option className="bg-zinc-800 text-gray-400" key={b.Barbers_id} value={b.Barbers_id}>
                                            {b.Kapster}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* INPUT TANGGAL & JAM */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold uppercase text-gray-400">Tanggal</label>
                                <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full text-trey border-b-2 border-zinc-800 py-2 outline-none focus:border-primary" required
                                       value={formData.date} onChange={handleDateChange}/>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold uppercase text-gray-400">Jam</label>
                                <select className="w-full text-trey border-b-2 border-zinc-800 py-2 outline-none focus:border-primary" required
                                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                                    <option className="bg-zinc-800 text-gray-400" value="">-- Pilih --</option>
                                    {availableSlots
                                        .map(s => <option className="bg-zinc-800 text-gray-400" key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* PEMBAYARAN */}
                    <div className="bg-olive/10 p-4 rounded-xl border-2 border-dashed text-gray-400 border-zinc-800 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total yang harus dibayar:</span>
                            <span className="text-xl font-black text-sulfur">
                                Rp {Number(service.Harga).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <div className="mt-4">
                            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Upload Bukti Transfer (JPG/PNG)</label>
                            <input type="file" accept="image/*" required className="p-2 rounded bg-zinc-100 text-xs w-full cursor-pointer"
                                   onChange={e => setFormData({...formData, file: e.target.files[0]})} />
                        </div>
                    </div>

                    <button type="submit" disabled={btnLoading}
                            className="w-full bg-primary text-sulfur py-4 rounded-xl font-bold tracking-widest hover:shadow-lg active:scale-95 transition-all">
                        {btnLoading ? 'MEMPROSES...' : 'KONFIRMASI BOOKING'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;