import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import TopNavigation from './TopNavigation';
import LoadPage from './component/LoadPage';
import { useEffect } from 'react';

const Main = () => {

       useEffect(() => {
            if (!localStorage.getItem("departmentbase")) {
                localStorage.clear();
            }
        }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <TopNavigation />
            <main className="flex-grow overflow-y-auto p-2">
                <div className="container mx-auto p-2 mt-12">
                    <Outlet />
                </div>
            </main>
            <Footer />
            <LoadPage />
        </div>
    );
};

export default Main;
