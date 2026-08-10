import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import { Spinner } from "@/components/ui/spinner"
import { AuthContext } from '../Contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
    const { loading } = useContext(AuthContext);
    return (
        <div className='min-h-screen flex flex-col bg-background text-foreground'>
            <div><Toaster /></div>
            <header>
                <Navbar></Navbar>
            </header>
            <main className='flex-grow min-h-[calc(100vh-200px)] flex flex-col'>
                {loading ? (
                    <div className="flex-grow flex items-center justify-center py-20">
                        <Spinner className="h-10 w-10 text-primary" />
                    </div>
                ) : (
                    <Outlet></Outlet>
                )}
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};
export default RootLayout;