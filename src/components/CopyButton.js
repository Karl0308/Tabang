import React, { useState,useEffect } from 'react';
import copylogo from '../img/copy-icon.svg';
import FlyingMessage from "../components/FlyingMessage"
import { ToastContainer, toast } from 'react-toastify';

const CopyButton = ({ text }) => {
    
    const notifySuccess = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });


    const copyToClipboard = async (e) => {
        e.stopPropagation();
        notifySuccess(('Ticket link ' + text +' has been copied.'));
        try {
            await navigator.clipboard.writeText( window.location.origin + "/istest/" + text);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };
    return (
        <>
            <button onClick={copyToClipboard}> <img src={copylogo} width={20} height={20} className='ml-2' /></button>
        
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default CopyButton;