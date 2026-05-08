import React, { useState } from 'react'
import { motion } from 'motion/react'
import { IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Login = ({ setShowLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // State untuk input form
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isLogin && formData.password !== formData.confirmPassword) {
            alert("Password tidak cocok!");
            setLoading(false);
            return;
        }

        const endpoint = isLogin ? '/login' : '/register';

        const payload = isLogin
            ? {
                Email: formData.email,
                Password: formData.password
            }
            : {
                Nama: formData.nama,
                Email: formData.email,
                Password: formData.password
            };

        try {
            const response = await fetch(`http://localhost:4000/api/users${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    // Simpan seluruh objek user yang dikirim backend (termasuk Barbers_id jika ada)
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setShowLogin(false);

                    const userRole = data.user.Role;

                    // LOGIKA REDIRECT BERDASARKAN ROLE
                    if (userRole === 'Admin' || userRole === 'Owner') {
                        alert(`Welcome Admin, ${data.user.Nama}!`);
                        window.location.href = '/admin'; // Hard refresh ke dashboard admin
                    } else if (userRole === 'Barber') {
                        alert(`Welcome Kapster, ${data.user.Nama}!`);
                        // Gunakan href agar App.jsx membaca ulang localStorage yang berisi Barbers_id
                        window.location.href = '/#bookings';
                    } else {
                        alert(`Welcome back, ${data.user.Nama}!`);
                        window.location.href = '/';
                    }
                } else {
                    alert("Registrasi Berhasil! Silahkan Login.");
                    setIsLogin(true);
                }
            } else {
                alert(data.pesan || "Terjadi kesalahan");
            }
        } catch (error) {
            alert("Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md px-4'>
            <div className='absolute inset-0' onClick={() => setShowLogin(false)}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-primary border-2 border-sulfur p-8 rounded-lg w-full max-w-md relative z-[1001]'
            >
                <IoClose
                    className='absolute top-4 right-4 text-sulfur text-2xl cursor-pointer hover:rotate-90 transition-all'
                    onClick={() => setShowLogin(false)}
                />

                <h2 className='text-3xl font-bold text-sulfur mb-2 text-center uppercase tracking-tighter'>
                    {isLogin ? 'Cutz Access' : 'Join the Unit'}
                </h2>
                <p className='text-center text-sulfur/60 text-xs mb-8 uppercase tracking-widest'>
                    {isLogin ? 'Enter your account' : 'Create your account to get full access'}
                </p>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            required
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="FULL NAME"
                            className='bg-transparent border border-sulfur/30 p-3 text-white focus:border-sulfur outline-none transition-all placeholder:text-sulfur/30'
                        />
                    )}

                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="EMAIL"
                        className='bg-transparent border border-sulfur/30 p-3 text-white focus:border-sulfur outline-none transition-all placeholder:text-sulfur/30'
                    />

                    <input
                        required
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="PASSWORD"
                        className='bg-transparent border border-sulfur/30 p-3 text-white focus:border-sulfur outline-none transition-all placeholder:text-sulfur/30'
                    />

                    {!isLogin && (
                        <input
                            required
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="CONFIRM PASSWORD"
                            className='bg-transparent border border-sulfur/30 p-3 text-white focus:border-sulfur outline-none transition-all placeholder:text-sulfur/30'
                        />
                    )}

                    <button
                        disabled={loading}
                        className='font-bold py-3 mt-4 bg-sulfur hover:bg-sulfur/70 text-primary transition-all uppercase tracking-widest disabled:bg-sulfur/50'
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Get In' : 'Register Now')}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-sulfur/80'>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span
                            className='ml-2 text-sulfur font-bold cursor-pointer hover:underline'
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'SIGN UP' : 'LOGIN'}
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
export default Login