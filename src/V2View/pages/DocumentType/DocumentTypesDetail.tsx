
import React, { useState,useRef, useEffect } from 'react';

interface DocumentType {
    id: number;
    name: string;
    isDeleted: boolean;
}

interface ModalProps {
    selected: DocumentType | null;
    setSelected: React.Dispatch<React.SetStateAction<DocumentType | null>>;
    handleSave: () => void;
}

const DocumentTypeDetail: React.FC<ModalProps> = ({ selected, setSelected, handleSave }) => {
    // const [data, setData] = useState(selected ? selected.name : '');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const saveData = async () => {
            handleSave();
    };

    const handleClose = () => {
        setSelected(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            
        setSelected(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={`fixed top-0 left-0 h-screen w-full md:w-1/3 bg-white border border-gray-300 shadow-lg z-50 transform transition-transform duration-1000 ${selected? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4 pb-6 bg-slate-200 p-4">
                    <h2 className="text-2xl font-bold underline">DOCUMENT TYPE DETAILS</h2>
                    <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-semibold text-left">Name:</p>
                    <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-3" value={selected ? selected.name : ''} onChange={(e) => {
                        if (selected) {
                            setSelected({ ...selected, name: e.target.value });
                        }
                    }} />
                </div>

                <div className="flex justify-between">
                    <button onClick={() => setSelected(null)} className="flex-grow px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 m-2">Close</button>
                    <button
                        onClick={saveData}
                        className="flex-grow px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 m-2">Save</button>
                </div>
            </div>
            
        </div>

    );
};

export default DocumentTypeDetail;