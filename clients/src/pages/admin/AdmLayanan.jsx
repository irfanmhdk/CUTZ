import React, { useEffect, useState } from 'react'
import {IoChevronBack, IoChevronForward} from "react-icons/io5";

const AdmLayanan = () => {
    const [servis, setServ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk Form & Edit Logic
    const [isEditMode, setIsEditMode] = useState(false);
    const [idUp, setIdUp] = useState(null);
    const [formData, setFormData] = useState({
        Bar: 1, // Diisi otomatis dengan value 1
        Serv: '',
        Harga: '',
        Dur: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const BASE_URL = '/api/serv';

    // 1. Ambil Data
    const fetchServ = async (query = '') => {
        try {
            const url = query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Could not find Layanan');

            const data = await response.json();
            setServ(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServ(searchTerm);
    }, [searchTerm]);

    // 2. Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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
                alert(isEditMode ? '🎉 Layanan berhasil diperbarui!' : '🚀 Layanan berhasil disimpan!');
                resetForm();
                fetchServ(searchTerm);
            } else {
                alert('Gagal memproses data.');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // 4. Hapus Data
    const hapusData = async (id, namaLayanan) => {
        if (!window.confirm(`Hapus layanan ${namaLayanan}?`)) return;
        try {
            const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) fetchServ(searchTerm);
        } catch (error) {
            console.error("Gagal hapus:", error);
        }
    };

    // 5. Persiapkan Edit
    const persiapkanEdit = (item) => {
        setIsEditMode(true);
        setIdUp(item.Services_id);
        setFormData({
            Bar: 1,
            Serv: item.Layanan,
            Harga: item.Harga,
            Dur: item.Estimasi
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditMode(false);
        setIdUp(null);
        setFormData({ Bar: 1, Serv: '', Harga: '', Dur: '' });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = servis.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(servis.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm'>
                <h1 className='text-xl font-bold text-sulfur'>Ringkasan Layanan</h1>
                <div className='text-sm text-sulfur'>Selamat Datang, Admin</div>
            </header>

            {/* FORM SECTION */}
            <section className="bg-white border-l-4 border-l-primary border-r-4 border-r-primary p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="font-bold text-primary mb-4">
                    {isEditMode ? '📝 Update Layanan' : '➕ Tambah Layanan Baru'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 mb-1 uppercase">Nama Layanan</label>
                        <input
                            name="Serv" type="text" placeholder="Contoh: Haircut" required
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.Serv} onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 mb-1 uppercase">Harga (Rp)</label>
                        <input
                            name="Harga" type="number" placeholder="50000" required
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.Harga} onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 mb-1 uppercase">Estimasi Waktu</label>
                        <input
                            name="Dur" type="text" placeholder="30 Menit" required
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.Dur} onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                        <button type="submit"
                                className={`flex-1 py-2 rounded font-bold cursor-pointer transition-all ${isEditMode ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-primary hover:scale-101 text-sulfur'}`}>
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
                    <h2 className='font-bold text-primary'>Daftar Layanan</h2>
                    <input
                        type="text"
                        className="text-xs bg-gray-100 border border-gray-200 rounded px-3 py-1 outline-none"
                        placeholder="🔎︎ | Cari Layanan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className='p-6 overflow-x-auto'>
                    {loading ? <p className="text-center">Memuat data...</p> : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                            <tr className='text-gray-400 text-sm uppercase'>
                                <th className='pb-4 border-b'>Layanan</th>
                                <th className='pb-4 border-b'>Harga</th>
                                <th className='pb-4 border-b'>Estimasi</th>
                                <th className='pb-4 border-b text-center'>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50 transition-colors'>
                                    <td className='py-4 border-b font-medium text-gray-700'>{item.Layanan}</td>
                                    <td className='py-4 border-b font-bold text-primary'>
                                        Rp. {Number(item.Harga).toLocaleString('id-ID')}
                                    </td>
                                    <td className='py-4 border-b text-gray-600'>
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[11px] font-semibold">
                                            {item.Estimasi}
                                        </span>
                                    </td>
                                    <td className='py-4 border-b text-center'>
                                        <button onClick={() => persiapkanEdit(item)}
                                                className="text-xs bg-yellow-500 text-white px-3 py-1 mr-1 rounded hover:opacity-80 transition-all">Edit
                                        </button>
                                        <button onClick={() => hapusData(item.Services_id, item.Layanan)}
                                                className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:opacity-80 transition-all">Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {servis.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-400 text-sm italic">Layanan tidak ditemukan</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- PAGINATION UI --- */}
                <div className='mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg'>
                    <p className='text-xs text-gray-500'>
                        Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, servis.length)} dari {servis.length} data
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

export default AdmLayanan