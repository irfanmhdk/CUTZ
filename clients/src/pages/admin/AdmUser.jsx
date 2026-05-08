import React, { useEffect, useState } from 'react'
import {IoChevronBack, IoChevronForward} from "react-icons/io5";

const AdmUser = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const userLogin = JSON.parse(localStorage.getItem('user'));

    // State untuk Form (Create & Update)
    const [isEditMode, setIsEditMode] = useState(false);
    const [idUp, setIdUp] = useState(null);
    const [formData, setFormData] = useState({
        Nama: '',
        Email: '',
        Pass: '',
        Role: 'Customer',
        Bar: 1
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const BASE_URL = '/api/users';

    // 1. READ: Ambil Data
    const fetchUser = async (query = '') => {
        try {
            const url = query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL;
            const response = await fetch(url);
            const data = await response.json();
            setUser(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(searchTerm);
    }, [searchTerm]);

    // 2. HANDLE INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 3. CREATE & UPDATE
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
                alert(isEditMode ? 'Data user diperbarui!' : 'User baru ditambahkan!');
                resetForm();
                fetchUser(searchTerm);
            }
        } catch (error) {
            console.error("Proses gagal:", error);
        }
    };

    // 4. DELETE
    const hapusUser = async (id, nama) => {
        if (!window.confirm(`Hapus akun ${nama}?`)) return;
        try {
            const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) fetchUser(searchTerm);
        } catch (error) {
            console.error("Gagal hapus:", error);
        }
    };

    // 5. PREPARE EDIT
    const persiapkanEdit = (item) => {
        setIsEditMode(true);
        setIdUp(item.Users_id);
        setFormData({
            Nama: item.Nama,
            Email: item.Email,
            Role: item.Role,
            Pw: '',
            Bar: 1
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditMode(false);
        setIdUp(null);
        setFormData({ Nama: '', Email: '', Role: 'Customer', Pw: '' });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(user.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <header className='flex justify-between items-center mb-8 bg-primary p-4 rounded-xl shadow-sm'>
                <h1 className='text-xl font-bold text-sulfur'>Manajemen User</h1>
                <div className='text-sm text-sulfur'>Selamat Datang, Admin</div>
            </header>

            {/* FORM SECTION */}
            <section className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="font-bold text-primary mb-4">
                    {isEditMode ? '📝 Edit Akun' : '➕ Tambah Akun'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Nama</label>
                        <input
                            name="Nama" type="text" required
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary outline-none"
                            value={formData.Nama} onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Email</label>
                        <input
                            name="Email" type="email" required
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary outline-none"
                            value={formData.Email} onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Password</label>
                        <input
                            name="Pw" type="password" placeholder={isEditMode ? "Kosongkan jika tetap" : "****"}
                            required={!isEditMode}
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary outline-none"
                            value={formData.Pw} onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Role</label>
                        <select
                            name="Role"
                            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary outline-none"
                            value={formData.Role} onChange={handleChange}
                        >
                            <option value="Customer">Customer</option>
                            <option value="Admin">Admin</option>
                            <option value="Barber">Kapster</option>
                        </select>
                    </div>
                    <div className="lg:col-span-4 flex gap-2">
                        <button type="submit" className="flex-1 bg-primary text-sulfur py-2 rounded font-bold hover:scale-101 cursor-pointer transition-all">
                            {isEditMode ? 'Update User' : 'Simpan User'}
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
                    <h2 className='font-bold text-primary'>Daftar Akun</h2>
                    <input
                        type="text"
                        className="text-xs bg-gray-100 border border-gray-200 rounded px-3 py-1 outline-none w-64"
                        placeholder="Cari Nama/Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className='p-6 overflow-x-auto'>
                    {loading ? <p className="text-center py-4">Memuat...</p> : (
                        <table className='w-full text-left border-collapse'>
                            <thead>
                            <tr className='text-gray-400 text-xs uppercase'>
                                <th className='pb-4 border-b'>Nama</th>
                                <th className='pb-4 border-b'>Email</th>
                                <th className='pb-4 border-b'>Role</th>
                                <th className='pb-4 border-b text-center'>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50 transition-colors'>
                                    <td className='py-4 border-b font-medium text-gray-700'>{item.Nama}</td>
                                    <td className='py-4 border-b text-gray-500 text-sm'>{item.Email}</td>
                                    <td className='py-4 border-b'>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                                item.Role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {item.Role}
                                            </span>
                                    </td>
                                    <td className='py-4 border-b text-center'>
                                        {item.Role === 'Admin' && (
                                            <>
                                                <button onClick={() => persiapkanEdit(item)}
                                                        className="text-xs bg-yellow-500 text-white px-3 py-1 mr-1 rounded hover:opacity-80">Edit
                                                </button>
                                                <button onClick={() => hapusUser(item.Users_id, item.Nama)}
                                                        className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:opacity-80">Hapus
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
                        Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, user.length)} dari {user.length} data
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

export default AdmUser