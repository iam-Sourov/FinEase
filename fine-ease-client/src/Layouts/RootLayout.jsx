import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
    return (
        <div className='min-h-screen flex flex-col bg-background text-foreground'>
            <div><Toaster /></div>
            <header>
                <Navbar></Navbar>
            </header>
            <main className='flex-grow min-h-[calc(100vh-200px)] flex flex-col'>
                <Outlet></Outlet>
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};
export default RootLayout;