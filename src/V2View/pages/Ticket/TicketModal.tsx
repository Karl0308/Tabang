import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

interface TicketModalProps {
    isOpen: boolean;
    ticketNumber: string;
    onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({
    isOpen,
    ticketNumber,
    onClose,
}) => {
    if (!isOpen) return null;

    const notifySuccess = (message: string) => toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });
    const handleCopy = () => {

        navigator.clipboard.writeText(window.location.origin + "/istest/" + ticketNumber);
        notifySuccess("Link of " + ticketNumber + " copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Ticket Successfully Created
                </h2>
                <p className="mt-4 text-gray-600">
                    Your ticket number is{" "}
                    <span className="font-bold text-gray-800">{ticketNumber}</span>
                </p>

                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                    >
                        Copy Link
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded"
                    >
                        Close
                    </button>

                </div>
            </div>
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
        </div>
    );
};

export default TicketModal;