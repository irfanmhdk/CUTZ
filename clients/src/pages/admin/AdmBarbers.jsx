import React, { useEffect, useState } from 'react'
import {IoChevronBack, IoChevronForward} from "react-icons/io5";

const AdmBarbers = () => {
    const [kaps, setKaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk Edit Logic
    const [isEditMode, setIsEditMode] = useState(false);
    const [idUp, setIdUp] = useState(null);
    const [formData, setFormData] = useState({
        Barbershop: 1,
        Nama: '',
        Pendapatan: '',
        Status: 'Aktif'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const BASE_URL = '/api/barbers';

    // 1. Ambil Data
    const fetchKaps = async (query = '') => {
        try {
            const url = query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Gagal mengambil data');
            const data = await response.json();
            setKaps(data);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKaps(searchTerm);
    }, [searchTerm]);

    // 2. Handle Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 3. Submit Update (Hanya Fee dan Stat)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/${idUp}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // Mengirimkan data yang diperbolehkan saja ke backend
                body: JSON.stringify({
                    Barbershop: 1,
                    Pendapatan: formData.Pendapatan,
                    Status: formData.Status
                })
            });

            if (response.ok) {
                alert('🎉 Perubahan pendapatan & status berhasil disimpan!');
                resetForm();
                fetchKaps(searchTerm);
            } else {
                alert('Gagal memperbarui data.');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // 4. Hapus Data
    const hapusData = async (id, nama) => {
        if (!window.confirm(`Hapus kapster ${nama}?`)) return;
        try {
            const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) fetchKaps(searchTerm);
        } catch (error) {
            console.error("Gagal hapus:", error);
        }
    };

    // 5. Persiapkan Edit
    const persiapkanEdit = (item) => {
        setIsEditMode(true);
        setIdUp(item.Barbers_id);
        setFormData({
            Barbershop: 1,
            Nama: item.Kapster,
            Pendapatan: item.Pendapatan,
            Status: item.Status
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditMode(false);
        setIdUp(null);
        setFormData({ Barbershop: 1, Pendapatan: '', Statatus: 'Aktif' });
    };

    const totalKaps = kaps.length;
    const Aktif = kaps.filter(b => b.Status === 'Aktif').length;
    const libur = kaps.filter(b => b.Status !== 'Aktif').length;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = kaps.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(kaps.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm'>
                <h1 className='text-xl font-bold text-sulfur'>Manajemen Kapster</h1>
                <div className='text-sm text-sulfur'>Selamat Datang, Admin</div>
            </header>

            {/* Statistik */}
            <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary'>
                    <p className='text-gray-500 text-sm'>Total Kapster</p>
                    <h3 className='text-2xl font-bold'>{totalKaps}</h3>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500'>
                    <p className='text-gray-500 text-sm'>Aktif</p>
                    <h3 className='text-2xl font-bold text-green-600'>{Aktif}</h3>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500'>
                    <p className='text-gray-500 text-sm'>Libur / Non-Aktif</p>
                    <h3 className='text-2xl font-bold text-red-600'>{libur}</h3>
                </div>
            </section>

            {/* FORM EDIT (Nama tidak bisa diubah) */}
            {isEditMode && (
                <section className="bg-white border-l-4 border-l-orange-500 border-r-4 border-r-orange-500 p-6 rounded-xl shadow-sm mb-8 border border-gray-100 animate-in fade-in duration-300">
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className="font-bold text-orange-600">📝 Update Pendapatan & Status</h2>
                        <span className='text-xs font-bold bg-gray-100 px-3 py-1 rounded text-gray-500'>KAPSTER: {formData.Nama}</span>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-400 mb-1 uppercase">Pendapatan (%)</label>
                            <input
                                name="Pendapatan" type="number" required
                                className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 font-bold"
                                value={formData.Pendapatan} onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-400 mb-1 uppercase">Status Kapster</label>
                            <select
                                name="Status"
                                className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 font-bold"
                                value={formData.Status} onChange={handleChange}
                            >
                                <option value="Aktif">Aktif</option>
                                <option value="Libur">Libur</option>
                                <option value="Tidak Aktif">Tidak Aktif</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex gap-2 mt-2">
                            <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition-all shadow-md">
                                Simpan Perubahan
                            </button>
                            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-6 py-2 rounded font-bold">
                                Batal
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* TABEL SECTION */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='p-6 border-b flex justify-between items-center'>
                    <h2 className='font-bold text-primary'>Daftar Kapster</h2>
                    <input
                        type="text"
                        className="text-xs bg-gray-100 border border-gray-200 rounded px-3 py-1 outline-none w-64"
                        placeholder="🔎︎ | Cari Kapster..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className='p-6 overflow-x-auto'>
                    {loading ? <p className="text-center py-4">Memuat data...</p> : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                            <tr className='text-gray-400 text-sm uppercase'>
                                <th className='pb-4 border-b'>Kapster</th>
                                <th className='pb-4 border-b'>Barbershop</th>
                                <th className='pb-4 border-b'>Pendapatan</th>
                                <th className='pb-4 border-b'>Status</th>
                                <th className='pb-4 border-b text-center'>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50 transition-colors'>
                                    <td className='py-4 border-b font-medium text-gray-700'>{item.Kapster}</td>
                                    <td className='py-4 border-b text-gray-500 text-sm'>{item.Barbershop}</td>
                                    <td className='py-4 border-b font-bold text-primary'>{item.Pendapatan} %</td>
                                    <td className='py-4 border-b'>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                item.Status === 'Aktif' ? 'bg-green-100 text-green-700' :
                                                    item.Status === 'Libur' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {item.Status}
                                            </span>
                                    </td>
                                    <td className='py-4 border-b text-center'>
                                        <button onClick={() => persiapkanEdit(item)}
                                                className="text-xs bg-yellow-500 text-white px-3 py-1 mr-1 rounded hover:opacity-80 transition-all">Edit
                                        </button>
                                        <button onClick={() => hapusData(item.Barbers_id)}
                                                className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:opacity-80 transition-all">Hapus
                                        </button>
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
                        Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, kaps.length)} dari {kaps.length} data
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
        </div>
    )
}

export default AdmBarbers