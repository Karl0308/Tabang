import React, { useState, useEffect } from 'react';
type LoadComponentProps = {
    loading: boolean;
};
const LoadComponent: React.FC<LoadComponentProps> = ({ loading }) => {
    const [isLoading, setIsLoading] = useState(loading);

    useEffect(() => {
        setIsLoading(loading); // Cleanup the timeout on unmount
    }, [loading]);

    const loadingStyle: React.CSSProperties = {
        transition: 'opacity 1s ease-in-out',
        opacity: isLoading ? 1 : 0,
        position: 'fixed', // Position fixed to keep it on top
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9, // Higher zIndex to ensure it's on top of other content
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    };

    return (
        isLoading ? (
            <div style={loadingStyle} className="flex items-center justify-center">
                <div className="flex justify-between w-10 m-10">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50 animate-ping"></div>
                </div>
                <div className="flex justify-between w-10 m-10">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50 animate-ping"></div>
                </div>
                <div className="flex justify-between w-10 m-10">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50 animate-ping"></div>
                </div>
            </div>
        ) : null
    );
};

export default LoadComponent;
