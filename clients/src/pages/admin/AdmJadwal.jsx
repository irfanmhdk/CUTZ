import React, { useEffect, useState } from 'react'
import {IoChevronBack, IoChevronForward} from "react-icons/io5";

const AdmJadwal = () => {
    const [jadwal, setJad] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isEditMode, setIsEditMode] = useState(false);
    const [idUp, setIdUp] = useState(null);
    const [formData, setFormData] = useState({
        hari: '',
        jam_buka: '',
        jam_tutup: '',
        is_tutup: 0
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const BASE_URL = 'http://localhost:4000/api/jadwal';

    // 1. Ambil Data
    const fetchJad = async (query = '') => {
        try {
            const url = query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Could not find Jadwal');

            const data = await response.json();
            setJad(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJad(searchTerm);
    }, [searchTerm]);

    // 2. Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'is_tutup' ? parseInt(value) : value
        });
    };

    // 3. Submit Form (Create & Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `${BASE_URL}/${idUp}` : BASE_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isEditMode ? '🎉 Data berhasil diperbarui!' : '🚀 Data berhasil disimpan!');
                resetForm();
                fetchJad(searchTerm); // Ambil data terbaru setelah simpan
            } else {
                alert('Gagal memproses data.');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // 4. Hapus Data
    const hapusData = async (id, hari) => {
        if (!window.confirm(`Hapus jadwal hari ${hari}?`)) return;
        try {
            const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) fetchJad(searchTerm);
        } catch (error) {
            console.error("Gagal hapus:", error);
        }
    };

    // 5. Persiapkan Edit
    const persiapkanEdit = (item) => {
        setIsEditMode(true);
        setIdUp(item.Jadwal_id);
        setFormData({
            hari: item.Hari,
            jam_buka: item.Jam_buka || '',
            jam_tutup: item.Jam_tutup || '',
            is_tutup: item.Is_tutup
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditMode(false);
        setIdUp(null);
        setFormData({ hari: '', jam_buka: '', jam_tutup: '', is_tutup: 0 });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = jadwal.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(jadwal.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm'>
                <h1 className='text-xl font-bold text-sulfur'>Ringkasan Jadwal</h1>
                <div className='text-sm text-sulfur'>Selamat Datang, Admin</div>
            </header>

            {/* FORM SECTION */}
            <section className="bg-white border-l-4 border-l-primary border-r-4 border-r-primary p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="font-bold text-primary mb-4">
                    {isEditMode ? '📝 Update Jadwal' : '➕ Tambah Jadwal Baru'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 mb-1">HARI</label>
                        <input
                            name="hari" type="text" placeholder="Senin" required
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.hari} onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 mb-1">JAM BUKA</label>
                        <input
                            name="jam_buka" type="time"
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.jam_buka} onChange={handleChange}
                            disabled={formData.is_tutup === 1}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 mb-1">JAM TUTUP</label>
                        <input
                            name="jam_tutup" type="time"
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.jam_tutup} onChange={handleChange}
                            disabled={formData.is_tutup === 1}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 mb-1">STATUS</label>
                        <select
                            name="is_tutup"
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.is_tutup} onChange={handleChange}
                        >
                            <option value={0}>Buka (Aktif)</option>
                            <option value={1}>Tutup (Libur)</option>
                        </select>
                    </div>
                    <div className="md:col-span-4 flex gap-2">
                        <button type="submit"
                                className={`flex-1 py-2 rounded font-bold transition-all ${isEditMode ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-primary hover:scale-101 text-sulfur'}`}>
                            {isEditMode ? 'Update Data' : 'Simpan Data'}
                        </button>
                        {isEditMode && (
                            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-6 py-2 rounded font-bold">
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* TABEL SECTION */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='p-6 border-b flex justify-between items-center'>
                    <h2 className='font-bold text-primary'>Daftar Jadwal</h2>
                    {/* Perbaikan Input Search */}
                    <input
                        type="text"
                        className="text-xs bg-gray-100 border border-gray-200 rounded px-3 py-1 outline-none"
                        placeholder="🔎︎ | Cari Hari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className='p-6 overflow-x-auto'>
                    {loading ? <p className="text-center">Memuat data...</p> : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                            <tr className='text-gray-400 text-sm uppercase'>
                                <th className='pb-4 border-b'>Hari</th>
                                <th className='pb-4 border-b'>Jam Buka</th>
                                <th className='pb-4 border-b'>Jam Tutup</th>
                                <th className='pb-4 border-b'>Keterangan</th>
                                <th className='pb-4 border-b'>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50'>
                                    <td className='py-4 border-b font-medium text-gray-700'>{item.Hari}</td>
                                    <td className='py-4 border-b text-gray-600'>{item.Jam_buka || '-'}</td>
                                    <td className='py-4 border-b text-gray-600'>{item.Jam_tutup || '-'}</td>
                                    <td className='py-4 border-b'>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            item.Is_tutup == 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {item.Is_tutup == 0 ? 'Buka' : 'Tutup'}
                                        </span>
                                    </td>
                                    <td className='py-4 border-b'>
                                        <button onClick={() => persiapkanEdit(item)}
                                                className="text-xs bg-yellow-500 text-white px-3 py-1 mr-1 rounded hover:opacity-80">Edit
                                        </button>
                                        <button onClick={() => hapusData(item.Jadwal_id, item.Hari)}
                                                className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:opacity-80">Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {jadwal.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-400 text-sm italic">Data tidak ditemukan</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- PAGINATION UI --- */}
                <div className='mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg'>
                    <p className='text-xs text-gray-500'>
                        Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, jadwal.length)} dari {jadwal.length} data
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

export default AdmJadwal