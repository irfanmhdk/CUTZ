    import { useState } from 'react';
    import { Outlet } from 'react-router-dom';
    import Sidebar from './admin/Sidebar.jsx';
    import Footer from "./admin/Footer.jsx";

    const Admin = () => {

        const [isOpen, setIsOpen] = useState(true);

        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

                <div className={`flex flex-col flex-1 transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'ml-0'}`}>
                    <main className={`flex-1 p-8`}>
                        <Outlet />
                    </main>

                    <Footer />
                </div>
            </div>
        );
    };

    export default Admin;